"use client"

import { ServicesSection } from "@/components/services";
import { Navbar } from "@/components/navbar";

export default function ServicesPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <div className="pt-16">
        <ServicesSection />
      </div>
    </main>
  );
}