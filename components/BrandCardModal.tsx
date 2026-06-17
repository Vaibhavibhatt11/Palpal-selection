"use client";

import { useState } from "react";
import Image from "next/image";

export default function BrandCardModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="absolute -bottom-6 left-4 right-4 flex items-center gap-4 border border-[var(--line)] bg-white p-4 text-left shadow-lift transition hover:shadow-card dark:bg-[var(--surface)]"
      >
        <div className="relative h-16 w-24 overflow-hidden rounded-sm border border-[var(--line)] bg-white">
          <Image
            src="/brand/logo-card.jpg"
            alt="PALPAL Selection card"
            fill
            className="object-contain p-2"
          />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-700">PALPAL Selection</p>
          <p className="text-xs text-neutral-500">Tap to view card</p>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          <div
            className="card-soft relative w-full max-w-2xl p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/80 px-4 py-2 text-sm font-bold text-white"
            >
              Close
            </button>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white dark:bg-neutral-950">
              <Image
                src="/brand/logo-card.jpg"
                alt="PALPAL Selection card full view"
                fill
                className="object-contain p-2"
              />
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-primary mt-4 w-full py-3"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
