"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./about.css";
import { BBH_Bartle } from "next/font/google";
import ScrollVelocity from "@/components/ScrollVelocity";

gsap.registerPlugin(ScrollTrigger);

const bbhBartle = BBH_Bartle({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

const Spline = dynamic(() => import("@splinetool/react-spline"), {
    ssr: false,
});

interface HeroProps {
    startAnimations?: boolean;
}

export default function about({ startAnimations = false }: HeroProps) {
    const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const textContainerRef = useRef<HTMLDivElement>(null);
    const backgroundTextRef = useRef<HTMLHeadingElement>(null);
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const heroDescRef = useRef<HTMLHeadingElement>(null);
    const separatorRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const splineRef = useRef<HTMLDivElement>(null);
    const whiteBackgroundRef = useRef<HTMLDivElement>(null);
    const scene2ContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Spline after a short delay
        const timer = setTimeout(() => {
            setShouldLoadSpline(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (startAnimations && sectionRef.current && textContainerRef.current && backgroundTextRef.current) {
            // Zoom animation for text container
            gsap.fromTo(textContainerRef.current,
                {
                    scale: 0.5,
                    opacity: 0.8
                },
                {
                    scale: 1,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom center",
                        scrub: 1,
                        pin: true,
                    }
                }
            );

            // Zoom animation for background text "ABOUT ME"
            gsap.fromTo(backgroundTextRef.current,
                {
                    scale: 0.3,
                    opacity: 0.3
                },
                {
                    scale: 1.5,
                    opacity: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom center",
                        scrub: 1,
                    }
                }
            );
        }
    }, [startAnimations]);

    useEffect(() => {
        if (startAnimations && sectionRef.current && whiteBackgroundRef.current && scene2ContentRef.current) {
            // Fade in white background as zoom progresses
            gsap.fromTo(whiteBackgroundRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top top",
                        end: "bottom center",
                        scrub: 1,
                    }
                }
            );

            // Fade in scene2 content after white background
            gsap.fromTo(scene2ContentRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "center top",
                        end: "bottom center",
                        scrub: 1,
                    }
                }
            );
        }
    }, [startAnimations]);

    return (
        <section ref={sectionRef} id="about" className="about-section">

            <ScrollVelocity
                texts={['Get to know me ', '  Scroll Down ', " RAYOXEL "]}
                velocity={80}
                className={`velocity-text ${bbhBartle.className} `}
            />

            {/* White Background Layer - Fades in during zoom */}
            <div ref={whiteBackgroundRef} className="white-background-layer"></div>

            {/* Grid Background with Text */}
            <div className="hero-background">
                <div className="grid-background"></div>
                <h1 ref={backgroundTextRef} className={`background-text-about ${bbhBartle.className} `}>ABOUT ME.</h1>
            </div>

            {/* Main Content */}
            <div className="about-content">
                <div ref={textContainerRef} className="about-text-container">
                    <h2 ref={heroTitleRef} className="about-title" style={{ opacity: startAnimations ? 1 : 0 }}>
                        SO WE BUILT<br />
                        <span className="highlight-text">WEB SCROLLING</span>
                    </h2>

                    <h2 ref={heroDescRef} className="about-subtitle" style={{ opacity: startAnimations ? 1 : 0 }}>
                        AS IT SHOULD BE
                    </h2>
                </div>
            </div>

            {/* AboutScene2 Content - Appears after zoom */}
            <div ref={scene2ContentRef} className="about-scene2-inline">
                <h2 className="about-scene2-title">About Me</h2>
                <div className="about-scene2-text">
                    <p>
                        I'm a passionate web developer and software engineer based in Surabaya, Indonesia.
                        I specialize in creating smooth, immersive web experiences that push the boundaries
                        of what's possible on the web.
                    </p>
                    <p>
                        With expertise in modern web technologies and a keen eye for design, I build
                        interfaces that not only look great but feel incredible to use.
                    </p>
                </div>
            </div>

        </section>
    );
}
