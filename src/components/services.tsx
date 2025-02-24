"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface Service {
  title: string;
  description: string;
  price: string;
  skills: { name: string; level: number }[];
}

const services: Service[] = [
  {
    title: "Video Editing",
    description: "Professional video editing dengan sentuhan kreatif",
    price: "Mulai dari 5jt/proyek",
    skills: [
      { name: "After Effects", level: 95 },
      { name: "Premiere Pro", level: 90 },
      { name: "DaVinci Resolve", level: 85 },
    ],
  },
  // ... tambahkan layanan lainnya
];

export function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  return (
    <section className="py-20 px-4 bg-background">
      <h2 className="text-4xl font-space font-bold text-center mb-12 gradient-text">
        Services
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {services.map((service, index) => (
          <motion.div
            key={service.title}
            className={`relative h-96 perspective-1000 cursor-pointer ${
              activeIndex === index ? "rotate-y-180" : ""
            }`}
            onClick={() => setActiveIndex(activeIndex === index ? -1 : index)}
          >
            <div
              className={`absolute inset-0 backface-hidden transition-transform duration-500 ${
                activeIndex === index ? "rotate-y-180" : ""
              }`}
            >
              <div className="h-full bg-gray-900 rounded-xl p-8 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-space font-bold mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-400">{service.description}</p>
                </div>
                <div className="text-xl font-space gradient-text">
                  {service.price}
                </div>
              </div>
            </div>

            <div
              className={`absolute inset-0 backface-hidden bg-gray-900 rounded-xl p-8 rotate-y-180 transition-transform duration-500 ${
                activeIndex === index ? "" : "-rotate-y-180"
              }`}
            >
              <h4 className="text-xl font-space font-bold mb-6">Skills</h4>
              {service.skills.map((skill) => (
                <div key={skill.name} className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}