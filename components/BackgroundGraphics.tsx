
import React, { useEffect, useRef } from 'react';

const BackgroundGraphics: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let orbitals: Orbital[] = [];
    let shapes: Shape[] = [];
    let confetti: Confetti[] = [];
    let sparkles: Sparkle[] = [];
    let fireworks: Firework[] = [];
    let bubbles: Bubble[] = [];
    const mouse = { x: -1000, y: -1000 };

    const colors = [
      '6, 182, 212',  // Cyan
      '16, 185, 129', // Emerald
      '245, 158, 11', // Amber
      '59, 130, 246', // Blue
      '249, 115, 22', // Orange
      '236, 72, 153', // Pink
      '168, 85, 247', // Purple
      '251, 191, 36', // Yellow
    ];

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    class Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.size = Math.random() * 2 + 1;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const glow = dist < 250 ? (1 - dist / 250) : 0;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + (glow * 3), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha + glow})`;
        if (glow > 0.5) {
          ctx.shadowBlur = 10 * glow;
          ctx.shadowColor = `rgb(${this.color})`;
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }
    }

    class Orbital {
      radius: number;
      angle: number;
      speed: number;
      thickness: number;
      color: string;
      segments: number;

      constructor() {
        this.radius = Math.random() * 400 + 100;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = (Math.random() - 0.5) * 0.005;
        this.thickness = Math.random() * 1.5 + 0.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.segments = Math.floor(Math.random() * 3) + 1;
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(this.angle);
        ctx.strokeStyle = `rgba(${this.color}, 0.08)`;
        ctx.lineWidth = this.thickness;

        for (let i = 0; i < this.segments; i++) {
          ctx.beginPath();
          ctx.arc(0, 0, this.radius, (i * Math.PI), (i * Math.PI) + Math.PI / 2);
          ctx.stroke();
        }
        ctx.restore();
        this.angle += this.speed;
      }
    }

    class Shape {
      x: number;
      y: number;
      size: number;
      angle: number;
      rotSpeed: number;
      color: string;
      type: 'rect' | 'tri';

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 30 + 10;
        this.angle = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.01;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.type = Math.random() > 0.5 ? 'rect' : 'tri';
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.strokeStyle = `rgba(${this.color}, 0.05)`;
        ctx.lineWidth = 1;

        if (this.type === 'rect') {
          ctx.strokeRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
          ctx.beginPath();
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          ctx.closePath();
          ctx.stroke();
        }

        ctx.restore();
        this.angle += this.rotSpeed;
        this.y -= 0.15;
        if (this.y < -50) this.y = canvas.height + 50;
      }
    }

    // NEW YEAR THEMED ELEMENTS
    class Confetti {
      x: number;
      y: number;
      vx: number;
      vy: number;
      rotation: number;
      rotationSpeed: number;
      color: string;
      size: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = Math.random() * 2 + 1;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.size = Math.random() * 8 + 4;
        this.alpha = Math.random() * 0.6 + 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        this.vy += 0.05; // gravity

        if (this.y > canvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * canvas.width;
          this.vy = Math.random() * 2 + 1;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
        ctx.restore();
      }
    }

    class Sparkle {
      x: number;
      y: number;
      size: number;
      alpha: number;
      fadeSpeed: number;
      growing: boolean;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 0;
        this.alpha = 0;
        this.fadeSpeed = Math.random() * 0.02 + 0.01;
        this.growing = true;
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (this.growing) {
          this.alpha += this.fadeSpeed;
          this.size += 0.3;
          if (this.alpha >= 1) {
            this.growing = false;
          }
        } else {
          this.alpha -= this.fadeSpeed;
          if (this.alpha <= 0) {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = 0;
            this.alpha = 0;
            this.growing = true;
          }
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha * 0.8})`;

        // Draw star shape
        for (let i = 0; i < 4; i++) {
          ctx.save();
          ctx.rotate((Math.PI / 2) * i);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(this.size, 0);
          ctx.lineTo(0, this.size / 3);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }
    }

    class Firework {
      x: number;
      y: number;
      particles: FireworkParticle[];
      exploded: boolean;
      vy: number;
      targetY: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.4 + 50;
        this.vy = -8;
        this.exploded = false;
        this.particles = [];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        if (!this.exploded) {
          this.y += this.vy;
          if (this.y <= this.targetY) {
            this.explode();
          }
        } else {
          this.particles.forEach(p => p.update());
          this.particles = this.particles.filter(p => p.alpha > 0);
        }
      }

      explode() {
        this.exploded = true;
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
          this.particles.push(new FireworkParticle(this.x, this.y, this.color));
        }
      }

      draw() {
        if (!ctx) return;
        if (!this.exploded) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${this.color}, 0.8)`;
          ctx.fill();
        } else {
          this.particles.forEach(p => p.draw());
        }
      }

      isDead() {
        return this.exploded && this.particles.length === 0;
      }
    }

    class FireworkParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
      color: string;
      size: number;

      constructor(x: number, y: number, color: string) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 2;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.color = color;
        this.size = Math.random() * 3 + 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.1; // gravity
        this.alpha -= 0.015;
        this.vx *= 0.98;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, ${this.alpha})`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    class Bubble {
      x: number;
      y: number;
      size: number;
      vy: number;
      vx: number;
      alpha: number;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + 20;
        this.size = Math.random() * 6 + 2;
        this.vy = -(Math.random() * 1.5 + 0.5);
        this.vx = (Math.random() - 0.5) * 0.5;
        this.alpha = Math.random() * 0.3 + 0.1;
      }

      update() {
        this.y += this.vy;
        this.x += this.vx;

        if (this.y < -20) {
          this.y = canvas.height + 20;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251, 191, 36, ${this.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Highlight
        ctx.beginPath();
        ctx.arc(this.x - this.size / 3, this.y - this.size / 3, this.size / 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha * 0.6})`;
        ctx.fill();
      }
    }

    const init = () => {
      nodes = [];
      orbitals = [];
      shapes = [];
      confetti = [];
      sparkles = [];
      fireworks = [];
      bubbles = [];

      const density = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < density; i++) nodes.push(new Node());
      for (let i = 0; i < 8; i++) orbitals.push(new Orbital());
      for (let i = 0; i < 20; i++) shapes.push(new Shape());

      // New Year elements
      for (let i = 0; i < 40; i++) confetti.push(new Confetti());
      for (let i = 0; i < 15; i++) sparkles.push(new Sparkle());
      for (let i = 0; i < 25; i++) bubbles.push(new Bubble());
    };

    const animate = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      orbitals.forEach(o => o.draw());
      shapes.forEach(s => s.draw());

      // Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const mdist = Math.sqrt((nodes[i].x - mouse.x) ** 2 + (nodes[i].y - mouse.y) ** 2);
            if (mdist < 250) {
              ctx.beginPath();
              ctx.moveTo(nodes[i].x, nodes[i].y);
              ctx.lineTo(nodes[j].x, nodes[j].y);
              ctx.strokeStyle = `rgba(${nodes[i].color}, ${(1 - dist / 120) * 0.15})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      nodes.forEach(n => {
        n.update();
        n.draw();
      });

      // Draw New Year elements
      bubbles.forEach(b => {
        b.update();
        b.draw();
      });

      confetti.forEach(c => {
        c.update();
        c.draw();
      });

      sparkles.forEach(s => {
        s.update();
        s.draw();
      });

      // Randomly spawn fireworks
      if (Math.random() < 0.02) {
        fireworks.push(new Firework());
      }

      fireworks.forEach(f => {
        f.update();
        f.draw();
      });
      fireworks = fireworks.filter(f => !f.isDead());

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);
    init();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#020617]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/10 via-transparent to-emerald-950/10 pointer-events-none"></div>

      {/* Abstract Background Numbers */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none select-none font-black text-[40vw] leading-none text-white tracking-tighter italic">
        2026
      </div>
    </div>
  );
};

export default BackgroundGraphics;
