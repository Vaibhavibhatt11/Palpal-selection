import Link from "next/link";
import Image from "next/image";
import Carousel from "../components/Carousel";
import FollowForm from "../components/FollowForm";
import BrandCardModal from "../components/BrandCardModal";
import { prisma } from "../lib/db";
import { getSettings } from "../lib/settings";
import { formatCurrency, isNewArrival, withTimeout } from "../lib/utils";

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

  return (
    <div className="space-y-12">
      <section className="relative overflow-hidden hero-grid">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute top-32 -left-16 h-56 w-56 rounded-full bg-brand-100/60 blur-3xl" />
        <div className="container-shell py-14 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="space-y-6">
            {settings.announcementText && (
              <div className="badge-soft">{settings.announcementText}</div>
            )}
            <span className="rounded-full bg-green-100 text-green-800 px-4 py-2 text-xs font-semibold w-fit inline-flex">
              {settings.deliveryText}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Premium ladieswear for every occasion.
              <span className="block text-brand-600">
                New arrivals drop daily at PALPAL Selection.
              </span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-xl">
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
            <div className="grid grid-cols-2 gap-3 pt-6">
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
                  className="rounded-2xl bg-white/90 border border-pink-100 px-4 py-3 text-sm font-semibold text-neutral-700 shadow-soft hover:border-brand-200 hover:text-brand-700 transition"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative space-y-4">
            <div className="rounded-[32px] overflow-hidden border border-pink-100 bg-white shadow-soft">
              <div className="relative w-full aspect-[16/9] sm:aspect-[16/10] bg-gradient-to-br from-white via-pink-50 to-pink-100">
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
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="card-soft p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="/brand/logo-card.jpg"
              target="_blank"
              rel="noreferrer"
              className="relative h-16 w-24 sm:h-20 sm:w-32 rounded-xl overflow-hidden border border-pink-100 bg-white"
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
              <p className="font-semibold text-neutral-900">PALPAL Selection</p>
              <p className="text-xs text-neutral-500">
                Anand - Ladieswear Boutique
              </p>
            </div>
          </div>
          <Link href="/about" className="btn-secondary">
            View Store Location
          </Link>
        </div>
      </section>

      <section className="container-shell">
        <div className="section-wave rounded-3xl p-6 border border-pink-100 shadow-soft bg-white/90">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-5">
            <div>
              <h2 className="text-2xl font-semibold">New Arrivals</h2>
              <p className="text-sm text-neutral-500">
                Smooth carousel, drag to explore the latest drops.
              </p>
            </div>
            {products[0] && (
              <span className="text-sm text-neutral-500">
                Latest price: {formatCurrency(Number(products[0].price))}
              </span>
            )}
          </div>
          <Carousel items={arrivals} />
        </div>
      </section>

      <section className="container-shell grid gap-6 lg:grid-cols-3">
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
          <div key={item.title} className="card-soft p-6">
            <h3 className="text-lg font-semibold text-brand-700">
              {item.title}
            </h3>
            <p className="text-sm text-neutral-600 mt-2">{item.text}</p>
          </div>
        ))}
      </section>

      <section className="container-shell">
        <div className="card-soft p-6">
          <h2 className="text-2xl font-semibold mb-6">How to Order</h2>
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
              <div key={step.title} className="rounded-2xl bg-pink-50 p-4">
                <div className="text-2xl font-semibold text-brand-700">
                  {step.icon}
                </div>
                <p className="text-xs text-neutral-500 mt-2">Step {idx + 1}</p>
                <p className="font-semibold text-neutral-900 mt-1">
                  {step.title}
                </p>
                <p className="text-sm text-neutral-600 mt-2">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="card-soft p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Customer Trust</h2>
            <p className="text-sm text-neutral-500">
              Serving happy customers across India.
            </p>
          </div>
          <div className="flex gap-6 text-sm font-semibold text-neutral-700">
            <div>
              <p className="text-2xl text-brand-700">5K+</p>
              <p>Orders</p>
            </div>
            <div>
              <p className="text-2xl text-brand-700">4.9 star</p>
              <p>Avg Rating</p>
            </div>
            <div>
              <p className="text-2xl text-brand-700">24h</p>
              <p>Fast Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell">
        <div className="card-soft p-6">
          <h2 className="text-2xl font-semibold mb-3">
            Follow for Daily Arrivals
          </h2>
          <p className="text-sm text-neutral-600 mb-6 max-w-2xl">
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
                    className="rounded-2xl bg-pink-50 border border-pink-100 px-4 py-3 text-sm font-semibold text-neutral-700"
                  >
                    {item}
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500">
                Follow to get daily arrival alerts on WhatsApp.
              </p>
            </div>
            <div className="rounded-2xl border border-pink-100 bg-white p-4">
              <FollowForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
