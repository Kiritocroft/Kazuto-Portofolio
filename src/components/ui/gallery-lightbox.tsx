"use client";

import { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

interface GalleryLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  items: {
    title: string;
    description?: string;
    imageSrc: string;
  }[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

export function GalleryLightbox({
  isOpen,
  onClose,
  items,
  currentIndex,
  onNext,
  onPrev,
}: GalleryLightboxProps) {
  const currentItem = items[currentIndex];

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [onClose, onNext, onPrev]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen || !currentItem) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-50 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Navigation Buttons */}
          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onPrev();
                }}
                className="absolute left-2 md:left-4 z-50 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} className="md:w-8 md:h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNext();
                }}
                className="absolute right-2 md:right-4 z-50 p-2 md:p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors border border-white/10"
                aria-label="Next image"
              >
                <ChevronRight size={24} className="md:w-8 md:h-8" />
              </button>
            </>
          )}

          {/* Content */}
          <motion.div
            key={currentIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-6xl h-full max-h-[90vh] p-4 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex-1 min-h-0 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={currentItem.imageSrc}
                alt={currentItem.title}
                fill
                className="object-contain"
                priority
                sizes="90vw"
              />
            </div>

            <div className="mt-6 text-center max-w-2xl">
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-2xl font-bold text-white mb-2"
              >
                {currentItem.title}
              </motion.h3>
              {currentItem.description && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-300"
                >
                  {currentItem.description}
                </motion.p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
