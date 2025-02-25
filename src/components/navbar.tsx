"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Binary } from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  
  const routes = [
    { path: "/hero", label: "Home" },
    { path: "/portofolio", label: "Portofolio" },
    { path: "/about-me", label: "About Me" },
    { path: "/process", label: "Process" },
    { path: "/testimonials", label: "Testimoni" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/hero" className="flex items-center gap-2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Binary size={24} className="text-primary" />
            </motion.div>
            <span className="font-space font-bold text-lg gradient-text">
              Adhara Eka
            </span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-1">
            {routes.map((route) => {
              const isActive = pathname === route.path;
              
              return (
                <Link
                  key={route.path}
                  href={route.path}
                  className="relative px-4 py-2"
                >
                  <span className={`relative z-10 ${isActive ? "text-white" : "text-gray-400 hover:text-white"}`}>
                    {route.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-blue-500/50 rounded-full z-0"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          <div className="md:hidden">
            {/* Hamburger menu untuk mobile (bisa diimplementasikan nanti) */}
            <button className="p-2">
              <div className="w-5 h-0.5 bg-white mb-1"></div>
              <div className="w-5 h-0.5 bg-white mb-1"></div>
              <div className="w-5 h-0.5 bg-white"></div>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}