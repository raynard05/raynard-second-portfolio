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
import Spline from "@splinetool/react-spline";
import SplitText from "@/components/SplitText";
import MetaBalls from "@/components/MetaBalls";

import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

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
        [0.01, 0.4],
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
                d="M -1100 600
C 0 500, 200 720, 600 560
S 900 360, 700 520
S 1500 820, 1800 600
S 2100 1200, 2400 1000
S 2100 1200, 2400 1000
S 2100 1200, 2400 1000

"

                stroke="#fffb00ff"
                strokeWidth="20"
                style={{
                    pathLength,
                    strokeDashoffset: useTransform(pathLength, v => 1 - v),

                }}
            />
        </svg>
    );
};

// LinePath 2 - Empty path for custom design
const LinePath2 = ({
    className,
    scrollYProgress,
}: {
    className: string;
    scrollYProgress: MotionValue<number>;
}) => {
    // LinePath 2: Animasi dimulai lebih lambat (0.2 - 0.6)
    const pathLength = useTransform(
        scrollYProgress,
        [0.15, 0.55],
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
            <defs>
                <marker
                    id="arrow-head"
                    markerWidth="12"
                    markerHeight="12"
                    refX="6"
                    refY="6"
                    orient="auto"
                    markerUnits="strokeWidth"
                >
                    <path
                        d="M 0 0 L 12 6 L 0 12 Z"
                        fill="#fffb00ff"
                    />
                </marker>
            </defs>

            <motion.path
                d="
      M 3800 600
      C 2400 500, 2200 720, 1800 560
      S 1500 150, 1700 520
      S 900 820, 600 600
      S 300 1200, 300 1200
      S 300 1200, 300 1200
      S 300 1200, 300 1200

    "
                stroke="#fffb00ff"
                strokeWidth="20"
                fill="none"
                markerEnd="url(#arrow-head)"
                style={{
                    pathLength,
                    strokeDashoffset: useTransform(pathLength, v => 1 - v),
                }}
            />
        </svg>

    );
};

