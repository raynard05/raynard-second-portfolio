"use client";

// ========================================
// IMPORTS
// ========================================
import React, { useLayoutEffect, useRef, useCallback } from 'react';
import type { ReactNode } from 'react';
import Lenis from 'lenis'; // Library untuk smooth scrolling
import { BBH_Bartle } from "next/font/google"; // Font BBH Bartle
import "./ScrollStack.css"; // Styling untuk ScrollStack

// ========================================
// FONT CONFIGURATION
// ========================================
// Setup font BBH Bartle untuk digunakan di semua text
const bbhBartle = BBH_Bartle({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

// ========================================
// SCROLLSTACK ITEM COMPONENT
// ========================================
// Props untuk setiap card individual
export interface ScrollStackItemProps {
  itemClassName?: string; // Custom CSS class untuk card
  children: ReactNode;    // Konten di dalam card (description, dll)
  number: string;         // Nomor card ("01", "02", dst)
  title: string;          // Judul card (uppercase)
  subtitle?: string;      // Subtitle card (optional)
}

/**
 * ScrollStackItem Component
 * Komponen untuk setiap card individual dalam stack
 * Menampilkan: number (besar pink), title, subtitle, dan children
 */
export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  itemClassName = '',
  number,
  title,
  subtitle
}) => (
  <div
    className={`scroll-stack-card ${itemClassName}`.trim()}
    style={{
      backfaceVisibility: 'hidden', // Optimasi rendering 3D
      transformStyle: 'preserve-3d'  // Preserve 3D transforms
    }}
  >
    <div className="card-content">
      {/* Nomor besar di pojok kiri atas (01, 02, dst) */}
      <span className={`card-number ${bbhBartle.className}`}>{number}</span>

      <div className="card-text">
        {/* Judul card (uppercase, hitam) */}
        <h2 className={`card-title ${bbhBartle.className}`}>{title}</h2>

        {/* Subtitle (uppercase, abu-abu) - optional */}
        {subtitle && <p className={`card-subtitle ${bbhBartle.className}`}>{subtitle}</p>}

        {/* Konten tambahan (description, dll) */}
        {children}
      </div>
    </div>
  </div>
);

// ========================================
// SCROLLSTACK MAIN COMPONENT PROPS
// ========================================
interface ScrollStackProps {
  className?: string;           // Custom CSS class untuk container
  children: ReactNode;          // ScrollStackItem components
  itemDistance?: number;        // Jarak antar card saat scroll (default: 50)
  itemScale?: number;           // Skala pengecilan per card (default: 0.02)
  itemStackDistance?: number;   // Jarak vertical stacking (default: 40)
  stackPosition?: string;       // Posisi mulai stack (default: "15%")
  scaleEndPosition?: string;    // Posisi akhir scale (default: "10%")
  baseScale?: number;           // Skala dasar card (default: 0.9)
  scaleDuration?: number;       // Durasi animasi scale (default: 0.5)
  rotationAmount?: number;      // Rotasi card (default: 0)
  blurAmount?: number;          // Blur effect (default: 0)
  useWindowScroll?: boolean;    // Gunakan window scroll atau container (default: true)
  onStackComplete?: () => void; // Callback saat stacking selesai
}

/**
 * ScrollStack Component
 * Main component untuk stacking cards dengan scroll animation
 * Cards muncul satu per satu dengan fade-in dari bawah
 * Posisi tetap (tidak bergerak vertikal), hanya diagonal offset
 */
