import Link from "next/link";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/followers", label: "Followers" }
];

export default function AdminNav() {
  return (
    <nav className="flex flex-wrap items-center gap-3 text-sm font-medium">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="rounded-full bg-white px-3 py-1.5 shadow-soft border border-orange-100 hover:text-brand-700"
        >
          {link.label}
        </Link>
      ))}
      <Link
        href="/admin/settings"
        className="rounded-full border border-brand-200 px-3 py-1.5 text-brand-700 bg-white"
      >
        Settings
      </Link>
      <Link
        href="/"
        className="rounded-full bg-brand-600 text-white px-3 py-1.5 shadow-soft"
      >
        Open Website
      </Link>
    </nav>
  );
}
