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
    <div className="card-soft group overflow-hidden hover:-translate-y-1 hover:border-brand-200/70">
      <Link href={`/products/${slug}`} className="block">
        <div className="relative h-64">
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
          <div className="absolute left-3 top-3 flex gap-2">
            {isNew && (
              <span className="rounded-full bg-brand-600 px-2.5 py-1 text-xs font-bold text-white shadow-soft">
                New
              </span>
            )}
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-bold shadow-soft ${
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
          className="block font-bold text-neutral-950 transition group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200"
        >
          {name}
        </Link>
        <div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">From</p>
          <p className="text-lg font-bold text-brand-700 dark:text-brand-200">
            {formatCurrency(price)}
          </p>
        </div>
      </div>
      <div className="px-4 pb-4 flex flex-col gap-2">
        <Link
          href={`/products/${slug}`}
          className="btn-secondary w-full px-4 py-2"
        >
          View Details
        </Link>
        <a
          href={whatsappLink}
          className="btn-primary w-full px-4 py-2"
        >
          WhatsApp to Order
        </a>
      </div>
    </div>
  );
}
