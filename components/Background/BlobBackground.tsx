"use client";

import { useEffect, useRef } from "react";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOB COLOR — change once here, applies to all blobs
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BLOB_COLOR = "148, 52, 255";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BLOB CONFIGURATION
// x          — horizontal position, 0–100 (% of viewport width)
// y          — vertical position in px from top of page
// size       — diameter in vw units
// opacity    — base opacity 0–1 (will breathe ±PULSE_DEPTH around this)
// wiggle     — movement speed/radius around home position (1 = subtle, 5 = noticeable)
// pulse      — breathing speed in seconds per cycle (higher = slower)
// blur       — blur amount in px (higher = softer/more atmospheric)
// parallax   — scroll depth layer: positive floats up faster, negative slower (0 = locked)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const BLOBS = [
  // ── Screen 1 (0–1080px) ─────────────────────────────────────────────────
  { x: 8,    y: 180,  size: 38, opacity: 0.35, wiggle: 1.5, pulse: 9,  blur: 80, parallax:  0.12 },
  { x: 88,   y: 450,  size: 22, opacity: 0.40, wiggle: 2.0, pulse: 12, blur: 65, parallax: -0.08 },
  { x: 40,   y: 800,  size: 25, opacity: 0.55, wiggle: 1.2, pulse: 15, blur: 90, parallax:  0.06 },

  // ── Screen 2 (~1080–2160px) ──────────────────────────────────────────────
  { x: 90,   y: 1200, size: 30, opacity: 0.50, wiggle: 1.8, pulse: 10, blur: 75, parallax: -0.10 },
  { x: 3,    y: 1500, size: 35, opacity: 0.40, wiggle: 2.5, pulse: 8,  blur: 60, parallax:  0.14 },
  { x: 60,   y: 1950, size: 32, opacity: 0.45, wiggle: 1.4, pulse: 13, blur: 85, parallax: -0.06 },

  // ── Screen 3 (~2160–3240px) ──────────────────────────────────────────────
  { x: 20,   y: 2300, size: 36, opacity: 0.52, wiggle: 1.6, pulse: 11, blur: 78, parallax:  0.10 },
  { x: 85,   y: 2700, size: 24, opacity: 0.40, wiggle: 2.2, pulse: 9,  blur: 68, parallax: -0.12 },
  { x: 42,   y: 3050, size: 44, opacity: 0.48, wiggle: 1.0, pulse: 16, blur: 88, parallax:  0.08 },
] as const;

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TUNING CONSTANTS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const WIGGLE_RADIUS_BASE  = 12;   // px — max drift from home at wiggle=1
const PULSE_DEPTH         = 0.18; // opacity breathing range (± fraction of base)
const ENTRANCE_DURATION   = 1.8;  // seconds for each blob to fade+scale in
const ENTRANCE_STAGGER    = 0.18; // seconds between each blob's entrance
const MOUSE_ATTRACT_PX    = 20;   // max px a blob shifts toward mouse
const MOUSE_ATTRACT_RANGE = 500;  // px — how far mouse influence reaches
const PARALLAX_STRENGTH   = 100;  // px — max parallax travel at parallax=1
const GRID_SIZE           = 60;   // px — grid cell size

