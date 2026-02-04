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
    const uploaded: string[] = [];
    for (const file of Array.from(files)) {
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
        continue;
      }
      const data = (await res.json()) as { url: string };
      uploaded.push(data.url);
    }
    onChange([...value, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (url: string) => {
    onChange(value.filter((item) => item !== url));
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-neutral-700">
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
        className="block w-full rounded-xl border border-pink-200 bg-white px-3 py-3"
      />
      {uploading && <p className="text-sm text-neutral-500">Uploading...</p>}
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3 flex-wrap">
        {value.map((url) => (
          <div
            key={url}
            className="relative h-20 w-20 rounded-xl overflow-hidden border border-pink-100"
          >
            <Image src={url} alt="Uploaded" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded"
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
