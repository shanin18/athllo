"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export function HeroMedia({
  src,
  video,
  alt = "",
  opacity = 30,
}: {
  src: string;
  video?: string;
  alt?: string;
  opacity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(!video);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    function onScroll() {
      const el = ref.current;
      if (!el) return;
      const rect = el.parentElement?.getBoundingClientRect();
      if (!rect) return;
      const offset = Math.max(-40, Math.min(40, rect.top * -0.08));
      el.style.transform = `translateY(${offset}px)`;
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!video || !ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [video]);

  return (
    <>
      <div ref={ref} className="absolute inset-0 will-change-transform">
        {video ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              priority
              sizes="100vw"
              className="object-cover transition-opacity duration-700"
              style={{ opacity: ready ? 0 : opacity / 100 }}
            />
            {inView && (
              <video
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                onPlaying={() => setReady(true)}
                className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
                style={{ opacity: ready ? opacity / 100 : 0 }}
              >
                <source src={video} type="video/mp4" />
              </video>
            )}
          </>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority
            sizes="100vw"
            className="animate-ken-burns object-cover"
            style={{ opacity: opacity / 100 }}
          />
        )}
      </div>
      <div
        aria-hidden
        className="absolute -left-24 top-10 h-72 w-72 animate-blob-drift rounded-full bg-brand/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-16 bottom-0 h-80 w-80 animate-blob-drift rounded-full bg-energy/20 blur-3xl [animation-delay:3s]"
      />
    </>
  );
}
