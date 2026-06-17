"use client";

import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import { useState } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  value: string[];
  onChange: Dispatch<SetStateAction<string[]>>;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const results = await Promise.all(
      Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
          credentials: "same-origin"
        });
        if (!res.ok) {
          const payload = await res.json().catch(() => null);
          setError(payload?.error || "Image upload failed. Please try again.");
          return null;
        }
        const data = (await res.json()) as { url: string };
        return data.url;
      })
    );
    const uploaded = results.filter((url): url is string => Boolean(url));
    if (uploaded.length > 0) {
      onChange((current) => [...current, ...uploaded]);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    setUploading(false);
  };

  const removeImage = (url: string) => {
    onChange((current) => current.filter((item) => item !== url));
  };

  return (
    <div className="space-y-3 border border-[var(--line)] bg-cream-50 p-4 dark:bg-[var(--surface-muted)]">
      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-neutral-700 dark:text-neutral-300">
        Product Images
      </label>
      <p className="text-xs text-neutral-500">
        Select multiple images together or upload again later. First image becomes the main photo.
      </p>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        disabled={uploading}
        className="input-soft"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
        <span>{value.length} image{value.length === 1 ? "" : "s"} added</span>
        <span>Max 5MB each</span>
      </div>
      {uploading && <p className="text-sm text-neutral-500">Uploading images...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {value.map((url, index) => (
          <div
            key={url}
            className="relative h-20 w-20 overflow-hidden border border-[var(--line)]"
          >
            <Image src={url} alt="Uploaded" fill className="object-cover" />
            <span className="absolute left-1 top-1 bg-white/90 px-1.5 py-0.5 text-[10px] font-semibold text-neutral-800">
              {index === 0 ? "Main" : index + 1}
            </span>
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-1 top-1 bg-black/70 px-1.5 py-0.5 text-[10px] font-semibold text-white"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
