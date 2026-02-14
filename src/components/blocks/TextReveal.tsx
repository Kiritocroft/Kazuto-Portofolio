
"use client";

import React, { useEffect, useRef } from "react";
import { createTimeline } from "animejs";

interface TextRevealProps {
  text: string;
  className?: string;
}

export const TextReveal: React.FC<TextRevealProps> = ({ text, className = "" }) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      // Split text into letters
      const textWrapper = textRef.current;
      textWrapper.innerHTML = textWrapper.textContent!.replace(/\S/g, "<span class='letter inline-block'>$&</span>");

      createTimeline({ loop: false })
        .add('.letter', {
          translateY: [100,0],
          translateZ: 0,
          opacity: [0,1],
          easing: "easeOutExpo",
          duration: 1400,
          delay: (el: any, i: number) => 300 + 30 * i
        });
    }
  }, [text]);

  return (
    <div ref={textRef} className={`overflow-hidden ${className}`}>
      {text}
    </div>
  );
};
