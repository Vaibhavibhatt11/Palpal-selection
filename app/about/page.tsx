import { getSettings } from "../../lib/settings";

// Prisma-backed settings should run on Node.js and avoid build-time execution.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="container-shell py-10 space-y-6">
      <div className="card-soft p-6">
        <h1 className="text-3xl font-bold">About {settings.shopName}</h1>
        <p className="text-neutral-600 mt-2">
          Ladies clothing boutique with fresh daily arrivals. WhatsApp us to
          reserve or order.
        </p>
        <div className="mt-4 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2">
          <p>
            <span className="font-semibold">Owner:</span> Subhan
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            Subhanv128@gmail.com
          </p>
          <p>
            <span className="font-semibold">Address:</span> {settings.address}
          </p>
          <p>
            <span className="font-semibold">Hours:</span> {settings.hours}
          </p>
          <p>
            <span className="font-semibold">WhatsApp:</span>{" "}
            {settings.whatsappNumber}
          </p>
        </div>
      </div>
      <div className="card-soft overflow-hidden">
        <div className="p-6 border-b border-pink-100">
          <h2 className="text-xl font-semibold">Find Us on Map</h2>
          <p className="text-sm text-neutral-500">
            Tuki Gali, Manish Market, Anand
          </p>
        </div>
        <iframe
          title="PALPAL Selection Location"
          src="https://www.google.com/maps/embed?q=Tuki%20Gali%20Manish%20Market%20Anand&z=15&output=embed"
          className="w-full h-[320px] bg-white"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
