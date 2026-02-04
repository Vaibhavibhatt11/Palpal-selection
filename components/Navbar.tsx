import Link from "next/link";
import Image from "next/image";
import { getSettings } from "../lib/settings";

export default async function Navbar() {
  const settings = await getSettings();
  return (
    <header className="bg-white/80 backdrop-blur border-b border-pink-100 sticky top-0 z-40">
      <div className="container-shell py-4 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-12 w-12 rounded-xl overflow-hidden border border-pink-100 bg-white">
            <Image
              src="/brand/logo-card.jpg"
              alt="PALPAL Selection"
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0">
            <p className="text-base sm:text-lg font-semibold text-brand-700 leading-tight whitespace-normal max-w-[220px] sm:max-w-none">
              {settings.shopName}
            </p>
            <p className="text-xs text-neutral-500">Ladies Clothing Store</p>
          </div>
        </Link>
        <nav className="hidden sm:flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="hover:text-brand-700">
            Home
          </Link>
          <Link href="/products" className="hover:text-brand-700">
            Products
          </Link>
          <Link href="/about" className="hover:text-brand-700">
            About
          </Link>
          <Link
            href={`https://wa.me/${settings.whatsappNumber.replace(
              /[^\d]/g,
              ""
            )}`}
            className="rounded-full bg-brand-600 text-white px-4 py-2 shadow-soft hover:bg-brand-700 transition"
          >
            WhatsApp
          </Link>
        </nav>
        <Link
          href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, "")}`}
          className="sm:hidden rounded-full bg-brand-600 text-white px-3 py-2 text-xs shadow-soft hover:bg-brand-700 transition"
        >
          WhatsApp
        </Link>
      </div>
    </header>
  );
}
