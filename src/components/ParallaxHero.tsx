/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, Sparkles } from "lucide-react";

interface ParallaxHeroProps {
  smoothedScrollY: number;
}

export default function ParallaxHero({ smoothedScrollY }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile or touch-capable to disable heavy mouse tracking parallax
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setIsMobile(
        window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768
      );
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update mouse offset percentages relative to container dimensions
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2); // -1 to 1
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2); // -1 to 1
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMobile]);

  // Translate scroll positions mathematically for precise layering speed differences
  const scrollRatio = Math.min(1, Math.max(0, smoothedScrollY / dimensions.height));
  
  // Custom offsets representing the multi-layered parallax mechanics
  // Depth coefficient mapping layout:
  const bgTranslateY = smoothedScrollY * 0.48;
  const sunTranslateY = smoothedScrollY * 0.34;
  const mtDistantTranslateY = smoothedScrollY * 0.22;
  const textTranslateY = smoothedScrollY * 0.28;
  const mtCloseTranslateY = smoothedScrollY * 0.10;
  const foregroundTranslateY = smoothedScrollY * 0.02;

  // Text scaling / fading multipliers based on scroll depth
  const textOpacity = Math.max(0, 1 - scrollRatio * 1.6);
  const textScale = Math.max(0.75, 1 - scrollRatio * 0.3);

  // 2.5D mouse translation offsets per layer (deep shifts less, near shifts more)
  const bgMouseX = isMobile ? 0 : mousePos.x * -11;
  const bgMouseY = isMobile ? 0 : mousePos.y * -11;

  const sunMouseX = isMobile ? 0 : mousePos.x * -24;
  const sunMouseY = isMobile ? 0 : mousePos.y * -18;

  const mtDistantMouseX = isMobile ? 0 : mousePos.x * -32;
  const mtDistantMouseY = isMobile ? 0 : mousePos.y * -20;

  const textMouseX = isMobile ? 0 : mousePos.x * -42;
  const textMouseY = isMobile ? 0 : mousePos.y * -24;

  const mtCloseMouseX = isMobile ? 0 : mousePos.x * -52;
  const mtCloseMouseY = isMobile ? 0 : mousePos.y * -28;

  const foregroundMouseX = isMobile ? 0 : mousePos.x * -64;
  const foregroundMouseY = isMobile ? 0 : mousePos.y * -32;

  return (
    <section
      ref={containerRef}
      id="hero-parallax-container"
      className="relative w-full h-[100vh] overflow-hidden select-none"
      style={{ willChange: "transform" }}
    >
      {/* =======================================================
          LAYER 1: Deep Sky & Cosmos Layer (Distant background)
          ======================================================= */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#020512] via-[#090b21] to-[#12142e] w-full h-full origin-center scale-105"
        style={{
          transform: `translate3d(${bgMouseX}px, ${bgMouseY + bgTranslateY}px, 0)`,
          willChange: "transform",
        }}
      >
        {/* Twinkling CSS Stars (rendered as SVGs) */}
        <svg className="absolute inset-0 w-full h-full opacity-60 pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10%" cy="20%" r="1" fill="#fff" className="animate-pulse" />
          <circle cx="25%" cy="15%" r="1.5" fill="#ffd27d" className="animate-pulse duration-1000" />
          <circle cx="45%" cy="30%" r="1" fill="#fff" className="animate-pulse duration-500" />
          <circle cx="70%" cy="18%" r="1" fill="#93c5fd" className="animate-pulse duration-700" />
          <circle cx="85%" cy="28%" r="1.5" fill="#fff" className="animate-pulse duration-1500" />
          <circle cx="92%" cy="12%" r="1" fill="#ffedd5" className="animate-pulse duration-1000" />
          <circle cx="30%" cy="65%" r="1" fill="#fff" className="animate-pulse duration-700" />
          <circle cx="65%" cy="70%" r="1.5" fill="#fff" className="animate-pulse duration-2000" />
        </svg>

        {/* Ambient cosmic stardust fog (using absolute design accents) */}
        <div className="absolute top-[20%] left-[30%] w-[35rem] h-[35rem] rounded-full bg-indigo-500/10 blur-[130px] pointer-events-none animate-pulse-slow" />
        <div className="absolute top-1/3 right-[10%] w-[25rem] h-[25rem] rounded-full bg-violet-600/5 blur-[100px] pointer-events-none" />
      </div>

      {/* =======================================================
          LAYER 2: Glowing Celestial Moon (Dynamic orb)
          ======================================================= */}
      <div
        className="absolute left-1/2 -ml-[150px] top-[15%] w-[300px] h-[300px] flex items-center justify-center pointer-events-none scale-[0.95]"
        style={{
          transform: `translate3d(${sunMouseX}px, ${sunMouseY + sunTranslateY}px, 0)`,
          willChange: "transform",
        }}
      >
        {/* Luminous glow circles behind moon */}
        <div className="absolute w-[280px] h-[280px] bg-amber-500/20 rounded-full blur-[50px] animate-pulse duration-[4000ms]" />
        <div className="absolute w-[210px] h-[210px] bg-yellow-300/10 rounded-full blur-[25px]" />

        {/* Beautiful detailed SVG crescent moon and celestial stars */}
        <svg
          width="200"
          height="200"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative drop-shadow-[0_0_20px_rgba(253,224,71,0.3)] animate-spin-slow"
        >
          {/* Main Moon Orb */}
          <circle cx="50" cy="50" r="40" fill="url(#moonGrad)" />
          {/* Shadow clip to create detailed crescent crest */}
          <circle cx="38" cy="45" r="39" fill="#020512" />

          {/* Little glowing orbit ring */}
          <ellipse
            cx="50"
            cy="50"
            rx="45"
            ry="12"
            stroke="rgba(251, 191, 36, 0.15)"
            strokeWidth="1.5"
            transform="rotate(-15, 50, 50)"
          />

          <defs>
            <linearGradient id="moonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fffbeb" />
              <stop offset="35%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* =======================================================
          LAYER 3: Distant Jagged Silhouette Peaks (Midground background)
          ======================================================= */}
      <div
        className="absolute bottom-0 w-full h-[55%] pointer-events-none"
        style={{
          transform: `translate3d(${mtDistantMouseX}px, ${mtDistantMouseY + mtDistantTranslateY}px, 0)`,
          willChange: "transform",
        }}
      >
        <svg
          className="absolute bottom-[-1px] w-full h-full fill-[#0c0d1e] preserve-3d"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path d="M0,224 L160,112 L320,192 L480,96 L640,240 L800,160 L960,256 L1120,128 L1280,224 L1440,96 L1440,320 L0,320 Z" />
          <path d="M0,160 L240,240 L480,144 L720,260 L960,180 L1200,240 L1440,150 L1440,320 L0,320 Z" opacity="0.3" />
        </svg>
      </div>

      {/* =======================================================
          LAYER 4: Stylistic Middle Floating Typography
          ======================================================= */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center pointer-events-none"
        style={{
          transform: `translate3d(${textMouseX}px, ${textMouseY + textTranslateY}px, 0)`,
          opacity: textOpacity,
          scale: textScale,
          willChange: "transform, opacity",
        }}
      >
        <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md mb-4">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] font-mono tracking-[0.25em] text-amber-300 uppercase">
            IMMERSIVE EXCURSION
          </span>
        </div>

        <h1 className="font-sans font-black flex flex-col tracking-[-3px] sm:tracking-[-5px] md:tracking-[-7px] lg:tracking-[-8px] leading-[0.85] text-white uppercase text-5xl sm:text-8xl md:text-9xl lg:text-[140px]">
          <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
            Ascend
          </span>
          <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent drop-shadow-2xl">
            The Heights
          </span>
        </h1>

        <p className="mt-8 text-xs sm:text-sm font-sans tracking-[0.4em] text-white/60 font-semibold max-w-md uppercase drop-shadow">
          A multi-layered 2.5D sensory visual environment.
        </p>
      </div>

      {/* =======================================================
          LAYER 5: Closer Jagged Silhouette Peaks (Landscape midground)
          ======================================================= */}
      <div
        className="absolute bottom-0 w-full h-[38%] pointer-events-none"
        style={{
          transform: `translate3d(${mtCloseMouseX}px, ${mtCloseMouseY + mtCloseTranslateY}px, 0)`,
          willChange: "transform",
        }}
      >
        <svg
          className="absolute bottom-[-1px] w-full h-full fill-[#04060d] preserve-3d"
          viewBox="0 0 1440 240"
          preserveAspectRatio="none"
        >
          <path d="M0,160 L180,80 L360,140 L540,70 L720,130 L900,60 L1080,120 L1260,50 L1440,110 L1440,240 L0,240 Z" />
          <path d="M0,50 L320,120 L720,40 L1100,100 L1440,30 L1440,240 L0,240 Z" opacity="0.15" />
        </svg>

        {/* Drifting vapor cloud banks */}
        <div className="absolute inset-x-0 bottom-6 bg-gradient-to-t from-[#04060d] to-transparent h-20 opacity-90" />
      </div>

      {/* =======================================================
          LAYER 6: Landscape Pine Trees Foreshore (Foreground overlay)
          ======================================================= */}
      <div
        className="absolute bottom-0 w-full h-[22%] pointer-events-none"
        style={{
          transform: `translate3d(${foregroundMouseX}px, ${foregroundMouseY + foregroundTranslateY}px, 0)`,
          willChange: "transform",
        }}
      >
        <svg
          className="absolute bottom-[-1px] w-full h-full fill-[#010206]"
          viewBox="0 0 1440 180"
          preserveAspectRatio="none"
        >
          {/* Individual vector pines and rocky banks silhouettes */}
          <path d="M0,140 L40,120 L90,160 L150,110 L190,140 L260,95 L310,130 L380,80 L440,120 L510,75 L560,110 L630,70 L690,115 L770,70 L830,120 L890,65 L940,105 L1010,60 L1070,110 L1140,75 L1190,115 L1260,60 L1320,100 L1380,50 L1440,90 L1440,180 L0,180 Z" />
          {/* Closer, larger detailed shore slopes */}
          <path d="M0,110 Q280,150 560,80 T1120,130 Q1280,95 1440,110 L1440,180 L0,180 Z" opacity="0.5" />
        </svg>

        {/* Subtle foreground fog bank */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent h-12 opacity-60" />
      </div>

      {/* Interactive Scroll Prompt (Arrow / mouse animation at bottom of hero) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="absolute bottom-8 left-1/2 -ml-6 z-20 flex flex-col items-center pointer-events-auto cursor-pointer"
        onClick={() => {
          const content1 = document.getElementById("landmark-forest");
          content1?.scrollIntoView({ behavior: "smooth" });
        }}
      >
        <div
          className="w-8 h-12 rounded-full border-2 border-white/20 flex items-center justify-center backdrop-blur-md bg-slate-900/30 hover:border-amber-400/80 transition-colors"
          data-cursor="hover"
          title="Scroll Down"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-amber-400 rounded-full"
          />
        </div>
        <span className="text-[9px] font-mono tracking-widest text-white/50 uppercase scale-90 mt-2 font-semibold">
          SCROLL
        </span>
      </motion.div>
    </section>
  );
}
