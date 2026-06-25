/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ColorTheme {
  bg: string;       // Tailwind background class
  text: string;     // Tailwind text class
  accent: string;   // Tailwind accent class/HEX
  primary: string;  // Hex value for custom transitions
  secondary: string;// Hex value for custom transitions
}

export interface SectionContent {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  coordinates: string;
  theme: ColorTheme;
}

export const SECTIONS: SectionContent[] = [
  {
    id: "peak",
    title: "The Celestial Summit",
    subtitle: "Aether altitude 4,800m",
    description: "Where the atmosphere thins and the stars burn with pristine clarity. High above the veil of clouds, the celestial sphere is within touch.",
    coordinates: "45.109° N, 6.827° E",
    theme: {
      bg: "bg-[#020617]",
      text: "text-slate-100",
      accent: "text-amber-400",
      primary: "#020617", // slate-950/midnight
      secondary: "#f59e0b", // amber accent
    },
  },
  {
    id: "forest",
    title: "The Sylvan Shallows",
    subtitle: "Ridge depth 2,400m",
    description: "Descend into the ancient pine canopies. Here, giant sequoias capture the morning mountain mist, and whispers of old growth echo through the timber.",
    coordinates: "45.105° N, 6.834° E",
    theme: {
      bg: "bg-[#042f2e]",
      text: "text-teal-50",
      accent: "text-emerald-400",
      primary: "#042f2e", // deep emerald green
      secondary: "#10b981", // emerald accent
    },
  },
  {
    id: "fjord",
    title: "The Crystal Fjord",
    subtitle: "Basin floor 120m",
    description: "A sheer glacier-carved valley reflecting the emerald cliffs. Submerged echoes travel through pure mountain runoff, mirroring the heavens above.",
    coordinates: "45.101° N, 6.841° E",
    theme: {
      bg: "bg-[#083344]",
      text: "text-cyan-100",
      accent: "text-cyan-400",
      primary: "#083344", // deep cyan
      secondary: "#06b6d4", // cyan accent
    },
  },
  {
    id: "origin",
    title: "The Heartwood Core",
    subtitle: "Ground equilibrium",
    description: "The journey settles where roots interlace with deep crystalline stone. A foundational baseline to rest, reflect, and prepare for the next ascent.",
    coordinates: "45.097° N, 6.848° E",
    theme: {
      bg: "bg-[#18080f]",
      text: "text-neutral-100",
      accent: "text-rose-400",
      primary: "#18080f", // deep warm rose quartz
      secondary: "#f43f5e", // rose accent
    },
  },
];
