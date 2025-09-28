'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, extend, useThree } from '@react-three/fiber';
import { shaderMaterial, OrthographicCamera, useTexture } from '@react-three/drei';
import gsap from 'gsap';

export interface FisheyeSettings {
  fisheyeStrength: number;
  vignetteStart: number;
  vignetteEnd: number;
  fisheyeRadius: number;
  chromaticAberration: number;
  noiseIntensity: number;
  vignetteIntensity: number;
  showVignetteMask: boolean;
  animationDuration: number;
  canvasOpacity: number;
}

interface FisheyeShaderProps {
  src: string;
  className?: string;
  settings: FisheyeSettings;
}

// ===== Shader =====
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  precision mediump float;
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform float uFisheyeIntensity;
  uniform float uFisheyeStrength;
  uniform float uVignetteStart;
  uniform float uVignetteEnd;
  uniform float uFisheyeRadius;
  uniform float uChromaticAberration;
  uniform float uNoiseIntensity;
  uniform float uVignetteIntensity;
  uniform float uMouseEffect;
  uniform float uMouseRadius;
  uniform float uShowVignetteMask;
  uniform vec2 uMouse;
  uniform float uAspectRatio;
  varying vec2 vUv;

  vec4 sampleTextureSafe(sampler2D tex, vec2 uv) {
    vec2 clampedUV = clamp(uv, 0.001, 0.999);
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      vec2 edgeUV = clamp(uv, 0.0, 1.0);
      vec4 edgeColor = texture2D(tex, edgeUV);
      float fadeX = 1.0 - smoothstep(0.0, 0.1, abs(uv.x - clamp(uv.x, 0.0, 1.0)));
      float fadeY = 1.0 - smoothstep(0.0, 0.1, abs(uv.y - clamp(uv.y, 0.0, 1.0)));
      return edgeColor * fadeX * fadeY;
    }
    return texture2D(tex, clampedUV);
  }

  vec2 fisheyeDistortion(vec2 uv, float intensity, float aspect) {
    vec2 center = vec2(0.5, 0.5);
    vec2 delta = uv - center;
    delta.x *= aspect;
    float distance = length(delta);

    if (distance < uFisheyeRadius && distance > 0.0) {
      float percent = distance / uFisheyeRadius;
      float theta = percent * percent * intensity * uFisheyeStrength;
      float beta = max(0.00001, distance);
      delta = delta / beta * tan(theta) * beta;
    }

    delta.x /= aspect;
    return center + delta;
  }

  void main() {
    vec2 uv = vUv;
    vec2 center = vec2(0.5, 0.5);
    vec2 delta = uv - center;
    delta.x *= uAspectRatio;
    float distanceFromCenter = length(delta);

    float vignetteMask = smoothstep(uVignetteStart, uVignetteEnd, distanceFromCenter);

    if (uShowVignetteMask > 0.5) {
      gl_FragColor = vec4(vignetteMask, vignetteMask, vignetteMask, 1.0);
      return;
    }

    vec2 finalUV = uv;

    if (uFisheyeIntensity > 0.001) {
      vec2 distortedUV = fisheyeDistortion(uv, uFisheyeIntensity, uAspectRatio);
      finalUV = mix(uv, distortedUV, vignetteMask);

      vec2 mousePos = uMouse * 0.5 + 0.5;
      float mouseDist = distance(uv, mousePos);
      float mouseEffectStrength = smoothstep(uMouseRadius, 0.0, mouseDist) * uFisheyeIntensity * uMouseEffect;
      vec2 mouseDistortion = normalize(uv - mousePos) * mouseEffectStrength;
      finalUV += mouseDistortion;
    }

    vec3 color;

    if (uFisheyeIntensity > 0.001) {
      vec2 direction = normalize(finalUV - vec2(0.5));
      float aberrationStrength = uChromaticAberration * uFisheyeIntensity;

      float r = sampleTextureSafe(uTexture, finalUV + direction * aberrationStrength).r;
      float g = sampleTextureSafe(uTexture, finalUV).g;
      float b = sampleTextureSafe(uTexture, finalUV - direction * aberrationStrength).b;
      color = vec3(r, g, b);
    } else {
      color = sampleTextureSafe(uTexture, finalUV).rgb;
    }

    if (uFisheyeIntensity > 0.001) {
      float n = fract(sin(dot(uv * uTime * 0.05, vec2(12.9898, 78.233))) * 43758.5453) * uNoiseIntensity * uFisheyeIntensity;
      color += n;
    }

    float vignetteEffect = 1.0 - smoothstep(uVignetteStart, uVignetteEnd, distanceFromCenter) * uVignetteIntensity;
    color *= vignetteEffect;

    gl_FragColor = vec4(color, 1.0);
  }
