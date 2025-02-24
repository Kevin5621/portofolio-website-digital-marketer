"use client";

import Image from "next/image";
import { Dialog } from "@radix-ui/react-dialog";
import { motion } from "framer-motion";
import { Project } from "@/styles/types";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <Dialog open onOpenChange={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="container max-w-4xl mx-auto h-full py-8 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gray-900 rounded-2xl overflow-hidden">
            <div className="relative h-[400px]">
              <Image
                src={project.thumbnail}
                alt={project.title}
                fill
                className="object-cover"
              />
            </div>
            
            <div className="p-8">
              <h3 className="text-3xl font-space font-bold mb-4 gradient-text">
                {project.title}
              </h3>
              
              <p className="text-gray-300 mb-8">{project.description}</p>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-space font-bold mb-4">Tools Used</h4>
                  <ul className="space-y-2">
                    {project.tools.map((tool) => (
                      <li
                        key={tool}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500" />
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="text-xl font-space font-bold mb-4">Results</h4>
                  <ul className="space-y-2">
                    {project.results.map((result) => (
                      <li
                        key={result}
                        className="flex items-center gap-2 text-gray-300"
                      >
                        <span className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-500" />
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-500 rounded-lg font-space font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </Dialog>
  );
}