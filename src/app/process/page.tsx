"use client"

import { ProcessWave } from "@/components/process";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";
import { Astronaut3D } from "@/lib/hooks/Planetary";

export default function ProcessPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      
      {/* Astronaut background */}
      <div className="fixed inset-0 z-0 opacity-50">
        <Astronaut3D />
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-space font-bold gradient-text mb-6">
              Proses Kreatif
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Setiap proyek melalui tahapan yang didesain untuk menghasilkan karya berkualitas tinggi.
              Transparansi dan komunikasi adalah kunci untuk hasil yang memuaskan.
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-gray-900/60 backdrop-blur-md p-8 rounded-2xl mb-16"
          >
            <h2 className="text-2xl font-space font-bold mb-4 text-white">
              Metodologi Kreatif
            </h2>
            <p className="text-gray-300 mb-6">
              Pendekatan kami menggabungkan inovasi teknis dengan visi artistik.
              Kami fokus pada hasil yang tidak hanya memenuhi tujuan bisnis,
              tetapi juga menciptakan pengalaman yang berkesan bagi audiens.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/60 p-6 rounded-xl">
                <h3 className="text-xl font-space font-bold mb-2 text-white">
                  Riset & Analisis
                </h3>
                <p className="text-gray-400">
                  Memahami pasar, kompetitor, dan target audiens untuk 
                  menghasilkan strategi yang tepat sasaran.
                </p>
              </div>
              
              <div className="bg-gray-800/60 p-6 rounded-xl">
                <h3 className="text-xl font-space font-bold mb-2 text-white">
                  Eksekusi & Evaluasi
                </h3>
                <p className="text-gray-400">
                  Proses produksi dengan standar kualitas tinggi, diikuti
                  dengan evaluasi menyeluruh untuk hasil optimal.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <ProcessWave />
      </div>
    </main>
  );
}