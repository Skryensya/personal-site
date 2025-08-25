// components/AsciiGrid.tsx

import React, { useMemo, useRef } from 'react';
// Import 'type' for type-only imports, and remove ReactThreeFiber from named imports
import { Canvas, extend, useFrame, type RootState, type ThreeEvent, type ReactThreeFiber } from '@react-three/fiber';
import { OrbitControls, shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 1. Uniform types (no change)
type AsciiGridMaterialUniforms = {
  uTime: number;
  uMouse: THREE.Vector2;
  uTexture: THREE.Texture | null;
  uColor: THREE.Color;
};

// 2. shaderMaterial definition (no change)
const AsciiGridMaterial = shaderMaterial(
  {
    uTime: 0,
    uMouse: new THREE.Vector2(0, 0),
    uTexture: null,
    uColor: new THREE.Color('#00ff00'),
  },
  /*glsl*/`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /*glsl*/`
    uniform float uTime;
    uniform vec2 uMouse;
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    varying vec2 vUv;

    void main() {
      vec4 textureColor = texture2D(uTexture, vUv);
      float distanceToMouse = distance(vUv, uMouse);
      float glow = smoothstep(0.2, 0.0, distanceToMouse);
      vec3 finalColor = textureColor.rgb * (uColor * glow + 1.0);
      gl_FragColor = vec4(finalColor, textureColor.a);
    }
  `
);

extend({ AsciiGridMaterial });

// 3. JSX type declaration (no change)
declare global {
  namespace JSX {
    interface IntrinsicElements {
      asciiGridMaterial: ReactThreeFiber.ShaderMaterialProps & Partial<AsciiGridMaterialUniforms>;
    }
  }
}

// 4. GridMesh Component
const GridMesh: React.FC = () => {
  // CORRECTED: Use InstanceType for a more accurate and robust ref type
  const materialRef = useRef<InstanceType<typeof AsciiGridMaterial>>(null);

  const asciiTexture = useMemo<THREE.CanvasTexture>(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    const resolution = 256;
    const fontSize = 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789*&%$#@!';
    canvas.width = resolution;
    canvas.height = resolution;
    context.font = `${fontSize}px monospace`;
    context.fillStyle = '#ffffff';
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < (resolution / fontSize); i++) {
      for (let j = 0; j < (resolution / fontSize); j++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        context.fillText(char, i * fontSize, j * fontSize + fontSize);
      }
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Animation frame
  useFrame((state: RootState) => {
    if (materialRef.current) {
      // CORRECTED: Must update the .value property of the uniform
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <mesh
      scale={10}
      rotation={[-Math.PI / 2, 0, 0]}
      onPointerMove={(e: ThreeEvent<PointerEvent>) => {
        if (materialRef.current && e.uv) {
          // CORRECTED: Must update the .value property of the uniform
          materialRef.current.uniforms.uMouse.value.copy(e.uv);
        }
      }}
    >
      <planeGeometry args={[1, 1, 64, 64]} />
      <asciiGridMaterial
        ref={materialRef}
        uTexture={asciiTexture}
        transparent={true} 
      />
    </mesh>
  );
};

// 5. Main AsciiGrid component (no change)
const AsciiGrid: React.FC = () => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 75 }}>
      <color attach="background" args={['#101010']} />
      <ambientLight intensity={1.5} />
      <GridMesh />
      <OrbitControls />
    </Canvas>
  );
};

export default AsciiGrid;