`;

const FisheyeShaderMaterial = shaderMaterial(
  {
    uTexture: null,
    uTime: 0,
    uFisheyeIntensity: 0,
    uFisheyeStrength: 1.0,
    uVignetteStart: 0.3,
    uVignetteEnd: 0.8,
    uFisheyeRadius: 0.8,
    uChromaticAberration: 0.015,
    uNoiseIntensity: 0.08,
    uVignetteIntensity: 0.32,
    uMouseEffect: 0.02,
    uMouseRadius: 0.3,
    uShowVignetteMask: 0.0,
    uMouse: new THREE.Vector2(0, 0),
    uAspectRatio: 1,
  },
  vertexShader,
  fragmentShader
);

extend({ FisheyeShaderMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    fisheyeShaderMaterial: any;
  }
}

function Quad({
  src,
  intensityRef,
  settings,
  mouseRef,
}: {
  src: string;
  intensityRef: React.MutableRefObject<number>;
  settings: FisheyeSettings;
  mouseRef: React.MutableRefObject<THREE.Vector2>;
}) {
  const materialRef = useRef<any>(null!);
  const tStart = useRef<number>(0);
  const { size } = useThree();

  const texture = useTexture(src);
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    if (tStart.current === 0) tStart.current = clock.elapsedTime;
    materialRef.current.uTime = clock.elapsedTime - tStart.current;
    materialRef.current.uFisheyeIntensity = intensityRef.current;
    materialRef.current.uTexture = texture;
    materialRef.current.uMouse.set(mouseRef.current.x, mouseRef.current.y);
    const aspect = Math.max(1e-6, size.width / size.height);
    materialRef.current.uAspectRatio = aspect;

    materialRef.current.uFisheyeStrength = settings.fisheyeStrength;
    materialRef.current.uVignetteStart = settings.vignetteStart;
    materialRef.current.uVignetteEnd = settings.vignetteEnd;
    materialRef.current.uFisheyeRadius = settings.fisheyeRadius;
    materialRef.current.uChromaticAberration = settings.chromaticAberration;
    materialRef.current.uNoiseIntensity = settings.noiseIntensity;
    materialRef.current.uVignetteIntensity = settings.vignetteIntensity;
    materialRef.current.uShowVignetteMask = settings.showVignetteMask ? 1.0 : 0.0;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <fisheyeShaderMaterial ref={materialRef} transparent />
    </mesh>
  );
}

const FisheyeShader = ({ src, className = '', settings }: FisheyeShaderProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const canvasWrapperRef = useRef<HTMLDivElement>(null);

    const intensityRef = useRef(0);
    const tweenRef = useRef<gsap.core.Tween | null>(null);
    const isHoveredRef = useRef(false);

    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const [canvasOpacity, setCanvasOpacity] = useState(0);

    useEffect(() => {
      const el = containerRef.current;
      if (!el) return;

      const onEnter = () => {
        isHoveredRef.current = true;
        if (tweenRef.current) tweenRef.current.kill();
        tweenRef.current = gsap.to(intensityRef, {
          current: 1,
          duration: settings.animationDuration,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
          onUpdate: () => {},
        });
        setCanvasOpacity(settings.canvasOpacity);
      };
      const onLeave = () => {
        isHoveredRef.current = false;
        if (tweenRef.current) tweenRef.current.kill();
        tweenRef.current = gsap.to(intensityRef, {
          current: 0,
          duration: settings.animationDuration,
          ease: 'cubic-bezier(0.23, 1, 0.32, 1)',
        });
        setCanvasOpacity(0);
      };

      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mouseenter', onEnter);
        el.removeEventListener('mouseleave', onLeave);
      };
    }, [settings.animationDuration, settings.canvasOpacity]);

    return (
      <div ref={containerRef} className={`relative group ${className}`}>
        <img ref={imgRef} src={src} alt="" className="block w-full h-full object-cover select-none pointer-events-none grayscale contrast-125" />
        <div ref={canvasWrapperRef} className="absolute inset-0" style={{ opacity: canvasOpacity, transition: 'opacity 300ms ease' }}>
          <Canvas
            orthographic
            gl={{ alpha: true, antialias: true, premultipliedAlpha: false }}
            dpr={[1, 2]}
            frameloop="always"
            className="w-full h-full"
          >
            <OrthographicCamera makeDefault position={[0, 0, 1]} near={0} far={1} />
            <Quad src={src} intensityRef={intensityRef} settings={settings} mouseRef={mouseRef} />
          </Canvas>
        </div>
      </div>
    );
};

export default FisheyeShader;