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
    starsCount: 150000,
    starSize: 0.03,
    radius: 25,
    branches: 4,
    spin: 1.5,
    randomness: 0.15,
    randomnessPower: 2.5,
    insideColor: '#ffb74d',
    outsideColor: '#e3f2fd',
    opacity: 0.8,
    
    // Gas and dust parameters
    gasCount: 80000,
    gasSize: 0.12,
    gasOpacity: 0.3,
    gasColor: '#cfd8dc', 
    dustColor: '#ff8a65',
    
    // Dark matter parameters
    darkMatterCount: 40000,
    darkMatterSize: 0.02,
    darkMatterRadius: 35,
    darkMatterOpacity: 0.1,
    darkMatterColor: '#b0bec5'
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
      const branchOffset = (Math.random() - 0.5) * 0.3; // Offset lebih kecil
      const branchAngle = ((branchIndex + branchOffset) / branches) * Math.PI * 2;
      
      const randomness = galaxyParams.randomness * 0.5; // Randomness dikurangi
      const randomX = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;
      const randomY = Math.pow(Math.random(), 4) * (Math.random() < 0.5 ? 1 : -1) * randomness * r * 0.2;
      const randomZ = Math.pow(Math.random(), 3) * (Math.random() < 0.5 ? 1 : -1) * randomness * r;

      // Position gas clouds
      positions[i3] = Math.cos(branchAngle + spinAngle) * r + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;
      
      // Gradien warna berdasarkan jarak
      const mixFactor = r / radius;
      if (Math.random() > 0.4) {
        // Gas putih kebiruan
        colors[i3] = gasCloudColor.r * (1 - mixFactor * 0.2);
        colors[i3 + 1] = gasCloudColor.g * (1 - mixFactor * 0.1);
        colors[i3 + 2] = gasCloudColor.b;
      } else {
        // Debu kemerahan
        colors[i3] = dustCloudColor.r;
        colors[i3 + 1] = dustCloudColor.g * (1 - mixFactor * 0.3);
        colors[i3 + 2] = dustCloudColor.b * (1 - mixFactor * 0.5);
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
  useFrame(({ clock, pointer }) => {
    const elapsedTime = clock.getElapsedTime();
    
    // Rotasi dasar
    if (starsRef.current) {
      starsRef.current.rotation.y = elapsedTime * 0.05;
    }
    if (gasCloudRef.current) {
      gasCloudRef.current.rotation.y = elapsedTime * 0.06;
    }
    if (darkMatterRef.current) {
      darkMatterRef.current.rotation.y = elapsedTime * 0.02;
    }

    // Matikan atau kurangi efek parallax yang mungkin mengganggu OrbitControls
    const parallaxX = pointer.x * 0.1;
    const parallaxY = pointer.y * 0.1;

    // Gunakan lerp yang lebih lambat agar tidak mengganggu OrbitControls
    if (starsRef.current) {
      starsRef.current.position.x += (parallaxX - starsRef.current.position.x) * 0.01;
      starsRef.current.position.y += (parallaxY - starsRef.current.position.y) * 0.01;
    }
    if (gasCloudRef.current) {
      gasCloudRef.current.position.x += (parallaxX * 1.2 - gasCloudRef.current.position.x) * 0.01;
      gasCloudRef.current.position.y += (parallaxY * 1.2 - gasCloudRef.current.position.y) * 0.01;
    }
    if (darkMatterRef.current) {
      darkMatterRef.current.position.x += (parallaxX * 0.8 - darkMatterRef.current.position.x) * 0.01;
      darkMatterRef.current.position.y += (parallaxY * 0.8 - darkMatterRef.current.position.y) * 0.01;
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