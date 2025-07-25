onmessage = function (e) {
    const result = dither(e.data.imageData, e.data.pixelSize, e.data.cutoff, e.data.blackRGBA, e.data.whiteRGBA);
    const reply = {};
    reply.imageData = result;
    reply.pixelSize = e.data.pixelSize;
    reply.cutoff = e.data.cutoff;
    postMessage(reply);
};

function getRGBAArrayBuffer(color) {
    let buffer = new ArrayBuffer(4);
    for (let i = 0; i < 4; ++i) {
        buffer[i] = color[i];
    }
    return buffer;
}

function dither(imageData, scaleFactor, cutoff, blackRGBA, whiteRGBA) {
    const blackRGBABuffer = getRGBAArrayBuffer(blackRGBA);
    const whiteRGBABuffer = getRGBAArrayBuffer(whiteRGBA);
    let output = new ImageData(imageData.width * scaleFactor, imageData.height * scaleFactor);
    
    // Fast grayscale conversion using pre-calculated values
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
        data[i] = data[i + 1] = data[i + 2] = 
            (data[i] * 77 + data[i + 1] * 151 + data[i + 2] * 28) >> 8; // Fast integer math
    }

    // Simplified Floyd-Steinberg dithering for speed
    const width = imageData.width;
    const height = imageData.height;
    const cutoffValue = cutoff * 255;
    
    // Use single array instead of sliding window for better performance
    const errorBuffer = new Int16Array(width + 2); // Add padding for bounds checking
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const oldPixel = data[idx] + errorBuffer[x + 1];
            const newPixel = oldPixel <= cutoffValue ? 0 : 255;
            const error = oldPixel - newPixel;
            
            // Distribute error using optimized Floyd-Steinberg
            errorBuffer[x + 2] += (error * 7) >> 4; // x+1, y
            if (y < height - 1) {
                const nextRowBase = ((y + 1) * width + x) * 4;
                if (x > 0) data[nextRowBase - 4] += (error * 3) >> 4; // x-1, y+1
                data[nextRowBase] += (error * 5) >> 4; // x, y+1
                if (x < width - 1) data[nextRowBase + 4] += error >> 4; // x+1, y+1
            }
            
            const rgba = newPixel === 0 ? blackRGBABuffer : whiteRGBABuffer;
            
            // Optimized pixel scaling with reduced bounds checking
            const baseY = y * scaleFactor;
            const baseX = x * scaleFactor;
            for (let sy = 0; sy < scaleFactor; sy++) {
                let pixelOffset = ((baseY + sy) * output.width + baseX) * 4;
                for (let sx = 0; sx < scaleFactor; sx++) {
                    output.data[pixelOffset] = rgba[0];
                    output.data[pixelOffset + 1] = rgba[1];
                    output.data[pixelOffset + 2] = rgba[2];
                    output.data[pixelOffset + 3] = rgba[3];
                    pixelOffset += 4;
                }
            }
        }
        // Clear error buffer for next row
        errorBuffer.fill(0);
    }
    return output;
}
