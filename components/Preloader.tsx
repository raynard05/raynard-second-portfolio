"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';
import './Preloader.css';

interface PreloaderProps {
    onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
    const [progress, setProgress] = useState(0);
    const preloaderRef = useRef<HTMLDivElement>(null);
    const counterRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: () => {
                // Exit animation
                gsap.to(preloaderRef.current, {
                    yPercent: -100,
                    duration: 0.8,
                    ease: 'power4.inOut',
                    onComplete: () => {
                        onComplete();
                    }
                });
            }
        });

        // Logo entrance
        tl.from(logoRef.current, {
            scale: 0.8,
            opacity: 0,
            duration: 0.6,
            ease: 'power3.out'
        });

        // First 360° rotation
        tl.to(logoRef.current, {
            rotation: 360,
            duration: 0.8,
            ease: 'power2.inOut'
        }, '-=0.2');

        // Pause (empty tween)
        tl.to({}, { duration: 0.3 });

        // Second 360° rotation
        tl.to(logoRef.current, {
            rotation: 720,
            duration: 0.8,
            ease: 'power2.inOut'
        });

        // Counter animation
        tl.to({}, {
            duration: 2,
            onUpdate: function () {
                const prog = Math.round(this.progress() * 100);
                setProgress(prog);
            }
        }, '-=2');

        // Loading bar animation
        tl.to(barRef.current, {
            scaleX: 1,
            duration: 2,
            ease: 'power2.inOut'
        }, '-=2');

        return () => {
            tl.kill();
        };
    }, [onComplete]);

    return (
        <div ref={preloaderRef} className="preloader">
            <div className="preloader-content">
                <div ref={logoRef} className="preloader-logo">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        width={200}
                        height={200}
                        priority
                        className="logo-img"
                    />
                </div>

                <div className="preloader-counter-wrapper">
                    <div ref={counterRef} className="preloader-counter">
                        {progress}%
                    </div>
                </div>

                <div className="preloader-bar-container">
                    <div ref={barRef} className="preloader-bar"></div>
                </div>
            </div>
        </div>
    );
}
