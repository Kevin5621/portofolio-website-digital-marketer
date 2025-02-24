"use client"

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GalaxyBackground() {
  const points = useRef<THREE.Points>(null);

  const { geometry } = useMemo(() => {
    const particlesCount = 6000;
    const positions = new Float32Array(particlesCount * 3);
    const colors = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const radius = Math.random() * 100;
      const spinAngle = radius * 0.1;
      const branchAngle = ((i % 3) / 3) * Math.PI * 2;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
      positions[i3 + 1] = (Math.random() - 0.5) * 5;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

      const mixedColor = new THREE.Color();
      mixedColor.setHSL(Math.random() * 0.2 + 0.4, 0.8, 0.6);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    return { geometry };
  }, []);

  // Hapus parameter state jika tidak digunakan
  useFrame(() => {
    if (points.current) {
      points.current.rotation.y += 0.0005;
      points.current.rotation.z += 0.0002;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry attach="geometry" {...geometry} />
      <pointsMaterial
        attach="material"
        size={0.1}
        sizeAttenuation={true}
        vertexColors={true}
        transparent
        opacity={0.8}
      />
    </points>
  );
}