// LinePath 3 - Empty path for custom design
const LinePath3 = ({
    className,
    scrollYProgress,
}: {
    className: string;
    scrollYProgress: MotionValue<number>;
}) => {
    // LinePath 3: Animasi dimulai paling akhir (0.4 - 0.8)
    const pathLength = useTransform(
        scrollYProgress,
        [0.4, 0.8],
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
                stroke="#ff0000"
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
    const imageRef = useRef<HTMLDivElement>(null);

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
                    onLeave: () => {
                        // Refresh ScrollTrigger setelah pin selesai
                        ScrollTrigger.refresh();
                    },
                },
            });

            // Zoom animation - scales and translates to focus on "ABOUT ME" text (letter U)
            tl.to(zoomContainerRef.current, {
                scale: 70,
                x: "-130%", // Adjust to center on U
                y: "-290%", // Moved down more
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

    // Image animation - slide in from left when visible
    useEffect(() => {
        if (!imageRef.current) return;

        const ctx = gsap.context(() => {
            gsap.fromTo(
                imageRef.current,
                {
                    x: -200,
                    opacity: 0,
                    scale: 0.9,
                },
                {
                    x: 0,
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: imageRef.current,
                        start: "top 80%",
                        end: "top 50%",
                        toggleActions: "play none none none",
                        once: true,
                        invalidateOnRefresh: true,
                    },
                }
            );
        }, imageRef);

        return () => ctx.revert();
    }, []);

    return (
        <>

            {/* Zoom Animation Section */}
            <section id="about" className="about-section" ref={sectionRef}>
                {/* Noise effect for black background */}
                <Noise
                    patternSize={500}
                    patternAlpha={30}
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

                {/* Spline 3D Background - Fixed */}


                <Particles
                    className="absolute inset-0 w-full h-full"
                    quantity={300}
                    ease={80}
                    color="#000000"
                    refresh={false}
                    size={1.2}
                />
                <div className="about-content-wrapper" ref={contentWrapperRef}>
                    <LinePath
                        className="absolute inset-0  lg:mt-[-100px]"
                        scrollYProgress={scrollYProgress}
                    />

                    {/* LinePath 2 - Custom path (Green) */}
                    <LinePath2
                        className="absolute inset-0  lg:mt-[1000px]"
                        scrollYProgress={scrollYProgress}
                    />

                    {/* LinePath 3 - Custom path (Red) */}
                    <LinePath3
                        className="absolute inset-0  lg:mt-[-100px]"
                        scrollYProgress={scrollYProgress}
                    />

                    <SplitText
                        text="1. ABOUT ME."
                        delay={80}
                        duration={1.9}
                        className="float-text"
                    />

                    {/* Flex container untuk gambar dan teks */}
                    <div className="about-content-flex">

                        <div className="about-content-image" ref={imageRef}>
                            <img src="/profilku.jpg" alt="" />
                        </div>
                        <div className="about-scene-text">
                            <h3>"  I'm Raynard Aurelio (Rayoxel), a creative Web Developer and Software Engineer shaping ideas through code and visual rhythm.
                                <span></span> <br />I blend logic and aesthetics, turning interfaces into expressive, functional digital experiences.
                                <span></span> <br />Driven by problem-solving, I deconstruct complexity into elegant, scalable systems.
                                <span></span><br />I build with intention — performance, structure, and clarity at the core of every line.
                                <span></span><br /> Curious by nature, I design and engineer products that feel alive, purposeful, and human.  "</h3>
                        </div>

                        {/* Signature */}
                        <div className="about-signature">
                            <img src="/signature.png" alt="Signature" />
                        </div>
                    </div>
                    <div className="what-i-do">
                        <div className="scrollstack-wrapper">
                            {/* ScrollStack Section - Left Side */}


                            {/* Header Text - Right Side */}
                            <div className="scrollstack-header">
                                <h2 className={`scrollstack-title ${bbhBartle.className}`}>
                                    RAYNARD BRINGS
                                </h2>
                                <h2 className={`scrollstack-subtitle ${bbhBartle.className}`}>
                                    THE SKILLS
                                </h2>
                            </div>
                        </div>
                        <div className="scrollstack-content">
                            <ScrollStack
                                itemDistance={60}
                                itemScale={0.025}
                                itemStackDistance={35}
                                stackPosition="15%"
                                useWindowScroll={true}

                            >
                                <ScrollStackItem
                                    number="01"
                                    title="TECHNICAL SKILLS"
                                    subtitle="FULL-STACK DEVELOPMENT"
                                >
                                    <p className="text-black/60 mt-4 max-w-md">
                                        Proficient in React, Next.js, TypeScript, Node.js, and modern web technologies.
                                        Building scalable applications with clean architecture and best practices.
                                    </p>
                                </ScrollStackItem>

                                <ScrollStackItem
                                    number="02"
                                    title="CREATIVE DESIGN"
                                    subtitle="UI/UX EXCELLENCE"
                                >
                                    <p className="text-black/60 mt-4 max-w-md">
                                        Crafting stunning user interfaces with attention to detail.
                                        Combining aesthetics with functionality for exceptional user experiences.
                                    </p>
                                </ScrollStackItem>

                                <ScrollStackItem
                                    number="03"
                                    title="APPLICATION & SYSTEMS"
                                    subtitle="MOBILE · DESKTOP · IOT"
                                >
                                    <p className="text-black/60 mt-4 max-w-md">
                                        Building Android applications with Flutter and desktop systems using Java (NetBeans).
                                        Also experienced in IoT solutions powered by MQTT with Mosquitto brokers.
                                    </p>

                                </ScrollStackItem>

                                <ScrollStackItem
                                    number="04"
                                    title="TECHNOLOGY STACK"
                                    subtitle="DATABASES & LANGUAGES"
                                >
                                    <p className="text-black/60 mt-4 max-w-md">
                                        Experienced with MySQL, PostgreSQL, Supabase, and Firebase.
                                        Proficient in PHP, JavaScript, TypeScript, Dart, Python, and continuously exploring new technologies.
                                    </p>

                                </ScrollStackItem>


                                <ScrollStackItem
                                    number="05"
                                    title="PROFESSIONAL EXPERIENCE"
                                    subtitle="2+ YEARS IN DEVELOPMENT"
                                >
                                    <p className="text-black/60 mt-4 max-w-md">
                                        Building creative web experiences and applications.
                                        From concept to deployment, delivering high-quality solutions.
                                    </p>
                                </ScrollStackItem>

                                <ScrollStackItem
                                    number="06"
                                    title="PROBLEM SOLVING"
                                    subtitle="ANALYTICAL MINDSET"
                                >
                                    <p className="text-black/60 mt-4 max-w-md">
                                        Deconstructing complexity into elegant, scalable systems.
                                        Performance, structure, and clarity at the core of every solution.
                                    </p>
                                </ScrollStackItem>

                                <ScrollStackItem
                                    number="07"
                                    title="CONTINUOUS LEARNING"
                                    subtitle="ALWAYS EVOLVING"
                                >
                                    <p className="text-black/60 mt-4 max-w-md">
                                        Staying current with latest technologies and best practices.
                                        Curious by nature, always exploring new ways to innovate.
                                    </p>
                                </ScrollStackItem>
                            </ScrollStack>
                        </div>




                    </div>
                    {/* ScrollStack Container */}


                </div>
                <div>


                </div>

            </section>
        </>
    );
}
