"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { ProjectCard } from "./project-card";
import { ProjectModal } from "./project-modal";
interface Project {
  id: string;
  title: string;
  category: "Social Media" | "Video" | "Design";
  thumbnail: string;
  description: string;
  tools: string[];
  results: string[];
}

const projects: Project[] = [
  {
    id: "1",
    title: "Brand Campaign",
    category: "Social Media",
    thumbnail: "/projects/campaign.jpg",
    description: "Kampanye digital untuk brand lifestyle",
    tools: ["Figma", "After Effects", "Facebook Ads"],
    results: ["10x ROI", "1M+ Reach", "50K+ Engagement"],
  },
  // ... tambahkan proyek lainnya
];

export function PortfolioGrid() {
  const [filter, setFilter] = useState<string>("all");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const categories = ["all", "Social Media", "Video", "Design"];

  const filteredProjects = projects.filter(
    (project) => filter === "all" || project.category === filter
  );

  return (
    <section className="py-20 px-4 bg-background">
      <h2 className="text-4xl font-space font-bold text-center mb-12 gradient-text">
        Featured Works
      </h2>

      <div className="flex justify-center gap-4 mb-12">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-6 py-2 rounded-full transition-all ${
              filter === category
                ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white"
                : "bg-gray-800 text-gray-400 hover:text-white"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
      >
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </motion.div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}