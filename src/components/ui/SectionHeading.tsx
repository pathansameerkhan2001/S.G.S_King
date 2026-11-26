import { RevealDivider } from "@/components/heritage/RevealDivider";

type SectionHeadingProps = {
  id: string;
  title: string;
  eyebrow?: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h2" | "h3";
};

/** Consistent heritage-styled section heading for inner pages. */
export function SectionHeading({ id, title, eyebrow, subtitle, align = "center", as: Tag = "h2" }: SectionHeadingProps) {
  const center = align === "center";
  return (
    <header className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      {eyebrow && (
        <p className="font-sans text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-umber sm:text-xs">{eyebrow}</p>
      )}
      <Tag id={id} className="mt-2 text-balance font-display text-[1.9rem] font-bold leading-tight text-burgundy sm:text-[2.4rem]">
        {title}
      </Tag>
      {subtitle && <p className="mt-2 text-pretty font-display text-[1.08rem] italic text-umber sm:text-[1.2rem]">{subtitle}</p>}
      {center && <RevealDivider className="mt-4" />}
    </header>
  );
}
