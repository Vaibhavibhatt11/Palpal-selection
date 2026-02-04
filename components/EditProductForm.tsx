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
        <label className="text-sm font-semibold">Product Name</label>
        <input
          name="name"
          defaultValue={initial.name}
          placeholder="Product name"
          className="w-full rounded-xl border border-pink-200 px-3 py-3"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Price (INR)</label>
        <input
          name="price"
          type="number"
          defaultValue={initial.price}
          placeholder="Price (INR)"
          className="w-full rounded-xl border border-pink-200 px-3 py-3"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Description</label>
        <textarea
          name="description"
          defaultValue={initial.description}
          placeholder="Description"
          className="w-full rounded-xl border border-pink-200 px-3 py-3 min-h-[140px]"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Category (optional)</label>
        <input
          name="category"
          defaultValue={initial.category || ""}
          placeholder="Category (optional)"
          className="w-full rounded-xl border border-pink-200 px-3 py-3"
        />
      </div>
      <label className="flex items-center gap-3 text-sm font-semibold">
        <input
          name="inStock"
          type="checkbox"
          defaultChecked={initial.inStock}
          className="h-4 w-4"
        />
        In Stock
      </label>
      <ImageUploader value={images} onChange={setImages} />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <div className="flex gap-3 flex-wrap">
        <button
          disabled={loading}
          className="rounded-xl bg-brand-600 text-white px-4 py-3 text-base font-semibold flex-1"
        >
          {loading ? "Saving..." : "Update Product"}
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="rounded-xl border border-red-200 text-red-600 px-4 py-3 text-base font-semibold flex-1"
        >
          Delete
        </button>
      </div>
    </form>
  );
}
