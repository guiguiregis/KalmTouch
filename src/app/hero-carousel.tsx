"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const slides = [
  {
    src: "/images/hero/hands-mid-1.jpg",
    alt: "Light-skinned African male massage therapist's hands performing deep tissue massage on a client's upper back",
  },
  {
    src: "/images/hero/hands-mid-2.jpg",
    alt: "Light-skinned African male massage therapist's hands applying firm Swedish massage strokes across draped shoulders",
  },
  {
    src: "/images/hero/atmosphere.jpg",
    alt: "Calm massage room with towels, oil, basalt stones, eucalyptus, and candlelight",
  },
] as const;

const INTERVAL_MS = 6000;

export default function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <div className="absolute inset-0 animate-drift">
        {slides.map((slide, index) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === active ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={index !== active}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 right-6 z-20 flex gap-2 md:right-10">
        {slides.map((slide, index) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === active}
            onClick={() => setActive(index)}
            className={`h-1.5 rounded-full transition-all ${
              index === active
                ? "w-6 bg-white"
                : "w-1.5 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </>
  );
}
