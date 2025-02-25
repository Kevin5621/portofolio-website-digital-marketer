"use client"

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GalaxyBackground() {
  const starsRef = useRef<THREE.Points>(null);
  const gasCloudRef = useRef<THREE.Points>(null);
  const darkMatterRef = useRef<THREE.Points>(null);

  // Enhanced galaxy parameters
  const galaxyParams = useMemo(() => ({
    // Stars parameters
    starsCount: 100000, // Increased number of stars
    starSize: 0.05,
    radius: 20,
    branches: 5,
    spin: 1,
    randomness: 0.2,
    randomnessPower: 3,
    insideColor: '#ff8a00', // More reddish/yellow for older stars in the center
    outsideColor: '#4287f5', // More bluish for younger stars in the outer regions
    opacity: 1.0,
    
    // Gas and dust parameters
    gasCount: 50000,
    gasSize: 0.08,
    gasOpacity: 0.4,
    gasColor: '#8a9ef5', // Bluish for hydrogen gas
    dustColor: '#a63c06', // Reddish brown for dust
    
    // Dark matter parameters
    darkMatterCount: 30000,
    darkMatterSize: 0.03,
    darkMatterRadius: 30, // Extends beyond visible galaxy
    darkMatterOpacity: 0.15,
    darkMatterColor: '#ffffff'
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

  // Create gas cloud texture function
  const createGasTexture = () => {
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
    
    gradient.addColorStop(0, 'rgba(255,255,255,0.8)');
    gradient.addColorStop(0.3, 'rgba(200,200,255,0.6)');
    gradient.addColorStop(0.6, 'rgba(100,100,200,0.3)');
    gradient.addColorStop(1, 'rgba(0,0,100,0)');
    
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
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

  // Create stars geometry and material
  const stars = useMemo(() => {
    const { starsCount, branches, randomness, randomnessPower, insideColor, outsideColor, radius, spin } = galaxyParams;
    
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    
    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);

    // Star size variation factors
    const minStarSize = galaxyParams.starSize * 0.5;
    const maxStarSize = galaxyParams.starSize * 2.0;

    for (let i = 0; i < starsCount; i++) {
      const i3 = i * 3;
      
      // Position in spiral galaxy
      const r = Math.pow(Math.random(), 2) * radius; // Squared distribution for more concentration in center
      const spinAngle = r * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;
      
      // Randomness factors for realism
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.5;
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      // Star positions in galaxy
      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY; // Thinner galaxy
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
      
      // Star colors based on distance from center and some randomization
      // for different stellar types
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, r / radius);
      
      // Add some color variation
      if (Math.random() > 0.98) {
        // Occasionally add a reddish star (giant)
        colors[i3] = 0.8 + Math.random() * 0.2;
        colors[i3 + 1] = 0.2 + Math.random() * 0.3;
        colors[i3 + 2] = 0.2 + Math.random() * 0.2;
      } else if (Math.random() > 0.98) {
        // Occasionally add a white/blue bright star
        colors[i3] = 0.7 + Math.random() * 0.3;
        colors[i3 + 1] = 0.7 + Math.random() * 0.3;
        colors[i3 + 2] = 0.9 + Math.random() * 0.1;
      } else {
        // Normal gradient stars
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Star material with size attenuation
    const material = new THREE.PointsMaterial({
      size: galaxyParams.starSize,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: galaxyParams.opacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: textures.star
    });
    
    return { geometry, material };
  }, [galaxyParams, textures]);

  // Create gas and dust geometry and material
  const gasAndDust = useMemo(() => {
    const { gasCount, radius, branches, gasColor, dustColor, spin } = galaxyParams;
    
    const positions = new Float32Array(gasCount * 3);
    const colors = new Float32Array(gasCount * 3);
    
    const gasCloudColor = new THREE.Color(gasColor);
    const dustCloudColor = new THREE.Color(dustColor);

    for (let i = 0; i < gasCount; i++) {
      const i3 = i * 3;
      
      // Gas clouds follow spiral arms more closely
      const r = Math.random() * radius * 0.9; // Gas doesn't extend quite as far as stars
      const spinAngle = r * spin * 1.2; // Gas rotates slightly differently
      
      // Make gas clouds follow arms more closely
      const branchIndex = Math.floor(Math.random() * branches);
      const branchAngle = (branchIndex / branches) * Math.PI * 2;
      
      // Less randomness for gas - it's more concentrated in the arms
      const randomness = galaxyParams.randomness * 0.7;
      const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.3;
      const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      // Position gas clouds
      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY; // Gas is thinner than stars
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
      
      // Color gas/dust - hydrogen gas (blue) vs dust (reddish brown)
      if (Math.random() > 0.3) { // 70% gas, 30% dust
        // Hydrogen gas (blueish)
        colors[i3] = gasCloudColor.r;
        colors[i3 + 1] = gasCloudColor.g;
        colors[i3 + 2] = gasCloudColor.b;
      } else {
        // Dust (reddish brown)
        colors[i3] = dustCloudColor.r;
        colors[i3 + 1] = dustCloudColor.g;
        colors[i3 + 2] = dustCloudColor.b;
      }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Gas material with special blending
    const material = new THREE.PointsMaterial({
      size: galaxyParams.gasSize,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: galaxyParams.gasOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: textures.gas
    });
    
    return { geometry, material };
  }, [galaxyParams, textures]);

  // Create dark matter geometry and material
  const darkMatter = useMemo(() => {
    const { darkMatterCount, darkMatterRadius, darkMatterColor } = galaxyParams;
    
    const positions = new Float32Array(darkMatterCount * 3);
    const colors = new Float32Array(darkMatterCount * 3);
    
    const dmColor = new THREE.Color(darkMatterColor);

    for (let i = 0; i < darkMatterCount; i++) {
      const i3 = i * 3;
      
      // Dark matter forms a spherical halo around galaxy
      // Use spherical distribution rather than disk
      const radius = Math.pow(Math.random(), 1/3) * darkMatterRadius; // Power of 1/3 for uniform volume distribution
      const theta = Math.random() * Math.PI * 2; // Azimuthal angle
      const phi = Math.acos(2 * Math.random() - 1); // Polar angle
      
      // Position in spherical coordinates
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // Dark matter is represented by dimmer white points
      colors[i3] = dmColor.r;
      colors[i3 + 1] = dmColor.g;
      colors[i3 + 2] = dmColor.b;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // Dark matter material - subtle and transparent
    const material = new THREE.PointsMaterial({
      size: galaxyParams.darkMatterSize,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: galaxyParams.darkMatterOpacity,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: textures.darkMatter
    });
    
    return { geometry, material };
  }, [galaxyParams, textures]);

  // Animation with differential rotation
  useFrame(() => {
    if (starsRef.current) {
      // Stars rotate at different speeds based on distance from center
      starsRef.current.rotation.y += 0.0003;
      starsRef.current.rotation.z += 0.0001;
    }
    if (gasCloudRef.current) {
      // Gas rotates slightly faster than stars
      gasCloudRef.current.rotation.y += 0.0004;
      gasCloudRef.current.rotation.z += 0.00005;
    }
    if (darkMatterRef.current) {
      // Dark matter rotates more slowly
      darkMatterRef.current.rotation.y += 0.0001;
      darkMatterRef.current.rotation.z += 0.00002;
    }
  });
  
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