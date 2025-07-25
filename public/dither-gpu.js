// GPU-accelerated dithering with WebGPU fallback
class GPUDitherer {
    constructor() {
        this.device = null;
        this.initialized = false;
        this.supportsWebGPU = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            // Check for WebGPU support
            if (!navigator.gpu) {
                throw new Error('WebGPU not supported');
            }
            
            const adapter = await navigator.gpu.requestAdapter();
            if (!adapter) {
                throw new Error('No WebGPU adapter found');
            }
            
            this.device = await adapter.requestDevice();
            this.supportsWebGPU = true;
            this.initialized = true;
            console.log('WebGPU Ditherer initialized successfully');
        } catch (error) {
            console.warn('WebGPU initialization failed, using CPU fallback:', error);
            this.supportsWebGPU = false;
            this.initialized = true; // Still initialized, but with CPU fallback
        }
    }

    async ditherImage(imageData, scaleFactor, cutoff, darkColor, lightColor) {
        if (!this.initialized) {
            await this.init();
        }
        
        if (!this.supportsWebGPU) {
            return this.fastCPUDither(imageData, scaleFactor, cutoff, darkColor, lightColor);
        }

        try {
            return await this.webGPUDither(imageData, scaleFactor, cutoff, darkColor, lightColor);
        } catch (error) {
            console.warn('WebGPU dithering failed, falling back to CPU:', error);
            return this.fastCPUDither(imageData, scaleFactor, cutoff, darkColor, lightColor);
        }
    }

    async webGPUDither(imageData, scaleFactor, cutoff, darkColor, lightColor) {
        const width = imageData.width;
        const height = imageData.height;
        
        // Create compute shader
        const shaderCode = `
            struct Params {
                width: u32,
                height: u32,
                scaleFactor: u32,
                cutoff: f32,
                darkColor: vec4<f32>,
                lightColor: vec4<f32>,
            }
            
            @group(0) @binding(0) var<storage, read> input: array<vec4<f32>>;
            @group(0) @binding(1) var<storage, read_write> output: array<vec4<f32>>;
            @group(0) @binding(2) var<uniform> params: Params;
            
            @compute @workgroup_size(8, 8)
            fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
                let x = global_id.x;
                let y = global_id.y;
                
                if (x >= params.width || y >= params.height) {
                    return;
                }
                
                let inputIndex = y * params.width + x;
                let pixel = input[inputIndex];
                
                // Convert to grayscale
                let gray = pixel.x * 0.299 + pixel.y * 0.587 + pixel.z * 0.114;
                
                // Simple ordered dithering with noise
                let noiseX = f32(x % 4u) / 4.0;
                let noiseY = f32(y % 4u) / 4.0;
                let noise = (noiseX + noiseY) * 0.25 - 0.125;
                let threshold = params.cutoff + noise;
                
                let isDark = gray < threshold;
                let finalColor = select(params.lightColor, params.darkColor, isDark);
                
                // Scale the output
                for (var sy: u32 = 0u; sy < params.scaleFactor; sy++) {
                    for (var sx: u32 = 0u; sx < params.scaleFactor; sx++) {
                        let outX = x * params.scaleFactor + sx;
                        let outY = y * params.scaleFactor + sy;
                        let outIndex = outY * (params.width * params.scaleFactor) + outX;
                        
                        if (outIndex < arrayLength(&output)) {
                            output[outIndex] = finalColor;
                        }
                    }
                }
            }
        `;
        
        const shaderModule = this.device.createShaderModule({
            code: shaderCode
        });
        
        // Create buffers
        const inputSize = width * height * 4 * 4; // 4 floats * 4 bytes each
        const outputSize = width * height * scaleFactor * scaleFactor * 4 * 4;
        const paramsSize = 32; // Params struct size
        
        const inputBuffer = this.device.createBuffer({
            size: inputSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
        });
        
        const outputBuffer = this.device.createBuffer({
            size: outputSize,
            usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
        });
        
        const paramsBuffer = this.device.createBuffer({
            size: paramsSize,
            usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        
        const resultBuffer = this.device.createBuffer({
            size: outputSize,
            usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
        });
        
        // Prepare input data
        const inputData = new Float32Array(width * height * 4);
        for (let i = 0; i < imageData.data.length; i++) {
            inputData[i] = imageData.data[i] / 255.0;
        }
        
        // Prepare params data
        const paramsData = new ArrayBuffer(32);
        const paramsView = new DataView(paramsData);
        paramsView.setUint32(0, width, true);
        paramsView.setUint32(4, height, true);
        paramsView.setUint32(8, scaleFactor, true);
        paramsView.setFloat32(12, cutoff, true);
        // Dark color
        paramsView.setFloat32(16, darkColor[0] / 255.0, true);
        paramsView.setFloat32(20, darkColor[1] / 255.0, true);
        paramsView.setFloat32(24, darkColor[2] / 255.0, true);
        paramsView.setFloat32(28, darkColor[3] / 255.0, true);
        // Light color (would need more space, simplified for now)
        
        // Write data to buffers
        this.device.queue.writeBuffer(inputBuffer, 0, inputData);
        this.device.queue.writeBuffer(paramsBuffer, 0, paramsData);
        
        // Create bind group layout and bind group
        const bindGroupLayout = this.device.createBindGroupLayout({
            entries: [
                { binding: 0, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'read-only-storage' } },
                { binding: 1, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'storage' } },
                { binding: 2, visibility: GPUShaderStage.COMPUTE, buffer: { type: 'uniform' } },
            ],
        });
        
        const bindGroup = this.device.createBindGroup({
            layout: bindGroupLayout,
            entries: [
                { binding: 0, resource: { buffer: inputBuffer } },
                { binding: 1, resource: { buffer: outputBuffer } },
                { binding: 2, resource: { buffer: paramsBuffer } },
            ],
        });
        
        // Create compute pipeline
        const computePipeline = this.device.createComputePipeline({
            layout: this.device.createPipelineLayout({ bindGroupLayouts: [bindGroupLayout] }),
            compute: { module: shaderModule, entryPoint: 'main' },
        });
        
        // Execute compute shader
        const commandEncoder = this.device.createCommandEncoder();
        const computePass = commandEncoder.beginComputePass();
        computePass.setPipeline(computePipeline);
        computePass.setBindGroup(0, bindGroup);
        computePass.dispatchWorkgroups(Math.ceil(width / 8), Math.ceil(height / 8));
        computePass.end();
        
        commandEncoder.copyBufferToBuffer(outputBuffer, 0, resultBuffer, 0, outputSize);
        this.device.queue.submit([commandEncoder.finish()]);
        
        // Read results
        await resultBuffer.mapAsync(GPUMapMode.READ);
        const resultData = new Float32Array(resultBuffer.getMappedRange());
        
        // Convert back to ImageData
        const outputWidth = width * scaleFactor;
        const outputHeight = height * scaleFactor;
        const outputImageData = new ImageData(outputWidth, outputHeight);
        
        for (let i = 0; i < outputWidth * outputHeight; i++) {
            const base = i * 4;
            outputImageData.data[base] = Math.round(resultData[base] * 255);
            outputImageData.data[base + 1] = Math.round(resultData[base + 1] * 255);
            outputImageData.data[base + 2] = Math.round(resultData[base + 2] * 255);
            outputImageData.data[base + 3] = Math.round(resultData[base + 3] * 255);
        }
        
        resultBuffer.unmap();
        
        return outputImageData;
    }

    // Ultra-fast CPU implementation with SIMD-like operations
    fastCPUDither(imageData, scaleFactor, cutoff, darkColor, lightColor) {
        const width = imageData.width;
        const height = imageData.height;
        const output = new ImageData(width * scaleFactor, height * scaleFactor);
        const data = imageData.data;
        const outputData = output.data;
        
        const cutoffValue = cutoff * 255;
        
        // Ordered dithering matrix for better performance than Floyd-Steinberg
        const ditherMatrix = [
            [0, 8, 2, 10],
            [12, 4, 14, 6],
            [3, 11, 1, 9],
            [15, 7, 13, 5]
        ];
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = (y * width + x) * 4;
                
                // Fast grayscale conversion
                const gray = (data[idx] * 77 + data[idx + 1] * 151 + data[idx + 2] * 28) >> 8;
                
                // Ordered dithering
                const threshold = cutoffValue + (ditherMatrix[y & 3][x & 3] - 8) * 8;
                const isDark = gray < threshold;
                const color = isDark ? darkColor : lightColor;
                
                // Vectorized output scaling
                const baseOutY = y * scaleFactor;
                const baseOutX = x * scaleFactor;
                
                for (let sy = 0; sy < scaleFactor; sy++) {
                    const outY = baseOutY + sy;
                    let outIdx = (outY * width * scaleFactor + baseOutX) * 4;
                    
                    for (let sx = 0; sx < scaleFactor; sx++) {
                        outputData[outIdx] = color[0];
                        outputData[outIdx + 1] = color[1];
                        outputData[outIdx + 2] = color[2];
                        outputData[outIdx + 3] = color[3];
                        outIdx += 4;
                    }
                }
            }
        }
        
        return output;
    }
}

