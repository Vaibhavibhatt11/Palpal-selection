import Image from "next/image";
import Link from "next/link";
import FollowForm from "../components/FollowForm";
import { ProductCarousel } from "../components/ProductGallery";
import TrustBar from "../components/TrustBar";
import { prisma } from "../lib/db";
import { getSettings } from "../lib/settings";
import { formatCurrency, isNewArrival, withTimeout } from "../lib/utils";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

const CATEGORIES = [
  { label: "Sarees", value: "Sarees" },
  { label: "Kurtis", value: "Kurtis" },
  { label: "Salwar Suits", value: "Salwar Suits" },
  { label: "Lehengas", value: "Lehengas" },
  { label: "Anarkali", value: "Anarkali" },
  { label: "Gowns", value: "Gowns" },
  { label: "Western Wear", value: "Western Wear" },
  { label: "Co-ord Sets", value: "Co-ord Sets" }
];

export default async function HomePage() {
  const settings = await getSettings();
  let products: Array<{
    id: string;
    name: string;
    slug: string;
    price: any;
    images: string[];
    createdAt: Date;
  }> = [];

  try {
    products = await withTimeout(
      prisma.product.findMany({
        orderBy: { createdAt: "desc" },
        take: 8
      }),
      []
    );
  } catch {
    // DB unavailable
  }

  const arrivals = products.map((product) => ({
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: Number(product.price),
    image: product.images[0],
    isNew: isNewArrival(product.createdAt)
  }));
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const wa = settings.whatsappNumber.replace(/[^\d]/g, "");
  const mapQuery = encodeURIComponent(settings.address);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div>
      <section className="relative overflow-hidden bg-brand-700 text-white">
        <div className="absolute inset-0 bg-[url('/brand/storefront.jpg')] bg-cover bg-center opacity-20" />
        <div className="container-shell relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="space-y-6">
            <span className="inline-block border border-white/30 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
              {settings.deliveryText}
            </span>
            <h1 className="font-display text-4xl font-medium leading-tight sm:text-5xl lg:text-6xl">
              Premium ladieswear for every occasion.
            </h1>
            <p className="max-w-lg text-base leading-relaxed text-white/85">
              Discover curated sarees, kurtis, salwar suits, and party wear.
              Order instantly on WhatsApp with personalized support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center bg-white px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-brand-700 transition hover:bg-cream-100"
              >
                Shop New Arrivals
              </Link>
              <a
                href={`https://wa.me/${wa}`}
                className="inline-flex items-center gap-2 border border-white/50 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-white/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative aspect-[4/5] overflow-hidden border border-white/20 shadow-lift">
              <Image
                src="/brand/storefront.jpg"
                alt="PALPAL Selection storefront"
                fill
                className="object-cover"
                sizes="45vw"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <TrustBar />

      <section className="container-shell py-14">
        <div className="mb-8 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
            Explore
          </p>
          <h2 className="section-title mt-2">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {CATEGORIES.map((item) => (
            <Link
              key={item.value}
              href={`/products?category=${encodeURIComponent(item.value)}`}
              className="group flex flex-col items-center border border-[var(--line)] bg-white p-5 text-center transition hover:border-brand-700 hover:shadow-lift dark:bg-[var(--surface)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-neutral-800 transition group-hover:text-brand-700 dark:text-neutral-200">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-cream-100 dark:bg-[var(--surface-muted)]">
        <div className="container-shell grid gap-5 py-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-24 overflow-hidden rounded-sm border border-[var(--line)] bg-white">
              <Image
                src="/brand/logo-card.jpg"
                alt="PALPAL Selection"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="space-y-1">
              <p className="font-display text-lg font-medium text-brand-700">
                PALPAL Selection
              </p>
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {settings.address}
              </p>
              <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">
                Online orders on WhatsApp - store visit location available
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={mapsLink}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary"
            >
              Open Live Location
            </a>
            <Link href="/about" className="btn-primary">
              Store Details
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
              Fresh Drop
            </p>
            <h2 className="section-title mt-2">New Arrivals</h2>
          </div>
          <div className="flex items-center gap-4">
            {products[0] && (
              <span className="text-sm text-neutral-500">
                Latest: {formatCurrency(Number(products[0].price))}
              </span>
            )}
            <Link href="/products" className="btn-secondary px-4 py-2">
              View All
            </Link>
          </div>
        </div>
        <ProductCarousel
          items={arrivals}
          whatsappNumber={settings.whatsappNumber}
          baseUrl={baseUrl}
        />
      </section>

      <section className="bg-white py-14 dark:bg-[var(--surface)]">
        <div className="container-shell">
          <div className="mb-8 text-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
              Simple Process
            </p>
            <h2 className="section-title mt-2">How to Order</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Browse",
                text: "Explore the latest arrivals and pick your favorites."
              },
              {
                step: "02",
                title: "Order Online",
                text: "Send the selected product to us directly on WhatsApp."
              },
              {
                step: "03",
                title: "Confirm",
                text: "We share availability, size, color, and delivery timelines."
              }
            ].map((item) => (
              <div
                key={item.title}
                className="border border-[var(--line)] p-6 text-center transition hover:shadow-lift"
              >
                <p className="font-display text-3xl font-medium text-brand-200">
                  {item.step}
                </p>
                <p className="mt-3 text-sm font-semibold uppercase tracking-[0.1em] text-neutral-900 dark:text-white">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <div className="grid grid-cols-3 gap-6 border border-[var(--line)] bg-white p-8 text-center dark:bg-[var(--surface)] sm:gap-12">
          <div>
            <p className="font-display text-3xl font-medium text-brand-700">
              5K+
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-neutral-500">
              Orders
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-medium text-brand-700">
              4.9 Star
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-neutral-500">
              Avg Rating
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-medium text-brand-700">
              24h
            </p>
            <p className="mt-1 text-xs uppercase tracking-[0.1em] text-neutral-500">
              Fast Dispatch
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-cream-100 py-14 dark:bg-[var(--surface-muted)]">
        <div className="container-shell">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
                Stay Updated
              </p>
              <h2 className="section-title mt-2">Follow for Daily Arrivals</h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                Get daily updates on new arrivals and reasonable prices. Follow us
                to receive WhatsApp notifications and never miss today's drops.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  "Dupatta",
                  "Blouse",
                  "Nightwear",
                  "Ethnic Sets",
                  "Party Wear",
                  "Casual Wear",
                  "Daily Wear",
                  "Festive Wear"
                ].map((item) => (
                  <span
                    key={item}
                    className="border border-[var(--line)] bg-white px-3 py-2 text-center text-xs font-medium text-neutral-700 dark:bg-[var(--surface)] dark:text-neutral-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
              <FollowForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
