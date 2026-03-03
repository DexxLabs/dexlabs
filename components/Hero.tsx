import React from "react";
import { LogoTicker } from "./LogoTicker";
import { MarketingSolutions } from "./MarketingSolutions";
import { GlideUpSpan } from "./ui/Glideupspan";

const Hero = () => {
  return (
    // No background here — page.tsx owns the global bg, grid & glows
    <section className="relative w-full overflow-hidden ">

      {/* ── First screen: hero content ── */}
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
          {/* <GlideUpSpan delay={0}>
            We build data-driven content systems
          </GlideUpSpan>
          <GlideUpSpan delay={0.2}>
          that turn passive scrollers into paying customers
          </GlideUpSpan> */}
        </h1>

        {/* Subheading */}
        <p
          className="mt-4 text-sm text-gray-400 font-light tracking-wide 
              lg:whitespace-nowrap lg:max-w-none max-w-md"
        >
          <span>
          Through viral content strategy, optimized ads, and conversion funnels
          </span>
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-row gap-3 items-center flex-wrap">
          <button className="h-10 px-5 border border-white bg-white text-black text-[0.62rem] font-bold tracking-[0.15em] uppercase transition-all duration-200 hover:bg-transparent hover:text-white">
            Book a free strategy call
          </button>

          <button className="h-10 px-5 border border-white/30 bg-transparent text-white text-[0.62rem] font-semibold tracking-[0.13em] uppercase transition-all duration-200 hover:border-white/60 hover:bg-white hover:text-black">
            See our work
          </button>
        </div>

        {/* Logo Ticker */}
        <div className="mt-14">
          <LogoTicker />
        </div>
      </div>

      
      <MarketingSolutions/>

    </section>
  );
};

export default Hero;