"use client"

import { ContactSection } from "@/components/contact";
import { PortfolioGrid } from "@/components/portofolio";
import { ProcessWave } from "@/components/process";
import { ServicesSection } from "@/components/services";
import { TestimonialCarousel } from "@/components/testimoni";

export default function ContentPage() {
  return (
    <main className="relative w-full">
      {/* Main Content */}
      <div className="relative z-10">
        <PortfolioGrid />
        <ProcessWave />
        <ServicesSection />
        <TestimonialCarousel />
        <ContactSection />
      </div>
    </main>
  );
}