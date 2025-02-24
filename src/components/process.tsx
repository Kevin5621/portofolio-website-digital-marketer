"use client";

import { motion } from "framer-motion";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    title: "Ideasi",
    icon: "💡",
    description: "Brainstorming dan perencanaan konsep kreatif",
  },
  {
    title: "Editing",
    icon: "✂️",
    description: "Proses produksi konten berkualitas tinggi",
  },
  {
    title: "Marketing",
    icon: "📈",
    description: "Strategi distribusi dan promosi konten",
  },
  {
    title: "Launch",
    icon: "🚀",
    description: "Peluncuran dan monitoring hasil",
  },
];

export function ProcessWave() {
  const waveRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(".wave-path", {
        scrollTrigger: {
          trigger: waveRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
        },
        attr: {
          d: "M 0 50 Q 200 0 400 50 Q 600 100 800 50 Q 1000 0 1200 50",
        },
      });
    }, waveRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={waveRef}
      className="py-20 px-4 bg-background relative overflow-hidden"
    >
      <h2 className="text-4xl font-space font-bold text-center mb-20 gradient-text">
        Creative Process
      </h2>

      <div className="relative max-w-7xl mx-auto">
        <svg
          className="absolute top-1/2 left-0 w-full"
          viewBox="0 0 1200 100"
          preserveAspectRatio="none"
        >
          <path
            className="wave-path"
            d="M 0 50 Q 200 50 400 50 Q 600 50 800 50 Q 1000 50 1200 50"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-600 to-blue-500 rounded-full flex items-center justify-center text-3xl">
                {step.icon}
              </div>
              <h3 className="text-xl font-space font-bold mb-2">{step.title}</h3>
              <p className="text-gray-400">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}