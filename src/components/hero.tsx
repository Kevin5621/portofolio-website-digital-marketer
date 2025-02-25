"use client"

import { motion } from 'framer-motion';
import { Binary } from 'lucide-react';

// Definisikan interface untuk props
interface HeroSectionProps {
  onExplore: () => void;
}

export function HeroSection({ onExplore }: HeroSectionProps) {
  return (
    <div 
      className="wormhole min-h-screen flex items-center justify-center relative"
      style={{ pointerEvents: 'auto' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2 }}
        className="text-center z-10"
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
        
        <motion.h1 
          className="quantum-text text-6xl font-bold mb-4"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Adhara Eka
        </motion.h1>
        
        <motion.p 
          className="text-muted-foreground text-xl mb-8"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Creative Singularity
        </motion.p>

        <motion.button
          onClick={onExplore}
          style={{ pointerEvents: 'auto' }}
          className="bg-primary/20 backdrop-blur-sm hover:bg-primary/30 text-primary-foreground px-8 py-3 rounded-full text-lg font-medium border border-primary/50"
          whileHover={{ 
            scale: 1.05,
            boxShadow: '0 0 20px rgba(124, 58, 237, 0.5)'
          }}
          whileTap={{ scale: 0.95 }}
        >
          Explore Galaxy
        </motion.button>
      </motion.div>
    </div>
  );
}