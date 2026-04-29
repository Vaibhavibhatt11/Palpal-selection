"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "../lib/utils";
import { buildWhatsappLink } from "../lib/whatsapp";

type CarouselItem = {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  isNew?: boolean;
};

type CarouselProps = {
  items: CarouselItem[];
  whatsappNumber: string;
  baseUrl: string;
};

export default function Carousel({ items, whatsappNumber, baseUrl }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const speedRef = useRef(380);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<CarouselItem | null>(null);

  useEffect(() => {
    let frame: number;
    let last = performance.now();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const updateSpeed = () => {
      if (prefersReducedMotion) {
        speedRef.current = 0;
        return;
      }
      if (window.innerWidth < 640) {
        speedRef.current = 660;
        return;
      }
      if (window.innerWidth < 1024) {
        speedRef.current = 500;
        return;
      }
      speedRef.current = 380;
    };

    updateSpeed();
    window.addEventListener("resize", updateSpeed);

    const tick = (now: number) => {
      const container = containerRef.current;
      const delta = now - last;
      last = now;
      if (container && !paused && items.length > 0) {
        const speed = speedRef.current;
        container.scrollLeft += (speed * delta) / 1000;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateSpeed);
    };
  }, [paused, items.length]);

  const showSkeleton = items.length === 0;

  const doubled = [...items, ...items];

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
      onPointerDown={() => setPaused(true)}
      onPointerUp={() => setPaused(false)}
    >
      <div
        ref={containerRef}
        className="fade-edges flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide py-2"
      >
        {showSkeleton
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-${idx}`}
                className="min-w-[240px] animate-pulse overflow-hidden rounded-3xl border border-white/70 bg-white/70 shadow-soft dark:border-white/10 dark:bg-white/10"
              >
                <div className="h-40 bg-pink-100/60 dark:bg-white/10" />
                <div className="p-4 space-y-2">
                  <div className="h-4 rounded-full bg-pink-100/60 dark:bg-white/10" />
                  <div className="h-3 w-1/2 rounded-full bg-pink-100/60 dark:bg-white/10" />
                </div>
              </div>
            ))
          : doubled.map((item, idx) => (
              <motion.div
                key={`${item.id}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="min-w-[250px] overflow-hidden rounded-3xl border border-white/70 bg-white/75 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-brand-200/70 dark:border-white/10 dark:bg-white/10"
              >
                <button
                  type="button"
                  onClick={() => setActive(item)}
                  className="w-full text-left"
                >
                  <div className="relative h-44">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition duration-500 hover:scale-105"
                      sizes="240px"
                    />
                    {item.isNew && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white shadow-soft">
                        New
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-bold text-neutral-950 dark:text-white">
                      {item.name}
                    </p>
                    <p className="text-xs font-semibold text-brand-700 dark:text-brand-200">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </button>
              </motion.div>
            ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[var(--page-bg)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[var(--page-bg)] to-transparent" />

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div
            className="card-soft relative w-full max-w-xl p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-4 py-2 text-sm font-bold text-white"
            >
              Close
            </button>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white dark:bg-neutral-950">
              <Image
                src={active.image}
                alt={active.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-lg font-bold text-neutral-950 dark:text-white">{active.name}</p>
              <p className="text-sm font-semibold text-brand-700 dark:text-brand-200">
                {formatCurrency(active.price)}
              </p>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/products/${active.slug}`}
                  className="btn-secondary px-4 py-2"
                >
                  View Details
                </Link>
                <a
                  href={buildWhatsappLink(
                    whatsappNumber,
                    active.name,
                    formatCurrency(active.price),
                    `${baseUrl}/products/${active.slug}`
                  )}
                  className="btn-primary px-4 py-2"
                >
                  Order on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
