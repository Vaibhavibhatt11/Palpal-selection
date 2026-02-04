import { getSettings } from "../lib/settings";

export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="bg-white border-t border-pink-100 mt-12">
      <div className="container-shell py-10 grid gap-6 sm:grid-cols-3 text-sm text-neutral-600">
        <div>
          <p className="font-semibold text-neutral-900">{settings.shopName}</p>
          <p>Ladies Clothing Store</p>
          <p className="mt-2">{settings.deliveryText}</p>
        </div>
        <div>
          <p className="font-semibold text-neutral-900">Visit</p>
          <p>{settings.address}</p>
          <p>{settings.hours}</p>
        </div>
        <div>
          <p className="font-semibold text-neutral-900">Contact</p>
          <p>WhatsApp: {settings.whatsappNumber}</p>
          <p>Email: Subhanv128@gmail.com</p>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, "")}`}
            className="inline-flex items-center rounded-full bg-brand-600 text-white px-4 py-2 mt-3 text-xs font-semibold shadow-soft hover:bg-brand-700 transition"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-pink-100">
        <div className="container-shell py-4 text-xs text-neutral-500 flex flex-wrap items-center justify-between gap-2">
          <span>{"\u00A9 2026 All rights reserved."}</span>
          <span>{settings.shopName}</span>
        </div>
      </div>
    </footer>
  );
}
