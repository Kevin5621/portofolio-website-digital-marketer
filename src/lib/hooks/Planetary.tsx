"use client";

import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface Astronaut3DProps {
  className?: string;
}

export function Astronaut3D({ className = "" }: Astronaut3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;

    // Scene, camera, renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    scene.fog = new THREE.FogExp2(0x000000, 0.002);
    
    const camera = new THREE.PerspectiveCamera(
      55, 
      container.clientWidth / container.clientHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 1.5, 3);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    // Update for Three.js recent versions - use ColorManagement instead of outputEncoding
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Lighting
    const ambientLight = new THREE.AmbientLight(0xcccccc, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
    
    const purpleLight = new THREE.PointLight(0x7c3aed, 1, 10);
    purpleLight.position.set(-2, 1, 2);
    scene.add(purpleLight);
    
    const blueLight = new THREE.PointLight(0x3b82f6, 1, 10);
    blueLight.position.set(2, 1, -2);
    scene.add(blueLight);
    
    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;
    
    // Membuat astronot sederhana
    const createAstronaut = () => {
      const group = new THREE.Group();
      
      // Buat kepala astronot (helm)
      const helmet = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 32, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xffffff,
          roughness: 0.3,
          metalness: 0.8
        })
      );
      helmet.position.y = 0.25;
      group.add(helmet);
      
      // Visor helm
      const visor = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({
          color: 0x2a52be,
          roughness: 0.1,
          metalness: 0.9,
          side: THREE.DoubleSide
        })
      );
      visor.position.set(0, 0.25, 0.1);
      visor.rotation.x = Math.PI / 2;
      group.add(visor);
      
      // Badan astronot
      const body = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.2, 0.3, 4, 8),
        new THREE.MeshStandardMaterial({
          color: 0xffffff,
          roughness: 0.5,
          metalness: 0.2
        })
      );
      body.position.y = -0.15;
      group.add(body);
      
      // Kaki
      const createLeg = (posX: number) => {
        const leg = new THREE.Mesh(
          new THREE.CapsuleGeometry(0.07, 0.3, 4, 8),
          new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.5,
            metalness: 0.2
          })
        );
        leg.position.set(posX, -0.4, 0);
        leg.rotation.z = posX < 0 ? 0.3 : -0.3;
        return leg;
      };
      
      group.add(createLeg(-0.1));
      group.add(createLeg(0.1));
      
      return group;
    };
    
    // Membuat planet
    const createPlanet = () => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      
      // Buat material yang terlihat seperti planet
      const material = new THREE.MeshStandardMaterial({
        color: 0x3498db,
        roughness: 0.7,
        metalness: 0.2,
      });
      
      const planet = new THREE.Mesh(geometry, material);
      
      // Tambahkan cincin planet
      const ringGeometry = new THREE.RingGeometry(0.7, 0.9, 32);
      const ringMaterial = new THREE.MeshStandardMaterial({
        color: 0x9b59b6,
        side: THREE.DoubleSide,
        roughness: 0.6,
        metalness: 0.2,
        transparent: true,
        opacity: 0.7
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      planet.add(ring);
      
      return planet;
    };
    
    // Buat scene astronot dan planet
    const createScene = () => {
      // Buat platform duduk
      const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32),
        new THREE.MeshStandardMaterial({
          color: 0x333333,
          roughness: 0.8,
          metalness: 0.2
        })
      );
      platform.position.y = -0.7;
      scene.add(platform);
      
      // Tambahkan astronot
      const astronaut = createAstronaut();
      astronaut.position.set(0, -0.4, 0);
      astronaut.rotation.y = -Math.PI / 4;
      scene.add(astronaut);
      
      // Tambahkan planet
      const planet = createPlanet();
      planet.position.set(0.5, 0, 0.5);
      planet.scale.set(0.6, 0.6, 0.6);
      scene.add(planet);
      
      // Animasi planet
      const animatePlanet = () => {
        planet.rotation.y += 0.005;
        planet.rotation.x += 0.002;
      };
      
      return { astronaut, planet, animatePlanet };
    };
    
    // Stars background
    
    const { astronaut, animatePlanet } = createScene();
    
    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      animatePlanet();
      
      // Tambahkan sedikit gerakan pada astronot
      if (astronaut) {
        astronaut.rotation.y += 0.001;
        astronaut.position.y = -0.4 + Math.sin(Date.now() * 0.001) * 0.03;
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    setLoading(false);
    
    // Handle window resize
    const handleResize = () => {
      if (!container) return;
      
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (renderer) {
        renderer.dispose();
      }
      
      if (rendererRef.current && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className={`w-full h-full ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
}