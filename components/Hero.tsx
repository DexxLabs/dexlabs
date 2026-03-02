import React from "react";
import { LogoTicker } from "./LogoTicker";

const Hero = () => {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-[#080714]">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* purple gradient */}
      <div
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          background: `radial-gradient(ellipse 55% 60% at 0% 40%, rgba(100, 40, 200, 0.55) 0%, rgba(60, 20, 130, 0.25) 45%, transparent 75%)`,
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          background: `radial-gradient(ellipse 55% 60% at 100% 100%, rgba(100, 40, 200, 0.55) 0%, rgba(60, 20, 130, 0.25) 45%, transparent 75%)`,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 w-full h-full"
        style={{
          background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,4,18,0.7) 100%)`,
        }}
      />

      <div className="relative z-10 flex flex-col justify-center min-h-screen pl-[18vw] pr-[8vw] pt-28 pb-20">
        <h1
          className="text-white font-extrabold leading-[1.12] tracking-tight 
             lg:max-w-none max-w-[640px]"
          style={{ fontSize: "clamp(2rem, 3.5vw, 3rem)" }}
        >
          <span className="block lg:whitespace-nowrap">
            We build data-driven content systems
          </span>
          <span className="block lg:whitespace-nowrap">
            that turn passive scrollers into paying customers
          </span>
        </h1>

        {/* ── Subheading ── */}
        <p
          className="mt-4 text-sm text-gray-400 font-light tracking-wide 
              lg:whitespace-nowrap lg:max-w-none max-w-md"
        >
          Through viral content strategy, optimized ads, and conversion funnels
        </p>

        {/* ── CTA Buttons ── */}
        <div className="mt-8 flex flex-row gap-3 items-center flex-wrap">
          {/* Primary — white border fill on hover */}
          <button className="h-10 px-5 border border-white bg-white text-black text-[0.62rem] font-bold tracking-[0.15em] uppercase transition-all duration-200 hover:bg- hover:text-[#080714]">
            Book a free strategy call
          </button>

          {/* Secondary ghost */}
          <button className="h-10 px-5 border border-white/30 bg-transparent text-white text-[0.62rem] font-semibold tracking-[0.13em] uppercase backdrop-blur-sm transition-all duration-200 hover:border-white/60 hover:bg-white  hover:text-black">
            See our work
          </button>
        </div>

        {/* ── Logo Ticker ── */}
        <div className="mt-14">
          <LogoTicker />
        </div>
      </div>
    </section>
  );
};

export default Hero;
