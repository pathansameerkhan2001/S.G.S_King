/**
 * Re-mounts on every navigation, giving each page a short, subtle entrance
 * (CSS only, skipped for reduced-motion users; content is never hidden).
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-[page-in_0.35s_ease-out]">{children}</div>;
}
