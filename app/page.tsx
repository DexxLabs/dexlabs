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

export default function Home() {
  const navItems = [
    { name: "Home", link: "/" },
    { name: "Our Works", link: "/works" },
    { name: "Services", link: "/services" },
    { name: "About Us", link: "/about" },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // Full-bleed outer shell — NO side padding, NO max-width here
    <main className="relative w-full overflow-x-hidden bg-[#080714]">

      {/* Navbar floats above everything */}
      <Navbar className="top-4">
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="hidden lg:flex items-center gap-4">
            
            <NavbarButton href="/book-call" variant="primary">
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

      {/* Hero is completely full-bleed — owns its own background */}
      <Hero />

      {/* Sections below hero stay max-width centered */}
      <div className="max-w-7xl w-full mx-auto px-5 sm:px-10">
        <Grid />
      </div>

    </main>
  );
}