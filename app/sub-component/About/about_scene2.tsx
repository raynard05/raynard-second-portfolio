"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./about_scene2.css";

gsap.registerPlugin(ScrollTrigger);

interface AboutScene2Props {
    startAnimations?: boolean;
}

export default function AboutScene2({ startAnimations = false }: AboutScene2Props) {
    const sectionRef = useRef<HTMLElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (startAnimations && sectionRef.current && contentRef.current) {
            gsap.from(contentRef.current, {
                opacity: 0,
                y: 50,
                duration: 1,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top center",
                    end: "top top",
                    scrub: 1,
                }
            });
        }
    }, [startAnimations]);

    return (
        <section ref={sectionRef} className="about-scene2">
            <div ref={contentRef} className="about-scene2-content">
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
