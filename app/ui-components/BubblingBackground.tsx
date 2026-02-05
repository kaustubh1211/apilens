'use client';

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseSpeedX: number;
  baseSpeedY: number;
  rotation: number;
}

export default function BubblingBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Color palette - blues, purples, pinks, warm colors
    const colors = [
      'rgba(79, 70, 229, 0.75)',   // Indigo
      'rgba(99, 102, 241, 0.75)',  // Blue
      'rgba(139, 92, 246, 0.7)',   // Purple
      'rgba(124, 58, 237, 0.65)',  // Violet
      'rgba(168, 85, 247, 0.65)',  // Purple light
      'rgba(236, 72, 153, 0.6)',   // Pink
      'rgba(244, 114, 182, 0.6)',  // Pink light
      'rgba(251, 191, 36, 0.6)',   // Amber
      'rgba(245, 158, 11, 0.6)',   // Orange
      'rgba(239, 68, 68, 0.6)',    // Red
    ];

    const createParticle = (startFromTop = true): Particle => {
      // Speed: falling diagonally from top-left to bottom-right
      const baseSpeedX = 0.3 + Math.random() * 0.4;
      const baseSpeedY = 0.5 + Math.random() * 0.6;
      
      let x: number, y: number;
      
      if (startFromTop) {
        // Start from top edge or left edge
        if (Math.random() < 0.6) {
          // From top
          x = Math.random() * (width + 200) - 100;
          y = -20 - Math.random() * 100;
        } else {
          // From left
          x = -20 - Math.random() * 50;
          y = Math.random() * height * 0.7;
        }
      } else {
        // Initial spread across screen
        x = Math.random() * width;
        y = Math.random() * height;
      }

      return {
        x,
        y,
        vx: baseSpeedX,
        vy: baseSpeedY,
        size: 1.5 + Math.random() * 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        baseSpeedX,
        baseSpeedY,
        rotation: Math.PI * 0.25 + (Math.random() - 0.5) * 0.3, // ~45 degrees with variation
      };
    };

    const init = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;

      particlesRef.current = [];
      const particleCount = Math.floor((width * height) / 6000); // Density based on screen

      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push(createParticle(false));
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      const avoidRadius = 120; // Space around cursor

      particlesRef.current.forEach((p, index) => {
        // Base diagonal falling movement
        let targetVx = p.baseSpeedX;
        let targetVy = p.baseSpeedY;

        // Mouse avoidance
        if (mouse.x !== -1000) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < avoidRadius && dist > 0) {
            // Smooth force that pushes particles away
            const force = Math.pow((avoidRadius - dist) / avoidRadius, 2);
            const angle = Math.atan2(dy, dx);
            
            // Add avoidance velocity
            targetVx += Math.cos(angle) * force * 3;
            targetVy += Math.sin(angle) * force * 3;
          }
        }

        // Smoothly interpolate velocity (creates the smooth flowing feel)
        p.vx += (targetVx - p.vx) * 0.08;
        p.vy += (targetVy - p.vy) * 0.08;

        // Update position
        p.x += p.vx;
        p.y += p.vy;

        // Update rotation based on movement direction
        const targetRotation = Math.atan2(p.vy, p.vx);
        const rotationDiff = targetRotation - p.rotation;
        const normalizedDiff = Math.atan2(Math.sin(rotationDiff), Math.cos(rotationDiff));
        p.rotation += normalizedDiff * 0.05;

        // Recycle particles that go off screen
        if (p.x > width + 50 || p.y > height + 50) {
          const newParticle = createParticle(true);
          particlesRef.current[index] = newParticle;
          return;
        }

        // Draw stretched dash shape
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Stretch based on velocity magnitude
        const velocity = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        const stretch = 2.5 + velocity * 1.5;

        const w = p.size * stretch;
        const h = p.size * 0.5;
        const radius = h / 2;

        ctx.beginPath();
        // Rounded rectangle (pill shape)
        ctx.moveTo(-w / 2 + radius, -h / 2);
        ctx.lineTo(w / 2 - radius, -h / 2);
        ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, 0);
        ctx.quadraticCurveTo(w / 2, h / 2, w / 2 - radius, h / 2);
        ctx.lineTo(-w / 2 + radius, h / 2);
        ctx.quadraticCurveTo(-w / 2, h / 2, -w / 2, 0);
        ctx.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + radius, -h / 2);
        ctx.closePath();

        ctx.fillStyle = p.color;
        ctx.fill();

        ctx.restore();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    init();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}