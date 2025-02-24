"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementasi pengiriman form
  };

  return (
    <section className="py-20 px-4 bg-background relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-space font-bold text-center mb-12 gradient-text">
          Let&apos;s Create Together
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="relative h-[600px]">
            {/* Tambahkan Spline 3D hologram di sini */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-500/20 rounded-xl" />
          </div>

          <motion.form
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <div>
              <label className="block text-sm font-medium mb-2">Nama</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900 rounded-lg focus:ring-2 focus:ring-purple-600 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-900 rounded-lg focus:ring-2 focus:ring-purple-600 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pesan</label>
              <textarea
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={6}
                className="w-full px-4 py-3 bg-gray-900 rounded-lg focus:ring-2 focus:ring-purple-600 transition-all"
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-space font-bold text-lg"
              type="submit"
            >
              Kirim Pesan
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}