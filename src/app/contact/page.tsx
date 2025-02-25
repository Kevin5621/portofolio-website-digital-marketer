"use client"

import { ContactSection } from "@/components/contact";
import { Navbar } from "@/components/navbar";

export default function ContactPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <div className="pt-16">
        <ContactSection />
      </div>
    </main>
  );
}