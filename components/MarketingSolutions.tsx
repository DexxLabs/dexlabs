"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Tooltip data for each service ──────────────────────────────────────────
const SERVICE_DATA = [
  {
    x: 68, y: 120, icon: "/logo-identity.png", label: "Logo & Identity",
    problem: "Generic branding that looks like everyone else.",
    solution: "A distinctive identity that commands premium pricing.",
    side: "left",
  },
  {
    x: 68, y: 250, icon: "/ui-ux-design.png", label: "UI/UX Design",
    problem: "Pages confuse users, they bounce fast.",
    solution: "Clean screens & smooth flows for web/app.",
    side: "left",
  },
  {
    x: 68, y: 380, icon: "/design-system.png", label: "Design System",
    problem: "Inconsistent design slows every new feature.",
    solution: "One system your whole team ships faster with.",
    side: "left",
  },
  {
    x: 832, y: 120, icon: "/marketing-website.png", label: "Marketing Website",
    problem: "Slow site, ugly design, zero leads.",
    solution: "Fast site with CTAs that convert visitors.",
    side: "right",
  },
  {
    x: 832, y: 250, icon: "/web-apps.png", label: "Web Apps",
    problem: "Clunky tools that frustrate your customers.",
    solution: "Polished apps that feel effortless to use.",
    side: "right",
  },
  {
    x: 832, y: 380, icon: "/mobile-apps.png", label: "Mobile Apps",
    problem: "Poor mobile UX kills retention overnight.",
    solution: "Native-feel apps that users actually keep.",
    side: "right",
  },
  {
    x: 832, y: 510, icon: "/SEO.png", label: "SEO",
    problem: "Invisible on Google, missing free traffic.",
    solution: "Rank for keywords that bring buying intent.",
    side: "right",
  },
  {
    x: 150, y: 793, icon: "/video-scripts.png", label: "Video Scripts",
    problem: "Videos without hooks get skipped in 2 seconds.",
    solution: "Scripts engineered to stop the scroll.",
    side: "bottom",
  },
  {
    x: 300, y: 793, icon: "/video-production.png", label: "Video Production",
    problem: "Low-quality video signals a low-quality brand.",
    solution: "Studio-level content shot & edited for you.",
    side: "bottom",
  },
  {
    x: 450, y: 793, icon: "/photography.png", label: "Photography",
    problem: "Stock photos make you look like everyone else.",
    solution: "Real photos that build trust and authenticity.",
    side: "bottom",
  },
  {
    x: 600, y: 793, icon: "/social-media.png", label: "Social Media",
    problem: "Posting without strategy wastes your time.",
    solution: "Content systems that grow & convert consistently.",
    side: "bottom",
  },
  {
    x: 750, y: 793, icon: "/paid-ads.png", label: "Paid Ads",
    problem: "Organic is too slow, need fast sales/leads.",
    solution: "Meta/Google Ads using your own videos & photos.",
    side: "bottom",
  },
];

// Node positions
const CENTER = { x: 450, y: 400 };
const PILLARS = [
  { x: 255, y: 200, title: "Brand & Identity", desc: "Look premium everywhere." },
  { x: 660, y: 200, title: "Websites & Apps", desc: "Build digital products that convert." },
  { x: 450, y: 630, title: "Content & Growth", desc: "Go viral. Turn views into revenue." },
];

function makePath(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
}

// Which pillar index each service belongs to (for connector lines)
const SERVICE_PILLAR = [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 2];

