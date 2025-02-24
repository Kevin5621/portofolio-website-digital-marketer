"use client";

import { Project } from "@/styles/types";
import { motion } from "framer-motion";
import Image from "next/image";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="relative bg-gray-900 rounded-xl overflow-hidden cursor-pointer group"
      onClick={onClick}
    >
      <Image
        src={project.thumbnail}
        alt={project.title}
        width={400}
        height={300}
        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-6">
          <h3 className="text-xl font-space font-bold text-white mb-2">
            {project.title}
          </h3>
          <p className="text-gray-300">{project.category}</p>
        </div>
      </div>
    </motion.div>
  );
}