"use client";

import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";

export default function ScrollStackDemo() {
    return (
        <ScrollStack
            itemDistance={60}
            itemScale={0.025}
            itemStackDistance={35}
            stackPosition="15%"
            useWindowScroll={true}
        >
            <ScrollStackItem
                number="01"
                title="RUN THROUGH THE MOTION"
                subtitle="LIGHTWEIGHT (UNDER 2KB)"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Smooth scrolling driven by precise interpolation, creating a natural yet controlled motion experience.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="02"
                title="LENIS BRINGS THE HEAT"
                subtitle="ANIMATION LIBRARY"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Bring your own animation library. Seamlessly integrate GSAP, Framer Motion, or custom RAF-based animations.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="03"
                title="MADE FOR 2026+"
                subtitle="MODERN SCROLL EXPERIENCE"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Built with flexibility in mind, empowering developers to craft immersive storytelling experiences.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="04"
                title="CONTROL SCROLL DURATION"
                subtitle="CUSTOMIZABLE EASING"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Give all your users the same experience whether they're using trackpads, mouse wheels, or otherwise.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="05"
                title="USE ELEGANT ELEMENTS"
                subtitle="CLEAN DESIGN"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Create more immersive interfaces with smooth scroll that pulls users into the flow of the experience.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="06"
                title="ENJOY HORIZONTAL VERSATILITY"
                subtitle="MULTI-DIRECTIONAL"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Unlock the creative potential and impact of your web experiences with butter-smooth navigation.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="07"
                title="FEEL USERS STICK"
                subtitle="ENGAGING UX"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Synchronization with native scroll is reliable. No jumps or delays with scroll-linked animations.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="08"
                title="TOUCH SUPPORT"
                subtitle="MOBILE FRIENDLY"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Designed to stay fast and fluid even on complex layouts and animation-heavy pages.
                </p>
            </ScrollStackItem>

            <ScrollStackItem
                number="09"
                title="LENIS BRINGS THE HEAT"
                subtitle="PERFORMANCE FIRST"
            >
                <p className="text-black/60 mt-4 max-w-md">
                    Make your animations flawless with smooth scroll that fixes threading issues in modern browsers.
                </p>
            </ScrollStackItem>
        </ScrollStack>
    );
}
