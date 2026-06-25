/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SECTIONS } from "../types";
import { Anchor, ArrowUp, Github, Linkedin, MessageSquare, Compass, Send, Check } from "lucide-react";

interface ParallaxFooterProps {
  onScrollToTop: () => void;
  activeSectionIndex: number;
}

export default function ParallaxFooter({ onScrollToTop, activeSectionIndex }: ParallaxFooterProps) {
  const [subscribed, setSubscribed] = useState(false);
  const sectionInfo = SECTIONS[3];

  const summaryCards = [
    { title: "Highest Peak", desc: "4,800m Altitude reached. Celestial star clarity.", value: "98%" },
    { title: "Canopy Depth", desc: "2,400m Pine crowns. High mist saturation.", value: "85%" },
    { title: "Basin Flow", desc: "120m Deep glacier fjord runoff. Pure mirror reflections.", value: "99.9%" },
  ];

  return (
    <footer
      id="landmark-origin"
      className="relative min-h-[100vh] w-full bg-transparent text-neutral-100 flex flex-col justify-between overflow-hidden select-none px-6 md:px-16 lg:px-24 pt-24 pb-12 block"
    >
      {/* Decorative root visual gradients */}
      <div className="absolute left-1/3 bottom-0 w-[45rem] h-[45rem] bg-rose-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute right-0 top-1/4 w-[35rem] h-[35rem] bg-rose-900/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Thin line separating sections */}
      <div className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-cyan-500 to-rose-500 w-full opacity-40" />

      <div className="max-w-7xl mx-auto w-full flex-grow flex flex-col justify-center relative z-10">
        
        {/* =======================================================
            TOP COLUMN: Section Header
            ======================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3 text-rose-400 mb-6">
              <Anchor className="w-5 h-5 animate-spin-slow" />
              <span className="font-mono text-xs tracking-[0.25em] uppercase font-bold">
                {sectionInfo.subtitle}
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white uppercase leading-none">
              The Heartwood <br />
              <span className="bg-gradient-to-r from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent">
                Core Foundation
              </span>
            </h2>

            <p className="mt-6 text-sm sm:text-base text-neutral-400 leading-relaxed font-sans max-w-lg">
              {sectionInfo.description}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              {/* Reset journey button */}
              <button
                id="reset-journey-btn"
                onClick={onScrollToTop}
                className="group flex items-center gap-2 px-6 py-3 bg-white text-slate-950 font-semibold rounded-full hover:bg-rose-400 hover:text-white transition-all duration-300 shadow-lg text-sm tracking-wider uppercase font-mono border border-transparent"
                data-cursor="hover"
              >
                <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
                Reset Descent
              </button>

              <a
                href="#hero-parallax-container"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("landmark-forest")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all duration-300 border border-white/10 text-sm tracking-wider uppercase font-mono"
                data-cursor="hover"
              >
                <Compass className="w-4 h-4 uppercase" />
                Inspect Forest
              </a>
            </div>
          </div>

          {/* =======================================================
              RIGHT COLUMN: Summaries Grid
              ======================================================= */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 lg:pl-12">
            {summaryCards.map((card, idx) => (
              <div
                key={idx}
                className="backdrop-blur-[10px] bg-white/[0.04] border border-white/10 rounded-xl p-6 shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-rose-400/30"
                data-cursor="explore"
                data-cursor-text={`Metric ${idx + 1}`}
              >
                <div className="flex justify-between items-baseline mb-2">
                  <h4 className="text-[11px] font-mono tracking-widest text-neutral-500 uppercase font-semibold">
                    {card.title}
                  </h4>
                  <span className="text-lg font-black font-mono text-rose-400">
                    {card.value}
                  </span>
                </div>
                <p className="text-xs text-neutral-400/80 leading-relaxed">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* =======================================================
            BOTTOM ROW: Brand Grid & Footer Links
            ======================================================= */}
        <div className="border-t border-white/5 mt-24 pt-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-center md:text-left">
          
          {/* Copyright Branding / Meta block */}
          <div className="md:col-span-4 flex flex-col justify-center">
            <div className="font-sans font-black text-lg tracking-tight text-white uppercase select-none">
              CELESTIAL<span className="text-rose-500 font-light">DEPTHS</span>
            </div>
            <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-widest mt-1">
              Reflective Parallax Scrolling System v1.5
            </p>
          </div>

          {/* Social interactive buttons (Slightly expanding/hoverable icons) */}
          <div className="md:col-span-5 flex justify-center gap-4">
            {[
              { icon: Github, href: "https://github.com", label: "Github Repo" },
              { icon: Linkedin, href: "https://linkedin.com", label: "Linkedin Profile" },
              { icon: MessageSquare, href: "info@example.com", label: "Direct Mail" },
            ].map((link, index) => {
              const Icon = link.icon;
              return (
                <a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-neutral-400 hover:bg-rose-500/20 hover:border-rose-400 hover:text-white transition-all duration-300"
                  aria-label={link.label}
                  data-cursor="hover"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>

          {/* Newsletter Input Widget (Sleek text bar) */}
          <div className="md:col-span-3">
            {subscribed ? (
              <div className="flex items-center gap-2 justify-center md:justify-end text-rose-400 text-xs font-mono font-bold animate-pulse">
                <Check className="w-4 h-4" />
                SECURE RECORD SAVED
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubscribed(true);
                }}
                className="flex border border-white/10 rounded-full px-2 py-1.5 bg-neutral-900/60 max-w-xs mx-auto md:ml-auto"
              >
                <input
                  type="email"
                  placeholder="Secure Ascent Logs..."
                  className="bg-transparent border-none text-xs font-mono text-neutral-200 placeholder-neutral-500 focus:outline-none focus:ring-0 pl-3 flex-grow"
                  required
                />
                <button
                  type="submit"
                  className="w-8 h-8 rounded-full bg-rose-500 hover:bg-rose-600 flex items-center justify-center text-white cursor-pointer transition-colors"
                  aria-label="Submit Mail"
                  data-cursor="hover"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

      </div>

      {/* Decorative Ground layer / settling pines roots overlay */}
      <div className="max-w-7xl mx-auto w-full text-center text-[9px] font-mono text-neutral-600 mt-8">
        Designed for Desktop Exploration. Smooth scroll (lerped) is active. Coordinates are synchronized. © {new Date().getFullYear()} Celestial Depths.
      </div>
    </footer>
  );
}
