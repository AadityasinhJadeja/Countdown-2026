
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
    const mouse = { x: -1000, y: -1000 };

    const colors = [
      '6, 182, 212',  // Cyan
      '16, 185, 129', // Emerald
      '245, 158, 11', // Amber
      '59, 130, 246', // Blue
      '249, 115, 22', // Orange
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

    const init = () => {
      nodes = [];
      orbitals = [];
      shapes = [];
      const density = Math.floor((canvas.width * canvas.height) / 8000);
      for (let i = 0; i < density; i++) nodes.push(new Node());
      for (let i = 0; i < 8; i++) orbitals.push(new Orbital());
      for (let i = 0; i < 20; i++) shapes.push(new Shape());
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
