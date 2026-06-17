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
    <article className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-cream-100">
        <Link href={`/products/${slug}`} className="absolute inset-0 z-0">
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        </Link>
        <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
          {isNew && <span className="badge-new">New In</span>}
          {!inStock && (
            <span className="rounded-sm bg-neutral-900/80 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
              Sold Out
            </span>
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full gap-1 p-2 transition duration-300 group-hover:translate-y-0">
          <Link
            href={`/products/${slug}`}
            className="flex-1 rounded-sm bg-white/95 py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-neutral-900 shadow-card"
          >
            View
          </Link>
          <a
            href={whatsappLink}
            className="flex-1 rounded-sm bg-[#25D366] py-2 text-center text-[10px] font-semibold uppercase tracking-wider text-white shadow-card"
          >
            WhatsApp
          </a>
        </div>
      </div>
      <Link href={`/products/${slug}`} className="mt-3 block space-y-1">
        <h3 className="line-clamp-2 text-xs font-medium uppercase tracking-wide text-neutral-800 transition group-hover:text-brand-700 dark:text-neutral-200 dark:group-hover:text-brand-300">
          {name}
        </h3>
        <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
          {formatCurrency(price)}
        </p>
      </Link>
    </article>
  );
}
