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
        className="card-soft p-4 flex w-full items-center gap-4 hover:border-brand-200 transition"
      >
        <div className="relative h-20 w-28 rounded-2xl overflow-hidden border border-pink-100 bg-white">
          <Image
            src="/brand/logo-card.jpg"
            alt="PALPAL Selection card"
            fill
            className="object-contain p-2"
          />
        </div>
        <div className="text-left">
          <p className="font-semibold text-neutral-900">PALPAL Selection</p>
          <p className="text-xs text-neutral-500">Tap to view the full card</p>
        </div>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl bg-white p-4 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full bg-black/80 text-white px-4 py-2 text-sm font-semibold"
            >
              Close
            </button>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-white">
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
              className="mt-4 w-full rounded-full bg-brand-600 text-white py-3 text-sm font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
