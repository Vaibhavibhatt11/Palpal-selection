import Link from "next/link";
import type { Product } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { formatCurrency, withTimeout } from "../../../lib/utils";

// Prisma must run on Node.js in production, and this page should not be prerendered at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
          <h1 className="font-display text-3xl font-medium">Products</h1>
          <p className="text-sm text-neutral-500">
            Tap any product to edit. Use Add New to upload today's arrivals.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="btn-primary"
        >
          Add New
        </Link>
      </div>
      <div className="space-y-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-3 border border-[var(--line)] bg-white p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-[var(--surface)]"
          >
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">{product.name}</p>
              <p className="text-sm text-neutral-500">
                {formatCurrency(Number(product.price))}
              </p>
            </div>
            <Link
              href={`/admin/products/${product.id}/edit`}
              className="inline-flex items-center justify-center border border-brand-700 px-4 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-700 transition hover:bg-brand-700 hover:text-white"
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
