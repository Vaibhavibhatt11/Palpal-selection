"use client";

import { useState } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  value: string[];
  onChange: (urls: string[]) => void;
};

export default function ImageUploader({ value, onChange }: ImageUploaderProps) {
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
    onChange([...value, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div className="space-y-3 border border-[var(--line)] bg-cream-50 p-4 dark:bg-[var(--surface-muted)]">
      <label className="block text-xs font-semibold uppercase tracking-[0.1em] text-neutral-700 dark:text-neutral-300">
        Product Images
      </label>
      <p className="text-xs text-neutral-500">
        Upload 1 or more images (max 5MB each). First image becomes the main photo.
      </p>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFiles(e.target.files)}
        className="input-soft"
      />
      {uploading && <p className="text-sm text-neutral-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-3">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-20 w-20 overflow-hidden border border-[var(--line)]"
          >
            <Image src={url} alt="Uploaded" fill className="object-cover" />
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
