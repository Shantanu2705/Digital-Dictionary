"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, HTMLMotionProps } from "framer-motion";

interface DynamicTextColorProps {
  children: React.ReactNode;
  className?: string;
  as?: any;
}

export function DynamicTextColor({ children, className, as: Component = "div" }: DynamicTextColorProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // We map the scroll progress of this element to a beautiful gradient of deep luxury colors.
  // 0 = just entered viewport, 0.5 = middle, 1 = leaving viewport.
  // We transition between dynamic jewel tones to ensure 
  // perfect contrast without using black, white, gold, or blue.
  const color = useTransform(
    scrollYProgress,
    [0, 0.25, 0.5, 0.75, 1],
    ["#991B1B", "#7E22CE", "#0F766E", "#B45309", "#991B1B"]
  );

  // Safely get the motion component if a string was passed (e.g., "h1" -> motion.h1)
  const MotionComponent = typeof Component === "string" 
    ? (motion as any)[Component] 
    : Component;

  return (
    <MotionComponent ref={ref} style={{ color }} className={className}>
      {children}
    </MotionComponent>
  );
}
