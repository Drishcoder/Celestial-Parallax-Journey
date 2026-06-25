/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from "react";
import { SECTIONS } from "../types";
import { Compass, Waves, Layers, ShieldCheck, Thermometer } from "lucide-react";

interface CurtainRevealProps {
  smoothedScrollY: number;
}

export default function CurtainReveal({ smoothedScrollY }: CurtainRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentStats, setParentStats] = useState({ top: 0, height: 1000 });
  const sectionInfo = SECTIONS[2];

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setParentStats({
          top: containerRef.current.offsetTop,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    // Delay slightly to allow full content styling rendering first
    const timer = setTimeout(handleResize, 100);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Compute scroll progress strictly within this 200vh container
  // Formula: relative scroll offset divided by scrolling track range (containerHeight)
  const relativeScroll = smoothedScrollY - parentStats.top;
  const scrollRange = parentStats.height - (typeof window !== "undefined" ? window.innerHeight : 800);
  
  // Clamp progress between 0 and 1
  const progress = Math.min(1, Math.max(0, relativeScroll / scrollRange));

  // Curtain transition values
  // A clean 'wipe' effect where the bottom photo clips upward over the dark teal base
  const clipPercentage = (1 - progress) * 100; // 100% (hidden) down to 0% (revealed)
  const curtainOpacity = Math.min(1, progress * 1.5);
  const textYOffset = (1 - progress) * 50;

  return (
    <div
      ref={containerRef}
      id="landmark-fjord"
      className="relative h-[200vh] w-full"
    >
      {/* Stick Viewport Content (Lock inside view while scrolling through track) */}
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden flex flex-col justify-center bg-transparent select-none">
        
        {/* =======================================================
            BASE LAYER: Cyan/Green Depth Under-Curtain
            ======================================================= */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#042f2e] to-[#083344] flex flex-col justify-center px-6 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto w-full text-center md:text-left">
            <span className="font-mono text-xs text-[#06b6d4] tracking-widest uppercase font-bold block mb-4">
              CRITICAL BASIN LEVEL / ALTITUDE 120M
            </span>
            <h2 className="text-3xl sm:text-5xl font-sans font-black tracking-tight text-teal-100 uppercase sm:leading-none">
              Entering the <br />
              <span className="text-[#06b6d4] relative">
                Sub-Glacier Abyss
                <span className="absolute -bottom-1 left-0 w-full h-1 bg-cyan-400 opacity-30 cursor-pointer" />
              </span>
            </h2>
            <p className="mt-6 text-sm sm:text-base text-teal-200/50 leading-relaxed font-sans max-w-xl">
              As temperatures dive, the water bodies converge behind frozen thresholds. Scroll further to lift the glacial veil and reveal the reflective mirrored reservoir beneath.
            </p>

            {/* Hint element showing scroll progression inside the reveal zone */}
            <div className="mt-8 flex items-center justify-center md:justify-start gap-4">
              <div className="w-16 h-[2px] bg-white/15 relative">
                <div
                  className="absolute left-0 top-0 h-full bg-cyan-400 transition-all duration-75"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 tracking-wider">
                VEIL LIFTED: {Math.round(progress * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* =======================================================
            REVEALING LAYER: The Crystal Fjord (Clips smoothly upwards)
            ======================================================= */}
        <div
          className="absolute inset-0 bg-slate-950 z-10 select-none"
          style={{
            clipPath: `inset(${clipPercentage}% 0px 0px 0px)`,
            WebkitClipPath: `inset(${clipPercentage}% 0px 0px 0px)`,
            willChange: "clip-path, -webkit-clip-path",
          }}
        >
          {/* Fjord background image */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src="/src/assets/images/crystal_glacier_fjord_1782195340160.jpg"
              alt="Glacier fjord landscape"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover scale-105"
            />
            {/* Dark cool tint overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-950 via-slate-950/70 to-slate-950/10" />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/90 to-transparent w-2/3 hidden md:block" />
          </div>

          {/* Revealed Foreground Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-20">
              
              {/* Information text matching the revealed background */}
              <div
                className="lg:col-span-6 flex flex-col justify-center"
                style={{
                  transform: `translate3d(0, ${textYOffset}px, 0)`,
                  opacity: curtainOpacity,
                  willChange: "transform, opacity",
                }}
              >
                <div className="flex items-center gap-3 text-cyan-400 mb-6">
                  <Waves className="w-5 h-5 animate-pulse" />
                  <span className="font-mono text-xs tracking-[0.25em] uppercase font-bold">
                    {sectionInfo.subtitle}
                  </span>
                </div>

                <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white uppercase leading-none">
                  The Crystal <br />
                  <span className="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                    Glacier Fjord
                  </span>
                </h2>

                <p className="mt-6 text-sm sm:text-base text-cyan-100/75 leading-relaxed font-sans max-w-lg">
                  {sectionInfo.description}
                </p>

                {/* Grid coordinates & stats widget */}
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="backdrop-blur-[10px] bg-white/[0.04] border border-white/10 p-4 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-colors hover:border-white/20">
                    <span className="text-[9px] font-mono text-cyan-400 block uppercase font-bold">COORDINATES</span>
                    <p className="text-xs font-mono text-white font-medium mt-1 uppercase">
                      {sectionInfo.coordinates}
                    </p>
                  </div>
                  <div className="backdrop-blur-[10px] bg-white/[0.04] border border-white/10 p-4 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-colors hover:border-white/20">
                    <span className="text-[9px] font-mono text-emerald-400 block uppercase font-bold">WATER PURITY</span>
                    <p className="text-xs font-mono text-white font-medium mt-1">
                      99.997% (TDS 1.2)
                    </p>
                  </div>
                </div>
              </div>

              {/* Revealed graphic panels dashboard (asymmetric content 2) */}
              <div
                className="lg:col-span-6 flex flex-col gap-4"
                style={{
                  transform: `translate3d(0, ${textYOffset * 0.5}px, 0)`,
                  opacity: curtainOpacity,
                  willChange: "transform, opacity",
                }}
              >
                {/* Panel row 1 */}
                <div
                  className="backdrop-blur-[10px] bg-white/[0.04] border border-white/10 p-5 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] hover:border-cyan-400/50 transition-all duration-300 flex gap-4"
                  data-cursor="explore"
                  data-cursor-text="Hydrometry"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Submerged thermal layers
                    </h4>
                    <p className="text-xs text-cyan-200/50 mt-1 leading-relaxed">
                      Dense hyper-purified meltwater currents reside below 45m depths, sustaining a closed microscopic ecological biosphere.
                    </p>
                  </div>
                </div>

                {/* Panel row 2 */}
                <div
                  className="backdrop-blur-[10px] bg-white/[0.04] border border-white/10 p-5 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] hover:border-cyan-400/50 transition-all duration-300 flex gap-4"
                  data-cursor="explore"
                  data-cursor-text="Thermal"
                >
                  <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-[#c2410c] shrink-0">
                    <Thermometer className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Temp Barometer: 2.2°C
                    </h4>
                    <p className="text-xs text-cyan-200/50 mt-1 leading-relaxed">
                      Hyperboric chill maintains oxygen saturation values, reflecting stellar constellations with zero particulate light haze.
                    </p>
                  </div>
                </div>

                {/* Panel row 3 */}
                <div className="backdrop-blur-[10px] bg-white/[0.04] border border-white/10 p-5 rounded-xl shadow-[0_40px_100px_rgba(0,0,0,0.5)] hover:border-white/20 transition-all duration-300 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                      Conservation Protocols
                    </h4>
                    <p className="text-xs text-emerald-200/50 mt-1 leading-relaxed">
                      UNESCO biosphere class-I. Closed motorized vehicle exclusion limits chemical surface turbulence.
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
