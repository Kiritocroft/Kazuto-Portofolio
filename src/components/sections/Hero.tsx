
"use client";

import { IconCloud } from "@/components/blocks/IconCloud";
import TrueFocus from "@/components/blocks/TrueFocus";
import BlurText from "@/components/blocks/BlurText";
import { portfolioData } from "@/data/portfolio";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail, Instagram } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbox } from "@/components/ui/lightbox";

const slugs = [
  "javascript",
  "typescript",
  "python",
  "php",
  "react",
  "nextdotjs",
  "tailwindcss",
  "nodedotjs",
  "express",
  "laravel",
  "mongodb",
  "mysql",
  "supabase",
  "postgresql",
  "git",
  "docker",
  "visualstudiocode"
];

export function Hero() {
  const images = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );

  return (
    <section id="hero" className="min-h-screen flex items-center pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Text Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col items-start gap-6 z-10 order-2 lg:order-1"
        >
          <div className="flex items-center gap-2 mb-2">
             <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">Available for work</span>
          </div>

          <BlurText
            text={`Hi, I'm ${portfolioData.personal.name.split(" ")[0]}`}
            className="text-4xl md:text-6xl font-bold tracking-tight text-foreground"
            delay={50}
          />
          
          <div className="h-16 md:h-20 flex items-center">
             <TrueFocus 
                sentence={portfolioData.personal.role}
                manualMode={false}
                blurAmount={10}
                borderColor="var(--primary)"
                glowColor="rgba(var(--primary), 0.6)"
                animationDuration={0.5}
                pauseBetweenAnimations={2}
             />
          </div>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
            {portfolioData.personal.about}
          </p>

          <div className="flex flex-wrap gap-4 mt-4">
            <Button size="lg" className="rounded-full" asChild>
              <a href={portfolioData.personal.cv} download target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" /> Download CV
              </a>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full" asChild>
              <Link href="#contact">Contact Me</Link>
            </Button>
          </div>

          <div className="flex gap-4 mt-6">
            <Button variant="ghost" size="icon" asChild>
              <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={portfolioData.personal.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={portfolioData.personal.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href={`mailto:${portfolioData.personal.email}`}>
                <Mail className="h-5 w-5" />
              </a>
            </Button>
          </div>
        </motion.div>

        {/* Right Column: Profile Picture & Lanyard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col justify-center items-center relative z-10 order-1 lg:order-2"
        >
            <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 rounded-full border-4 border-primary/20 p-2">
                   <div className="relative w-full h-full rounded-full overflow-hidden shadow-2xl group">
                       <Image 
                          src={portfolioData.personal.profilePicture}
                          alt={portfolioData.personal.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          priority
                       />
                       {/* Overlay effect on hover */}
                       <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                   </div>
                {/* Decorative Elements */}
                <motion.div 
                  className="absolute -top-4 -right-4 bg-background p-3 rounded-xl shadow-lg border border-border"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <span className="text-2xl">🚀</span>
                </motion.div>
                <motion.div 
                  className="absolute -bottom-2 -left-2 bg-background p-3 rounded-xl shadow-lg border border-border"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                >
                  <span className="text-2xl">💻</span>
                </motion.div>
            </div>
        </motion.div>
      </div>
    </section>
  );
}
