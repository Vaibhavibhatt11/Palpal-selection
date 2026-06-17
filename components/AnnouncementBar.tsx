import { getSettings } from "../lib/settings";

export default async function AnnouncementBar() {
  const settings = await getSettings();
  const messages = [
    settings.announcementText || "Daily new arrivals for ladies fashion!",
    settings.deliveryText || "All India Delivery Available",
    "Order directly on WhatsApp — Fast & Easy!"
  ];

  const doubled = [...messages, ...messages];

  return (
    <div className="border-b border-brand-800/20 bg-brand-700 text-white">
      <div className="overflow-hidden py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {doubled.map((msg, i) => (
            <span
              key={`${msg}-${i}`}
              className="mx-8 text-[11px] font-medium uppercase tracking-[0.14em]"
            >
              {msg}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
