"use client";

import { useEffect, useRef } from "react";

const GRID = 60; // px — cell size

// ── Hotspot definitions — positions in grid units (col, row) ────────────
// These are the "home" positions. Blobs drift slowly around them.
const HOTSPOTS = [
  // page top zone
  { col: 3,  row: 2,  radius: 220, pulseSpeed: 0.12, pulseAmp: 0.25, jitterR: 18, jitterSpeed: 0.4,  peakAlpha: 0.95, color: "180, 80, 255"  },
  { col: 17, row: 6,  radius: 170,  pulseSpeed: 0.07, pulseAmp: 0.20, jitterR: 14, jitterSpeed: 0.3,  peakAlpha: 0.50, color: "150, 50, 240"  },
  { col: 25, row: 13,  radius: 160, pulseSpeed: 0.18, pulseAmp: 0.30, jitterR: 20, jitterSpeed: 0.5,  peakAlpha: 0.75, color: "200,100, 255"  },

  // ~1080px down
  { col: 6,  row: 20, radius: 100, pulseSpeed: 0.09, pulseAmp: 0.22, jitterR: 16, jitterSpeed: 0.35, peakAlpha: 0.60, color: "160, 60, 255"  },
  { col: 18, row: 22, radius: 240, pulseSpeed: 0.15, pulseAmp: 0.28, jitterR: 22, jitterSpeed: 0.45, peakAlpha: 0.90, color: "190, 90, 255"  },
  { col: 10, row: 18, radius: 70,  pulseSpeed: 0.22, pulseAmp: 0.18, jitterR: 12, jitterSpeed: 0.55, peakAlpha: 0.45, color: "140, 40, 230"  },

  // ~2160px down
  { col: 2,  row: 38, radius: 190, pulseSpeed: 0.08, pulseAmp: 0.24, jitterR: 19, jitterSpeed: 0.38, peakAlpha: 0.85, color: "170, 70, 255"  },
  { col: 20, row: 36, radius: 90,  pulseSpeed: 0.20, pulseAmp: 0.26, jitterR: 15, jitterSpeed: 0.42, peakAlpha: 0.55, color: "200, 95, 255"  },
  { col: 12, row: 40, radius: 260, pulseSpeed: 0.11, pulseAmp: 0.20, jitterR: 17, jitterSpeed: 0.50, peakAlpha: 0.92, color: "155, 55, 245"  },

  // ~3240px down
  { col: 7,  row: 56, radius: 75,  pulseSpeed: 0.17, pulseAmp: 0.23, jitterR: 21, jitterSpeed: 0.36, peakAlpha: 0.48, color: "185, 85, 255"  },
  { col: 16, row: 54, radius: 210, pulseSpeed: 0.06, pulseAmp: 0.28, jitterR: 13, jitterSpeed: 0.48, peakAlpha: 0.88, color: "145, 45, 235"  },
  { col: 24, row: 58, radius: 120, pulseSpeed: 0.14, pulseAmp: 0.22, jitterR: 20, jitterSpeed: 0.32, peakAlpha: 0.65, color: "195, 98, 255"  },
];

