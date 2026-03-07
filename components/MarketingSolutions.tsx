"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function MarketingSolutions() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const nodes = {
    center: { x: 450, y: 400 },
    p1: { x: 255, y: 200 },
    p2: { x: 660, y: 200 },
    p3: { x: 450, y: 630 },
  };

  const services = [
    { x: 68, y: 120, icon: "/logo-identity.png", label: "Logo & Identity" },
    { x: 68, y: 250, icon: "/ui-ux-design.png", label: "UI/UX Design" },
    { x: 68, y: 380, icon: "/design-system.png", label: "Design System" },

    { x: 832, y: 120, icon: "/marketing-website.png", label: "Marketing Website" },
    { x: 832, y: 250, icon: "/web-apps.png", label: "Web Apps" },
    { x: 832, y: 380, icon: "/mobile-apps.png", label: "Mobile Apps" },
    { x: 832, y: 510, icon: "/seo.png", label: "SEO" },

    { x: 150, y: 793, icon: "/video-scripts.png", label: "Video Scripts" },
    { x: 300, y: 793, icon: "/video-production.png", label: "Video Production" },
    { x: 450, y: 793, icon: "/photography.png", label: "Photography" },
    { x: 600, y: 793, icon: "/social-media.png", label: "Social Media" },
    { x: 750, y: 793, icon: "/paid-ads.png", label: "Paid Ads" },
  ];

  function makePath(x1: number, y1: number, x2: number, y2: number) {
    const mx = (x1 + x2) / 2;
    return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
  }

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    svg.innerHTML = "";

    const center = nodes.center;

    const pillars = [nodes.p1, nodes.p2, nodes.p3];

    pillars.forEach((p) => {
      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );

      path.setAttribute("d", makePath(center.x, center.y, p.x, p.y));
      path.setAttribute("stroke", "#9c05ed");
      path.setAttribute("stroke-width", "1.5");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-opacity", "0.65");

      svg.appendChild(path);
    });
  }, []);

  return (
    <section className="relative w-full">
      <div className="flex w-full">

        {/* LEFT CONTENT */}
        <div
          className="flex flex-col justify-center shrink-0 pl-[18vw] pr-6 py-20"
          style={{ width: "42%" }}
        >
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[0.6rem] font-bold tracking-[0.22em] uppercase mb-3 text-purple-400"
          >
            Our Systems. Your Growth
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-white font-extrabold leading-[1.1]"
            style={{ fontSize: "clamp(1.7rem, 2.8vw, 2.6rem)" }}
          >
            Everything Your
            <br />
            Brand Needs
          </motion.h2>

          <div className="mt-7">
            <button className="h-9 px-5 border border-white bg-transparent text-white text-[0.58rem] font-bold tracking-[0.16em] uppercase hover:bg-white hover:text-black transition">
              Our Brand Solutions
            </button>
          </div>
        </div>

        {/* RIGHT MINDMAP */}
        <div className="relative flex-1 flex items-center justify-center">
          <div
            ref={canvasRef}
            className="relative w-[900px] h-[900px]"
          >

            {/* SVG CONNECTORS */}
            <svg
              ref={svgRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* CENTER */}
            <Node x={nodes.center.x} y={nodes.center.y}>
              <div className="w-[90px] h-[90px] rounded-xl border border-purple-500 bg-linear-to-br from-[#1e0535] to-[#2a0860] flex items-center justify-center shadow-[0_0_40px_rgba(156,5,237,0.4)]">
                <img src="/Logo_White-PNG.png" className="w-[54px]" />
              </div>
            </Node>

            {/* PILLARS */}
            <Node x={nodes.p1.x} y={nodes.p1.y}>
              <Pillar title="Brand & Identity" desc="Look premium everywhere." />
            </Node>

            <Node x={nodes.p2.x} y={nodes.p2.y}>
              <Pillar title="Websites & Apps" desc="Build digital products." />
            </Node>

            <Node x={nodes.p3.x} y={nodes.p3.y}>
              <Pillar title="Content & Growth" desc="Turn views into revenue." />
            </Node>

            {/* SERVICES */}
            {services.map((svc, i) => (
              <Node key={i} x={svc.x} y={svc.y}>
                <Service icon={svc.icon} label={svc.label} />
              </Node>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Node({
  x,
  y,
  children,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: x, top: y }}
    >
      {children}
    </div>
  );
}

function Pillar({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="w-[148px] h-[100px] bg-[#180630] border border-purple-500/40 rounded-xl p-3 hover:scale-105 transition">
      <div className="text-purple-300 font-bold text-sm">{title}</div>
      <div className="text-white/50 text-xs mt-1">{desc}</div>
    </div>
  );
}

function Service({
  icon,
  label,
}: {
  icon: string;
  label: string;
}) {
  return (
    <div className="w-[100px] h-[100px] bg-white/3 border border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-purple-500/10 hover:border-purple-500/50 transition hover:scale-110">
      <img src={icon} className="w-[36px]" />
      <span className="text-[11px] text-white/80 text-center px-2">
        {label}
      </span>
    </div>
  );
}