const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  itemDistance = 50,        // Jarak scroll trigger
  itemScale = 0.02,         // Pengecilan per card
  itemStackDistance = 10000,   // Offset stacking - Jeda SANGAT EKSTREM untuk reading experience optimal
  stackPosition = '15%',    // Posisi stack dari top viewport
  scaleEndPosition = '10%', // Posisi akhir scale
  baseScale = 0.9,          // Skala minimum
  scaleDuration = 3,      // Durasi scale animation
  rotationAmount = 0.7,       // Rotasi (disabled)
  blurAmount = 4,           // Blur (disabled)
  useWindowScroll = true,   // Gunakan window scroll
  onStackComplete
}) => {
  // ========================================
  // REFS - State Management
  // ========================================
  const scrollerRef = useRef<HTMLDivElement>(null);        // Reference ke scroll container
  const stackCompletedRef = useRef(false);                 // Track apakah stacking sudah selesai
  const animationFrameRef = useRef<number | null>(null);   // ID untuk requestAnimationFrame
  const lenisRef = useRef<Lenis | null>(null);             // Instance Lenis smooth scroll
  const cardsRef = useRef<HTMLElement[]>([]);              // Array semua card elements
  const lastTransformsRef = useRef(new Map<number, any>()); // Cache transform terakhir untuk optimasi
  const isUpdatingRef = useRef(false);                     // Flag untuk prevent double updates

  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * calculateProgress
   * Menghitung progress scroll antara 0 dan 1
   * @param scrollTop - Posisi scroll saat ini
   * @param start - Posisi mulai (0)
   * @param end - Posisi akhir (1)
   * @returns Progress value 0-1
   */
  const calculateProgress = useCallback((scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0;  // Belum mulai
    if (scrollTop > end) return 1;    // Sudah selesai
    return (scrollTop - start) / (end - start); // Progress linear 0-1
  }, []);

  /**
   * parsePercentage
   * Convert string percentage ke pixel value
   * @param value - String "15%" atau number
   * @param containerHeight - Tinggi container
   * @returns Pixel value
   */
  const parsePercentage = useCallback((value: string | number, containerHeight: number) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight; // Convert % ke px
    }
    return parseFloat(value as string); // Return as number
  }, []);

  const getScrollData = useCallback(() => {
    if (useWindowScroll) {
      return {
        scrollTop: window.scrollY,
        containerHeight: window.innerHeight,
        scrollContainer: document.documentElement
      };
    } else {
      const scroller = scrollerRef.current;
      return {
        scrollTop: scroller ? scroller.scrollTop : 0,
        containerHeight: scroller ? scroller.clientHeight : 0,
        scrollContainer: scroller
      };
    }
  }, [useWindowScroll]);

  /**
   * getElementOffset
   * Mendapatkan posisi element dari top
   * @param element - HTML element yang ingin dicek
   * @returns Offset dari top dalam pixels
   */
  const getElementOffset = useCallback(
    (element: HTMLElement) => {
      if (useWindowScroll) {
        // Untuk window scroll: gunakan getBoundingClientRect + scrollY
        const rect = element.getBoundingClientRect();
        return rect.top + window.scrollY;
      } else {
        // Untuk container scroll: gunakan offsetTop
        return element.offsetTop;
      }
    },
    [useWindowScroll]
  );

  // ========================================
  // MAIN ANIMATION LOGIC
  // ========================================
  /**
   * updateCardTransforms
   * Fungsi utama untuk update transform semua cards
   * Dipanggil setiap frame via requestAnimationFrame
   */
  const updateCardTransforms = useCallback(() => {
    // Guard: Jangan update jika tidak ada cards atau sedang updating
    if (!cardsRef.current.length || isUpdatingRef.current) return;

    isUpdatingRef.current = true; // Lock untuk prevent double update

    // Ambil data scroll saat ini
    const { scrollTop, containerHeight } = getScrollData();
    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    // Cari element terakhir untuk menentukan kapan animation selesai
    const endElement = useWindowScroll
      ? (document.querySelector('.scroll-stack-end') as HTMLElement | null)
      : (scrollerRef.current?.querySelector('.scroll-stack-end') as HTMLElement | null);

    const endElementTop = endElement ? getElementOffset(endElement) : 0;

    // Loop setiap card untuk update transform
    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      // ========================================
      // CALCULATE POSITIONS
      // ========================================
      const cardTop = getElementOffset(card);
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
      const triggerEnd = cardTop - scaleEndPositionPx;
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
      const pinEnd = endElementTop - containerHeight / 2;

      // ========================================
      // SCALE ANIMATION
      // ========================================
      const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
      const targetScale = baseScale + i * itemScale; // Setiap card sedikit lebih kecil
      const scale = 1 - scaleProgress * (1 - targetScale); // Interpolate scale
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0; // Rotasi (disabled)

      // ========================================
      // BLUR EFFECT (Optional)
      // ========================================
      let blur = 0;
      if (blurAmount) {
        // Cari card paling atas yang visible
        let topCardIndex = 0;
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jCardTop = getElementOffset(cardsRef.current[j]);
          const jTriggerStart = jCardTop - stackPositionPx - itemStackDistance * j;
          if (scrollTop >= jTriggerStart) {
            topCardIndex = j;
          }
        }

        // Card di bawah top card akan di-blur
        if (i < topCardIndex) {
          const depthInStack = topCardIndex - i;
          blur = Math.max(0, depthInStack * blurAmount);
        }
      }

      // ========================================
      // SLIDE-IN ANIMATION (CORE FEATURE)
      // ========================================
      // Cards muncul satu per satu dengan slide-in dari bawah jauh
      const translateX = i * 100; // Offset horizontal (diagonal kiri ke kanan)
      let translateYOffset = 200; // Mulai 200px di bawah (jauh!)
      let visibility: 'visible' | 'hidden' = 'hidden'; // Hide by default

      // Card pertama (index 0) langsung visible
      if (i === 0) {
        visibility = 'visible';
        translateYOffset = 0;
      } else {
        // Card lainnya muncul saat scroll
        // Hitung progress munculnya card (0-1)
        // 800px scroll distance untuk jeda lebih lama antar card
        const cardAppearProgress = calculateProgress(scrollTop, triggerStart, triggerStart + 800);

        if (cardAppearProgress > 0) {
          visibility = 'visible'; // Show card saat mulai muncul

          // EFEK TERBANG KE ATAS dengan bounce saat menempel
          // Appearance Range 3000px untuk gerakan ULTRA LAMBAT
          const appearanceProgress = calculateProgress(scrollTop, triggerStart, triggerStart + 8000);

          const c1 = 3; // Konstanta untuk back easing (overshoot amount)
          const c3 = c1 + 1;

          const easedProgress = appearanceProgress === 1 ? 1 : 1 - Math.pow(2, -10 * appearanceProgress);


          translateYOffset = 200 * (1 - easedProgress); // Terbang ULTRA LAMBAT dari 200px → 0px
        }
      }

      // ========================================
      // CREATE TRANSFORM OBJECT
      // ========================================
      // Round values untuk optimasi performa
      const newTransform = {
        translateX: Math.round(translateX * 100) / 100,           // Horizontal position
        translateYOffset: Math.round(translateYOffset * 100) / 100, // Vertical offset untuk slide-in
        visibility,                                               // Show/hide card
        scale: Math.round(scale * 1000) / 1000,                   // Scale (0.9-1)
        rotation: Math.round(rotation * 100) / 100,               // Rotation (disabled)
        blur: Math.round(blur * 100) / 100                        // Blur (disabled)
      };

      // ========================================
      // CHANGE DETECTION (Optimasi)
      // ========================================
      // Hanya update DOM jika ada perubahan signifikan
      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||  // Pertama kali render
        lastTransform.visibility !== newTransform.visibility ||              // Visibility berubah
        Math.abs(lastTransform.translateX - newTransform.translateX) > 1 ||      // Berubah > 1px
        Math.abs(lastTransform.translateYOffset - newTransform.translateYOffset) > 1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.01 ||             // Berubah > 1%
        Math.abs(lastTransform.rotation - newTransform.rotation) > 1 ||
        Math.abs(lastTransform.blur - newTransform.blur) > 1;

      // ========================================
      // APPLY TRANSFORM TO DOM
      // ========================================
      if (hasChanged) {
        // Build transform string
        const transform = `translate3d(${newTransform.translateX}px, ${newTransform.translateYOffset}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';

        // Update DOM styles
        card.style.transform = transform;           // Apply transform
        card.style.visibility = newTransform.visibility; // Show/hide card
        card.style.filter = filter;                 // Apply filter (blur)

        // Cache transform untuk next frame comparison
        lastTransformsRef.current.set(i, newTransform);
      }

      // ========================================
      // STACK COMPLETION CALLBACK
      // ========================================
      // Trigger callback saat card terakhir masuk viewport
      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true;
          onStackComplete?.(); // Call user callback
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false; // Reset jika scroll kembali
        }
      }
    });

    isUpdatingRef.current = false; // Unlock untuk frame berikutnya
  }, [
    // Dependencies untuk useCallback
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    calculateProgress,
    parsePercentage,
    getScrollData,
    getElementOffset
  ]);

  // ========================================
  // SCROLL HANDLER
  // ========================================
  /**
   * handleScroll
   * Throttle scroll updates menggunakan requestAnimationFrame
   * Mencegah update terlalu sering (max 60fps)
   */
  const handleScroll = useCallback(() => {
    if (!animationFrameRef.current) {
      // Schedule update di next frame
      animationFrameRef.current = requestAnimationFrame(() => {
        updateCardTransforms(); // Update transforms
        animationFrameRef.current = null; // Clear untuk frame berikutnya
      });
    }
  }, [updateCardTransforms]);

  // ========================================
  // LENIS SMOOTH SCROLL SETUP
  // ========================================
  /**
   * setupLenis
   * Initialize Lenis smooth scrolling library
   */
  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      // Setup Lenis untuk window scroll
      const lenis = new Lenis({
        duration: 2,              // Durasi smooth scroll
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
        smoothWheel: true,          // Smooth mouse wheel
        touchMultiplier: 2,         // Touch sensitivity
        infinite: false,            // Tidak infinite scroll
        wheelMultiplier: 0.3,         // Mouse wheel speed
      });

      // Use RAF loop for smooth updates
      const raf = (time: number) => {
        lenis.raf(time);
        updateCardTransforms();
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      // Setup Lenis untuk container scroll
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,          // Container element
        content: scroller.querySelector('.scroll-stack-inner') as HTMLElement, // Content element
        duration: 1.2,              // Durasi smooth scroll
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Easing function
        smoothWheel: true,          // Smooth mouse wheel
        touchMultiplier: 2,         // Touch sensitivity
        infinite: false,            // Tidak infinite scroll
        gestureOrientation: 'vertical', // Vertical scroll only
        wheelMultiplier: 1,         // Mouse wheel speed
      });

      // RAF loop untuk container scroll
      const raf = (time: number) => {
        lenis.raf(time);            // Update Lenis
        updateCardTransforms();     // Update card transforms
        requestAnimationFrame(raf); // Loop
      };
      requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [updateCardTransforms, useWindowScroll]);

  // ========================================
  // COMPONENT LIFECYCLE - useLayoutEffect
  // ========================================
  /**
   * useLayoutEffect
   * Setup cards, Lenis, dan event listeners saat component mount
   * Cleanup saat component unmount
   */
  useLayoutEffect(() => {
    if (!useWindowScroll && !scrollerRef.current) return;

    // ========================================
    // INITIALIZE CARDS
    // ========================================
    // Query semua card elements
    const cards = Array.from(
      useWindowScroll
        ? document.querySelectorAll('.scroll-stack-card')
        : (scrollerRef.current?.querySelectorAll('.scroll-stack-card') ?? [])
    ) as HTMLElement[];
    cardsRef.current = cards;
    const transformsCache = lastTransformsRef.current;

    // Setup initial styles untuk setiap card
    cards.forEach((card, i) => {
      // Spacing antar cards
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`;
      }
      // Optimasi rendering 3D
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.transform = 'translateZ(0)';
      card.style.webkitTransform = 'translateZ(0)';
      card.style.perspective = '1000px';
      card.style.webkitPerspective = '1000px';
    });

    setupLenis();

    updateCardTransforms();

    return () => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
      stackCompletedRef.current = false;
      cardsRef.current = [];
      transformsCache.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    scaleDuration,
    rotationAmount,
    blurAmount,
    useWindowScroll,
    onStackComplete,
    setupLenis,
    updateCardTransforms
  ]);

  return (
    <div
      className={`scroll-stack-container ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
