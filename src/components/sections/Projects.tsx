"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  tags: string[];
}

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (!res.ok) throw new Error('Failed to fetch projects');
        const projectsData = await res.json();
        setProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
        <div className="container mx-auto px-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 relative overflow-hidden bg-gradient-to-b from-background to-background/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Featured Projects</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
             A showcase of my recent work, highlighting my technical skills and problem-solving abilities.
          </p>
        </motion.div>

        {/* Projects List */}
        <div className="flex flex-col gap-24">
          {projects.length === 0 ? (
            <div className="text-center text-muted-foreground">
              No projects found. Please add projects via the Admin Panel.
            </div>
          ) : (
            projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
               <div className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                 {/* Image Section */}
                 <div className={`lg:col-span-7 relative rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-muted/20 ${index % 2 === 1 ? "lg:order-2" : "lg:order-1"}`}>
                    <div className="relative aspect-video w-full overflow-hidden">
                       <Image 
                          src={project.image} 
                          alt={project.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 60vw"
                       />
                       {/* Overlay on hover */}
                       <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                 </div>

                 {/* Content Section */}
                 <div className={`lg:col-span-5 flex flex-col gap-6 ${index % 2 === 1 ? "lg:order-1" : "lg:order-2"}`}>
                    <div>
                       <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                         {project.title}
                       </h3>
                       <div className="h-1.5 w-24 bg-primary rounded-full mb-6" />
                       <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                         {project.description}
                       </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags?.map((tech) => (
                        <span 
                          key={tech} 
                          className="px-4 py-1.5 text-sm font-medium bg-secondary/50 text-secondary-foreground rounded-full border border-border hover:bg-secondary transition-colors cursor-default"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button size="lg" className="rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all px-8" asChild>
                        <a href={project.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                        </a>
                      </Button>
                    </div>
                 </div>
               </div>
            </motion.div>
          )))}
        </div>
      </div>
    </section>
  );
}