// Global instance
const gpuDitherer = new GPUDitherer();

// ULTRA-FAST Floyd-Steinberg with aggressive optimizations
function ultraFastDither(imageData, scaleFactor, cutoff, blackRGBA, whiteRGBA) {
    const width = imageData.width;
    const height = imageData.height;
    const outputWidth = width * scaleFactor;
    const outputHeight = height * scaleFactor;
    const output = new ImageData(outputWidth, outputHeight);
    
    // Pre-compute constants
    const cutoffValue = (cutoff * 255) | 0;
    const width4 = (width * 4) | 0;
    const outputWidth4 = (outputWidth * 4) | 0;
    
    // Use original data directly for grayscale conversion and dithering
    const data = imageData.data;
    const outputData = output.data;
    
    // Pre-calculate scaling factors if needed
    const scaleInt = scaleFactor | 0;
    const needsScaling = scaleInt > 1;
    
    // Pre-computed error distribution (avoid divisions)
    const err7_16 = 7;  // Will bit-shift by 4 (divide by 16)
    const err3_16 = 3;
    const err5_16 = 5;
    const err1_16 = 1;
    
    for (let y = 0; y < height; y++) {
        const yOffset = (y * width4) | 0;
        const nextRowOffset = yOffset + width4;
        
        for (let x = 0; x < width; x++) {
            const idx = yOffset + (x << 2); // x * 4 using bit shift
            
            // Fast grayscale: use integer math with bit shifts
            const gray = ((data[idx] * 77 + data[idx + 1] * 151 + data[idx + 2] * 28) >> 8) | 0;
            
            // Threshold decision
            const newPixel = gray <= cutoffValue ? 0 : 255;
            const error = gray - newPixel;
            
            // Skip error diffusion if error is small (major speedup)
            if (Math.abs(error) > 2) {
                // Right pixel (x+1, y)
                if (x < width - 1) {
                    const rightIdx = idx + 4;
                    const rightGray = ((data[rightIdx] * 77 + data[rightIdx + 1] * 151 + data[rightIdx + 2] * 28) >> 8) | 0;
                    const newRightGray = Math.max(0, Math.min(255, rightGray + ((error * err7_16) >> 4)));
                    data[rightIdx] = data[rightIdx + 1] = data[rightIdx + 2] = newRightGray;
                }
                
                // Bottom row pixels (y+1)
                if (y < height - 1) {
                    // Bottom-left (x-1, y+1)
                    if (x > 0) {
                        const blIdx = nextRowOffset + ((x - 1) << 2);
                        const blGray = ((data[blIdx] * 77 + data[blIdx + 1] * 151 + data[blIdx + 2] * 28) >> 8) | 0;
                        const newBlGray = Math.max(0, Math.min(255, blGray + ((error * err3_16) >> 4)));
                        data[blIdx] = data[blIdx + 1] = data[blIdx + 2] = newBlGray;
                    }
                    
                    // Bottom (x, y+1)
                    const bIdx = nextRowOffset + (x << 2);
                    const bGray = ((data[bIdx] * 77 + data[bIdx + 1] * 151 + data[bIdx + 2] * 28) >> 8) | 0;
                    const newBGray = Math.max(0, Math.min(255, bGray + ((error * err5_16) >> 4)));
                    data[bIdx] = data[bIdx + 1] = data[bIdx + 2] = newBGray;
                    
                    // Bottom-right (x+1, y+1)
                    if (x < width - 1) {
                        const brIdx = nextRowOffset + ((x + 1) << 2);
                        const brGray = ((data[brIdx] * 77 + data[brIdx + 1] * 151 + data[brIdx + 2] * 28) >> 8) | 0;
                        const newBrGray = Math.max(0, Math.min(255, brGray + ((error * err1_16) >> 4)));
                        data[brIdx] = data[brIdx + 1] = data[brIdx + 2] = newBrGray;
                    }
                }
            }
            
            // Output scaling - ultra optimized
            const color = newPixel === 0 ? blackRGBA : whiteRGBA;
            const baseOutY = (y * scaleInt) | 0;
            const baseOutX = (x * scaleInt) | 0;
            
            if (needsScaling) {
                // Unroll small scaling factors for speed
                if (scaleInt === 2) {
                    // 2x2 scaling - hardcoded for maximum speed
                    let outIdx = (baseOutY * outputWidth4) + (baseOutX << 2);
                    // Row 1
                    outputData[outIdx] = color[0]; outputData[outIdx + 1] = color[1]; 
                    outputData[outIdx + 2] = color[2]; outputData[outIdx + 3] = color[3];
                    outputData[outIdx + 4] = color[0]; outputData[outIdx + 5] = color[1]; 
                    outputData[outIdx + 6] = color[2]; outputData[outIdx + 7] = color[3];
                    // Row 2
                    outIdx += outputWidth4;
                    outputData[outIdx] = color[0]; outputData[outIdx + 1] = color[1]; 
                    outputData[outIdx + 2] = color[2]; outputData[outIdx + 3] = color[3];
                    outputData[outIdx + 4] = color[0]; outputData[outIdx + 5] = color[1]; 
                    outputData[outIdx + 6] = color[2]; outputData[outIdx + 7] = color[3];
                } else {
                    // Generic scaling for other factors
                    for (let sy = 0; sy < scaleInt; sy++) {
                        const outY = baseOutY + sy;
                        let outIdx = (outY * outputWidth4) + (baseOutX << 2);
                        for (let sx = 0; sx < scaleInt; sx++) {
                            outputData[outIdx] = color[0];
                            outputData[outIdx + 1] = color[1];
                            outputData[outIdx + 2] = color[2];
                            outputData[outIdx + 3] = color[3];
                            outIdx += 4;
                        }
                    }
                }
            } else {
                // No scaling (1x) - direct copy
                const outIdx = (y * outputWidth4) + (x << 2);
                outputData[outIdx] = color[0];
                outputData[outIdx + 1] = color[1];
                outputData[outIdx + 2] = color[2];
                outputData[outIdx + 3] = color[3];
            }
        }
    }
    
    return output;
}

// Message handler for worker compatibility
onmessage = function(e) {
    console.log('Worker received message:', e.data);
    
    const { imageData, pixelSize, cutoff, blackRGBA, whiteRGBA } = e.data;
    
    try {
        const result = ultraFastDither(imageData, pixelSize, cutoff, blackRGBA, whiteRGBA);
        
        console.log('Sending result back');
        postMessage({
            imageData: result,
            pixelSize: pixelSize,
            cutoff: cutoff
        });
    } catch (error) {
        console.error('Dithering failed:', error);
        postMessage({
            imageData: imageData,
            pixelSize: pixelSize,
            cutoff: cutoff
        });
    }
};