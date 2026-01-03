"use client";

import { useEffect, useState } from "react";
import { useLenis } from "./LenisProvider";
import "./ScrollProgressBar.css";

export default function ScrollProgressBar() {
    const [scrollProgress, setScrollProgress] = useState(0);
    const { lenis } = useLenis();

    useEffect(() => {
        const calculateProgress = (scrollTop: number) => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const totalScrollableHeight = documentHeight - windowHeight;
            const progress = (scrollTop / totalScrollableHeight) * 100;
            return Math.min(100, Math.max(0, progress));
        };

        if (lenis) {
            // Use Lenis scroll events
            const handleScroll = () => {
                const progress = calculateProgress(lenis.scroll);
                setScrollProgress(progress);
            };

            // Initial check
            handleScroll();

            // Listen to Lenis scroll event
            lenis.on('scroll', handleScroll);

            return () => {
                lenis.off('scroll', handleScroll);
            };
        } else {
            // Fallback to window scroll
            const handleScroll = () => {
                const progress = calculateProgress(window.scrollY);
                setScrollProgress(progress);
            };

            // Initial check
            handleScroll();

            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }
    }, [lenis]);

    return (
        <div className="scroll-progress-container">
            <div
                className="scroll-progress-bar"
                style={{ width: `${scrollProgress}%` }}
            />
        </div>
    );
}