export default function MarketingSolutions() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState<number | null>(null);

  // Draw SVG connector lines: center→pillars, pillars→services
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = "";

    const addPath = (x1: number, y1: number, x2: number, y2: number, opacity = 0.5) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", makePath(x1, y1, x2, y2));
      path.setAttribute("stroke", "#9c05ed");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-opacity", String(opacity));
      svg.appendChild(path);
    };

    // Center → each pillar
    PILLARS.forEach((p) => addPath(CENTER.x, CENTER.y, p.x, p.y, 0.65));

    // Each pillar → its services
    SERVICE_DATA.forEach((svc, i) => {
      const pillar = PILLARS[SERVICE_PILLAR[i]];
      addPath(pillar.x, pillar.y, svc.x, svc.y, 0.35);
    });
  }, []);

  return (
    <section className="relative w-full py-16 overflow-visible">
      {/* ── Header ── */}
      <div className="text-center mb-10">
        <p className="text-[0.6rem] font-bold tracking-[0.22em] uppercase text-purple-400 mb-2">
          Our Systems. Your Growth
        </p>
        <h2
          className="text-white font-extrabold tracking-tight leading-[1.1]"
          style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)" }}
        >
          Everything Your Brand Needs.
        </h2>
        <p className="text-white/40 text-sm mt-2">
          Hover a service to see the problem we solve.
        </p>
      </div>

      {/* ── Mindmap canvas ── */}
      <div className="flex justify-center">
        <div className="relative w-[900px] h-[900px]">

          {/* SVG connector lines */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* Center node */}
          <Node x={CENTER.x} y={CENTER.y}>
            <div className="w-[90px] h-[90px] rounded-xl border border-purple-500 bg-linear-to-br from-[#1e0535] to-[#2a0860] flex items-center justify-center shadow-[0_0_40px_rgba(156,5,237,0.45)]">
              <img src="/Logo_White-PNG.png" className="w-[54px]" alt="logo" />
            </div>
          </Node>

          {/* Pillar nodes */}
          {PILLARS.map((p, i) => (
            <Node key={i} x={p.x} y={p.y}>
              <div className="w-[148px] min-h-[100px] bg-[#180630] border border-purple-500/40 rounded-xl p-3 hover:scale-105 transition-transform">
                <div className="text-purple-300 font-bold text-sm">
                  <span className="mr-1 text-purple-400">
                    {i === 0 ? "✦" : i === 1 ? "○" : "▲"}
                  </span>
                  {p.title}
                </div>
                <div className="text-white/50 text-xs mt-1">{p.desc}</div>
              </div>
            </Node>
          ))}

          {/* Service nodes */}
          {SERVICE_DATA.map((svc, i) => (
            <Node key={i} x={svc.x} y={svc.y}>
              <div
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                className={`
                  relative w-[100px] h-[100px] rounded-xl flex flex-col items-center justify-center gap-2
                  border transition-all duration-200 cursor-pointer
                  ${hovered === i
                    ? "bg-purple-500/15 border-purple-400/80 shadow-[0_0_24px_rgba(156,5,237,0.5)] scale-110"
                    : "bg-white/3 border-white/10 hover:bg-purple-500/10 hover:border-purple-500/50 hover:scale-110"
                  }
                `}
              >
                <img src={svc.icon} className="w-[36px]" alt={svc.label} />
                <span className="text-[11px] text-white/80 text-center px-2 leading-tight">
                  {svc.label}
                </span>

                {/* Tooltip */}
                <AnimatePresence>
                  {hovered === i && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.92, y: svc.side === "bottom" ? -8 : 0, x: svc.side === "left" ? 8 : svc.side === "right" ? -8 : 0 }}
                      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, scale: 0.92 }}
                      transition={{ duration: 0.18, ease: "easeOut" }}
                      className={`
                        absolute z-50 w-[200px] rounded-xl border border-purple-500/30
                        bg-[#0e0520]/95 backdrop-blur-md p-4 pointer-events-none
                        ${svc.side === "left"
                          ? "right-[110px] top-1/2 -translate-y-1/2"
                          : svc.side === "right"
                          ? "left-[110px] top-1/2 -translate-y-1/2"
                          : "bottom-[110px] left-1/2 -translate-x-1/2"
                        }
                      `}
                      style={{
                        boxShadow: "0 0 30px rgba(156,5,237,0.2), inset 0 0 0 1px rgba(156,5,237,0.15)",
                      }}
                    >
                      <p className="text-purple-400 font-bold text-[0.75rem] mb-2">
                        {svc.label}
                      </p>
                      <p className="text-[#ff6b6b] text-[0.7rem] leading-snug mb-2">
                        ⚠ {svc.problem}
                      </p>
                      <p className="text-[#6bffb8] text-[0.7rem] leading-snug">
                        ✓ {svc.solution}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Node>
          ))}
        </div>
      </div>
    </section>
  );
}

function Node({ x, y, children }: { x: number; y: number; children: React.ReactNode }) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}