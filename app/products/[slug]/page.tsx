import type { Product } from "@prisma/client";
import Image from "next/image";
import { prisma } from "../../../lib/db";
import { formatCurrency, withTimeout } from "../../../lib/utils";
import { buildWhatsappLink } from "../../../lib/whatsapp";
import { getSettings } from "../../../lib/settings";
import ProductViewTracker from "../../../components/ProductViewTracker";
import ProductCard from "../../../components/ProductCard";

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
        <div className="rounded-3xl bg-white p-6 border border-pink-100 shadow-soft">
          <h1 className="text-2xl font-bold">Product unavailable</h1>
          <p className="text-neutral-600 mt-2">
            We could not load this product right now. Please refresh and try again.
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
    <div className="container-shell py-10 space-y-8">
      <ProductViewTracker slug={product.slug} />
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="relative h-[420px] rounded-3xl overflow-hidden border border-pink-100 bg-white shadow-soft">
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
                className="relative h-24 rounded-2xl overflow-hidden border border-pink-100 bg-white"
              >
                <Image src={img} alt={product.name} fill className="object-cover" />
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-5">
          <div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                product.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-neutral-800 text-white"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
            <h1 className="text-3xl font-bold mt-3">{product.name}</h1>
            <p className="text-2xl text-brand-700 font-semibold mt-2">
              {price}
            </p>
          </div>
          <p className="text-neutral-600 whitespace-pre-line">
            {product.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            {product.category && (
              <span className="badge-soft">{product.category}</span>
            )}
            <span className="rounded-full bg-green-100 text-green-800 px-3 py-1 text-xs font-semibold">
              {settings.deliveryText}
            </span>
          </div>
          <div className="card-soft p-4 flex flex-col gap-3">
            <p className="text-sm text-neutral-600">
              Chat with us to confirm size, color, and availability.
            </p>
            <a href={whatsappLink} className="btn-primary text-center">
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Related Products</h2>
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
        </section>
      )}
    </div>
  );
}