export default function BlobBackground() {
  const blobContainerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const blobEls          = useRef<HTMLDivElement[]>([]);
  const rafRef           = useRef<number>(0);
  const startRef         = useRef(performance.now());
  const lastPageH        = useRef(0);
  const mouseRef         = useRef({ x: -9999, y: -9999 });
  const scrollRef        = useRef(0);

  useEffect(() => {
    const blobContainer = blobContainerRef.current;
    const gridContainer = gridContainerRef.current;
    if (!blobContainer || !gridContainer) return;

    // ── Event listeners ─────────────────────────────────────────────────
    const onMouseMove  = (e: MouseEvent) => { mouseRef.current = { x: e.clientX, y: e.clientY }; };
    const onMouseLeave = () => { mouseRef.current = { x: -9999, y: -9999 }; };
    const onScroll     = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("mousemove",  onMouseMove);
    window.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll",     onScroll, { passive: true });

    // ── Create blob DOM elements ─────────────────────────────────────────
    blobEls.current = BLOBS.map((b) => {
      const el = document.createElement("div");
      el.style.cssText = `
        position: absolute;
        pointer-events: none;
        border-radius: 50%;
        will-change: transform, opacity;
        background: radial-gradient(circle at center,
          rgba(${BLOB_COLOR}, 0.92) 0%,
          rgba(${BLOB_COLOR}, 0.45) 40%,
          transparent 70%
        );
        filter: blur(${b.blur}px);
        width:  ${b.size}vw;
        height: ${b.size}vw;
        left:   ${b.x}vw;
        top:    ${b.y}px;
        margin-left: -${b.size / 2}vw;
        margin-top:  -${b.size / 2}vw;
        opacity: 0;
        transform: scale(0);
      `;
      blobContainer.appendChild(el);
      return el;
    });

    const phases = BLOBS.map((_, i) => ({
      px:  i * 1.618,
      py:  i * 2.399,
      p2x: i * 0.927,
      p2y: i * 3.141,
    }));

    const mouseAttract = BLOBS.map(() => ({ dx: 0, dy: 0 }));

    function syncHeights(pageH: number) {
      blobContainer!.style.height  = `${pageH}px`;
      gridContainer!.style.height  = `${pageH}px`;
    }

    function tick() {
      const now     = (performance.now() - startRef.current) / 1000;
      const pageH   = document.body.scrollHeight;
      const scrollY = scrollRef.current;
      const mx      = mouseRef.current.x;
      const my      = mouseRef.current.y + scrollY;

      if (Math.abs(pageH - lastPageH.current) > 50) {
        lastPageH.current = pageH;
        syncHeights(pageH);
      }

      BLOBS.forEach((b, i) => {
        const el = blobEls.current[i];
        const ph = phases[i];

        // Entrance
        const entranceStart   = i * ENTRANCE_STAGGER;
        const entranceT       = Math.min(1, Math.max(0, (now - entranceStart) / ENTRANCE_DURATION));
        const easedEntrance   = 1 - Math.pow(1 - entranceT, 3);
        const entranceScale   = easedEntrance;
        const entranceOpacity = easedEntrance;

        // Wiggle
        const r   = WIGGLE_RADIUS_BASE * b.wiggle;
        const wdx = Math.sin(now * 0.3  * b.wiggle + ph.px)  * r
                  + Math.sin(now * 0.17 * b.wiggle + ph.p2x) * r * 0.35;
        const wdy = Math.cos(now * 0.25 * b.wiggle + ph.py)  * r
                  + Math.cos(now * 0.13 * b.wiggle + ph.p2y) * r * 0.35;

        // Parallax
        const parallaxY = scrollY * b.parallax * (PARALLAX_STRENGTH / 200);

        // Mouse attraction
        const vw     = window.innerWidth / 100;
        const blobPx = b.x * vw;
        const blobPy = b.y;
        const distX  = mx - blobPx;
        const distY  = my - blobPy;
        const dist   = Math.sqrt(distX * distX + distY * distY);
        const inRange = dist < MOUSE_ATTRACT_RANGE && dist > 0;

        const targetMX = inRange ? (distX / dist) * MOUSE_ATTRACT_PX * Math.max(0, 1 - dist / MOUSE_ATTRACT_RANGE) : 0;
        const targetMY = inRange ? (distY / dist) * MOUSE_ATTRACT_PX * Math.max(0, 1 - dist / MOUSE_ATTRACT_RANGE) : 0;

        mouseAttract[i].dx += (targetMX - mouseAttract[i].dx) * 0.04;
        mouseAttract[i].dy += (targetMY - mouseAttract[i].dy) * 0.04;

        // Pulse
        const pulse   = Math.sin((now / b.pulse) * Math.PI * 2 + ph.px);
        const opacity = b.opacity * (1 + pulse * PULSE_DEPTH) * entranceOpacity;

        const tx = wdx + mouseAttract[i].dx;
        const ty = wdy + mouseAttract[i].dy + parallaxY;

        el.style.transform = `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${entranceScale.toFixed(4)})`;
        el.style.opacity   = Math.max(0, Math.min(1, opacity)).toFixed(3);
      });

      rafRef.current = requestAnimationFrame(tick);
    }

    syncHeights(document.body.scrollHeight);
    rafRef.current = requestAnimationFrame(tick);

    // Keep grid height in sync if page grows after initial render
    const ro = new ResizeObserver(() => {
      syncHeights(document.body.scrollHeight);
    });
    ro.observe(document.body);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove",  onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll",     onScroll);
      blobEls.current.forEach(el => el.remove());
      blobEls.current = [];
    };
  }, []);

  return (
    <>
      {/* Dark base */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, background: "#08070f" }}
      />

      {/* Blob container — absolute, scrolls with page */}
      <div
        ref={blobContainerRef}
        className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 1 }}
      />

      {/* Grid — absolute, spans full page height, scrolls with content */}
      <div
        ref={gridContainerRef}
        className="absolute inset-x-0 top-0 pointer-events-none w-full"
        style={{
          zIndex: 2,
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          backgroundAttachment: "local",
        }}
      />
    </>
  );
}