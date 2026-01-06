"use client"

import { useState } from "react";
import Image from "next/image";
import Hero from "@/app/sub-component/hero/hero";
import PillNav from "@/components/PillNav";
import ScrollVelocity from "@/components/ScrollVelocity";
import Preloader from "@/components/Preloader";
import LenisProvider from "@/components/LenisProvider";
import logo from '@/public/logo.webp';
import About from '@/app/sub-component/About/about';
import ScrollProgressBar from "@/components/ScrollProgressBar";
import { BBH_Bartle } from "next/font/google";
import AboutFrame from "@/app/sub-component/About/about_frame";


const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});
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
          <ScrollProgressBar />

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



          <Hero startAnimations={startHeroAnimations} />
          <ScrollVelocity
            texts={['Get to know me ', '  Scroll Down ', " RAYOXEL "]}
            velocity={80}
            className={`velocity-text ${bbhBartle.className} `}
          />
          <About />
          <section id="test-aboutframe">
            <AboutFrame />
          </section>

        </LenisProvider>
      )}
    </>
  );
}
