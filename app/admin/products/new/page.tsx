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
    <div className="card-soft p-6">
      <h1 className="text-2xl font-bold mb-2">Add New Product</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Fill the details and upload at least one image. Large buttons are mobile-friendly.
      </p>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-semibold">Product Name</label>
          <input
            name="name"
            placeholder="e.g. Designer Saree"
            className="w-full rounded-xl border border-pink-200 px-3 py-3"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Price (INR)</label>
          <input
            name="price"
            type="number"
            placeholder="e.g. 1499"
            className="w-full rounded-xl border border-pink-200 px-3 py-3"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Description</label>
          <textarea
            name="description"
            placeholder="Write product details, fabric, sizes, colors..."
            className="w-full rounded-xl border border-pink-200 px-3 py-3 min-h-[140px]"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold">Category (optional)</label>
          <input
            name="category"
            placeholder="Sarees / Kurtis / Party Wear"
            className="w-full rounded-xl border border-pink-200 px-3 py-3"
          />
        </div>
        <label className="flex items-center gap-3 text-sm font-semibold">
          <input name="inStock" type="checkbox" defaultChecked className="h-4 w-4" />
          In Stock
        </label>
        <ImageUploader value={images} onChange={setImages} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          disabled={loading}
          className="w-full rounded-xl bg-brand-600 text-white px-4 py-3 text-base font-semibold"
        >
          {loading ? "Saving..." : "Create Product"}
        </button>
      </form>
    </div>
  );
}
