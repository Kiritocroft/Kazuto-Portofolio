
"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import { Briefcase, Code, GraduationCap, Terminal } from "lucide-react";

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.01
  });

  const dotTop = useTransform(scaleY, [0, 1], ['0%', '100%']);

  const icons = [GraduationCap, GraduationCap, Briefcase, Briefcase]; // Icons for decoration

  return (
    <section id="experience" className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Experience</h2>
        </motion.div>
        
        <div ref={containerRef} className="relative w-full max-w-4xl mx-auto">
          {/* Central Line */}
          <motion.div
            className="absolute left-[20px] md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary to-primary/20 md:-translate-x-1/2"
            style={{ scaleY, transformOrigin: 'top' }}
          />

          {/* Glowing Dot */}
          <motion.div
            className="absolute left-[13px] md:left-1/2 w-4 h-4 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(var(--primary),0.5)] md:-translate-x-1/2 z-10"
            style={{ top: dotTop }}
          />

          <div className="space-y-12">
            {portfolioData.experiences.map((exp, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div 
                  key={exp.id} 
                  className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Timeline Content */}
                  <div className={`pl-12 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12 md:order-1' : 'md:col-start-2 md:pl-12 md:order-2'}`}>
                    <div className="bg-card p-6 rounded-xl border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                      <h3 className="text-xl font-bold text-primary">{exp.title}</h3>
                      <p className="text-foreground font-medium text-lg">{exp.company}</p>
                      <span className="text-sm text-muted-foreground block mt-1 mb-3 bg-secondary/30 inline-block px-3 py-1 rounded-full">{exp.year}</span>
                      <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{exp.description}</p>
                    </div>
                  </div>
                  
                  {/* Icon Column for layout balance on desktop */}
                  <div className={`hidden md:flex justify-center items-center ${index % 2 === 0 ? 'md:col-start-2 md:pl-12 md:order-2' : 'md:col-start-1 md:pr-12 md:order-1'}`}>
                     <motion.div 
                       className="p-4 bg-background rounded-full border-2 border-primary shadow-[0_0_15px_rgba(var(--primary),0.4)] relative z-10"
                       whileHover={{ scale: 1.2, rotate: 360 }}
                       transition={{ duration: 0.5 }}
                     >
                        <Icon className="w-8 h-8 text-primary" />
                     </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
