"use client"

import { ContactSection } from "@/components/contact";
import { HeroSection } from "@/components/hero";
import { PortfolioGrid } from "@/components/portofolio";
import { ProcessWave } from "@/components/process";
import { ServicesSection } from "@/components/services";
import { TestimonialCarousel } from "@/components/testimoni";
import { GalaxyBackground } from "@/lib/hooks/galaxy-background";
import { motion } from "framer-motion";
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { useState, useEffect } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="fixed inset-0">
        <Canvas>
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

      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <PortfolioGrid />
        <ProcessWave />
        <ServicesSection />
        <TestimonialCarousel />
        <ContactSection />
      </div>

      {/* Ambient Background Gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 galaxy-gradient" />
      </div>
    </main>
  );
}