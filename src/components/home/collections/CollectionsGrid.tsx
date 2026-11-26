"use client";

import { motion } from "framer-motion";

import { categories } from "@/content/categories";

import { CollectionCard } from "./CollectionCard";

/**
 * Layout:
 * - < md: 2-column grid; an odd final card spans both columns in a
 *   horizontal layout so the last row looks intentional.
 * - ≥ md: centred flex-wrap with 4 cards per row, so a 4 + 3 split keeps
 *   the final row balanced in the middle.
 */
export function CollectionsGrid() {
  const lastIsOdd = categories.length % 2 === 1;

  return (
    <ul className="grid grid-cols-2 gap-3 min-[400px]:gap-4 md:flex md:flex-wrap md:justify-center md:gap-5 xl:gap-7">
      {categories.map((category, index) => {
        const wide = lastIsOdd && index === categories.length - 1;
        return (
          <motion.li
            key={category.slug}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className={[
              "md:w-[calc((100%-3*1.25rem)/4)] xl:w-[calc((100%-3*1.75rem)/4)]",
              wide ? "col-span-2" : "",
            ].join(" ")}
          >
            <CollectionCard category={category} wide={wide} />
          </motion.li>
        );
      })}
    </ul>
  );
}
