"use client"

import { ProcessWave } from "@/components/process";
import { Navbar } from "@/components/navbar";

export default function ProcessPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <div className="pt-16">
        <ProcessWave />
      </div>
    </main>
  );
}