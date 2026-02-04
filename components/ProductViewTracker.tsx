"use client";

import { useEffect } from "react";

export default function ProductViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch(`/api/products/slug/${slug}/view`, { method: "POST" }).catch(() => null);
  }, [slug]);
  return null;
}
