"use client";

import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import "@/components/Frames.css";
import { BBH_Bartle } from "next/font/google";

const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const cards = [
  {
    index: "01",
    title: "Run Through the Motion",
    desc: "Smooth scrolling driven by precise interpolation, creating a natural yet controlled motion experience."
  },
  {
    index: "02",
    title: "Lightweight & Performant",
    desc: "Designed to stay fast and fluid even on complex layouts and animation-heavy pages."
  },
  {
    index: "03",
    title: "Made for Creative Devs",
    desc: "Built with flexibility in mind, empowering developers to craft immersive storytelling."
  },
  {
    index: "04",
    title: "Bring Your Own Animation Library",
    desc: "Seamlessly integrate GSAP, Framer Motion, or custom RAF-based animations."
  }
];

export default function ScrollFrames() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const framesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    const onScroll = () => {
      if (!sectionRef.current) return;

      const rect = sectionRef.current.getBoundingClientRect();
      const progress = Math.min(
        Math.max(-rect.top / (rect.height - window.innerHeight), 0),
        1
      );

      framesRef.current.forEach((frame, i) => {
        const offset = i - progress * (cards.length - 1);

        frame.style.transform = `
          translateX(${offset * 70}px)
          translateY(${offset * 50}px)
          scale(${1 - Math.abs(offset) * 0.06})
        `;

        frame.style.opacity = offset < -1 ? "0" : "1";
        frame.style.zIndex = `${cards.length - i}`;
      });
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return (
    <section className="frames" ref={sectionRef}>
      <div className="frames__sticky">
        <div className="frames__track">
          {cards.map((card, i) => (
            <div
              key={i}
              className="frame"
              ref={(el) => {
                if (el) framesRef.current[i] = el;
              }}
            >
              <span className={`frame__index ${bbhBartle.className}`}>{card.index}</span>
              <h2 className={`frame__title ${bbhBartle.className}`}>{card.title}</h2>
              <p className={`frame__desc ${bbhBartle.className}`}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
