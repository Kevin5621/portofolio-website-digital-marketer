"use client"

import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GalaxyBackgroundProps {
  isZooming?: boolean;
}

export function GalaxyBackground({ isZooming = false }: GalaxyBackgroundProps) {
  const starsRef = useRef<THREE.Points>(null);
  const gasCloudRef = useRef<THREE.Points>(null);
  const darkMatterRef = useRef<THREE.Points>(null);
  const [zoomStartTime, setZoomStartTime] = useState<number | null>(null);

  // Track when zooming state changes
  useEffect(() => {
    if (isZooming) {
      setZoomStartTime(Date.now());
    } else {
      setZoomStartTime(null);
    }
  }, [isZooming]);

  // Enhanced galaxy parameters with more natural settings
  const galaxyParams = useMemo(() => ({
    // Stars parameters
    starsCount: 180000,
    starSize: 0.025,
    radius: 25,
    branches: 5, // More branches for more natural look
    branchesRandomness: 0.3, // Allow branches to vary in position
    spin: 1.3,
    randomness: 0.25, // Increased randomness
    randomnessPower: 2.2, // Adjusted for more natural distribution
    insideColor: '#ffb74d',
    outsideColor: '#e3f2fd',
    opacity: 0.7,
    
    // Gas and dust parameters
    gasCount: 100000, // More gas particles
    gasSize: 0.15,
    gasOpacity: 0.25,
    gasColor: '#cfd8dc', 
    dustColor: '#ff8a65',
    
    // Dark matter parameters
    darkMatterCount: 50000,
    darkMatterSize: 0.015, // Smaller dark matter particles
    darkMatterRadius: 40,
    darkMatterOpacity: 0.08,
    darkMatterColor: '#b0bec5',
    
    // New parameters for more natural appearance
    armWidth: 0.8, // Controls how defined the arms appear
    coreSize: 0.2, // Size of the dense galactic core
    coreConcentration: 3, // Higher values make more stars in the core
    diskThickness: 0.6, // How thick the galactic disk is
    dustConcentration: 2.5, // Higher values concentrate dust more in arms
  }), []);
  
  // Create star texture function
  const createStarTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    
    const context = canvas.getContext('2d');
    if (!context) {
      console.warn('Canvas 2D context could not be created');
      return new THREE.Texture();
    }
    
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.2, 'rgba(240,240,255,1)');
    gradient.addColorStop(0.4, 'rgba(128,128,255,0.8)');
    gradient.addColorStop(1, 'rgba(0,0,64,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Create gas cloud texture function with softer edges
  const createGasTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 64; // Increased size for more detail
    canvas.height = 64;
    
    const context = canvas.getContext('2d');
    if (!context) {
      console.warn('Canvas 2D context could not be created');
      return new THREE.Texture();
    }
    
    const gradient = context.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    );
    
    // Softer gradient transitions for more natural gas look
    gradient.addColorStop(0, 'rgba(255,255,255,0.7)');
    gradient.addColorStop(0.2, 'rgba(220,220,255,0.5)');
    gradient.addColorStop(0.5, 'rgba(150,150,200,0.3)');
    gradient.addColorStop(0.8, 'rgba(80,80,150,0.1)');
    gradient.addColorStop(1, 'rgba(0,0,100,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some noise to the texture for more organic feel
    for (let i = 0; i < 300; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 2 + 0.5;
      
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      
      const opacity = Math.random() * 0.07;
      context.fillStyle = `rgba(255,255,255,${opacity})`;
      context.fill();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  };

  // Create textures (memoized)
  const textures = useMemo(() => {
    return {
      star: createStarTexture(),
      gas: createGasTexture(),
      darkMatter: createStarTexture() // Reuse star texture but with different opacity
    };
  }, []);

  // Create stars geometry and material with natural distribution
  const stars = useMemo(() => {
    const { 
      starsCount, branches, randomness, randomnessPower, 
      insideColor, outsideColor, radius, spin, 
      armWidth, coreSize, coreConcentration, diskThickness,
      branchesRandomness
    } = galaxyParams;
    
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    const sizes = new Float32Array(starsCount);
    
    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);

    // Helper function for more natural arm curve using logarithmic spiral
    const getArmOffset = (r: number, angle: number, branchIndex: number) => {
      // Logarithmic spiral parameter (golden angle works well)
      const a = 0.18;
      const b = 0.5;
      
      // Add some variation to each arm
      const armVariation = 1 + (branchIndex / branches) * branchesRandomness;
      
      // logarithmic spiral: r = a * e^(b * angle)
      const spiralR = a * Math.exp(b * angle) * armVariation;
      return spiralR;
    };

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      
      // Core and disk distribution
      let r, angle, branchIndex;
      
      // 25% of stars in the dense core
      if (Math.random() < coreSize) {
        // Core stars with concentrated distribution
        r = Math.pow(Math.random(), coreConcentration) * radius * 0.2;
        angle = Math.random() * Math.PI * 2;
        branchIndex = Math.floor(Math.random() * branches);
      } else {
        // Disk stars in spiral structure
        r = Math.pow(Math.random(), 0.8) * radius; // More linear distribution for arm shape
        branchIndex = Math.floor(Math.random() * branches);
        
        // Add slight variation to branch angle
        const branchAngle = ((branchIndex + (Math.random() * 0.3)) / branches) * Math.PI * 2;
        angle = branchAngle + spin * Math.log(r);
      }
      
      // Calculate arm offset for major stars
      let armFactor = 0;
      if (Math.random() > 0.3) { // 70% of stars follow arms more closely
        const armOffset = getArmOffset(r, angle, branchIndex) * armWidth;
        armFactor = Math.exp(-Math.pow(r / radius - armOffset, 2) / 0.05);
      }
      
      // Apply randomness based on distance from center and arm factor
      const randomFactor = (1 - armFactor) * (r / radius);
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * randomFactor;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * diskThickness;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * randomFactor;

      // Star positions in galaxy
      positions[i3] = Math.cos(angle) * r + randomX;
      positions[i3 + 1] = randomY; // Thinner galaxy
      positions[i3 + 2] = Math.sin(angle) * r + randomZ;
      
      // Natural size variation - brighter stars in arms, dimmer ones scattered
      const sizeFactor = Math.random();
      sizes[i] = galaxyParams.starSize * (0.5 + 0.5 * Math.pow(sizeFactor, 2));
      
      // Star colors based on distance from center and some randomization
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, r / radius);
      
      // Add some color variation for realism
      if (Math.random() > 0.985) {
        // Occasionally add a reddish star (giant)
        colors[i3] = 0.8 + Math.random() * 0.2;
        colors[i3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i3 + 2] = 0.2 + Math.random() * 0.2;
        sizes[i] *= 1.5; // Giants are bigger
      } else if (Math.random() > 0.985) {
        // Occasionally add a white/blue bright star
        colors[i3] = 0.7 + Math.random() * 0.3;
        colors[i3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
        sizes[i] *= 1.4; // Blue stars are also bigger
      } else {
        // Normal gradient stars
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
        
        // Add subtle variations
        colors[i3] += (Math.random() - 0.5) * 0.1;
        colors[i3 + 1] += (Math.random() - 0.5) * 0.1;
        colors[i3 + 2] += (Math.random() - 0.5) * 0.1;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Star material with custom shader for variable sizes
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: textures.star },
        globalOpacity: { value: galaxyParams.opacity }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float globalOpacity;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, globalOpacity) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    
    return { geometry, material };
  }, [galaxyParams, textures]);

  // Create gas and dust geometry and material with more natural distribution
  const gasAndDust = useMemo(() => {
    const { 
      gasCount, radius, branches, gasColor, dustColor, spin,
      dustConcentration, branchesRandomness    } = galaxyParams;
    
    const positions = new Float32Array(gasCount * 3);
    const colors = new Float32Array(gasCount * 3);
    const sizes = new Float32Array(gasCount);
    
    const gasCloudColor = new THREE.Color(gasColor);
    const dustCloudColor = new THREE.Color(dustColor);

    // Helper function for dust concentration in arms
    const getArmIntensity = (r: number, angle: number) => {
      const normalizedR = r / radius;
      
      // Calculate angle difference to nearest arm
      let minAngleDiff = Infinity;
      for (let i = 0; i < branches; i++) {
        const branchPos = (i / branches) * Math.PI * 2;
        const spiralAngle = branchPos + spin * Math.log(normalizedR) * 2;
        const angleDiff = Math.abs(angle - spiralAngle) % (Math.PI * 2);
        minAngleDiff = Math.min(minAngleDiff, Math.min(angleDiff, Math.PI * 2 - angleDiff));
      }
      
      // Map angle difference to intensity - closer to arm = higher intensity
      return Math.exp(-Math.pow(minAngleDiff * 1.5, 2));
    };

    for (let i = 0; i < gasCount; i++) {
      const i3 = i * 3;
      
      // Gas clouds follow spiral arms more closely
      const r = (0.1 + Math.pow(Math.random(), 0.6)) * radius * 0.9; // Better distribution
      const branchIndex = Math.floor(Math.random() * branches);
      
      // Create smooth variation across arms
      const branchOffset = (Math.random() * branchesRandomness) - branchesRandomness/2;
      const branchAngle = ((branchIndex + branchOffset) / branches) * Math.PI * 2;
      const spinAngle = spin * Math.log(r / radius + 0.1) * 2;
      const angle = branchAngle + spinAngle;
      
      // Determine how close to the spiral arm this gas cloud is
      const armIntensity = getArmIntensity(r, angle, branchIndex);
      
      // Adjustable randomness based on arm intensity
      const randomFactor = 0.3 * (1 - armIntensity);
      const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * r;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * 0.04 * r;
      const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomFactor * r;

      // Position gas clouds
      positions[i3] = Math.cos(angle) * r + randomX;
      positions[i3 + 1] = randomY * (1 + Math.random());
      positions[i3 + 2] = Math.sin(angle) * r + randomZ;
      
      // Variable sizes for gas clouds - bigger in arms
      const sizeFactor = 0.5 + 2 * armIntensity * Math.random();
      sizes[i] = galaxyParams.gasSize * sizeFactor;
      
      // Gas type and color based on position and arm intensity
      const isNearArm = armIntensity > 0.3;
      const isDust = Math.random() < 0.5 || (isNearArm && Math.random() < dustConcentration * armIntensity);
      
      const distanceFactor = r / radius;
      if (isDust) {
        // Dust - more reddish/brownish, concentrated in arms
        colors[i3] = dustCloudColor.r * (0.7 + 0.3 * Math.random());
        colors[i3 + 1] = dustCloudColor.g * (0.4 + 0.3 * (1 - distanceFactor)) * (0.7 + 0.3 * Math.random());
        colors[i3 + 2] = dustCloudColor.b * (0.3 + 0.2 * (1 - distanceFactor)) * (0.7 + 0.3 * Math.random());
      } else {
        // Gas - more bluish/whitish, more diffuse
        colors[i3] = gasCloudColor.r * (0.8 + 0.2 * Math.random());
        colors[i3 + 1] = gasCloudColor.g * (0.8 + 0.2 * Math.random());
        colors[i3 + 2] = gasCloudColor.b * (0.8 + 0.2 * Math.random());
        
        // Add slight blue tint to some gas clouds
        if (Math.random() > 0.7) {
          colors[i3 + 2] *= 1.2;
        }
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Use same shader as stars but with gas texture
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: textures.gas },
        globalOpacity: { value: galaxyParams.gasOpacity }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float globalOpacity;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, globalOpacity) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    
    return { geometry, material };
  }, [galaxyParams, textures]);

  // Create dark matter geometry and material with more natural halo
  const darkMatter = useMemo(() => {
    const { darkMatterCount, darkMatterRadius, darkMatterColor } = galaxyParams;
    
    const positions = new Float32Array(darkMatterCount * 3);
    const colors = new Float32Array(darkMatterCount * 3);
    const sizes = new Float32Array(darkMatterCount);
    
    const dmColor = new THREE.Color(darkMatterColor);

    for (let i = 0; i < darkMatterCount; i++) {
      const i3 = i * 3;
      
      // Use NFW profile for dark matter halo (density ~ 1/r * (1 + r/rs)^2)
      // where rs is a scale radius
      const scaleRadius = darkMatterRadius * 0.3;
      
      // Generate points with higher density in center using inverse CDF sampling
      const u = Math.random();
      const theta = Math.random() * Math.PI * 2; // Azimuthal angle
      const phi = Math.acos(2 * Math.random() - 1); // Polar angle
      
      // NFW-inspired sampling (simplified)
      let radius;
      if (u < 0.3) {
        // Inner core - higher concentration
        radius = scaleRadius * Math.pow(u / 0.3, 1/2);
      } else {
        // Outer halo - power law falloff
        radius = scaleRadius + (darkMatterRadius - scaleRadius) * Math.pow((u - 0.3) / 0.7, 2/3);
      }
      
      // Position in spherical coordinates with some asymmetry
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta) * (1 + 0.1 * (Math.random() - 0.5));
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * (1 + 0.1 * (Math.random() - 0.5));
      positions[i3 + 2] = radius * Math.cos(phi) * (0.7 + 0.6 * Math.random()); // Slight flattening
      
      // Dark matter is represented by dimmer points with distance-based opacity
      colors[i3] = dmColor.r;
      colors[i3 + 1] = dmColor.g;
      colors[i3 + 2] = dmColor.b;
      
      // Size variation for dark matter
      sizes[i] = galaxyParams.darkMatterSize * (0.6 + 0.8 * Math.random());
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Dark matter material - subtle and transparent
    const material = new THREE.ShaderMaterial({
      uniforms: {
        pointTexture: { value: textures.darkMatter },
        globalOpacity: { value: galaxyParams.darkMatterOpacity }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D pointTexture;
        uniform float globalOpacity;
        varying vec3 vColor;
        
        void main() {
          gl_FragColor = vec4(vColor, globalOpacity) * texture2D(pointTexture, gl_PointCoord);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
    });
    
    return { geometry, material };
  }, [galaxyParams, textures]);

  // Animation with differential rotation and natural movements
  useFrame(({ clock, pointer, camera }) => {
    const elapsedTime = clock.getElapsedTime();
    
    // Organic rotation with slight wobble
    if (starsRef.current) {
      starsRef.current.rotation.y = elapsedTime * 0.05;
      starsRef.current.rotation.x = Math.sin(elapsedTime * 0.025) * 0.01;
    }
    if (gasCloudRef.current) {
      gasCloudRef.current.rotation.y = elapsedTime * 0.06;
      gasCloudRef.current.rotation.x = Math.sin(elapsedTime * 0.02) * 0.015;
    }
    if (darkMatterRef.current) {
      darkMatterRef.current.rotation.y = elapsedTime * 0.02;
      darkMatterRef.current.rotation.x = Math.sin(elapsedTime * 0.015) * 0.005;
    }

    // More natural parallax effect with smooth transitions
    const parallaxX = pointer.x * 0.15;
    const parallaxY = pointer.y * 0.1;

    // Use slow lerp with different speeds for depth effect
    if (starsRef.current) {
      starsRef.current.position.x += (parallaxX - starsRef.current.position.x) * 0.008;
      starsRef.current.position.y += (parallaxY - starsRef.current.position.y) * 0.008;
    }
    if (gasCloudRef.current) {
      gasCloudRef.current.position.x += (parallaxX * 1.3 - gasCloudRef.current.position.x) * 0.006;
      gasCloudRef.current.position.y += (parallaxY * 1.3 - gasCloudRef.current.position.y) * 0.006;
    }
    if (darkMatterRef.current) {
      darkMatterRef.current.position.x += (parallaxX * 0.7 - darkMatterRef.current.position.x) * 0.01;
      darkMatterRef.current.position.y += (parallaxY * 0.7 - darkMatterRef.current.position.y) * 0.01;
    }
    
    // Handle zoom effect with more organic transitions
    if (isZooming && zoomStartTime) {
      const now = Date.now();
      const elapsed = (now - zoomStartTime) / 1000; // Convert to seconds
      const zoomDuration = 3; // 3 seconds for zoom animation (longer for smoother feel)
      
      if (elapsed < zoomDuration) {
        // Calculate zoom progress with easing
        const zoomProgress = easeInOutCubic(Math.min(1, elapsed / zoomDuration));
        const startZ = 100;
        const targetZ = 15; // Final camera Z position
        
        // Update camera position with natural easing
        camera.position.z = startZ - (startZ - targetZ) * zoomProgress;
        
        // Add slight camera movement during zoom for more dramatic effect
        camera.position.x = Math.sin(elapsed * 0.5) * 0.5 * zoomProgress;
        camera.position.y = Math.cos(elapsed * 0.7) * 0.3 * zoomProgress;
        
        // Adjust brightness during zoom
        if (starsRef.current?.material) {
          const starMaterial = starsRef.current.material as THREE.ShaderMaterial;
          starMaterial.uniforms.globalOpacity.value = 
            galaxyParams.opacity + zoomProgress * 0.3;
        }
        
        if (gasCloudRef.current?.material) {
          const gasMaterial = gasCloudRef.current.material as THREE.ShaderMaterial;
          gasMaterial.uniforms.globalOpacity.value = 
            galaxyParams.gasOpacity + zoomProgress * 0.2;
        }
        
        // Increase rotation speed during zoom with easing
        if (starsRef.current) {
          starsRef.current.rotation.y += 0.002 * easeOutQuad(zoomProgress);
        }
        if (gasCloudRef.current) {
          gasCloudRef.current.rotation.y += 0.003 * easeOutQuad(zoomProgress);
        }
      }
    }
  });
  
  // Easing functions for smoother animations
  function easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  
  function easeOutQuad(t: number): number {
    return t * (2 - t);
  }
  
  return (
    <>
      {/* Dark matter halo - rendered first as backdrop */}
      <points ref={darkMatterRef}>
        <primitive object={darkMatter.geometry} attach="geometry" />
        <primitive object={darkMatter.material} attach="material" />
      </points>
      
      {/* Gas and dust clouds */}
      <points ref={gasCloudRef}>
        <primitive object={gasAndDust.geometry} attach="geometry" />
        <primitive object={gasAndDust.material} attach="material" />
      </points>
      
      {/* Stars in the foreground */}
      <points ref={starsRef}>
        <primitive object={stars.geometry} attach="geometry" />
        <primitive object={stars.material} attach="material" />
      </points>
    </>
  );
}