import { getSettings } from "../../lib/settings";
import Reveal from "../../components/Reveal";

// Prisma-backed settings should run on Node.js and avoid build-time execution.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function AboutPage() {
  const settings = await getSettings();
  return (
    <div className="container-shell space-y-8 py-12">
      <Reveal className="card-soft p-6 sm:p-8">
        <span className="badge-soft">Anand Boutique</span>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
          About {settings.shopName}
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600 dark:text-neutral-300">
          Ladies clothing boutique with fresh daily arrivals. WhatsApp us to
          reserve or order.
        </p>
        <div className="mt-6 grid gap-3 text-sm text-neutral-700 sm:grid-cols-2 dark:text-neutral-300">
          <p className="rounded-2xl bg-white/60 p-4 shadow-soft dark:bg-white/10">
            <span className="font-semibold">Owner:</span> Subhan
          </p>
          <p className="rounded-2xl bg-white/60 p-4 shadow-soft dark:bg-white/10">
            <span className="font-semibold">Email:</span>{" "}
            Subhanv128@gmail.com
          </p>
          <p className="rounded-2xl bg-white/60 p-4 shadow-soft dark:bg-white/10">
            <span className="font-semibold">Address:</span> {settings.address}
          </p>
          <p className="rounded-2xl bg-white/60 p-4 shadow-soft dark:bg-white/10">
            <span className="font-semibold">Hours:</span> {settings.hours}
          </p>
          <p className="rounded-2xl bg-white/60 p-4 shadow-soft dark:bg-white/10">
            <span className="font-semibold">WhatsApp:</span>{" "}
            {settings.whatsappNumber}
          </p>
        </div>
      </Reveal>
      <Reveal className="card-soft overflow-hidden" delay={0.08}>
        <div className="border-b border-white/60 p-6 dark:border-white/10">
          <h2 className="text-2xl font-bold text-neutral-950 dark:text-white">Find Us on Map</h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
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
      </Reveal>
    </div>
  );
}
