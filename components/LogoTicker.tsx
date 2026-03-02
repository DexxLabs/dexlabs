"use client";

import { motion } from "framer-motion";

const BASE_LOGOS: string[] = [
  "/swiftys.png",
  "/swiftys.png",
  "/swiftys.png",
  "/swiftys.png",
  "/swiftys.png",
  "/swiftys.png",
];

// duplicate for seamless loop
const TICKER_LOGOS = [...BASE_LOGOS, ...BASE_LOGOS];

export const LogoTicker = () => {
  return (
    <div className="w-full max-w-[640px]">
      {/* Label */}
      <div className="flex items-center gap-6">
        <span className="shrink-0 text-sm font-semibold tracking-[0.16em] uppercase text-white whitespace-nowrap">
          Partnered With
        </span>

        {/* Ticker viewport */}
        <div
          className="overflow-hidden w-full"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
          }}
        >
          <motion.div
            className="flex gap-12 w-max"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 18,
            }}
          >
            {TICKER_LOGOS.map((src, index) => (
              <img
                key={index}
                src={src}
                alt="partner logo"
                className="h-10 w-[60px] object-contain shrink-0 brightness-0 invert opacity-80 hover:opacity-80 transition duration-300"
              />
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};