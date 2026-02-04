"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatCurrency } from "../lib/utils";

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
};

export default function Carousel({ items }: CarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let frame: number;
    let last = performance.now();
    const speed = 220; // px per second

    const tick = (now: number) => {
      const container = containerRef.current;
      const delta = now - last;
      last = now;
      if (container && !paused && items.length > 0) {
        container.scrollLeft += (speed * delta) / 1000;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
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
                className="min-w-[240px] rounded-3xl bg-white border border-pink-100 shadow-soft overflow-hidden animate-pulse"
              >
                <div className="h-36 bg-pink-100/60" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-pink-100/60 rounded-full" />
                  <div className="h-3 bg-pink-100/60 rounded-full w-1/2" />
                </div>
              </div>
            ))
          : doubled.map((item, idx) => (
              <motion.div
                key={`${item.id}-${idx}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="min-w-[240px] bg-white rounded-3xl shadow-soft border border-pink-100 overflow-hidden hover:-translate-y-1 transition-transform"
              >
                <Link href={`/products/${item.slug}`}>
                  <div className="relative h-36">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                    {item.isNew && (
                      <span className="absolute left-3 top-3 rounded-full bg-brand-600 text-white text-xs px-2.5 py-1">
                        New
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm font-semibold text-neutral-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-[#fff3f8] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-[#fff3f8] to-transparent" />
    </div>
  );
}
