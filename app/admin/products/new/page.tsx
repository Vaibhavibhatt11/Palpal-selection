"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "../../../../components/ImageUploader";

export default function NewProductPage() {
  const router = useRouter();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    if (images.length === 0) {
      setError("Please upload at least one product image.");
      setLoading(false);
      return;
    }
    const form = event.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      price: (form.elements.namedItem("price") as HTMLInputElement).value,
      description: (
        form.elements.namedItem("description") as HTMLTextAreaElement
      ).value,
      category: (form.elements.namedItem("category") as HTMLInputElement).value,
      inStock: (form.elements.namedItem("inStock") as HTMLInputElement).checked,
      images
    };

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "same-origin"
    });
    setLoading(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error || "Failed to create product.");
      return;
    }
    router.push("/admin/products");
  };

  return (
    <div className="border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
      <h1 className="font-display text-3xl font-medium">Add New Product</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Fill the details and upload one or more images for the product gallery.
      </p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Product Name</label>
          <input
            name="name"
            placeholder="e.g. Designer Saree"
            className="input-soft"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Price (INR)</label>
          <input
            name="price"
            type="number"
            placeholder="e.g. 1499"
            className="input-soft"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Description</label>
          <textarea
            name="description"
            placeholder="Write product details, fabric, sizes, colors..."
            className="input-soft min-h-[140px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Category (optional)</label>
          <input
            name="category"
            placeholder="Sarees / Kurtis / Party Wear"
            className="input-soft"
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          <input name="inStock" type="checkbox" defaultChecked className="h-4 w-4 accent-brand-700" />
          In Stock
        </label>
        <ImageUploader value={images} onChange={setImages} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          disabled={loading}
          className="btn-primary w-full"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
