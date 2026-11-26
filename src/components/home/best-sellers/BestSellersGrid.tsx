"use client";

import { motion } from "framer-motion";

import { BestSellerProductCard } from "@/components/product/BestSellerProductCard";
import type { Product } from "@/content/products";

/** 2 columns on mobile/tablet, 4 from `lg`. Cards stretch to equal heights. */
export function BestSellersGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 min-[400px]:gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-5 xl:gap-7">
      {products.map((product, index) => (
        <motion.li
          key={product.id}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0"
        >
          <BestSellerProductCard product={product} />
        </motion.li>
      ))}
    </ul>
  );
}
