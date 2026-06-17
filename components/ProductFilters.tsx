"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type ProductFiltersProps = {
  categories: string[];
  currentQuery: string;
  currentCategory: string;
  currentSort: string;
  productCount: number;
};

export default function ProductFilters({
  categories,
  currentQuery,
  currentCategory,
  currentSort,
  productCount
}: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState(currentQuery);
  const [category, setCategory] = useState(currentCategory);
  const [sort, setSort] = useState(currentSort);

  const applyFilters = (overrides?: {
    q?: string;
    category?: string;
    sort?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const q = overrides?.q ?? query;
    const cat = overrides?.category ?? category;
    const s = overrides?.sort ?? sort;

    if (q) params.set("q", q);
    else params.delete("q");
    if (cat) params.set("category", cat);
    else params.delete("category");
    if (s && s !== "new") params.set("sort", s);
    else params.delete("sort");

    router.push(`/products?${params.toString()}`);
    setMobileOpen(false);
  };

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setSort("new");
    router.push("/products");
    setMobileOpen(false);
  };

  const filterContent = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Search
        </p>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          placeholder="Search products..."
          className="input-soft"
        />
      </div>

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setCategory("");
              applyFilters({ category: "" });
            }}
            className={`filter-chip ${!category ? "filter-chip-active" : ""}`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => {
                setCategory(cat);
                applyFilters({ category: cat });
              }}
              className={`filter-chip ${category === cat ? "filter-chip-active" : ""}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500">
          Sort By
        </p>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            applyFilters({ sort: e.target.value });
          }}
          className="input-soft"
        >
          <option value="new">New Arrivals</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-2">
        <button type="button" onClick={() => applyFilters()} className="btn-primary flex-1">
          Apply
        </button>
        {(query || category || sort !== "new") && (
          <button type="button" onClick={clearFilters} className="btn-secondary flex-1">
            Clear
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile filter bar */}
      <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
        <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {productCount} Products
        </p>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="btn-secondary px-4 py-2"
        >
          Filter & Sort
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-lg bg-white p-6 dark:bg-[var(--surface)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold uppercase tracking-[0.12em]">Filters</p>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-sm text-neutral-500"
              >
                Close
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <div className="sticky top-28 rounded-sm border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900 dark:text-white">
            Filters
          </p>
          {filterContent}
        </div>
      </aside>
    </>
  );
}
