import React from "react";
import { Spotlight } from "./ui/Spotlight";
import { cn } from "@/lib/utils";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import MagicButton from "./ui/MagicButton";
import { FaLocationArrow } from "react-icons/fa6";

const Hero = () => {
  return (
    <div className="relative pb-20 pt-36">
      {/* Spotlights */}
      <div className="pointer-events-none absolute inset-0">
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="top-10 left-full h-[80vh] w-[50vw]"
          fill="purple"
        />
        <Spotlight className="top-28 left-80 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      {/* Grid BG */}
      {/* FIX APPLIED HERE:
         1. Removed 'absolute inset-0' and 'w-full'.
         2. Added 'h-screen' and 'w-screen' (forces full viewport width).
         3. Added 'absolute top-0 left-1/2 -translate-x-1/2' (centers it relative to screen, ignoring parent width).
      */}
      <div className="h-screen w-screen dark:bg-black-100 bg-white absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center">
        <div
          className={cn(
            "absolute inset-0 w-full h-full",
            "[background-size:80px_80px]",
            "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        <div className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black-100" />
      </div>

      {/* Content */}
      <div className="flex justify-center relative my-20 z-10 ">
        <div className="max-w-[89vh] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <h2 className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80">
            Get Started With us !!
          </h2>
          <TextGenerateEffect
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
            words="Smart Strategies  Real Growth !"
          />
          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            Hi ! We are DexLabs , a Web and Content Creation Serving Agency.
          </p>
          <a href="#">
            <MagicButton
              title="Contact us!"
              icon={<FaLocationArrow />}
              position="right"
            />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Hero;