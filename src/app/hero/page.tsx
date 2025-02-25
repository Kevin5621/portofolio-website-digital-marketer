"use client"

import { motion } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero";
import { GalaxyBackground } from "@/lib/hooks/galaxy-background";
import { useRouter } from "next/navigation";

export default function HeroPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

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
        }`}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onWheel={(e) => {
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
        <Canvas camera={{ position: [0, 0, 100], fov: 60 }}>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            rotateSpeed={0.5}
            zoomSpeed={0.8}
            panSpeed={0.5}
            dampingFactor={0.1}
            minDistance={10}
            maxDistance={25}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 1.5}
          />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <GalaxyBackground />
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 pointer-events-none">
        <HeroSection onExplore={() => router.push('/content')} />
      </div>

      {/* Ambient Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 galaxy-gradient" />
      </div>
    </main>
  );
}