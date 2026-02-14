"use client";

import React, { useRef, useEffect } from "react";

interface ParticlesBackgroundProps {
  color?: string;
  particleCount?: number;
  connectionDistance?: number;
  interactive?: boolean;
}

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.size = Math.random() * 2 + 1;
  }

  update(mouse: { x: number; y: number }, interactive: boolean) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > this.canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > this.canvas.height) this.vy *= -1;

    // Mouse interaction
    if (interactive) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 200) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        const force = (200 - distance) / 200;
        const directionX = forceDirectionX * force * 0.5;
        const directionY = forceDirectionY * force * 0.5;
        this.vx += directionX;
        this.vy += directionY;
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D, color: string) {
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

const ParticlesBackground: React.FC<ParticlesBackgroundProps> = ({
  color = "#6366f1", // Primary indigo color by default
  particleCount = 100,
  connectionDistance = 150,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = window.innerWidth < 768 ? particleCount / 2 : particleCount;
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(canvas));
      }
    };

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(mouseRef.current, !!interactive);
        particles[i].draw(ctx, color);

        for (let j = i; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.globalAlpha = 1 - distance / connectionDistance;
            ctx.lineWidth = 1;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    window.addEventListener("resize", resizeCanvas);
    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    resizeCanvas();
    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mounted, color, particleCount, connectionDistance, interactive]);

  if (!mounted) {
    return (
        <div
        className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-background"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 pointer-events-none" />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 -z-10 w-full h-full overflow-hidden bg-background"
    >
      <canvas ref={canvasRef} className="block" />
      {/* Optional: Add a subtle gradient overlay to make text more readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-transparent to-background/80 pointer-events-none" />
    </div>
  );
};

export default ParticlesBackground;
