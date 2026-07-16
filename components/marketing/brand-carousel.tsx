"use client";

import { useEffect, useState } from "react";

const BRANDS = [
  { name: "Nordkap", mark: "N", color: "#7d92ff" },
  { name: "Velocore", mark: "V", color: "#39e08e" },
  { name: "Aeon Sports", mark: "A", color: "#f0a544" },
  { name: "Fjell & Co", mark: "F", color: "#e0637a" },
  { name: "Ridgeline", mark: "R", color: "#7d92ff" },
  { name: "Summit Athletics", mark: "S", color: "#39e08e" },
  { name: "Torque Energy", mark: "T", color: "#f0a544" },
  { name: "Pulsewear", mark: "P", color: "#e0637a" },
  { name: "Granite Nutrition", mark: "G", color: "#7d92ff" },
  { name: "Vantage Gear", mark: "V", color: "#39e08e" },
];

const PER_SLIDE = 5;
const SLIDES = Array.from({ length: Math.ceil(BRANDS.length / PER_SLIDE) }, (_, i) =>
  BRANDS.slice(i * PER_SLIDE, i * PER_SLIDE + PER_SLIDE)
);

/**
 * Autoplaying logo carousel — a trust-signal strip of the kind of brands
 * the platform is built for.
 */
export function BrandCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % SLIDES.length), 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="container-x py-16 md:py-20">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-muted">
        Trusted by brands like
      </p>
      <div className="relative mt-8 h-16 overflow-hidden">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 flex flex-wrap items-center justify-center gap-x-12 gap-y-4 transition-all duration-700 ease-out"
            style={{
              opacity: active === i ? 1 : 0,
              transform: `translateY(${active === i ? 0 : 12}px)`,
              pointerEvents: active === i ? "auto" : "none",
            }}
          >
            {slide.map((b) => (
              <span
                key={b.name}
                className="flex items-center gap-2.5 opacity-70 transition-opacity hover:opacity-100"
              >
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-lg text-sm font-bold text-white"
                  style={{ backgroundColor: b.color }}
                >
                  {b.mark}
                </span>
                <span className="font-display text-lg font-bold tracking-tight text-ink-soft">
                  {b.name}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Show brand slide ${i + 1}`}
            onClick={() => setActive(i)}
            className={`h-1.5 rounded-full transition-all ${
              active === i ? "w-6 bg-brand" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
