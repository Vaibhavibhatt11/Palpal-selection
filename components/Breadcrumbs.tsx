import Link from "next/link";

type Crumb = { label: string; href?: string };

type BreadcrumbsProps = {
  items: Crumb[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-neutral-500 dark:text-neutral-400">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition hover:text-brand-700 dark:hover:text-brand-300">
            Home
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            <span className="text-neutral-300 dark:text-neutral-600">/</span>
            {item.href ? (
              <Link href={item.href} className="transition hover:text-brand-700 dark:hover:text-brand-300">
                {item.label}
              </Link>
            ) : (
              <span className="text-neutral-700 dark:text-neutral-300">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
