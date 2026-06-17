"use client";

import { useState } from "react";
import Link from "next/link";

type MobileMenuProps = {
  shopName: string;
  whatsappNumber: string;
  categories: string[];
};

export default function MobileMenu({
  shopName,
  whatsappNumber,
  categories
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const wa = whatsappNumber.replace(/[^\d]/g, "");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-sm border border-[var(--line)] lg:hidden"
        aria-label="Open menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-lift dark:bg-[var(--surface)]">
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <p className="font-display text-lg font-medium text-brand-700">{shopName}</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-[var(--line)]"
                aria-label="Close menu"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-1">
                {[
                  { href: "/", label: "Home" },
                  { href: "/products", label: "All Products" },
                  { href: "/about", label: "About Us" }
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-[var(--line)] py-3 text-sm font-medium uppercase tracking-[0.1em] text-neutral-800 dark:text-neutral-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              {categories.length > 0 && (
                <div className="mt-6">
                  <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                    Shop by Category
                  </p>
                  <div className="space-y-1">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        href={`/products?category=${encodeURIComponent(cat)}`}
                        onClick={() => setOpen(false)}
                        className="block py-2 text-sm text-neutral-700 dark:text-neutral-300"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </nav>
            <div className="border-t border-[var(--line)] p-5">
              <a href={`https://wa.me/${wa}`} className="btn-whatsapp w-full">
                Order on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
