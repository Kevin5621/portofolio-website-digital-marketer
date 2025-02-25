"use client"

import { PortfolioGrid } from "@/components/portofolio/portofolio";
import { Navbar } from "@/components/navbar";

export default function PortfolioPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <div className="pt-16">
        <PortfolioGrid />
      </div>
    </main>
  );
}