export default function GlowGridBackground() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const rafRef       = useRef<number>(0);
  const startRef     = useRef(performance.now());
  const scrollYRef   = useRef(0);
  const pageSizeRef  = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = document.body.scrollHeight;
      pageSizeRef.current = { w: canvas!.width, h: canvas!.height };
    }

    // Recheck page height periodically (content may load in)
    function recheckHeight() {
      const newH = document.body.scrollHeight;
      if (Math.abs(newH - canvas!.height) > 50) resize();
    }

    resize();
    window.addEventListener("resize", resize);
    const heightInterval = setInterval(recheckHeight, 800);

    const onScroll = () => { scrollYRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Pre-compute phase offsets so each hotspot feels independent
    const phases = HOTSPOTS.map((_, i) => ({
      pulse:   (i * 1.618) % (Math.PI * 2),
      jitterX: (i * 2.399) % (Math.PI * 2),
      jitterY: (i * 3.141) % (Math.PI * 2),
    }));

    function render() {
      const t   = (performance.now() - startRef.current) / 1000;
      const W   = canvas!.width;
      const H   = canvas!.height;
      const BASE_ALPHA = 0.05;

      ctx.clearRect(0, 0, W, H);

      // ── Draw full-page grid lines ───────────────────────────────────────
      const cols = Math.ceil(W / GRID) + 1;
      const rows = Math.ceil(H / GRID) + 1;

      ctx.lineWidth   = 0.8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${BASE_ALPHA})`;

      for (let c = 0; c <= cols; c++) {
        ctx.beginPath();
        ctx.moveTo(c * GRID, 0);
        ctx.lineTo(c * GRID, H);
        ctx.stroke();
      }
      for (let r = 0; r <= rows; r++) {
        ctx.beginPath();
        ctx.moveTo(0, r * GRID);
        ctx.lineTo(W, r * GRID);
        ctx.stroke();
      }

      // ── Draw each hotspot ───────────────────────────────────────────────
      HOTSPOTS.forEach((hs, i) => {
        const ph = phases[i];

        // Home position in px
        const homeX = hs.col * GRID;
        const homeY = hs.row * GRID;

        // Jitter — slow Lissajous drift around home
        const jx = homeX + Math.sin(t * hs.jitterSpeed + ph.jitterX) * hs.jitterR
                         + Math.sin(t * hs.jitterSpeed * 1.3 + ph.jitterX + 1) * hs.jitterR * 0.4;
        const jy = homeY + Math.cos(t * hs.jitterSpeed + ph.jitterY) * hs.jitterR
                         + Math.cos(t * hs.jitterSpeed * 0.7 + ph.jitterY + 2) * hs.jitterR * 0.4;

        // Pulse — alpha breathes
        const pulse   = 0.5 + 0.5 * Math.sin(t * hs.pulseSpeed * Math.PI * 2 + ph.pulse);
        const alpha   = hs.peakAlpha * (0.3 + pulse * 0.7);

        const radius  = hs.radius;

        // ── Glow vertical lines within radius ────────────────────────────
        const cMin = Math.floor((jx - radius) / GRID);
        const cMax = Math.ceil( (jx + radius) / GRID);
        for (let c = cMin; c <= cMax; c++) {
          const lx   = c * GRID;
          const dist = Math.abs(lx - jx);
          if (dist > radius) continue;
          const f = 1 - dist / radius;
          const a = BASE_ALPHA + f * f * alpha * 0.8;

          const g = ctx.createLinearGradient(lx, jy - radius, lx, jy + radius);
          g.addColorStop(0,   `rgba(${hs.color}, ${BASE_ALPHA})`);
          g.addColorStop(0.5, `rgba(${hs.color}, ${a.toFixed(3)})`);
          g.addColorStop(1,   `rgba(${hs.color}, ${BASE_ALPHA})`);
          ctx.beginPath();
          ctx.moveTo(lx, jy - radius);
          ctx.lineTo(lx, jy + radius);
          ctx.strokeStyle = g;
          ctx.lineWidth   = 0.8 + f * 1.4;
          ctx.stroke();
        }

        // ── Glow horizontal lines within radius ───────────────────────────
        const rMin = Math.floor((jy - radius) / GRID);
        const rMax = Math.ceil( (jy + radius) / GRID);
        for (let r = rMin; r <= rMax; r++) {
          const ly   = r * GRID;
          const dist = Math.abs(ly - jy);
          if (dist > radius) continue;
          const f = 1 - dist / radius;
          const a = BASE_ALPHA + f * f * alpha * 0.8;

          const g = ctx.createLinearGradient(jx - radius, ly, jx + radius, ly);
          g.addColorStop(0,   `rgba(${hs.color}, ${BASE_ALPHA})`);
          g.addColorStop(0.5, `rgba(${hs.color}, ${a.toFixed(3)})`);
          g.addColorStop(1,   `rgba(${hs.color}, ${BASE_ALPHA})`);
          ctx.beginPath();
          ctx.moveTo(jx - radius, ly);
          ctx.lineTo(jx + radius, ly);
          ctx.strokeStyle = g;
          ctx.lineWidth   = 0.8 + f * 1.4;
          ctx.stroke();
        }

        // ── Intersection dots inside radius ───────────────────────────────
        for (let r = rMin; r <= rMax; r++) {
          for (let c = cMin; c <= cMax; c++) {
            const ix   = c * GRID;
            const iy   = r * GRID;
            const dist = Math.sqrt((ix - jx) ** 2 + (iy - jy) ** 2);
            if (dist > radius) continue;

            const f          = 1 - dist / radius;
            const dotOpacity = f * f * alpha;
            const dotRadius  = 1.0 + f * 2.2;

            const halo = ctx.createRadialGradient(ix, iy, 0, ix, iy, dotRadius * 5);
            halo.addColorStop(0,   `rgba(${hs.color}, ${(dotOpacity * 0.7).toFixed(3)})`);
            halo.addColorStop(0.5, `rgba(${hs.color}, ${(dotOpacity * 0.2).toFixed(3)})`);
            halo.addColorStop(1,   `rgba(${hs.color}, 0)`);
            ctx.beginPath();
            ctx.arc(ix, iy, dotRadius * 5, 0, Math.PI * 2);
            ctx.fillStyle = halo;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(ix, iy, dotRadius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(230, 170, 255, ${dotOpacity.toFixed(3)})`;
            ctx.fill();
          }
        }
      });

      rafRef.current = requestAnimationFrame(render);
    }

    rafRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      clearInterval(heightInterval);
    };
  }, []);

  return (
    <>
      {/* Dark base */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, background: "#07060e" }}
      />

      {/* Full-page canvas — absolute so it scrolls with content */}
      <canvas
        ref={canvasRef}
        className="absolute inset-x-0 top-0 pointer-events-none"
        style={{ zIndex: 1 }}
      />
    </>
  );
}