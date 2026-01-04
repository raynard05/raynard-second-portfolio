"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import "./hero.css";
import { BBH_Bartle } from "next/font/google";
import SocialButtons from "@/components/SocialButtons";
import Noise from "@/components/Noise";
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

export default function Hero({ startAnimations = false }: HeroProps) {
    const [shouldLoadSpline, setShouldLoadSpline] = useState(false);
    const heroTitleRef = useRef<HTMLHeadingElement>(null);
    const heroDescRef = useRef<HTMLHeadingElement>(null);
    const separatorRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const splineRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Load Spline after a short delay
        const timer = setTimeout(() => {
            setShouldLoadSpline(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (startAnimations) {
            // GSAP Timeline for entrance animations
            const tl = gsap.timeline({ delay: 0.3 });

            // Animate title
            tl.from(heroTitleRef.current, {
                y: 100,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            });

            // Animate separator
            tl.from(separatorRef.current, {
                scaleX: 0,
                opacity: 0,
                duration: 0.8,
                ease: "power3.out"
            }, "-=0.5");

            // Animate description
            tl.from(heroDescRef.current, {
                y: 80,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            }, "-=0.6");

            // Animate scroll indicator
            tl.from(scrollIndicatorRef.current, {
                x: 100,
                opacity: 0,
                duration: 1,
                ease: "power4.out"
            }, "-=0.8");

            // Animate Spline
            tl.from(splineRef.current, {
                scale: 0.8,
                opacity: 0,
                duration: 1.2,
                ease: "power4.out"
            }, "-=1");
        }
    }, [startAnimations]);

    return (
        <section id="hero" className="hero-section">
            <Noise
                patternSize={300}
                patternAlpha={20}
                patternRefreshInterval={3}
            />
            <SocialButtons />
            <div className="hero-content">
                <div className="hero-left">
                    <h1 ref={heroTitleRef} className="hero-title" style={{ opacity: startAnimations ? 1 : 0 }}>
                        Hello, I am Raynard Aurelio.
                    </h1>
                    <div ref={separatorRef} className="hero-separator" style={{ opacity: startAnimations ? 1 : 0 }}>
                        <span className="separator-dot">×</span>
                        <span className="separator-line"></span>
                    </div>
                    <h2 ref={heroDescRef} className="hero-desc" style={{ opacity: startAnimations ? 1 : 0 }}>
                        web developer x software engineer <br />
                        <span className="hero-desc-sub">Based in Surabaya, Indonesia</span>
                    </h2>
                </div>
                <div className="hero-right">
                    <div ref={scrollIndicatorRef} className="scroll-indicator" style={{ opacity: startAnimations ? 1 : 0 }}>
                        <motion.div
                            className="lamp-icon"
                            animate={startAnimations ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="lamp-outer"></div>
                            <div className="lamp-inner"></div>
                        </motion.div>
                        <h2 className="scroll-text">scroll down to get to know me</h2>
                    </div>
                </div>
            </div>

            {/* Grid Background with Text */}
            <div className="hero-background">
                <div className="grid-background"></div>
                <h1 className={`background-text ${bbhBartle.className} `}>RAYOXELBOT.</h1>
            </div>

            <div ref={splineRef} className="hero-spline" style={{ opacity: startAnimations ? 1 : 0 }}>
                {shouldLoadSpline ? (
                    <Spline scene="https://prod.spline.design/gKahRPD-qqgtYvpO/scene.splinecode" />
                ) : (
                    <div className="spline-placeholder font-[family-name:var(--font-satoshi)]"></div>
                )}
            </div>
        </section>
    );
}
