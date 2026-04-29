import Link from "next/link";
import Image from "next/image";
import Carousel from "../components/Carousel";
import FollowForm from "../components/FollowForm";
import BrandCardModal from "../components/BrandCardModal";
import Reveal from "../components/Reveal";
import { prisma } from "../lib/db";
import { getSettings } from "../lib/settings";
import { formatCurrency, isNewArrival, withTimeout } from "../lib/utils";

// Prisma must run on Node.js in production, and this page should not be prerendered at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

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
        take: 10
      }),
      []
    );
  } catch {
    // If DB is unavailable, show the landing UI without products.
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

  return (
    <div className="space-y-16 pb-4">
      <section className="relative overflow-hidden hero-grid">
        <div className="absolute -right-20 top-20 h-72 w-72 rounded-full bg-brand-300/30 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-72 w-72 rounded-full bg-amber-200/30 blur-3xl" />
        <div className="container-shell grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <Reveal className="space-y-7">
            {settings.announcementText && (
              <div className="badge-soft">{settings.announcementText}</div>
            )}
            <span className="inline-flex w-fit rounded-full border border-emerald-200/70 bg-emerald-50/80 px-4 py-2 text-xs font-extrabold text-emerald-800 shadow-soft backdrop-blur dark:border-emerald-400/20 dark:bg-emerald-400/10 dark:text-emerald-200">
              {settings.deliveryText}
            </span>
            <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] tracking-tight text-neutral-950 sm:text-6xl lg:text-7xl dark:text-white">
              Premium ladieswear for every occasion.
              <span className="block bg-gradient-to-r from-brand-700 via-brand-500 to-rose-400 bg-clip-text text-transparent dark:from-brand-200 dark:via-brand-300 dark:to-rose-200">
                New arrivals drop daily at PALPAL Selection.
              </span>
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              Discover curated sarees, kurtis, salwar suits, and party wear.
              Order instantly on WhatsApp with personalized support.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/products" className="btn-primary">
                Shop New Arrivals
              </Link>
              <Link
                href={`https://wa.me/${settings.whatsappNumber.replace(
                  /[^\d]/g,
                  ""
                )}`}
                className="btn-secondary"
              >
                Chat on WhatsApp
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-5 sm:grid-cols-4">
              {[
                { label: "Sarees", value: "Sarees" },
                { label: "Kurtis", value: "Kurtis" },
                { label: "Salwar Suits", value: "Salwar Suits" },
                { label: "Lehengas", value: "Lehengas" },
                { label: "Anarkali", value: "Anarkali" },
                { label: "Gowns", value: "Gowns" },
                { label: "Western Wear", value: "Western Wear" },
                { label: "Co-ord Sets", value: "Co-ord Sets" }
              ].map((item) => (
                <Link
                  key={item.value}
                  href={`/products?category=${encodeURIComponent(item.value)}`}
                  className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm font-bold text-neutral-700 shadow-soft backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700 dark:border-white/10 dark:bg-white/10 dark:text-neutral-200 dark:hover:text-brand-200"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </Reveal>
          <Reveal className="relative space-y-4" delay={0.12}>
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-brand-400/18 to-amber-200/20 blur-2xl" />
            <div className="card-soft relative overflow-hidden rounded-[2rem] p-3">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.45rem] bg-gradient-to-br from-white via-pink-50 to-pink-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-brand-900">
                <Image
                  src="/brand/storefront.jpg"
                  alt="PALPAL Selection storefront"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  priority
                />
              </div>
            </div>
            <BrandCardModal />
          </Reveal>
        </div>
      </section>

      <Reveal className="container-shell">
        <div className="card-soft flex flex-wrap items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <a
              href="/brand/logo-card.jpg"
              target="_blank"
              rel="noreferrer"
              className="relative h-16 w-24 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-soft sm:h-20 sm:w-32 dark:border-white/10 dark:bg-white/90"
              aria-label="Open PALPAL Selection card"
            >
              <Image
                src="/brand/logo-card.jpg"
                alt="PALPAL Selection"
                fill
                className="object-contain p-1"
              />
            </a>
            <div>
              <p className="font-bold text-neutral-950 dark:text-white">
                PALPAL Selection
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Anand - Ladieswear Boutique
              </p>
            </div>
          </div>
          <Link href="/about" className="btn-secondary">
            View Store Location
          </Link>
        </div>
      </Reveal>

      <Reveal className="container-shell">
        <div className="section-wave rounded-[2rem] border border-white/70 p-5 shadow-soft backdrop-blur-xl sm:p-7 dark:border-white/10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
            <div>
              <p className="badge-soft mb-3">Fresh Drop</p>
              <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
                New Arrivals
              </h2>
            </div>
            {products[0] && (
              <span className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Latest price: {formatCurrency(Number(products[0].price))}
              </span>
            )}
          </div>
          <Carousel
            items={arrivals}
            whatsappNumber={settings.whatsappNumber}
            baseUrl={baseUrl}
          />
        </div>
      </Reveal>

      <Reveal className="container-shell grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Fast Dispatch",
            text: "Orders packed quickly with premium finishing."
          },
          {
            title: "Pan-India Delivery",
            text: "Reach every city with reliable logistics."
          },
          {
            title: "WhatsApp Support",
            text: "Instant help for sizes, colors, and availability."
          }
        ].map((item) => (
          <div key={item.title} className="card-soft p-6 hover:-translate-y-1 hover:border-brand-200/70">
            <h3 className="text-lg font-bold text-brand-700 dark:text-brand-200">
              {item.title}
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{item.text}</p>
          </div>
        ))}
      </Reveal>

      <Reveal className="container-shell">
        <div className="card-soft p-6">
          <h2 className="mb-6 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            How to Order
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                title: "Browse",
                text: "Explore the latest arrivals and pick your favorites.",
                icon: "1"
              },
              {
                title: "Chat",
                text: "Message us on WhatsApp with product details.",
                icon: "2"
              },
              {
                title: "Confirm",
                text: "We share availability, size, and delivery timelines.",
                icon: "3"
              }
            ].map((step, idx) => (
              <div key={step.title} className="rounded-3xl border border-brand-100/70 bg-white/70 p-5 shadow-soft transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-rose-400 text-2xl font-bold text-white shadow-soft">
                  {step.icon}
                </div>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">Step {idx + 1}</p>
                <p className="mt-1 font-bold text-neutral-950 dark:text-white">
                  {step.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-600 dark:text-neutral-300">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="container-shell">
        <div className="card-soft flex flex-wrap items-center justify-between gap-6 p-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Customer Trust</h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Serving happy customers across India.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm font-bold text-neutral-700 dark:text-neutral-300 sm:gap-8">
            <div>
              <p className="text-2xl text-brand-700 dark:text-brand-200">5K+</p>
              <p>Orders</p>
            </div>
            <div>
              <p className="text-2xl text-brand-700 dark:text-brand-200">4.9 star</p>
              <p>Avg Rating</p>
            </div>
            <div>
              <p className="text-2xl text-brand-700 dark:text-brand-200">24h</p>
              <p>Fast Dispatch</p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal className="container-shell">
        <div className="card-soft p-6">
          <h2 className="mb-3 text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">
            Follow for Daily Arrivals
          </h2>
          <p className="mb-6 max-w-2xl text-sm leading-6 text-neutral-600 dark:text-neutral-300">
            Get daily updates on new arrivals and reasonable prices. Follow us
            to receive WhatsApp notifications and never miss today's drops.
          </p>
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
                  <div
                    key={item}
                    className="rounded-2xl border border-brand-100/80 bg-white/70 px-4 py-3 text-sm font-bold text-neutral-700 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/10 dark:text-neutral-200"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Follow to get daily arrival alerts on WhatsApp.
              </p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/70 p-4 shadow-soft backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
              <FollowForm />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
