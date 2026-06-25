/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SECTIONS } from "../types";
import { TreePine, Wind, Timer, Compass, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AsymmetricScrollProps {
  smoothedScrollY: number;
}

export default function AsymmetricScroll({ smoothedScrollY }: AsymmetricScrollProps) {
  const [activeTab, setActiveTab] = useState<"grow" | "winds" | "cycles">("grow");
  const sectionInfo = SECTIONS[1];

  // Section 2 starts exactly below Hero (approx 100vh)
  const isClient = typeof window !== "undefined";
  const startOffset = isClient ? window.innerHeight : 900;
  
  // Calculate relative scrolled distance
  const relativeScroll = Math.max(-500, smoothedScrollY - startOffset);

  // Compute differing scroll rates for asymmetric layouts
  const leftTranslateY = relativeScroll * -0.08;   // Clings upward slightly
  const rightTranslateY = relativeScroll * 0.08;   // Drifts downward
  const imageTranslateY = relativeScroll * 0.02;   // Steady midground scroll

  const subfeatures = {
    grow: {
      title: "Giant Sequoias",
      stat: "85m Height",
      text: "Reaching massive heights over millennia, their fibrous red bark acts as a natural armor against elements and flame.",
    },
    winds: {
      title: "Vapor Jetstreams",
      stat: "14 km/h East",
      text: "Heavy drafts guide dense coastal mist up sheer mountain chimneys, cooling the valleys and quenching ancient canopies.",
    },
    cycles: {
      title: "Timber Lifespans",
      stat: "3,200 Years",
      text: "Relying on mutual fungal networks deep in the soil, forests communicate nutrient statuses horizontally across species.",
    },
  };

  return (
    <section
      id="landmark-forest"
      className="relative min-h-[100vh] w-full py-24 px-6 md:px-16 lg:px-24 flex flex-col justify-center overflow-hidden bg-transparent transition-colors duration-1000 select-none pb-32"
    >
      {/* Background visual graphics */}
      <div className="absolute right-0 top-1/4 w-[40rem] h-[40rem] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute left-10 bottom-1/4 w-[30rem] h-[30rem] bg-teal-300/5 rounded-full blur-[110px] pointer-events-none" />
      
      {/* Dynamic altitude baseline indicator */}
      <div className="absolute left-0 top-0 h-1 bg-gradient-to-r from-amber-500 to-emerald-500 w-full opacity-30" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* =======================================================
            LEFT COLUMN (Fades slower or glides upward)
            ======================================================= */}
        <div
          className="lg:col-span-5 flex flex-col justify-center"
          style={{
            transform: `translate3d(0, ${leftTranslateY}px, 0)`,
            willChange: "transform",
          }}
        >
          {/* Section Breadcrumbs */}
          <div className="flex items-center gap-3 text-emerald-400 mb-6">
            <TreePine className="w-5 h-5 animate-pulse" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase font-bold">
              {sectionInfo.subtitle}
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white uppercase leading-none">
            The Sylvan <br />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Shallows
            </span>
          </h2>

          <p className="mt-8 text-base text-teal-100/70 leading-relaxed font-sans max-w-lg">
            {sectionInfo.description}
          </p>

          {/* Interactive tabs widgets inside asymmetric grid */}
          <div className="mt-10 backdrop-blur-[10px] bg-white/[0.05] border border-white/10 rounded-xl p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-colors">
            <div className="flex gap-2 border-b border-white/5 pb-3">
              {(Object.keys(subfeatures) as Array<keyof typeof subfeatures>).map((key) => (
                <button
                  key={key}
                  id={`tab-${key}`}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider uppercase transition-all ${
                    activeTab === key
                      ? "bg-emerald-500 text-slate-950 font-bold"
                      : "text-teal-200/50 hover:text-teal-100"
                  }`}
                  data-cursor="hover"
                >
                  {key}
                </button>
              ))}
            </div>

            <div className="mt-4 relative min-h-[110px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, cubicBezier: [0.16, 1, 0.3, 1] }}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#10b981]">
                    Metric: {subfeatures[activeTab].stat}
                  </span>
                  <h4 className="text-base font-semibold text-white mt-1">
                    {subfeatures[activeTab].title}
                  </h4>
                  <p className="text-xs text-teal-200/60 mt-2 leading-relaxed">
                    {subfeatures[activeTab].text}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* =======================================================
            CENTER COLUMN (Visual Image block with parallax shift)
            ======================================================= */}
        <div
          className="lg:col-span-4 flex justify-center relative my-12 lg:my-0"
          style={{
            transform: `translate3d(0, ${imageTranslateY}px, 0)`,
            willChange: "transform",
          }}
          data-cursor="explore"
          data-cursor-text="Sylvan"
        >
          {/* Visual card backing border frame */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl opacity-30 blur-md transform -rotate-3 scale-105" />

          <div className="relative rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-950 group">
            {/* Real generated high-quality forest image */}
            <img
              src="/src/assets/images/misty_primeval_forest_1782195325670.jpg"
              alt="Primeval misty mountain forest"
              referrerPolicy="no-referrer"
              className="w-full h-[400px] object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            />

            {/* Glowing gradient overlay overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80" />

            {/* Top-left Coordinate Badge */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
              <span className="text-[9px] font-mono text-emerald-300 font-bold tracking-wider">
                {sectionInfo.coordinates}
              </span>
            </div>

            {/* Float overlay details */}
            <div className="absolute bottom-6 left-6 right-6">
              <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-[0.2em] block mb-1">
                RECON METRICS
              </span>
              <h3 className="text-lg font-bold text-white capitalize">
                Primeval Tree Crown canopy
              </h3>
              <p className="text-[11px] text-teal-200/70 mt-1 leading-snug">
                The Sequoia clusters shield the forest floor, preserving 85% relative mist condensation.
              </p>
            </div>
          </div>
        </div>

        {/* =======================================================
            RIGHT COLUMN (Asymmetric slower drift downward)
            ======================================================= */}
        <div
          className="lg:col-span-3 flex flex-col gap-6 lg:pl-4"
          style={{
            transform: `translate3d(0, ${rightTranslateY}px, 0)`,
            willChange: "transform",
          }}
        >
          {/* Micro Information Card 1 */}
          <div className="backdrop-blur-[10px] bg-white/[0.05] border border-white/10 rounded-xl p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-colors hover:border-white/20">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4">
              <Wind className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Oxygen Barometer
            </h4>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-emerald-400">20.9</span>
              <span className="text-[10px] font-mono text-teal-300">% (Saturated)</span>
            </div>
            <p className="text-[11px] text-teal-200/50 mt-1.5 leading-relaxed">
              Elevated synthesis rates are recorded near valleys, ideal for breathing exercises.
            </p>
          </div>

          {/* Micro Information Card 2 */}
          <div className="backdrop-blur-[10px] bg-white/[0.05] border border-white/10 rounded-xl p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-colors hover:border-white/20">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400 mb-4">
              <Timer className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Ascent Panning
            </h4>
            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-2xl font-black text-teal-400">01:45</span>
              <span className="text-[10px] font-mono text-teal-300">Hr Left</span>
            </div>
            <p className="text-[11px] text-teal-200/50 mt-1.5 leading-relaxed">
              Recommended pathing covers rocky ledges with moderate elevation slopes.
            </p>
          </div>
        </div>

      </div>

      {/* Aesthetic geometric curve overlay separating section bottom */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        <svg
          className="fill-[#060814] w-full h-16 transform scale-y-110 translate-y-[2px]"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
        >
          <path d="M0,45 Q360,15 720,45 T1440,45 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
