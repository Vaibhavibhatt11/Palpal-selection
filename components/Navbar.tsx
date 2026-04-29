import Link from "next/link";
import Image from "next/image";
import { getSettings } from "../lib/settings";
import ThemeToggle from "./ThemeToggle";

export default async function Navbar() {
  const settings = await getSettings();
  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-white/70 shadow-[0_1px_0_rgba(255,255,255,0.45)] backdrop-blur-2xl transition dark:border-white/10 dark:bg-neutral-950/70">
      <div className="container-shell flex items-center justify-between gap-4 py-3">
        <Link href="/" className="group flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-soft transition group-hover:scale-105 dark:border-white/10 dark:bg-white/90">
            <Image
              src="/brand/logo-card.jpg"
              alt="PALPAL Selection"
              fill
              className="object-contain p-1"
            />
          </div>
          <div className="min-w-0">
            <p className="max-w-[180px] truncate text-base font-bold leading-tight text-neutral-950 sm:max-w-none sm:text-lg dark:text-white">
              {settings.shopName}
            </p>
            <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Ladies Clothing Store
            </p>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 rounded-full border border-white/60 bg-white/55 p-1 text-sm font-bold shadow-soft backdrop-blur-xl sm:flex dark:border-white/10 dark:bg-white/5">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Link href="/products" className="nav-link">
            Products
          </Link>
          <Link href="/about" className="nav-link">
            About
          </Link>
          <Link
            href={`https://wa.me/${settings.whatsappNumber.replace(
              /[^\d]/g,
              ""
            )}`}
            className="btn-primary px-4 py-2"
          >
            WhatsApp
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, "")}`}
            className="btn-primary px-3 py-2 text-xs sm:hidden"
          >
            WhatsApp
          </Link>
        </div>
      </div>
    </header>
  );
}
