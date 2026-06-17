"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader from "./ImageUploader";

type ProductFormProps = {
  id: string;
  initial: {
    name: string;
    price: number;
    description: string;
    category: string | null;
    inStock: boolean;
    images: string[];
  };
};

export default function EditProductForm({ id, initial }: ProductFormProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial.images);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    if (images.length === 0) {
      setError("Please keep at least one product image.");
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

    const res = await fetch(`/api/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      credentials: "same-origin"
    });
    setLoading(false);
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error || "Failed to update product.");
      return;
    }
    router.push("/admin/products");
  };

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
      credentials: "same-origin"
    });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      setError(payload?.error || "Failed to delete product.");
      return;
    }
    router.push("/admin/products");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Product Name</label>
        <input
          name="name"
          defaultValue={initial.name}
          placeholder="Product name"
          className="input-soft"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Price (INR)</label>
        <input
          name="price"
          type="number"
          defaultValue={initial.price}
          placeholder="Price (INR)"
          className="input-soft"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Description</label>
        <textarea
          name="description"
          defaultValue={initial.description}
          placeholder="Description"
          className="input-soft min-h-[140px]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-600">Category (optional)</label>
        <input
          name="category"
          defaultValue={initial.category || ""}
          placeholder="Category (optional)"
          className="input-soft"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        <input
          name="inStock"
          type="checkbox"
          defaultChecked={initial.inStock}
          className="h-4 w-4 accent-brand-700"
        />
        In Stock
      </label>
      <ImageUploader value={images} onChange={setImages} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex flex-wrap gap-3">
        <button
          disabled={loading}
          className="btn-primary flex-1"
        >
          {loading ? "Saving..." : "Update Product"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex flex-1 items-center justify-center border border-red-300 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-red-600 transition hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
