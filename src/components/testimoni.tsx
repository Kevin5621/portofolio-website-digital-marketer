"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Marketing Director",
    company: "Tech Corp",
    image: "/testimonials/john.jpg",
    content: "Hasil kerja yang luar biasa dan profesional!",
  },
  // ... tambahkan testimonial lainnya
];

export function TestimonialCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="grid grid-cols-4 gap-4">
          {/* Background collage */}
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-purple-600/30 to-blue-500/30 rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-4xl font-space font-bold text-center mb-12 gradient-text">
          Client Stories
        </h2>

        <div className="relative h-[500px]">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className={`absolute top-0 left-0 w-full transform ${
                index === activeIndex ? "z-10" : "z-0"
              }`}
              initial={{ opacity: 0, x: 100 }}
              animate={{
                opacity: index === activeIndex ? 1 : 0,
                x: index === activeIndex ? 0 : 100,
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-gray-900 rounded-xl p-8 md:p-12 shadow-xl">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-40 h-40">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="rounded-xl object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xl mb-6">{testimonial.content}</p>
                    <h3 className="text-2xl font-space font-bold mb-2">
                      {testimonial.name}
                    </h3>
                    <p className="text-gray-400">
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeIndex
                  ? "bg-gradient-to-r from-purple-600 to-blue-500"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}