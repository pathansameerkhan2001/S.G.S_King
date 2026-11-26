"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = { children: ReactNode; delay?: number; as?: "div" | "li"; className?: string };

/** Gentle fade-up when scrolled into view (respects reduced motion via MotionConfig). */
export function Reveal({ children, delay = 0, as = "div", className }: RevealProps) {
  const Tag = as === "li" ? motion.li : motion.div;
  return (
    <Tag
      initial={{ opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Tag>
  );
}
