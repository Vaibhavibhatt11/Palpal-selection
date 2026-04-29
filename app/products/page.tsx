import type { Product } from "@prisma/client";
import ProductCard from "../../components/ProductCard";
import Reveal from "../../components/Reveal";
import { prisma } from "../../lib/db";
import { getSettings } from "../../lib/settings";
import { withTimeout } from "../../lib/utils";

// Prisma must run on Node.js in production, and this page should not be prerendered at build time.
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
  let categories: Array<{ category: string | null }> = [];
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

    categories = await withTimeout(
      prisma.product.findMany({
        where: { category: { not: null } },
        select: { category: true },
        distinct: ["category"]
      }),
      []
    );
  } catch {
    // If DB is unavailable, render with empty data.
  }

  return (
    <div className="container-shell space-y-8 py-12">
      <Reveal className="card-soft p-6 sm:p-8">
        <span className="badge-soft">Curated Catalog</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
          Ladies Collection
        </h1>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          {settings.deliveryText} - PALPAL Selection
        </p>
        <form className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            name="q"
            defaultValue={query}
            placeholder="Search products..."
            className="input-soft"
          />
          <select
            name="category"
            defaultValue={category}
            className="input-soft"
          >
            <option value="">All Categories</option>
            {categories.map((cat) =>
              cat.category ? (
                <option key={cat.category} value={cat.category}>
                  {cat.category}
                </option>
              ) : null
            )}
          </select>
          <select
            name="sort"
            defaultValue={sort}
            className="input-soft"
          >
            <option value="new">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
          <button className="btn-primary md:col-span-4">
            Apply Filters
          </button>
        </form>
      </Reveal>

      <div className="flex items-center justify-between text-sm font-semibold text-neutral-500 dark:text-neutral-400">
        <span>{products.length} items</span>
      </div>

      <Reveal className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
      </Reveal>
      {products.length === 0 && (
        <Reveal className="card-soft p-8 text-center">
          <p className="text-lg font-bold text-neutral-950 dark:text-white">No products found</p>
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            Try changing filters or check back shortly for new arrivals.
          </p>
        </Reveal>
      )}
    </div>
  );
}
