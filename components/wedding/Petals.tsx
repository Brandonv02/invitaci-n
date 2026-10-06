"use client";

import { useEffect, useRef } from "react";

type Petal = { x: number; y: number; size: number; speed: number; sway: number; phase: number; spin: number; angle: number; color: string };

const COLORS = ["#dbe6ee", "#c9d8e3", "#b9cbd8", "#e8eef2", "#efeae1"];

/** Pétalos que caen lentamente sobre toda la invitación. */
export default function Petals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let width = 0, height = 0, frame = 0, last = performance.now();
    let petals: Petal[] = [];
    const spawn = (anywhere: boolean): Petal => ({
      x: Math.random() * width,
      y: anywhere ? Math.random() * height : -20,
      size: 5 + Math.random() * 7,
      speed: 14 + Math.random() * 22,
      sway: 12 + Math.random() * 26,
      phase: Math.random() * Math.PI * 2,
      spin: (Math.random() - 0.5) * 1.4,
      angle: Math.random() * Math.PI * 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)]
    });
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth; height = window.innerHeight;
      canvas.width = width * dpr; canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = width < 700 ? 16 : 28;
      petals = Array.from({ length: count }, () => spawn(true));
    };
    const draw = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (const p of petals) {
        p.phase += dt * 0.9;
        p.angle += p.spin * dt;
        p.y += p.speed * dt;
        const x = p.x + Math.sin(p.phase) * p.sway;
        if (p.y > height + 20) Object.assign(p, spawn(false));
        ctx.save();
        ctx.translate(x, p.y);
        ctx.rotate(p.angle);
        // El escalado en Y simula el pétalo girando en el aire
        ctx.scale(1, 0.55 + Math.abs(Math.sin(p.phase * 1.3)) * 0.45);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.75;
        ctx.beginPath();
        ctx.moveTo(0, -p.size);
        ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.5, p.size * 0.6, p.size * 0.8, 0, p.size);
        ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.8, -p.size * 0.9, -p.size * 0.5, 0, -p.size);
        ctx.fill();
        ctx.restore();
      }
      frame = requestAnimationFrame(draw);
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) { last = performance.now(); frame = requestAnimationFrame(draw); }
    };
    resize();
    frame = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="petals" aria-hidden="true" />;
}
