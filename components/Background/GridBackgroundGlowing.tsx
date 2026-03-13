"use client";

import { useEffect, useRef } from "react";

export default function GridBackground() {
  const glowCanvasRef  = useRef<HTMLCanvasElement>(null);
  const grainCanvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef         = useRef<number>(0);
  const startRef       = useRef(performance.now());

  // ── Glowing intersections on a canvas ──────────────────────────────────
  useEffect(() => {
    const canvas = glowCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const GRID    = 60;   // px between grid lines — matches your existing grid
    const RADIUS  = 1.4;  // dot base radius px
    const GLOW_R  = 18;   // glow radius px

    // Each intersection gets a unique phase so they twinkle independently
    type Dot = { x: number; y: number; phase: number; speed: number; brightness: number };
    let dots: Dot[] = [];

    function buildDots() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      dots = [];

      const cols = Math.ceil(canvas!.width  / GRID) + 1;
      const rows = Math.ceil(canvas!.height / GRID) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x:          c * GRID,
            y:          r * GRID,
            phase:      Math.random() * Math.PI * 2,
            speed:      0.4 + Math.random() * 0.6,   // twinkle speed
            brightness: 0.3 + Math.random() * 0.7,   // peak brightness multiplier
          });
        }
      }
    }

    buildDots();
    window.addEventListener("resize", buildDots);

    function render() {
      const t = (performance.now() - startRef.current) / 1000;
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);

      for (const d of dots) {
        // Twinkle: sine wave per dot, remapped to [0, 1]
        const alpha = (Math.sin(t * d.speed + d.phase) * 0.5 + 0.5) * d.brightness;

        // Outer glow
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, GLOW_R);
        grad.addColorStop(0,   `rgba(160, 80, 255, ${(alpha * 0.35).toFixed(3)})`);
        grad.addColorStop(0.4, `rgba(120, 40, 220, ${(alpha * 0.12).toFixed(3)})`);
        grad.addColorStop(1,   `rgba(80,  10, 180, 0)`);
        ctx.beginPath();
        ctx.arc(d.x, d.y, GLOW_R, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // Sharp dot centre
        ctx.beginPath();
        ctx.arc(d.x, d.y, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 140, 255, ${(alpha * 0.75).toFixed(3)})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", buildDots);
    };
  }, []);

  // ── Static grain canvas — regenerated on resize only ───────────────────
 

  return (
    <>
      {/* Dark base */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, background: "#08070f" }}
      />

      {/* Grid lines */}
      <div
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{
          zIndex: 1,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing intersection dots */}
      <canvas
        ref={glowCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 2, width: "100vw", height: "100vh" }}
      />

      {/* Grain overlay */}
      <canvas
        ref={grainCanvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 3, width: "100vw", height: "100vh", mixBlendMode: "screen" }}
      />
    </>
  );
}