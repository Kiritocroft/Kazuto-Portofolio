
"use client";

import { useEffect, useState } from "react";
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
import { ZoomIn, Loader2 } from "lucide-react";

interface Certificate {
  id: string;
  title: string;
  image: string;
  issuer: string;
  date: string;
  link: string;
}

export function Certificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch('/api/certificates');
        if (!res.ok) throw new Error('Failed to fetch certificates');
        const certsData = await res.json();
        setCertificates(certsData);
      } catch (error) {
        console.error("Error fetching certificates:", error);
        setError("Failed to load certificates. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  if (loading) {
    return (
      <section id="certificates" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="certificates" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 text-center text-destructive">
          <p>{error}</p>
        </div>
      </section>
    );
  }

  // Map certificates to match GalleryLightbox expected format if needed
  // Assuming GalleryLightbox expects 'imageSrc' or 'src'
  const lightboxItems = certificates.map(cert => ({
    ...cert,
    imageSrc: cert.image // Map 'image' to 'imageSrc' for compatibility
  }));

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

        {certificates.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No certificates found. Please add certificates via the Admin Panel.
          </div>
        ) : (
          <>
            <div className="max-w-5xl mx-auto px-12">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {certificates.map((cert, index) => (
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
                                  src={cert.image}
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
              items={lightboxItems}
              currentIndex={selectedIndex}
              onNext={() => setSelectedIndex((prev) => (prev + 1) % certificates.length)}
              onPrev={() => setSelectedIndex((prev) => (prev - 1 + certificates.length) % certificates.length)}
            />
          </>
        )}
      </div>
    </section>
  );
}
