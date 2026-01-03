"use client";

import "./about.css";
import { BBH_Bartle } from "next/font/google";
import { Anton } from "next/font/google";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const bbhBartle = BBH_Bartle({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

const anton = Anton({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const zoomContainerRef = useRef<HTMLDivElement>(null);
    const whiteBgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!sectionRef.current || !zoomContainerRef.current || !whiteBgRef.current) return;

        const ctx = gsap.context(() => {
            // Create timeline for coordinated animations
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "bottom bottom",
                    end: "+=2000", // Extended scroll distance for smooth reveal
                    scrub: true,
                    pin: true,
                },
            });

            // Zoom animation - scales and translates to focus on "ABOUT ME" text (letter U)
            tl.to(zoomContainerRef.current, {
                scale: 70,
                x: "10%", // Adjust to center on U
                y: "-80%", // Moved down more
                duration: 1,
            }, 0);

            // White background expansion - only appears when zoom is very close (last 30% of animation)
            tl.fromTo(whiteBgRef.current, {
                width: "0px",
                height: "0px",

            }, {
                width: "100%",
                height: "100%",
                borderRadius: "0%",
                duration: 0.3,
            }, 0.6); // Starts at 70% of the timeline

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="about" className="about-section" ref={sectionRef}>
            {/* White expanding background */}
            <div className="white-bg-container" ref={whiteBgRef}></div>

            {/* Zoom container */}
            <div className="zoom-container" ref={zoomContainerRef}>
                {/* Grid Background with Text */}
                <div className="hero-background">
                    <div className="grid-background"></div>
                    <div className="about-titletext-container">
                        <h1 className={`about-title1 ${anton.className}`}>LET'S GET TO </h1>
                        <span className={`about-title2 text-yellow-500 ${anton.className}`}>KNOW ME  </span>
                    </div>

                    <div className="aboutbottom-titletext-container">
                        <h1 className={`about-title1 ${anton.className}`}>AM I FINALLY A <span className="text-yellow-500"> HACKER ?</span></h1>
                    </div>

                    <h1 className={`background-text-about ${bbhBartle.className}`}>ABOUT ME.</h1>
                </div>
            </div>
        </section>
    );
}
