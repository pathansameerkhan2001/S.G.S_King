/** Column heading with the small gold rule-and-diamond underline from the reference. */
export function FooterHeading({ id, children }: { id: string; children: string }) {
  return (
    <div className="mb-4 lg:mb-5">
      <h2 id={id} className="font-display text-[1.6rem] font-bold leading-tight text-burgundy xl:text-[1.85rem]">
        {children}
      </h2>
      <div aria-hidden="true" className="mt-2 flex items-center gap-1.5">
        <span className="h-px w-14 bg-gradient-to-r from-gold/0 to-gold" />
        <span className="size-1.5 rotate-45 bg-gold" />
        <span className="h-px w-20 bg-gradient-to-r from-gold to-gold/0" />
      </div>
    </div>
  );
}
