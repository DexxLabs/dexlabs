"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

interface Reel {
  id: number;
  src: string;
  thumbnail: string;
  label: string;
  metric: string;
  tag: string;
}

// ─── YOUR REELS ─────────────────────────────────────────────────────────────
const REELS: Reel[] = [
  {
    id: 1,
    src: "/reels/showreel-optimized.mp4",
    thumbnail: "https://tenor.com/view/connecting-loading-buffering-load-gif-17415275",
    label: "Brand Launch",
    metric: "2.4M views",
    tag: "Branding",
  },
  {
    id: 2,
    src: "/reels/showreel-2-optimized.mp4",
    thumbnail: "https://tenor.com/view/connecting-loading-buffering-load-gif-17415275",
    label: "Growth Campaign",
    metric: "+320% reach",
    tag: "Paid Ads",
  },
  {
    id: 3,
    src: "/reels/showreel-3-optimized.mp4",
    thumbnail: "https://tenor.com/view/connecting-loading-buffering-load-gif-17415275",
    label: "Viral Content",
    metric: "18K shares",
    tag: "Content",
  },
  {
    id: 4,
    src: "/reels/showreel-4-optimized.mp4",
    thumbnail: "https://tenor.com/view/connecting-loading-buffering-load-gif-17415275",
    label: "Product Drop",
    metric: "4.1M impressions",
    tag: "Social",
  },
];

// ─── SIZING ──────────────────────────────────────────────────────────────────
const CENTER_W = 210;
const CENTER_H = CENTER_W * 1.8;
const SIDE_W   = CENTER_W * 0.62;
const SIDE_H   = CENTER_H * 0.62;
const INTERVAL = 3500;

function mod(n: number, m: number) {
  return ((n % m) + m) % m;
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
// Key idea: ALL video elements are rendered permanently (never unmounted).
// Only their position/size/opacity is animated. This keeps videos playing
// continuously with no remount flicker or poster flash on slide change.
export default function SpotlightCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused]   = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRefs   = useRef<(HTMLVideoElement | null)[]>([]);

  const advance = useCallback(() => {
    setCurrent((c) => mod(c + 1, REELS.length));
  }, []);

  // Autoplay all videos on mount and keep them looping forever
  useEffect(() => {
    videoRefs.current.forEach((vid) => {
      if (vid) vid.play().catch(() => {});
    });
  }, []);

  // Auto-advance timer
  useEffect(() => {
    if (paused) return;
    intervalRef.current = setInterval(advance, INTERVAL);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, advance]);

  const goTo = (index: number) => {
    setCurrent(index);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (!paused) intervalRef.current = setInterval(advance, INTERVAL);
  };

  return (
    <div
      className="relative flex flex-col items-center justify-center w-full h-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Ambient glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: CENTER_W * 2.2,
          height: CENTER_W * 2.2,
          background: "radial-gradient(circle, rgba(120,60,255,0.3) 0%, transparent 70%)",
          filter: "blur(50px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Card row — fixed height so cards don't shift layout */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: CENTER_H, width: CENTER_W + SIDE_W * 2 + 32 }}
      >
        {REELS.map((reel, i) => {
          const prev    = mod(current - 1, REELS.length);
          const next    = mod(current + 1, REELS.length);
          const isCenter = i === current;
          const isLeft   = i === prev;
          const isRight  = i === next;
          const isHidden = !isCenter && !isLeft && !isRight;

          // Compute target transform for each slot
          let targetX     = 0;
          let targetScale = 1;
          let targetOpacity = 1;
          let targetW     = CENTER_W;
          let targetH     = CENTER_H;
          let targetZ     = 10;

          if (isLeft) {
            targetX       = -(CENTER_W / 2 + SIDE_W / 2 + 16);
            targetScale   = 1;
            targetW       = SIDE_W;
            targetH       = SIDE_H;
            targetZ       = 5;
          } else if (isRight) {
            targetX       = CENTER_W / 2 + SIDE_W / 2 + 16;
            targetScale   = 1;
            targetW       = SIDE_W;
            targetH       = SIDE_H;
            targetZ       = 5;
          } else if (isHidden) {
            targetOpacity = 0;
            targetZ       = 0;
          }

          const borderRadius = targetW * 0.13;

          return (
            <motion.div
              key={reel.id}
              className="absolute overflow-hidden"
              animate={{
                x: targetX - targetW / 2,
                y: -targetH / 2,
                width: targetW,
                height: targetH,
                opacity: targetOpacity,
                zIndex: targetZ,
                boxShadow: isCenter
                  ? "0 0 40px rgba(120,60,255,0.5), 0 24px 64px rgba(0,0,0,0.8)"
                  : "0 8px 32px rgba(0,0,0,0.5)",
                borderColor: isCenter
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.08)",
              }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{
                borderRadius,
                border: "2px solid rgba(255,255,255,0.08)",
                background: "#0a0a12",
                cursor: isCenter ? "default" : "pointer",
                top: "50%",
                left: "50%",
              }}
              onClick={() => !isCenter && goTo(i)}
            >
              {/* Video — permanently mounted, always looping */}
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={reel.src || undefined}
                poster={reel.thumbnail}
                className="w-full h-full object-cover"
                muted
                loop
                autoPlay
                playsInline
                preload="auto"
              />

              {/* Fallback thumbnail when no src */}
              {!reel.src && (
                <img
                  src={reel.thumbnail}
                  alt={reel.label}
                  className="absolute inset-0 w-full h-full object-cover"
                  draggable={false}
                />
              )}

              {/* Subtle gradient at bottom */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 40%)",
                }}
              />

              {/* Notch */}
              <div
                className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
                style={{
                  top: "2.5%",
                  width: "33%",
                  height: "4%",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-2 mt-6">
        {REELS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="relative overflow-hidden rounded-full transition-all duration-300"
            style={{
              width: i === current ? 24 : 6,
              height: 6,
              background: i === current ? "#7c3aed" : "rgba(255,255,255,0.2)",
            }}
          >
            {i === current && !paused && (
              <motion.div
                className="absolute inset-y-0 left-0 bg-white/40 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: INTERVAL / 1000, ease: "linear" }}
                key={current}
              />
            )}
          </button>
        ))}
      </div>

      {/* Status hint */}
      <p
        className="mt-3 uppercase tracking-widest"
        style={{
          color: "rgba(255,255,255,0.25)",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 10,
          letterSpacing: "0.18em",
        }}
      >
        {paused ? "paused" : "auto-playing"}
      </p>
    </div>
  );
}