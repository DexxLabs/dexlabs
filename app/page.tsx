"use client";

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import { useState } from "react";
import Hero from "@/components/Hero";
import Grid from "@/components/Grid";
import { CallToAction } from "@/components/CallToAction";
import MeshGradientBackground from "@/components/Background/MeshGradientBackground";
import LavaBackground from "@/components/Background/LavaBackground";
import BlobBackground from "@/components/Background/BlobBackground";
import GridBackground from "@/components/Background/GridBackgroundGlowing";
import ShimmerGrid from "@/components/Background/ShimmerGrid";

export default function Home() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Our Works", link: "/works" },
    { name: "Services", link: "/services" },
    { name: "About Us", link: "/about" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <main className="relative w-full overflow-x-hidden bg-[#080714]">

    <BlobBackground/>


      
      <div className="relative" style={{ zIndex: 50 }}>
        <Navbar className="top-4">
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} />
            <div className="hidden lg:flex items-center gap-4">
              <NavbarButton href="/contact" variant="primary">
                Contact Us
              </NavbarButton>
            </div>
          </NavBody>

          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              />
            </MobileNavHeader>
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="relative text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-4">
                <NavbarButton href="/book-call" variant="primary" className="w-full">
                  Contact Us
                </NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
      </div>

      
      <div className="relative" style={{ zIndex: 10 }}>

        <div >
        <Hero />
        </div>
        
        <div className="max-w-7xl w-full mx-auto  my-30 px-5 sm:px-10">
          <Grid />
        </div>

        <div >
          <CallToAction />
        </div>

      </div>

    </main>
  );
}