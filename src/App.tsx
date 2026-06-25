/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { SECTIONS } from "./types";
import { AmbientSynth } from "./utils/audio";
import CustomCursor from "./components/CustomCursor";
import SVGScrollProgress from "./components/SVGScrollProgress";
import ParallaxHero from "./components/ParallaxHero";
import AsymmetricScroll from "./components/AsymmetricScroll";
import CurtainReveal from "./components/CurtainReveal";
import ParallaxFooter from "./components/ParallaxFooter";
import { Volume2, VolumeX, Sparkles, Activity, Map } from "lucide-react";

export default function App() {
  const [smoothedScrollY, setSmoothedScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  
  // Audio state
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const synthRef = useRef<AmbientSynth | null>(null);

  // Targets for scroll lerping
  const targetScrollYRef = useRef(0);
  const smoothedScrollYRef = useRef(0);
  const animationFrameIdRef = useRef<number | null>(null);

  // Initialize Audio Synth instance
  useEffect(() => {
    synthRef.current = new AmbientSynth();
    return () => {
      if (synthRef.current) {
        synthRef.current.stop();
      }
    };
  }, []);

  // Butter-Smooth Scroll Lerping Loop
  useEffect(() => {
    const handleScroll = () => {
      targetScrollYRef.current = window.scrollY;

      // Compute total progress (0 to 1)
      const totalScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalScrollHeight > 0 ? window.scrollY / totalScrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Initial compute
    handleScroll();

    // Lerped Animation Loop (Linear Interpolation)
    const updateScroll = () => {
      const target = targetScrollYRef.current;
      const current = smoothedScrollYRef.current;
      
      // Determine if touch screen to reduce math load
      const isTouch = window.matchMedia("(pointer: coarse)").matches;
      const lerpFactor = isTouch ? 0.25 : 0.085; // Crisper speed on mobile

      // Linear interpolation formula: current + (target - current) * factor
      const next = current + (target - current) * lerpFactor;
      
      // If difference is tiny, snap to target to allow idle CPU
      if (Math.abs(target - next) < 0.1) {
        smoothedScrollYRef.current = target;
        setSmoothedScrollY(target);
      } else {
        smoothedScrollYRef.current = next;
        setSmoothedScrollY(next);
      }

      // Check current active section by measuring element bounds inside the viewport center
      const sections = ["hero-parallax-container", "landmark-forest", "landmark-fjord", "landmark-origin"];
      let activeIndex = 0;
      const viewportCenter = window.innerHeight / 2;

      for (let i = 0; i < sections.length; i++) {
        const el = document.getElementById(sections[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Sec covers middle of the screen
          if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
            activeIndex = i;
            break;
          }
        }
      }

      setActiveSectionIndex((prev) => {
        if (prev !== activeIndex) {
          // If section shifted and audio is enabled, trigger synth chord glider crossfade
          if (isAudioEnabled && synthRef.current) {
            synthRef.current.setSection(activeIndex);
          }
          return activeIndex;
        }
        return prev;
      });

      // Modulate lowpass filter frequency continuously on scroll if audio enabled
      if (isAudioEnabled && synthRef.current) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const normalized = totalHeight > 0 ? target / totalHeight : 0;
        synthRef.current.handleScrollModulation(normalized);
      }

      animationFrameIdRef.current = requestAnimationFrame(updateScroll);
    };

    animationFrameIdRef.current = requestAnimationFrame(updateScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [isAudioEnabled]);

  // Audio Toggle Controller
  const handleToggleAudio = async () => {
    if (!synthRef.current) return;

    if (isAudioEnabled) {
      synthRef.current.stop();
      setIsAudioEnabled(false);
    } else {
      // Must trigger within user gesture to bypass Chrome audio protection block
      await synthRef.current.play();
      synthRef.current.setSection(activeSectionIndex);
      setIsAudioEnabled(true);
    }
  };

  // Milestone Click scrolling trigger
  const handleMilestoneClick = (index: number) => {
    const sections = ["hero-parallax-container", "landmark-forest", "landmark-fjord", "landmark-origin"];
    const targetElement = document.getElementById(sections[index]);
    
    if (targetElement) {
      // Use standard native smooth scroll to target layout
      targetElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentTheme = SECTIONS[activeSectionIndex].theme;

  return (
    <div
      className={`relative min-h-screen text-white select-none transition-colors duration-1000 ${currentTheme.bg}`}
      style={{
        // Define global variables dynamically for beautiful cinematic color variables morphing
        transition: "background-color 1.2s cubic-bezier(0.2, 0.8, 0.2, 1)",
      }}
    >
      {/* 1. Fine Custom Contextual Cursor (Desktop only) */}
      <CustomCursor />

      {/* 2. Side Intricate Path Scroll Progress timeline */}
      <SVGScrollProgress
        scrollProgress={scrollProgress}
        activeSectionIndex={activeSectionIndex}
        onMilestoneClick={handleMilestoneClick}
      />

      {/* 3. Global Top Ambient HUD (Minimal system details) */}
      <header className="fixed top-6 left-6 right-6 md:left-10 md:right-10 z-30 flex justify-between items-center mix-blend-difference pointer-events-none">
        {/* Branding */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <span className="font-sans font-black text-xs md:text-sm tracking-widest text-white uppercase">
            CELESTIAL<span className="font-light text-amber-400">DEPTHS</span>
          </span>
        </div>

        {/* HUD Stats */}
        <div className="hidden md:flex items-center gap-6 font-mono text-[9px] text-white/60 tracking-wider">
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>SPEED: LERPed</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            <Map className="w-3 h-3 text-amber-400" />
            <span className="uppercase">LANDMARK: {SECTIONS[activeSectionIndex].title}</span>
          </div>
        </div>
      </header>

      {/* 4. Core Immersive Content Sections (Modular stack) */}
      <main className="relative w-full overflow-hidden">
        
        {/* SECTION 1: Peak Hero Parallax (2.5D Depth) */}
        <ParallaxHero smoothedScrollY={smoothedScrollY} />

        {/* SECTION 2: Forest Asymmetric Slider */}
        <AsymmetricScroll smoothedScrollY={smoothedScrollY} />

        {/* SECTION 3: Glacier Fjord Curtain Revealer */}
        <CurtainReveal smoothedScrollY={smoothedScrollY} />

        {/* SECTION 4: Foundation Core Footer */}
        <ParallaxFooter
          onScrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          activeSectionIndex={activeSectionIndex}
        />

      </main>

      {/* 5. Minimal FLOATING Space Synth Audio Toggle Module (Bottom-right) */}
      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-40">
        <button
          id="global-audio-toggle"
          onClick={handleToggleAudio}
          className={`flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full border transition-all duration-500 shadow-2xl focus:outline-none focus:ring-1 focus:ring-white/20 hover:scale-105 active:scale-95 ${
            isAudioEnabled
              ? "bg-[#f43f5e] border-[#fda4af] text-white shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              : "bg-slate-900/80 backdrop-blur-md border-white/10 text-white/50 hover:border-white/20 hover:text-white"
          }`}
          title={isAudioEnabled ? "Mute Cosmic Drone" : "Listen to Cosmic Synthesizer"}
          data-cursor="sound-toggle"
        >
          {/* Pulsing sound waves indicator */}
          <div className="flex gap-0.5 items-end justify-center w-4 h-4 overflow-hidden">
            {isAudioEnabled ? (
              <>
                <span className="w-[3px] h-3 bg-white rounded-full animate-pulse-bar" style={{ animationDelay: "0.1s" }} />
                <span className="w-[3px] h-4 bg-white rounded-full animate-pulse-bar" style={{ animationDelay: "0.4s" }} />
                <span className="w-[3px] h-2.5 bg-white rounded-full animate-pulse-bar" style={{ animationDelay: "0.7s" }} />
                <span className="w-[3px] h-3.5 bg-white rounded-full animate-pulse-bar" style={{ animationDelay: "0.2s" }} />
              </>
            ) : (
              <>
                <span className="w-[3px] h-1 bg-white/40 rounded-full" />
                <span className="w-[3px] h-1.5 bg-white/40 rounded-full" />
                <span className="w-[3px] h-1 bg-white/40 rounded-full" />
                <span className="w-[3px] h-1 bg-white/40 rounded-full" />
              </>
            )}
          </div>

          <span className="text-[10px] uppercase font-mono tracking-widest font-semibold">
            {isAudioEnabled ? "Drone pad active" : "Enable Sound"}
          </span>

          {/* Icon */}
          <div className="border-l border-white/10 pl-2">
            {isAudioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </div>
        </button>
      </div>
    </div>
  );
}
