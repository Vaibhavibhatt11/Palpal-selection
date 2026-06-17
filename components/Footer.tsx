import Link from "next/link";
import { getSettings } from "../lib/settings";

const QUICK_LINKS = [
  { href: "/products", label: "Shop All" },
  { href: "/products?sort=new", label: "New Arrivals" },
  { href: "/about", label: "About Us" },
  { href: "/about", label: "Store Location" }
];

const CATEGORIES = [
  "Sarees",
  "Kurtis",
  "Salwar Suits",
  "Lehengas",
  "Anarkali",
  "Gowns",
  "Western Wear",
  "Co-ord Sets"
];

export default async function Footer() {
  const settings = await getSettings();
  const wa = settings.whatsappNumber.replace(/[^\d]/g, "");

  return (
    <footer className="mt-0 border-t border-[var(--line)] bg-white dark:bg-[var(--surface)]">
      <div className="container-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-medium text-brand-700">
            {settings.shopName}
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Ladies Clothing Store — Anand
          </p>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {settings.deliveryText}
          </p>
          <a href={`https://wa.me/${wa}`} className="btn-whatsapp mt-4 inline-flex px-5 py-2.5">
            Order on WhatsApp
          </a>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
            Quick Links
          </p>
          <ul className="mt-4 space-y-2">
            {QUICK_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-neutral-600 transition hover:text-brand-700 dark:text-neutral-400 dark:hover:text-brand-300"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
            Collections
          </p>
          <ul className="mt-4 space-y-2">
            {CATEGORIES.map((cat) => (
              <li key={cat}>
                <Link
                  href={`/products?category=${encodeURIComponent(cat)}`}
                  className="text-sm text-neutral-600 transition hover:text-brand-700 dark:text-neutral-400 dark:hover:text-brand-300"
                >
                  {cat}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-900 dark:text-white">
            Contact Us
          </p>
          <div className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <p>{settings.address}</p>
            <p>{settings.hours}</p>
            <p>WhatsApp: {settings.whatsappNumber}</p>
            <p>Email: Subhanv128@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[var(--line)] bg-cream-100 dark:bg-[var(--surface-muted)]">
        <div className="container-shell flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-neutral-500">
          <span>© 2026 {settings.shopName}. All Rights Reserved.</span>
          <span>Developed by Vaibhavi Bhatt — 9909949320</span>
        </div>
      </div>
    </footer>
  );
}
