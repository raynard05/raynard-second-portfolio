"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import "./project.css";
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
        <section id="project" className="project-section">
            <div
                className="project-spline"
                onWheel={(e) => e.preventDefault()}
                onTouchMove={(e) => e.preventDefault()}
            >
                <Spline
                    scene="https://prod.spline.design/kj5l1L6Vc8waGxQc/scene.splinecode"
                />

            </div>
        </section>
    );
}
