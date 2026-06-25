/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export type CursorType = "default" | "hover" | "explore" | "drag" | "sound-toggle" | "arrow";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [cursorType, setCursorType] = useState<CursorType>("default");
  const [cursorText, setCursorText] = useState("");
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  // Smooth mouse coordinates using spring dynamics from Framer Motion
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 350, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only activate cursor if the device has a precision pointer (Desktop mouse)
    const mediaQuery = window.matchMedia("(pointer: fine)");
    setIsPointerFine(mediaQuery.matches);

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsPointerFine(e.matches);
    };
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  useEffect(() => {
    if (!isPointerFine) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    // Event delegation to detect cursor custom styles by reading data-cursor attributes
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("[data-cursor]") as HTMLElement;
      
      if (interactiveEl) {
        const type = (interactiveEl.getAttribute("data-cursor") || "hover") as CursorType;
        const text = interactiveEl.getAttribute("data-cursor-text") || "";
        setCursorType(type);
        setCursorText(text);
      } else {
        // Fallback checks for standard interactive elements
        const isClickable = target.closest("button, a, input, select, textarea, [role='button']");
        if (isClickable) {
          setCursorType("hover");
          setCursorText("");
        } else {
          setCursorType("default");
          setCursorText("");
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isPointerFine, isVisible, mouseX, mouseY]);

  if (!isPointerFine || !isVisible) return null;

  // Configuration map representing visual states of the custom cursor
  const cursorVariants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      border: "1px solid rgba(255, 255, 255, 0.5)",
    },
    hover: {
      width: 48,
      height: 48,
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      border: "1px solid rgba(255, 255, 255, 0.9)",
    },
    explore: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      border: "1px solid rgba(255, 255, 255, 1)",
    },
    drag: {
      width: 56,
      height: 56,
      backgroundColor: "rgba(245, 158, 11, 0.2)",
      border: "2px solid rgba(245, 158, 11, 0.8)",
    },
    arrow: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(16, 185, 129, 0.2)",
      border: "2px solid rgba(16, 185, 129, 0.9)",
    },
    "sound-toggle": {
      width: 60,
      height: 60,
      backgroundColor: "rgba(244, 63, 94, 0.1)",
      border: "1.5px dashed rgba(244, 63, 94, 0.7)",
    },
  };

  const activeStyles = cursorVariants[cursorType] || cursorVariants.default;

  return (
    <>
      {/* 1. Main outer cursor ring */}
      <motion.div
        id="custom-cursor-ring"
        className="fixed top-0 left-0 pointer-events-none z-50 rounded-full flex items-center justify-center mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          ...activeStyles,
          scale: isClicked ? 0.85 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 28,
          mass: 0.1,
        }}
      >
        {/* Dynamic Inner Text Badge (e.g. "Explore" or "Play") */}
        {cursorType === "explore" && (
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[10px] font-mono tracking-widest text-slate-950 font-bold uppercase"
          >
            {cursorText || "View"}
          </motion.span>
        )}
      </motion.div>

      {/* 2. Precision inner core dot */}
      <motion.div
        id="custom-cursor-dot"
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-amber-400 rounded-full pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isClicked ? 1.4 : cursorType === "default" ? 1 : 0.4,
          backgroundColor:
            cursorType === "explore"
              ? "#10b981"
              : cursorType === "sound-toggle"
              ? "#f43f5e"
              : "#fbbf24",
        }}
        transition={{
          type: "tween",
          ease: "easeOut",
          duration: 0.15,
        }}
      />
    </>
  );
}
