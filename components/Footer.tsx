import { getSettings } from "../lib/settings";

export default async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="mt-16 border-t border-white/60 bg-white/55 backdrop-blur-2xl dark:border-white/10 dark:bg-white/5">
      <div className="container-shell grid gap-6 py-10 text-sm text-neutral-600 sm:grid-cols-3 dark:text-neutral-300">
        <div>
          <p className="font-bold text-neutral-950 dark:text-white">
            {settings.shopName}
          </p>
          <p>Ladies Clothing Store</p>
          <p className="mt-2">{settings.deliveryText}</p>
        </div>
        <div>
          <p className="font-bold text-neutral-950 dark:text-white">Visit</p>
          <p>{settings.address}</p>
          <p>{settings.hours}</p>
        </div>
        <div>
          <p className="font-bold text-neutral-950 dark:text-white">Contact</p>
          <p>WhatsApp: {settings.whatsappNumber}</p>
          <p>Email: Subhanv128@gmail.com</p>
          <a
            href={`https://wa.me/${settings.whatsappNumber.replace(/[^\d]/g, "")}`}
            className="btn-primary mt-3 px-4 py-2 text-xs"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
      <div className="border-t border-white/60 dark:border-white/10">
        <div className="container-shell flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-neutral-500 dark:text-neutral-400">
          <span>{"\u00A9 2026 All rights reserved."}</span>
          <span>Developed by Vaibhavi Bhatt - Contact: 9909949320</span>
        </div>
      </div>
    </footer>
  );
}
