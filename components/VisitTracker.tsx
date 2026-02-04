"use client";

import { useEffect } from "react";

export default function VisitTracker() {
  useEffect(() => {
    fetch("/api/track", { method: "POST" }).catch(() => null);
  }, []);

  return null;
}
