import Link from "next/link";
import type { Product } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { formatCurrency, withTimeout } from "../../../lib/utils";

export default async function AdminProductsPage() {
  let products: Product[] = [];
  try {
    products = await withTimeout(
      prisma.product.findMany({
        orderBy: { createdAt: "desc" }
      }),
      []
    );
  } catch {
    products = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-neutral-500">
            Tap any product to edit. Use Add New to upload today's arrivals.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-brand-600 text-white px-4 py-2 text-sm font-semibold"
        >
          Add New
        </Link>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-pink-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="font-semibold">{product.name}</p>
              <p className="text-sm text-neutral-500">
                {formatCurrency(Number(product.price))}
              </p>
            </div>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="rounded-full border border-brand-200 px-4 py-2 text-sm text-brand-700 text-center"
            >
              Edit
            </Link>
          </div>
        ))}
        {products.length === 0 && (
          <p className="text-sm text-neutral-500">No products yet.</p>
        )}
      </div>
    </div>
  );
}
