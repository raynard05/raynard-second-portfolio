"use client";

import "./about.css";
import { BBH_Bartle } from "next/font/google";
import { Anton } from "next/font/google";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import ScrollFloat from "@/components/ScrollFloat";
import { Particles } from "@/components/ui/particles";
import Noise from "@/components/Noise";

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
const LinePath = ({
    className,
    scrollYProgress,
}: {
    className: string;
    scrollYProgress: MotionValue<number>;
}) => {
    // window animasi yang stabil
    const pathLength = useTransform(
        scrollYProgress,
        [0.01, 1.5],
        [0, 1],
        { clamp: true }
    );

    return (
        <svg
            width="1278"
            height="2319"
            viewBox="0 0 1278 2319"
            fill="none"
            overflow="visible"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <motion.path
                d=""
                stroke="#000"
                strokeWidth="20"
                style={{
                    pathLength,
                    strokeDashoffset: useTransform(pathLength, v => 1 - v),
                }}
            />
        </svg>
    );
};
export default function About() {
    const sectionRef = useRef<HTMLElement>(null);
    const zoomContainerRef = useRef<HTMLDivElement>(null);
    const whiteBgRef = useRef<HTMLDivElement>(null);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    // Track scroll progress specifically for the about-content-wrapper section
    const { scrollYProgress } = useScroll({
        target: contentWrapperRef,
        offset: ["start end", "end start"],
    });


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
                x: "1%", // Adjust to center on U
                y: "-150%", // Moved down more
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
        <>
            {/* Zoom Animation Section */}
            <section id="about" className="about-section" ref={sectionRef}>
                {/* Noise effect for black background */}
                <Noise
                    patternSize={500}
                    patternAlpha={20}
                    patternRefreshInterval={3}
                />

                {/* White expanding background */}
                <div className="white-bg-container" ref={whiteBgRef}>

                </div>

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

                        <h1 className={`background-text-about ${bbhBartle.className}`}>[1] ABOUT ME.</h1>
                    </div>
                </div>
            </section>

            {/* Content Section - Appears after white background */}
            <section className="about-content-section">
                <div className="gridsection-background"></div>
                <Particles
                    className="absolute inset-0 w-full h-full"
                    quantity={150}
                    ease={80}
                    color="#000000"
                    refresh={false}
                    size={0.8}
                />
                <div className="about-content-wrapper" ref={contentWrapperRef}>
                    <LinePath
                        className="absolute inset-0"
                        scrollYProgress={scrollYProgress}
                    />
                    <ScrollFloat
                        containerClassName="float-text"
                        textClassName="font-bold text-black text-6xl md:text-[200px] lg:text-8xl"
                        stagger={0.04}


                    >
                        1. About Me.
                    </ScrollFloat>

                </div>
            </section>
        </>
    );
}
