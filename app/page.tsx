"use client"

import { useState } from "react";
import Image from "next/image";
import Hero from "@/app/sub-component/hero/hero";
import PillNav from "@/components/PillNav";
import SocialButtons from "@/components/SocialButtons";
import Preloader from "@/components/Preloader";
import LenisProvider from "@/components/LenisProvider";
import logo from '@/public/logo.webp';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [startHeroAnimations, setStartHeroAnimations] = useState(false);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
    // Start hero animations after a brief delay
    setTimeout(() => {
      setStartHeroAnimations(true);
    }, 100);
  };

  return (
    <>
      {isLoading && <Preloader onComplete={handlePreloaderComplete} />}

      {!isLoading && (
        <LenisProvider>
          <PillNav
            logo={logo.src}
            logoAlt="Company Logo"
            items={[
              { label: 'Home', href: '/' },
              { label: 'About', href: '/About' },
              { label: 'Project', href: '/Project' },
              { label: 'Contact', href: '/contact' }
            ]}
            activeHref="/"
            className="custom-nav"
            ease="power2.easeOut"
            baseColor="#ffffffff"
            pillColor="#000000ff"
            hoveredPillTextColor="#000000ff"
            pillTextColor="#ffffffff"
          />

          <SocialButtons />

          <Hero startAnimations={startHeroAnimations} />
        </LenisProvider>
      )}
    </>
  );
}
