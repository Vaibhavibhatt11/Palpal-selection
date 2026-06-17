import { getSettings } from "../../lib/settings";
import Breadcrumbs from "../../components/Breadcrumbs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSettings();
  const wa = settings.whatsappNumber.replace(/[^\d]/g, "");
  const mapQuery = encodeURIComponent(settings.address);
  const mapsLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <div className="container-shell space-y-10 py-10 lg:py-14">
      <Breadcrumbs items={[{ label: "About Us" }]} />

      <div className="max-w-3xl">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">
          Anand Boutique
        </p>
        <h1 className="section-title mt-2">About {settings.shopName}</h1>
        <p className="mt-4 text-neutral-600 dark:text-neutral-400">
          Ladies clothing boutique with fresh daily arrivals. WhatsApp us to
          reserve or order.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { label: "Owner", value: "Subhan" },
          { label: "Email", value: "Subhanv128@gmail.com" },
          { label: "Address", value: settings.address },
          { label: "Hours", value: settings.hours },
          { label: "WhatsApp", value: settings.whatsappNumber },
          { label: "Delivery", value: settings.deliveryText }
        ].map((item) => (
          <div
            key={item.label}
            className="border border-[var(--line)] bg-white p-5 dark:bg-[var(--surface)]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500">
              {item.label}
            </p>
            <p className="mt-2 text-sm font-medium text-neutral-900 dark:text-white">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a href={`https://wa.me/${wa}`} className="btn-whatsapp">
          Chat on WhatsApp
        </a>
      </div>

      <div className="overflow-hidden border border-[var(--line)] bg-white dark:bg-[var(--surface)]">
        <div className="border-b border-[var(--line)] p-6">
          <h2 className="text-lg font-medium text-neutral-900 dark:text-white">
            Find Us on Map
          </h2>
          <p className="text-sm text-neutral-500">
            {settings.address}
          </p>
          <a
            href={mapsLink}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary mt-4 inline-flex"
          >
            Open Live Location
          </a>
        </div>
        <iframe
          title="PALPAL Selection Location"
          src={`https://www.google.com/maps/embed?q=${mapQuery}&z=16&output=embed`}
          className="h-[320px] w-full bg-white"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
