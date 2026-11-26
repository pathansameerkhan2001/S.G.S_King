import { discountPercent, type Product } from "@/content/products";
import { formatPrice } from "@/lib/format";

export function ProductPrice({ product }: { product: Pick<Product, "price" | "mrp"> }) {
  const discount = discountPercent(product);

  return (
    <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="font-display text-[1.25rem] font-bold leading-none text-burgundy sm:text-[1.45rem]">
        <span className="sr-only">Price </span>
        {formatPrice(product.price)}
      </span>
      {discount !== null && product.mrp && (
        <>
          <span className="font-display text-[0.95rem] leading-none text-umber/80 line-through decoration-umber/60 sm:text-[1.05rem]">
            <span className="sr-only">Original price </span>
            {formatPrice(product.mrp)}
          </span>
          <span className="font-sans text-[0.7rem] font-bold uppercase leading-none tracking-wide text-[#2f7a3d] sm:text-xs">
            {discount}% off
          </span>
        </>
      )}
    </p>
  );
}
