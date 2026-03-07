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

     {/* Global background Layer */}
      <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>

        {/* Fine grid lines */}
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

        {/* Glow 1 — top-left */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse 35% 30% at 0% 10%, rgba(100,40,200,0.55) 0%, rgba(60,20,130,0.25) 45%, transparent 75%)`,
          }}
        />

        {/* Glow 2 — top-right */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse 35% 30% at 100% 50%, rgba(100,40,200,0.55) 0%, rgba(60,20,130,0.25) 45%, transparent 75%)`,
          }}
        />

        {/* Glow 3 — mid-left */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse 35% 30% at 0% 100%, rgba(100,40,200,0.55) 0%, rgba(60,20,130,0.25) 45%, transparent 75%)`,
          }}
        />

       

        {/* Vignette — keeps edges dark so glows feel focused */}
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            background: `radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(5,4,18,0.7) 100%)`,
          }}
        />
      </div>
      


      
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