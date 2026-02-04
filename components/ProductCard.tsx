import Image from "next/image";
import Link from "next/link";
import { formatCurrency, isNewArrival } from "../lib/utils";
import { buildWhatsappLink } from "../lib/whatsapp";

type ProductCardProps = {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  createdAt: Date;
  inStock: boolean;
  whatsappNumber: string;
  baseUrl: string;
};

export default function ProductCard({
  name,
  slug,
  price,
  images,
  createdAt,
  inStock,
  whatsappNumber,
  baseUrl
}: ProductCardProps) {
  const isNew = isNewArrival(createdAt);
  const productUrl = `${baseUrl}/products/${slug}`;
  const whatsappLink = buildWhatsappLink(
    whatsappNumber,
    name,
    formatCurrency(price),
    productUrl
  );
  return (
    <div className="group rounded-3xl bg-white shadow-soft overflow-hidden border border-pink-100 hover:-translate-y-1 transition-transform">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative h-56">
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
          <div className="absolute left-3 top-3 flex gap-2">
            {isNew && (
              <span className="rounded-full bg-brand-600 text-white text-xs px-2.5 py-1">
                New
              </span>
            )}
            <span
              className={`rounded-full text-xs px-2.5 py-1 ${
                inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-neutral-800 text-white"
              }`}
            >
              {inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>
        </div>
      </Link>
      <div className="p-4 space-y-2">
        <Link
          href={`/products/${slug}`}
          className="font-semibold text-neutral-900 group-hover:text-brand-700 block"
        >
          {name}
        </Link>
        <div>
          <p className="text-sm text-neutral-500">From</p>
          <p className="text-lg font-semibold text-brand-700">
            {formatCurrency(price)}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4 flex flex-col gap-2">
        <Link
          href={`/products/${slug}`}
          className="inline-flex w-full items-center justify-center rounded-full border border-brand-200 text-brand-700 px-4 py-2 text-sm font-semibold hover:bg-brand-50 transition"
        >
          View Details
        </Link>
        <a
          href={whatsappLink}
          className="inline-flex w-full items-center justify-center rounded-full bg-brand-600 text-white px-4 py-2 text-sm font-semibold shadow-soft hover:bg-brand-700 transition"
        >
          WhatsApp to Order
        </a>
      </div>
    </div>
  );
}
