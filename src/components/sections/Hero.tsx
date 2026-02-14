"use client";

import { useEffect, useState } from "react";
import { IconCloud } from "@/components/blocks/IconCloud";
import TrueFocus from "@/components/blocks/TrueFocus";
import BlurText from "@/components/blocks/BlurText";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Download, Github, Linkedin, Mail, Instagram } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lightbox } from "@/components/ui/lightbox";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [heroData, setHeroData] = useState({
    name: "Nabil",
    role: "Fullstack Developer",
    about: "Passionate Fullstack Developer with a knack for building scalable web applications and intuitive user interfaces. Experienced in modern JavaScript frameworks and cloud technologies.",
    email: "nabitathaillah33@gmail.com",
    avatar: "/pp.jpg",
    resume: "/CV.pdf",
    github: "https://github.com/Kiritocroft",
    linkedin: "https://www.linkedin.com/in/nabil-athaillah",
    instagram: "https://www.instagram.com/kazutongl/",
    skills: slugs
  });

  useEffect(() => {
    const fetchSettings = async () => {
      if (!db) return;
      try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setHeroData(prev => ({
            ...prev,
            name: data.name !== undefined ? data.name : prev.name,
            role: (data.role !== undefined ? data.role : data.heroTitle) || prev.role,
            about: (data.about !== undefined ? data.about : data.heroDescription) || prev.about,
            email: (data.email !== undefined ? data.email : data.contactEmail) || prev.email,
            // avatar: data.avatar || prev.avatar, // Hardcoded to /pp.jpg for stability
            resume: data.resume !== undefined ? data.resume : prev.resume,
            github: data.github !== undefined ? data.github : prev.github,
            linkedin: data.linkedin !== undefined ? data.linkedin : prev.linkedin,
            instagram: data.instagram !== undefined ? data.instagram : prev.instagram,
            // skills: data.skills && data.skills.length > 0 ? data.skills : prev.skills // Hardcoded static list
          }));
        }
      } catch (error) {
        console.error("Error fetching hero settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const staticImages = slugs.map(
    (slug) => `https://cdn.simpleicons.org/${slug}/${slug}`,
  );

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-24 pb-12 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
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
            <span className="text-sm font-medium text-green-500 tracking-wide uppercase">Available for work</span>
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-medium text-muted-foreground">
              Hello, I'm <span className="text-foreground font-semibold">{heroData.name}</span>
            </h2>
            <div className="h-20 md:h-24 flex items-center">
              <TrueFocus 
                sentence={heroData.role}
                manualMode={false}
                blurAmount={5}
                borderColor="red"
                animationDuration={2}
                pauseBetweenAnimations={1}
              />
            </div>
          </div>

          <div className="max-w-2xl">
             <BlurText
                text={heroData.about}
                delay={50}
                animateBy="words"
                direction="top"
                className="text-lg text-muted-foreground leading-relaxed"
             />
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button size="lg" className="group" asChild>
              <Link href="#projects">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="group" asChild>
              <Link href={heroData.resume} target="_blank">
                <Download className="mr-2 h-4 w-4 transition-transform group-hover:-translate-y-1" />
                Download CV
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-6 pt-8">
            <Link href={heroData.github} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
            <Link href={heroData.linkedin} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
             <Link href={heroData.instagram} target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link href={`mailto:${heroData.email}`} className="text-muted-foreground hover:text-primary transition-colors">
              <Mail className="h-6 w-6" />
              <span className="sr-only">Email</span>
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Avatar Only */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:col-span-5 flex justify-center items-center relative z-10 order-1 lg:order-2"
        >
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-primary/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-background shadow-2xl overflow-hidden pointer-events-auto transition-transform hover:scale-105 duration-300 relative bg-background">
              <Image 
                src="/pp.jpg" 
                alt={heroData.name} 
                fill
                className="object-cover"
                priority
                unoptimized
              />
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Skills Cloud */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full flex justify-center mt-12 md:mt-16 relative z-10"
      >
        <div className="relative flex items-center justify-center scale-75 md:scale-100">
           <IconCloud images={staticImages} radius={130} />
        </div>
      </motion.div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-0 right-0 -z-10 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-1/3 h-1/2 bg-gradient-to-t from-primary/5 to-transparent"></div>
    </section>
  );
}
