/** A handful of tiny drifting gold particles. Desktop only, motion-safe only. */
const PARTICLES = [
  { left: "8%", top: "30%", size: 4, delay: "0s", duration: "9s" },
  { left: "22%", top: "70%", size: 3, delay: "1.5s", duration: "11s" },
  { left: "41%", top: "18%", size: 3, delay: "3s", duration: "10s" },
  { left: "63%", top: "62%", size: 4, delay: "0.8s", duration: "12s" },
  { left: "78%", top: "26%", size: 3, delay: "2.2s", duration: "9.5s" },
  { left: "90%", top: "58%", size: 4, delay: "4s", duration: "13s" },
];

export function GoldParticles() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden motion-safe:md:block">
      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full bg-gold shadow-[0_0_8px_rgba(199,149,67,0.8)]"
          style={{
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            animation: `particle-float ${p.duration} ease-in-out ${p.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}
