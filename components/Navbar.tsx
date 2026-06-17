import Link from "next/link";
import Image from "next/image";
import { prisma } from "../lib/db";
import { getSettings } from "../lib/settings";
import { withTimeout } from "../lib/utils";
import AnnouncementBar from "./AnnouncementBar";
import MobileMenu from "./MobileMenu";

const NAV_CATEGORIES = [
  "Sarees",
  "Kurtis",
  "Salwar Suits",
  "Lehengas",
  "Anarkali",
  "Gowns",
  "Western Wear",
  "Co-ord Sets"
];

export default async function Navbar() {
  const settings = await getSettings();
  const wa = settings.whatsappNumber.replace(/[^\d]/g, "");

  let dbCategories: string[] = [];
  try {
    const cats = await withTimeout(
      prisma.product.findMany({
        where: { category: { not: null } },
        select: { category: true },
        distinct: ["category"]
      }),
      []
    );
    dbCategories = cats.map((c) => c.category!).filter(Boolean);
  } catch {
    // fallback to static categories
  }

  const categories = dbCategories.length > 0 ? dbCategories : NAV_CATEGORIES;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-card dark:bg-[var(--surface)]">
      <AnnouncementBar />
      <div className="border-b border-[var(--line)]">
        <div className="container-shell flex items-center justify-between gap-4 py-3">
          <div className="flex items-center gap-3">
            <MobileMenu
              shopName={settings.shopName}
              whatsappNumber={settings.whatsappNumber}
              categories={categories}
            />
            <Link href="/" className="group flex min-w-0 items-center gap-3">
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-sm border border-[var(--line)] bg-white">
                <Image
                  src="/brand/logo-card.jpg"
                  alt={settings.shopName}
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <div className="min-w-0 hidden sm:block">
                <p className="font-display text-lg font-medium leading-tight text-brand-700">
                  {settings.shopName}
                </p>
                <p className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  Ladies Clothing Store
                </p>
              </div>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link href="/" className="nav-link">Home</Link>
            <Link href="/products" className="nav-link">Shop All</Link>
            <div className="group relative">
              <Link href="/products" className="nav-link flex items-center gap-1">
                Categories
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </Link>
              <div className="invisible absolute left-0 top-full z-50 min-w-[200px] border border-[var(--line)] bg-white py-2 opacity-0 shadow-lift transition group-hover:visible group-hover:opacity-100 dark:bg-[var(--surface)]">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    href={`/products?category=${encodeURIComponent(cat)}`}
                    className="block px-4 py-2 text-sm text-neutral-700 transition hover:bg-cream-100 hover:text-brand-700 dark:text-neutral-300 dark:hover:bg-white/5"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <Link href="/about" className="nav-link">About</Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden h-10 w-10 items-center justify-center rounded-sm border border-[var(--line)] sm:flex"
              aria-label="Search products"
            >
              <svg className="h-4 w-4 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </Link>
            <a href={`https://wa.me/${wa}`} className="btn-whatsapp hidden px-4 py-2.5 sm:inline-flex">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Order
            </a>
            <a href={`https://wa.me/${wa}`} className="btn-whatsapp px-3 py-2.5 sm:hidden">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
