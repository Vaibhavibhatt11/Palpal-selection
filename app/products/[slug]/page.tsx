import type { Product } from "@prisma/client";
import Image from "next/image";
import { prisma } from "../../../lib/db";
import { formatCurrency, withTimeout } from "../../../lib/utils";
import { buildWhatsappLink } from "../../../lib/whatsapp";
import { getSettings } from "../../../lib/settings";
import ProductViewTracker from "../../../components/ProductViewTracker";
import ProductCard from "../../../components/ProductCard";
import Reveal from "../../../components/Reveal";

// Prisma must run on Node.js in production, and this page should not be prerendered at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

type ProductPageProps = {
  params: { slug: string };
};

export default async function ProductPage({ params }: ProductPageProps) {
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
      where: { slug: params.slug }
    });
  } catch {
    product = null;
  }
  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12">
        <div className="card-soft p-6">
          <h1 className="text-2xl font-bold text-neutral-950 dark:text-white">More details on WhatsApp</h1>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            For more details kindly contact on WhatsApp. We will share sizes,
            colors, and availability quickly.
          </p>
        </div>
      </div>
    );
  }
  const settings = await getSettings();
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
    // Ignore related on DB issues
  }

  return (
    <div className="container-shell space-y-10 py-12">
      <ProductViewTracker slug={product.slug} />
      <Reveal className="grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-4">
          <div className="card-soft relative h-[420px] overflow-hidden p-2 sm:h-[540px]">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {product.images.slice(1).map((img) => (
              <div
                key={img}
                className="relative h-24 overflow-hidden rounded-2xl border border-white/70 bg-white/70 shadow-soft dark:border-white/10 dark:bg-white/10"
              >
                <Image src={img} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5 lg:pt-8">
          <div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                product.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-neutral-800 text-white"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">{product.name}</h1>
            <p className="mt-3 text-3xl font-bold text-brand-700 dark:text-brand-200">
              {price}
            </p>
          </div>
          <p className="whitespace-pre-line leading-7 text-neutral-600 dark:text-neutral-300">
            {product.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.category && (
              <span className="badge-soft">{product.category}</span>
            )}
            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800 dark:bg-green-400/10 dark:text-green-200">
              {settings.deliveryText}
            </span>
          </div>
          <div className="card-soft p-4 flex flex-col gap-3">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Chat with us to confirm size, color, and availability.
            </p>
            <a href={whatsappLink} className="btn-primary text-center">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </Reveal>

      {related.length > 0 && (
        <Reveal className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight text-neutral-950 dark:text-white">Related Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        </Reveal>
      )}
    </div>
  );
}
