import { Suspense } from "react";
import type { Product } from "@prisma/client";
import ProductCard from "../../components/ProductCard";
import ProductFilters from "../../components/ProductFilters";
import Breadcrumbs from "../../components/Breadcrumbs";
import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { withTimeout } from "../../lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

type ProductsPageProps = {
  searchParams?:
    | { q?: string; category?: string; sort?: string }
    | Promise<{ q?: string; category?: string; sort?: string }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams =
    typeof (searchParams as { then?: unknown })?.then === "function"
      ? await (searchParams as Promise<{
          q?: string;
          category?: string;
          sort?: string;
        }>)
      : (searchParams as { q?: string; category?: string; sort?: string });

  const query = resolvedSearchParams?.q?.trim() || "";
  const category = resolvedSearchParams?.category?.trim() || "";
  const sort = resolvedSearchParams?.sort?.trim() || "new";
  const settings = await getSettings();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let products: Product[] = [];
  let categories: string[] = [];
  try {
    const orderBy =
      sort === "price_asc"
        ? { price: "asc" as const }
        : sort === "price_desc"
          ? { price: "desc" as const }
          : { createdAt: "desc" as const };

    products = await withTimeout(
      prisma.product.findMany({
        where: {
          AND: [
            query
              ? {
                  OR: [
                    { name: { contains: query, mode: "insensitive" } },
                    { description: { contains: query, mode: "insensitive" } },
                    { category: { contains: query, mode: "insensitive" } }
                  ]
                }
              : {},
            category
              ? { category: { equals: category, mode: "insensitive" } }
              : {}
          ]
        },
        orderBy
      }),
      []
    );

    const cats = await withTimeout(
      prisma.product.findMany({
        where: { category: { not: null } },
        select: { category: true },
        distinct: ["category"]
      }),
      []
    );
    categories = cats.map((c) => c.category!).filter(Boolean);
  } catch {
    // DB unavailable
  }

  const pageTitle = category || "All Products";

  return (
    <div className="container-shell py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/products" },
          ...(category ? [{ label: category }] : [])
        ]}
      />

      <div className="mt-4 mb-8">
        <h1 className="section-title">{pageTitle}</h1>
        <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
          {settings.deliveryText} — {settings.shopName}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <Suspense fallback={<div className="hidden lg:block h-96 animate-pulse bg-cream-200 rounded-sm" />}>
          <ProductFilters
            categories={categories}
            currentQuery={query}
            currentCategory={category}
            currentSort={sort}
            productCount={products.length}
          />
        </Suspense>

        <div>
          <div className="mb-6 hidden items-center justify-between lg:flex">
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {products.length} Products
            </p>
            <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">
              {sort === "price_asc"
                ? "Price: Low to High"
                : sort === "price_desc"
                  ? "Price: High to Low"
                  : "New Arrivals"}
            </p>
          </div>

          {products.length > 0 ? (
            <div className="product-grid">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  slug={product.slug}
                  price={Number(product.price)}
                  images={product.images}
                  createdAt={product.createdAt}
                  inStock={product.inStock}
                  whatsappNumber={settings.whatsappNumber}
                  baseUrl={baseUrl}
                />
              ))}
            </div>
          ) : (
            <div className="border border-[var(--line)] bg-white p-12 text-center dark:bg-[var(--surface)]">
              <p className="text-lg font-medium text-neutral-900 dark:text-white">
                No products found
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Try changing filters or check back shortly for new arrivals.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
