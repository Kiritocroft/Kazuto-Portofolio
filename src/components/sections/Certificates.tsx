
"use client";

import { useState } from "react";
import { portfolioData } from "@/data/portfolio";
import { Card, CardContent } from "@/components/ui/card";
import { GalleryLightbox } from "@/components/ui/gallery-lightbox";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { motion } from "framer-motion";
import { ZoomIn } from "lucide-react";

export function Certificates() {
  const [selectedIndex, setSelectedIndex] = useState(-1);

  return (
    <section id="certificates" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Certifications</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional certifications and achievements that validate my skills and expertise.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto px-12">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {portfolioData.certificates.map((cert, index) => (
                <CarouselItem key={cert.id} className="md:basis-1/2 lg:basis-1/3">
                  <motion.div 
                    className="p-1"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-none bg-transparent">
                      <CardContent className="p-0 relative aspect-[4/3] rounded-xl overflow-hidden group border border-border/50 bg-card hover:border-primary/50 transition-colors duration-300">
                        <div 
                          className="w-full h-full cursor-pointer group relative z-10 block"
                          role="button"
                          tabIndex={0}
                          onClick={() => setSelectedIndex(index)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              setSelectedIndex(index);
                            }
                          }}
                        >
                          <div className="relative w-full h-full">
                            <Image
                              src={cert.imageSrc}
                              alt={cert.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center flex-col gap-2">
                                <ZoomIn className="text-white w-8 h-8 mb-2" />
                                <p className="text-white font-medium text-center px-4">{cert.title}</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        <GalleryLightbox 
          isOpen={selectedIndex >= 0}
          onClose={() => setSelectedIndex(-1)}
          items={portfolioData.certificates}
          currentIndex={selectedIndex}
          onNext={() => setSelectedIndex((prev) => (prev + 1) % portfolioData.certificates.length)}
          onPrev={() => setSelectedIndex((prev) => (prev - 1 + portfolioData.certificates.length) % portfolioData.certificates.length)}
        />
      </div>
    </section>
  );
}
