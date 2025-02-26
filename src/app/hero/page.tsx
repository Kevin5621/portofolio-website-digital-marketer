"use client"

import { motion } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero";
import { GalaxyBackground } from "@/lib/hooks/galaxy-background";
import { useRouter } from "next/navigation";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

export default function HeroPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [isZooming, setIsZooming] = useState(false);
  const [] = useState({
    chromaticAberration: 0.5,
    bloom: 1.5
  });
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const handleTriggerZoom = (zooming: boolean) => {
    setIsZooming(zooming);
  };

  return (
    <main className="relative w-full">
      {/* Loading Screen */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: isLoading ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        style={{ pointerEvents: isLoading ? 'auto' : 'none' }}
      >
        <motion.h1
          className="quantum-text text-4xl font-bold"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        >
          Entering Creative Singularity...
        </motion.h1>
      </motion.div>

      {/* 3D Background */}
      <div 
        className={`canvas-container ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        } ${isZooming ? 'zooming-to-galaxy' : ''}`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onWheel={(e) => {
          if (isZooming) return; // Disable wheel zoom during animation
          
          const element = e.currentTarget;
          const className = e.deltaY > 0 ? 'zooming-out' : 'zooming';
          element.classList.add(className);
          setTimeout(() => {
            // Periksa apakah elemen masih tersedia di DOM
            if (element && document.body.contains(element)) {
              element.classList.remove(className);
            }
          }, 150);
        }}
      >
        <Canvas camera={{ position: [0, 0, 100], fov: 30 }}>
          <OrbitControls
            enableZoom={!isZooming}
            enablePan={!isZooming}
            enableRotate={!isZooming}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.5}
            dampingFactor={0.1}
            minDistance={40}
            maxDistance={100}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
          <EffectComposer>
            <Bloom intensity={1} luminanceThreshold={0.3} luminanceSmoothing={0.9} />
          </EffectComposer>
          <Stars
            radius={150}
            depth={5}
            count={15000}
            factor={6}
            saturation={2}
            fade
            speed={isZooming ? 2 : 1}
          />
          <GalaxyBackground 
            isZooming={isZooming}
            initialPosition={{ x: 0, y: -1, z: 0 }}
          />
          {isZooming}
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 pointer-events-none">
        <HeroSection onExplore={() => router.push('/portofolio')} triggerZoom={handleTriggerZoom} />
      </div>

      {/* Ambient Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 galaxy-gradient" />
      </div>
      
      {/* Zoom Effect Overlay */}
      {isZooming && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 z-20 pointer-events-none"
        >
          <div className="absolute inset-0 warp-speed-overlay" />
        </motion.div>
      )}
    </main>
  );
}