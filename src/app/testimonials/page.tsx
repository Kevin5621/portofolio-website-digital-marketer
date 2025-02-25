"use client"

import { TestimonialCarousel } from "@/components/testimoni";
import { Navbar } from "@/components/navbar";

export default function TestimonialsPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <div className="pt-16">
        <TestimonialCarousel />
      </div>
    </main>
  );
}