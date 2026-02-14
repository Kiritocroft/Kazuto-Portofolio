"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";
import Image from "next/image";

interface LightboxProps {
  src: string;
  alt: string;
  trigger: React.ReactNode;
  hideDefaultOverlay?: boolean;
  title?: string;
  description?: string;
}

export function Lightbox({ src, alt, trigger, hideDefaultOverlay = false, title, description }: LightboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <>
      <div 
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }} 
        className="w-full h-full cursor-pointer group relative z-10 block"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {trigger}
        {!hideDefaultOverlay && (
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
            <ZoomIn className="text-white w-8 h-8" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {isOpen && mounted && createPortal(
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="relative max-w-5xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors border border-white/10"
              >
                <X size={24} />
              </button>
              
              <div className="relative w-full h-full flex-1 min-h-0">
                 <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-contain"
                    priority
                 />
              </div>

              {(title || description) && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="w-full p-6 text-center bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-12 pb-2 rounded-b-xl"
                >
                  {title && <h3 className="text-xl md:text-2xl font-bold text-white mb-2 drop-shadow-md">{title}</h3>}
                  {description && <p className="text-sm md:text-base text-gray-200 font-medium drop-shadow-sm">{description}</p>}
                </motion.div>
              )}
            </motion.div>
          </motion.div>,
          document.body
        )}
      </AnimatePresence>
    </>
  );
}
