import type { Product } from "@prisma/client";
import { prisma } from "../../../lib/db";
import { formatCurrency, withTimeout } from "../../../lib/utils";
import { buildWhatsappLink } from "../../../lib/whatsapp";
import { getSettings } from "../../../lib/settings";
import ProductViewTracker from "../../../components/ProductViewTracker";
import ProductCard from "../../../components/ProductCard";
import ProductGallery, { StickyWhatsAppBar } from "../../../components/ProductGallery";
import Breadcrumbs from "../../../components/Breadcrumbs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

type ProductPageProps = {
  params: Promise<{ slug: string }> | { slug: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  let product:
    | {
        id: string;
        name: string;
        slug: string;
        price: any;
        description: string;
        category: string | null;
        images: string[];
        inStock: boolean;
        createdAt: Date;
      }
    | null = null;
  try {
    product = await prisma.product.findUnique({
      where: { slug: resolvedParams.slug }
    });
  } catch {
    product = null;
  }

  const settings = await getSettings();
  const mapQuery = encodeURIComponent(settings.address);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  if (!product) {
    return (
      <div className="container-shell py-12">
        <div className="border border-[var(--line)] bg-white p-8 dark:bg-[var(--surface)]">
          <h1 className="section-title">Product details unavailable</h1>
          <p className="mt-3 text-neutral-600 dark:text-neutral-400">
            This product is not available right now. Please open the latest
            products from the shop page.
          </p>
          <a href="/products" className="btn-secondary mt-6 inline-flex">
            View Products
          </a>
        </div>
      </div>
    );
  }

  const price = formatCurrency(Number(product.price));
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const whatsappLink = buildWhatsappLink(
    settings.whatsappNumber,
    product.name,
    price,
    productUrl
  );

  let related: Product[] = [];
  try {
    related = await withTimeout(
      prisma.product.findMany({
        where: product.category
          ? { category: product.category, NOT: { id: product.id } }
          : { NOT: { id: product.id } },
        orderBy: { createdAt: "desc" },
        take: 4
      }),
      []
    );
  } catch {
    // ignore
  }

  return (
    <div className="pb-24 lg:pb-12">
      <ProductViewTracker slug={product.slug} />
      <div className="container-shell py-8">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/products" },
            ...(product.category
              ? [
                  {
                    label: product.category,
                    href: `/products?category=${encodeURIComponent(product.category)}`
                  }
                ]
              : []),
            { label: product.name }
          ]}
        />

        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="space-y-5">
              {product.category && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
                  {product.category}
                </p>
              )}
              <h1 className="font-display text-2xl font-medium uppercase tracking-wide text-neutral-900 sm:text-3xl dark:text-white">
                {product.name}
              </h1>

              <div className="flex items-center gap-3">
                <p className="text-2xl font-semibold text-brand-700 dark:text-brand-300">
                  {price}
                </p>
                <span
                  className={`rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    product.inStock
                      ? "bg-green-100 text-green-800"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </span>
              </div>

              <div className="border-t border-[var(--line)] pt-5">
                <p className="text-sm font-semibold uppercase tracking-[0.1em] text-neutral-900 dark:text-white">
                  Description
                </p>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="badge-soft">{settings.deliveryText}</span>
              </div>

              <div className="border-y border-[var(--line)] py-5">
                <p className="text-sm font-semibold uppercase tracking-[0.1em] text-neutral-900 dark:text-white">
                  Store Location
                </p>
                <p className="mt-3 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
                  {settings.address}
                </p>
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary mt-4 inline-flex"
                >
                  Open Live Location
                </a>
              </div>

              <div className="border border-[var(--line)] bg-cream-50 p-5 dark:bg-[var(--surface-muted)]">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Online orders are confirmed on WhatsApp with product details,
                  size, color, and availability.
                </p>
                <a href={whatsappLink} className="btn-whatsapp mt-4 w-full text-center">
                  Order Online on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="border-t border-[var(--line)] bg-white py-12 dark:bg-[var(--surface)]">
        <div className="container-shell">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
                Visit Store
              </p>
              <h2 className="section-title mt-2">PALPAL Selection Location</h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                {settings.address}
              </p>
            </div>
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Open Live Location
            </a>
          </div>
          <div className="overflow-hidden border border-[var(--line)]">
            <iframe
              title="PALPAL Selection Location"
              src={`https://www.google.com/maps/embed?q=${mapQuery}&z=16&output=embed`}
              className="h-[320px] w-full bg-white"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-[var(--line)] bg-cream-50 py-12 dark:bg-[var(--surface-muted)]">
          <div className="container-shell">
            <h2 className="section-title mb-8">You May Also Like</h2>
            <div className="product-grid">
              {related.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  slug={item.slug}
                  price={Number(item.price)}
                  images={item.images}
                  createdAt={item.createdAt}
                  inStock={item.inStock}
                  whatsappNumber={settings.whatsappNumber}
                  baseUrl={baseUrl}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <StickyWhatsAppBar
        whatsappLink={whatsappLink}
        price={price}
        inStock={product.inStock}
      />
    </div>
  );
}
