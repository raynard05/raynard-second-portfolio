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
import Project from "@/app/sub-component/Project/project";


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

          <svg
            className="wave-seperator wave-seperator-2"
            viewBox="0 0 1200 140"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="     M -3 94 H 417 C 460 60 470 30 520 30 H 760 C 810 30 820 60 857 80 H 1200 V 140 H 0 Z"
              fill="rgb(56, 56, 56)"
            />
          </svg>
          <Project />
        </LenisProvider>
      )}
    </>
  );
}
