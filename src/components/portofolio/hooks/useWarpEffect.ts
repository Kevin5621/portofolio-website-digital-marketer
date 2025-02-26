import * as THREE from 'three';
import { useRef, useEffect } from 'react';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';

// Custom shader for warp effect
const WarpShader = {
    uniforms: {
      'tDiffuse': { value: null },
      'time': { value: 0 },
      'warpIntensity': { value: 0 },
      'distortion': { value: 0 },
      'blurAmount': { value: 0 }, // New uniform for blur control
      'brightness': { value: 1.0 }, // New uniform for brightness control
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float time;
      uniform float warpIntensity;
      uniform float distortion;
      uniform float blurAmount;
      uniform float brightness;
      varying vec2 vUv;
  
      // Gaussian blur function
      vec4 blur13(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
        vec4 color = vec4(0.0);
        vec2 off1 = vec2(1.411764705882353) * direction;
        vec2 off2 = vec2(3.2941176470588234) * direction;
        vec2 off3 = vec2(5.176470588235294) * direction;
        
        color += texture2D(image, uv) * 0.1964825501511404;
        color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
        color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
        color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
        color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
        color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
        color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
        
        return color;
      }
  
      void main() {
        vec2 center = vec2(0.5, 0.5);
        vec2 uv = vUv;
        vec2 resolution = vec2(1024.0, 1024.0); // Assuming 1024x1024 resolution
        
        // Radial distortion
        float dist = distance(uv, center);
        float distortionFactor = 1.0 + dist * distortion * 2.0;
        uv = center + (uv - center) * distortionFactor;
        
        // Warp speed effect
        float warpOffset = dist * warpIntensity;
        vec2 warpUv = uv + (uv - center) * warpOffset;
        
        // Apply blur based on blurAmount
        vec4 color;
        if (blurAmount > 0.01) {
          // Two-pass gaussian blur
          vec4 blurPass1 = blur13(tDiffuse, warpUv, resolution, vec2(blurAmount, 0.0));
          color = blur13(tDiffuse, warpUv, resolution, vec2(0.0, blurAmount));
          color = mix(texture2D(tDiffuse, warpUv), color, blurAmount);
        } else {
          color = texture2D(tDiffuse, warpUv);
        }
        
        // Color shifting and streaks
        float streak = max(0.0, 1.0 - abs(dist - warpIntensity * 0.5) * 10.0);
        color.rgb += vec3(0.5, 0.7, 1.0) * streak * warpIntensity;
        
        // Apply brightness control
        color.rgb *= brightness;
        
        gl_FragColor = color;
      }
    `
  };

export interface WarpEffectState {
  active: boolean;
  startTime: number;
  duration: number;
  initialCameraPos: THREE.Vector3;
  targetCameraPos: THREE.Vector3;
  initialLookAt: THREE.Vector3;
  targetLookAt: THREE.Vector3;
}

export const useWarpEffect = (
  scene: THREE.Scene | null,
  camera: THREE.PerspectiveCamera | null,
  renderer: THREE.WebGLRenderer | null
) => {
  const composerRef = useRef<EffectComposer | null>(null);
  const warpPassRef = useRef<ShaderPass | null>(null);
  const warpStateRef = useRef<WarpEffectState>({
    active: false,
    startTime: 0,
    duration: 3000,
    initialCameraPos: new THREE.Vector3(),
    targetCameraPos: new THREE.Vector3(),
    initialLookAt: new THREE.Vector3(),
    targetLookAt: new THREE.Vector3()
  });

  useEffect(() => {
    if (!scene || !camera || !renderer) return;

    // Initialize post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    // Add bloom for light streaks
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      1.5, // intensity
      0.4, // radius
      0.85 // threshold
    );
    composer.addPass(bloomPass);

    // Add custom warp shader
    const warpPass = new ShaderPass(WarpShader);
    composer.addPass(warpPass);

    composerRef.current = composer;
    warpPassRef.current = warpPass;

    return () => {
      composer.dispose();
    };
  }, [scene, camera, renderer]);

  const startWarpEffect = (
    startPos: THREE.Vector3,
    endPos: THREE.Vector3,
    startLookAt: THREE.Vector3,
    endLookAt: THREE.Vector3
  ) => {
    if (!camera) return;

    const state = warpStateRef.current;
    state.active = true;
    state.startTime = performance.now();
    state.initialCameraPos = startPos.clone();
    state.targetCameraPos = endPos.clone();
    state.initialLookAt = startLookAt.clone();
    state.targetLookAt = endLookAt.clone();

    // Reset camera to initial position
    camera.position.copy(startPos);
  };

  const updateWarpEffect = (time: number) => {
    if (!composerRef.current || !warpPassRef.current || !camera) return false;

    const state = warpStateRef.current;
    if (!state.active) return false;

    const elapsed = time - state.startTime;
    const progress = Math.min(elapsed / state.duration, 1);

    // Custom easing for dramatic effect
    const easeInOutBack = (t: number) => {
      const c1 = 1.70158;
      const c2 = c1 * 1.525;
      return t < 0.5
        ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
        : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
    };

    const eased = easeInOutBack(progress);

    // Update camera position
    camera.position.lerpVectors(state.initialCameraPos, state.targetCameraPos, eased);

    // Update look-at target
    const currentLookAt = new THREE.Vector3();
    currentLookAt.lerpVectors(state.initialLookAt, state.targetLookAt, eased);
    camera.lookAt(currentLookAt);

    // Update shader uniforms for visual effects
    const warpIntensity = progress < 0.5 
      ? progress * 2 // Accelerate
      : (1 - progress) * 2; // Decelerate

    const distortion = Math.sin(progress * Math.PI) * 0.3;

    warpPassRef.current.uniforms.time.value = time * 0.001;
    warpPassRef.current.uniforms.warpIntensity.value = warpIntensity;
    warpPassRef.current.uniforms.distortion.value = distortion;

    // Add camera shake during initial warp
    if (progress < 0.3) {
      const shake = Math.sin(time * 0.05) * (0.3 - progress);
      camera.position.y += shake * 0.2;
      camera.position.x += shake * 0.1;
    }

    // Render with post-processing
    composerRef.current.render();

    // Return true if effect is still active
    if (progress >= 1) {
      state.active = false;
      return false;
    }
    return true;
  };

  return {
    startWarpEffect,
    updateWarpEffect,
    isWarping: () => warpStateRef.current.active
  };
};