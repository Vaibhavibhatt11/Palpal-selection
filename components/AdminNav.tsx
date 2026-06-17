import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/followers", label: "Followers" }
];

export default function AdminNav() {
  return (
    <nav className="flex flex-wrap items-center gap-2 border border-[var(--line)] bg-white p-3 dark:bg-[var(--surface)]">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="inline-flex items-center border border-[var(--line)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-neutral-700 transition hover:border-brand-700 hover:text-brand-700 dark:text-neutral-300"
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/admin/settings"
        className="inline-flex items-center border border-brand-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-brand-700 transition hover:bg-brand-700 hover:text-white"
      >
        Settings
      </Link>
      <Link
        href="/"
        className="ml-auto inline-flex items-center bg-brand-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-brand-800"
      >
        Open Website
      </Link>
    </nav>
  );
}
