"use client";

// ========================================
// IMPORTS
// ========================================
import React, { useEffect, useRef } from 'react';
import { BBH_Bartle } from "next/font/google";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Particles } from "@/components/ui/particles";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import "./about_frame.css";

// Register GSAP plugin
gsap.registerPlugin(ScrollTrigger);

// ========================================
// FONT CONFIGURATION
// ========================================
const bbhBartle = BBH_Bartle({
    subsets: ["latin"],
    weight: "400",
    display: "swap",
});

// ========================================
// LINEPATH COMPONENT
// ========================================
const LinePath = ({
    className,
    scrollYProgress,
}: {
    className: string;
    scrollYProgress: MotionValue<number>;
}) => {
    const pathLength = useTransform(
        scrollYProgress,
        [0, 1],
        [0, 1.2],
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
                d="M -190 600
C 0 500, 200 720, 600 560
S 900 360, 700 520
S 1500 820, 1900 500
S 2100 1200, 2400 1000
S 2100 1200, 2400 1000
S 2100 1200, 2400 1000
S 2100 1200, 2400 1000
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

// ========================================
// CARD DATA
// ========================================
const cardsData = [
    {
        number: "01",
        title: "TECHNICAL SKILLS",
        subtitle: "FULL-STACK DEVELOPMENT",
        description: "Proficient in React, Next.js, TypeScript, Node.js, and modern web technologies. Building scalable applications with clean architecture and best practices."
    },
    {
        number: "02",
        title: "CREATIVE DESIGN",
        subtitle: "UI/UX EXCELLENCE",
        description: "Crafting stunning user interfaces with attention to detail. Combining aesthetics with functionality for exceptional user experiences."
    },

    {
        number: "03",
        title: "APPLICATION & SYSTEMS",
        subtitle: "MOBILE · DESKTOP · IOT",
        description: "Building Android applications with Flutter and desktop systems using Java (NetBeans). Also experienced in IoT solutions powered by MQTT with Mosquitto brokers."
    },

    {
        number: "04",
        title: "TECHNOLOGY STACK",
        subtitle: "DATABASES & LANGUAGES",
        description: "Experienced with MySQL, PostgreSQL, Supabase, and Firebase. Proficient in PHP, JavaScript, TypeScript, Dart, Python, and continuously exploring new technologies."
    },

    {
        number: "05",
        title: "PROFESSIONAL EXPERIENCE",
        subtitle: "2+ YEARS IN DEVELOPMENT",
        description: "Building creative web experiences and applications. From concept to deployment, delivering high-quality solutions."
    },
    {
        number: "06",
        title: "PROBLEM SOLVING",
        subtitle: "ANALYTICAL MINDSET",
        description: "Deconstructing complexity into elegant, scalable systems. Performance, structure, and clarity at the core of every solution."
    },
    {
        number: "07",
        title: "CONTINUOUS LEARNING",
        subtitle: "ALWAYS EVOLVING",
        description: "Staying current with latest technologies and best practices. Curious by nature, always exploring new ways to innovate."
    },
    {
        number: "08",
        title: "HIRE ME",
        subtitle: "FROM IDEA TO IMPACT",
        description: "I blend logic with aesthetics, turning raw concepts into immersive, high-performance web / app experiences."
    }


];

// ========================================
// ABOUT FRAME COMPONENT


// ========================================
const AboutFrame: React.FC = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
    const contentWrapperRef = useRef<HTMLDivElement>(null);

    // Track scroll progress for LinePath animation
    const { scrollYProgress } = useScroll({
        target: contentWrapperRef,
        offset: ["start end", "end start"],
    });

    // GSAP ScrollTrigger - Pin section and animate cards with timeline
    useEffect(() => {
        if (!sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Create timeline with pinning
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=5000", // Extended scroll for all 7 cards
                    pin: true,
                    scrub: 1,
                    anticipatePin: 1,
                },
            });

            // Set all cards to initial hidden state
            cardsRef.current.forEach((card) => {
                if (!card) return;
                gsap.set(card, {
                    yPercent: 50,
                    opacity: 0,
                });
            });

            // Animate cards one by one in timeline
            cardsRef.current.forEach((card, index) => {
                if (!card) return;

                tl.to(card, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 0.5,
                    ease: "power2.out",
                }, index * 0.4); // Stagger between cards
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section className="about-frame-section" ref={sectionRef}>
            {/* Background matching about.tsx */}
            <div className="gridsection-background"></div>

            {/* Particles matching about.tsx */}
            <Particles
                className="absolute inset-0 w-full h-full"
                quantity={300}
                ease={80}
                color="#000000"
                refresh={false}
                size={0.8}
            />

            <div className="about-frame-container" ref={contentWrapperRef}>
                {/* LinePath animation */}
                <LinePath
                    className="absolute inset-0 lg:mt-[-340px]"
                    scrollYProgress={scrollYProgress}
                />

                {/* Floating text - doesn't affect card layout */}
                <h2 className={`raynard-skills-text ${bbhBartle.className}`}>
                    RAYNARD BRINGS<br />
                    <span>THE SKILLS</span>
                </h2>

                <div className="about-frame-inner">
                    {cardsData.map((card, index) => (
                        <div
                            key={index}
                            ref={(el) => { cardsRef.current[index] = el; }}
                            className={`card-wrapper card-wrapper-${card.number}`}
                        >
                            <div className="about-frame-card">
                                <div className="card-content">
                                    {/* Large Number */}
                                    <span className={`card-number ${bbhBartle.className}`}>
                                        {card.number}
                                    </span>

                                    <div className="card-text">
                                        {/* Title */}
                                        <h2 className={`card-title ${bbhBartle.className}`}>
                                            {card.title}
                                        </h2>

                                        {/* Subtitle */}
                                        <p className={`card-subtitle ${bbhBartle.className}`}>
                                            {card.subtitle}
                                        </p>

                                        {/* Description */}
                                        <p className={`card-description`}>
                                            {card.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutFrame;
