"use client"

import { motion } from 'framer-motion';
import { Binary } from 'lucide-react';

export function HeroSection() {
  return (
    <div className="wormhole min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="text-center"
      >
        <motion.div
          className="mb-8 inline-block"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Binary size={64} className="text-primary" />
        </motion.div>
        
        <h1 className="quantum-text text-6xl font-bold mb-4">
          Adhara Eka
        </h1>
        
        <p className="text-muted-foreground text-xl mb-8">
          Creative Singularity
        </p>

        <motion.button
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-full text-lg font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Enter the Galaxy
        </motion.button>
      </motion.div>
    </div>
  );
}