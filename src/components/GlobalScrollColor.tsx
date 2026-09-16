"use client";

import { useScroll, useTransform, useMotionValueEvent } from "framer-motion";

export function GlobalScrollColor() {
  const { scrollYProgress } = useScroll();
  
  // Luxury medium jewel tones (No blue, no black, no white, no gold)
  // We cycle through Crimson -> Deep Purple -> Emerald -> Rich Rust
  const color1 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#991B1B", "#7E22CE", "#0F766E", "#B45309", "#991B1B"] 
  );
  
  const color2 = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#7F1D1D", "#6B21A8", "#115E59", "#92400E", "#7F1D1D"] 
  );

  useMotionValueEvent(color1, "change", (latest) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--foreground", latest);
      document.documentElement.style.setProperty("--color-charcoal", latest);
    }
  });
  
  useMotionValueEvent(color2, "change", (latest) => {
    if (typeof document !== "undefined") {
      document.documentElement.style.setProperty("--color-soft-charcoal", latest);
    }
  });

  return null;
}
