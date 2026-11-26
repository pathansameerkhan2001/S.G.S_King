"use client";

import { motion } from "framer-motion";

import { LeafSprig } from "@/components/decor/Ornaments";

/** Gold rule + leaf ornament whose lines extend outward when scrolled into view. */
export function RevealDivider({ className = "" }: { className?: string }) {
  const line = {
    hidden: { scaleX: 0, opacity: 0 },
    show: { scaleX: 1, opacity: 1, transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] as const } },
  };
  return (
    <motion.div
      aria-hidden="true"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
      className={`flex items-center justify-center gap-2.5 ${className}`}
    >
      <motion.span variants={line} className="h-px w-16 origin-right bg-gradient-to-r from-gold/0 to-gold sm:w-24" />
      <LeafSprig className="h-4 w-7 text-gold-deep" />
      <motion.span variants={line} className="h-px w-16 origin-left bg-gradient-to-l from-gold/0 to-gold sm:w-24" />
    </motion.div>
  );
}
