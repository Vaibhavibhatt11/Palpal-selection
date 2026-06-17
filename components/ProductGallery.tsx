"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "../lib/utils";
import { buildWhatsappLink } from "../lib/whatsapp";

type ProductGalleryProps = {
  images: string[];
  name: string;
};

export default function ProductGallery({ images, name }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] || images[0];

  if (!active) return null;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-cream-100">
        <Image
          src={active}
          alt={name}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={img}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-20 w-16 shrink-0 overflow-hidden border-2 transition ${
                i === activeIndex
                  ? "border-brand-700"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`${name} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

type StickyWhatsAppProps = {
  whatsappLink: string;
  price: string;
  inStock: boolean;
};

export function StickyWhatsAppBar({ whatsappLink, price, inStock }: StickyWhatsAppProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--line)] bg-white/95 p-3 backdrop-blur-sm lg:hidden dark:bg-[var(--surface)]/95">
      <div className="container-shell flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-neutral-500">Sale price</p>
          <p className="text-lg font-semibold text-brand-700 dark:text-brand-300">{price}</p>
        </div>
        <a
          href={whatsappLink}
          className={`btn-whatsapp shrink-0 px-5 py-3 ${!inStock ? "opacity-60" : ""}`}
        >
          Order on WhatsApp
        </a>
      </div>
    </div>
  );
}

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

export function ProductCarousel({ items, whatsappNumber, baseUrl }: CarouselProps) {
  const [active, setActive] = useState<CarouselItem | null>(null);

  if (items.length === 0) {
    return (
      <div className="product-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-cream-200" />
            <div className="mt-3 h-4 w-3/4 bg-cream-200" />
            <div className="mt-2 h-4 w-1/3 bg-cream-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="product-grid">
        {items.map((item) => (
          <article key={item.id} className="group">
            <Link href={`/products/${item.slug}`} className="block">
              <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {item.isNew && (
                  <span className="badge-new absolute left-2 top-2">New In</span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setActive(item);
                  }}
                  className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-sm bg-white/90 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-neutral-900 opacity-0 shadow-card transition group-hover:opacity-100"
                >
                  Quick View
                </button>
              </div>
              <div className="mt-3 space-y-1">
                <h3 className="line-clamp-2 text-xs font-medium uppercase tracking-wide text-neutral-800 dark:text-neutral-200">
                  {item.name}
                </h3>
                <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                  {formatCurrency(item.price)}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-0 sm:items-center sm:p-4"
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-lg bg-white p-5 sm:rounded-sm dark:bg-[var(--surface)]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute right-4 top-4 text-sm font-medium text-neutral-500"
            >
              ✕
            </button>
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-cream-100">
              <Image src={active.image} alt={active.name} fill className="object-cover" />
            </div>
            <div className="mt-4 space-y-3">
              <p className="text-sm font-medium uppercase tracking-wide">{active.name}</p>
              <p className="text-lg font-semibold text-brand-700 dark:text-brand-300">
                {formatCurrency(active.price)}
              </p>
              <div className="flex gap-2">
                <Link href={`/products/${active.slug}`} className="btn-secondary flex-1 py-2.5">
                  View Details
                </Link>
                <a
                  href={buildWhatsappLink(
                    whatsappNumber,
                    active.name,
                    formatCurrency(active.price),
                    `${baseUrl}/products/${active.slug}`
                  )}
                  className="btn-whatsapp flex-1 py-2.5"
                >
                  Order
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
