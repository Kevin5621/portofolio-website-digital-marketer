"use client"

import { Navbar } from "@/components/navbar";
import AboutMe from "@/components/about-me";

export default function ServicesPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <div className="pt-16">
        <AboutMe />
      </div>
    </main>
  );
}