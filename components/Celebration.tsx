
import React, { useEffect, useRef } from 'react';

const Celebration: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let fireworks: Firework[] = [];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Premium festive colors: Emerald, Azure, Gold, White
    const colors = [
      '#10b981', // Emerald
      '#3b82f6', // Blue
      '#60a5fa', // Sky
      '#fbbf24', // Amber/Gold
      '#f8fafc', // Ghost White
      '#2dd4bf'  // Teal
    ];

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      friction: number;
      gravity: number;
      size: number;
      decay: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.friction = 0.96;
        this.gravity = 0.15;
        this.size = Math.random() * 2.5 + 0.5;
        this.decay = Math.random() * 0.015 + 0.005;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        // Add a "sparkle" effect to some particles
        if (Math.random() > 0.9) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#fff';
        } else {
            ctx.shadowBlur = 5;
            ctx.shadowColor = this.color;
        }
        ctx.fill();
        ctx.restore();
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
    }

    class Firework {
        x: number;
        y: number;
        vy: number;
        vx: number;
        color: string;
        exploded: boolean;

        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.vy = -(Math.random() * 12 + 12);
            this.vx = (Math.random() - 0.5) * 4;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.exploded = false;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vy += 0.15; // Gravity on the shell
            if (this.vy >= -0.5) {
                this.explode();
                this.exploded = true;
            }
        }

        draw(ctx: CanvasRenderingContext2D) {
            if (this.exploded) return;
            ctx.save();
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        explode() {
            const particleCount = 100 + Math.floor(Math.random() * 50);
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle(this.x, this.y, this.color));
            }
        }
    }

    const loop = () => {
      // Trail effect: don't clear fully
      ctx.fillStyle = 'rgba(2, 6, 23, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (Math.random() < 0.05) {
        fireworks.push(new Firework());
      }

      fireworks = fireworks.filter(f => !f.exploded);
      fireworks.forEach(f => {
          f.update();
          f.draw(ctx);
      });

      particles = particles.filter(p => p.alpha > 0);
      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-50 pointer-events-none" />;
};

export default Celebration;
