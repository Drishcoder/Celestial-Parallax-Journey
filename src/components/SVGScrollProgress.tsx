/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from "react";
import { SECTIONS } from "../types";
import { Compass, Sparkles, MapPin, Anchor } from "lucide-react";

interface SVGScrollProgressProps {
  scrollProgress: number; // 0 to 1
  activeSectionIndex: number;
  onMilestoneClick: (index: number) => void;
}

export default function SVGScrollProgress({
  scrollProgress,
  activeSectionIndex,
  onMilestoneClick,
}: SVGScrollProgressProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  // Compute actual path length dynamically for precise stroke mapping
  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, []);

  // Winding mountain trail path vector: 40px width, 400px height
  // Starts with sharp angles, transitions to loops, then wave structures, then settles straight.
  const pathData = `
    M 20 10
    L 20 60
    C 38 75, 42 105, 20 120
    C -2 135, 2 165, 20 180
    L 20 230
    Q 35 250, 20 270
    T 20 310
    L 20 390
  `;

  // Positions on the Y-axis representing each landmark (correlated to visual path)
  const milestones = [
    { y: 35, icon: Sparkles, label: "Summit", altitude: "4800m" },
    { y: 150, icon: Compass, label: "Sylvan", altitude: "2400m" },
    { y: 270, icon: MapPin, label: "Fjord", altitude: "120m" },
    { y: 375, icon: Anchor, label: "Core", altitude: "0m" },
  ];

  // Map progress to dash offset
  const strokeDashoffset = pathLength - scrollProgress * pathLength;

  return (
    <div
      id="scroll-tracker-sidebar"
      className="fixed left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center bg-slate-900/40 backdrop-blur-md py-6 px-4 rounded-full border border-white/10 shadow-2xl transition-all duration-500"
    >
      <div className="text-[9px] font-mono tracking-widest text-white/40 uppercase mb-3 rotate-180 writing-mode-vertical">
        ALTITUDE SCROLL
      </div>

      <div className="relative w-10 h-[400px]">
        {/* SVG Path Background and Fill Track */}
        <svg
          width="40"
          height="400"
          viewBox="0 0 40 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0"
        >
          {/* Base Track (Subtle glowing vector trail) */}
          <path
            d={pathData}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Masked Active Fill Line (Draws on scroll) */}
          <path
            ref={pathRef}
            d={pathData}
            stroke="url(#progressGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: pathLength,
              strokeDashoffset: isNaN(strokeDashoffset) ? 0 : strokeDashoffset,
            }}
            className="transition-all duration-75"
          />

          {/* Core gradients for the visual track */}
          <defs>
            <linearGradient id="progressGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#f43f5e" />
            </linearGradient>
          </defs>
        </svg>

        {/* Milestone Trigger Dots */}
        {/* Milestone Trigger Dots */}
        {milestones.map((milestone, idx) => {
          const Icon = milestone.icon;
          const isActive = activeSectionIndex === idx;
          const isPassed = activeSectionIndex >= idx;

          // Milestone theme pairings matching our gorgeous section designs
          const activeSkins = [
            "bg-amber-400 border-amber-300 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.6)]",
            "bg-emerald-400 border-emerald-300 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.6)]",
            "bg-cyan-400 border-cyan-300 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]",
            "bg-rose-400 border-rose-300 text-slate-950 shadow-[0_0_15px_rgba(244,63,94,0.6)]",
          ];
          
          const passedSkins = [
            "bg-slate-950 border-amber-500/80 text-amber-400/80 shadow-[0_0_10px_rgba(245,158,11,0.1)]",
            "bg-slate-950 border-emerald-500/80 text-emerald-400/80 shadow-[0_0_10px_rgba(16,185,129,0.1)]",
            "bg-slate-950 border-cyan-500/80 text-cyan-400/80 shadow-[0_0_10px_rgba(6,182,212,0.1)]",
            "bg-slate-950 border-rose-500/80 text-rose-400/80 shadow-[0_0_10px_rgba(244,63,94,0.1)]",
          ];

          const pings = [
            "border-amber-400/50",
            "border-emerald-400/50",
            "border-cyan-400/50",
            "border-rose-400/50",
          ];

          const labelColors = [
            "text-amber-400",
            "text-emerald-400",
            "text-cyan-400",
            "text-rose-400",
          ];

          return (
            <button
              key={idx}
              id={`milestone-btn-${idx}`}
              onClick={() => onMilestoneClick(idx)}
              className="absolute group left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 focus:outline-none"
              style={{ top: `${milestone.y}px` }}
              aria-label={`Jump to ${SECTIONS[idx].title}`}
              data-cursor="hover"
            >
              {/* Tooltip Label (Expands on hover) */}
              <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-slate-950/90 border border-white/10 px-2.5 py-1 rounded-md shadow-lg pointer-events-none opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 whitespace-nowrap">
                <p className="text-xs font-semibold text-white">
                  {SECTIONS[idx].title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className={`text-[10px] font-mono ${labelColors[idx]} font-bold`}>
                    {milestone.altitude}
                  </span>
                  <span className="text-[8px] font-mono text-white/40 font-semibold uppercase">
                    {milestone.label}
                  </span>
                </div>
              </div>

              {/* Glowing Interactive Landmark Node */}
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-500 scale-100 group-hover:scale-125 ${
                  isActive
                    ? activeSkins[idx]
                    : isPassed
                    ? passedSkins[idx]
                    : "bg-slate-950 border-slate-700 text-slate-500"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Tiny pulsate ring */}
              {isActive && (
                <div className={`absolute -inset-1.5 rounded-full border ${pings[idx]} animate-ping pointer-events-none`} />
              )}
            </button>
          );
        })}
      </div>

      <div className="text-[10px] font-mono text-white/30 mt-3 font-semibold">
        S{activeSectionIndex + 1}
      </div>
    </div>
  );
}
