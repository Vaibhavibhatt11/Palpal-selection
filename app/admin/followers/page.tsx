import { prisma } from "../../../lib/db";
import { withTimeout } from "../../../lib/utils";

// Prisma must run on Node.js in production, and this page should not be prerendered at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminFollowersPage() {
  let followers: Array<{
    id: string;
    name: string;
    whatsapp: string;
    email: string | null;
  }> = [];
  try {
    followers = await withTimeout(
      prisma.follower.findMany({
        orderBy: { createdAt: "desc" }
      }),
      []
    );
  } catch {
    followers = [];
  }
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const updateText = encodeURIComponent(
    `Daily arrivals are live at PALPAL Selection. Browse here: ${baseUrl}`
  );

  return (
    <div className="space-y-4 border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
      <div>
        <h1 className="font-display text-3xl font-medium">Followers</h1>
        <p className="text-sm text-neutral-500">
          These customers opted in for daily arrivals. Tap to message updates.
        </p>
      </div>
      <div className="space-y-3">
        {followers.map((follower) => (
          <div
            key={follower.id}
            className="flex flex-col gap-3 border border-[var(--line)] bg-cream-50 p-4 sm:flex-row sm:items-center sm:justify-between dark:bg-[var(--surface-muted)]"
          >
            <div>
              <p className="font-medium text-neutral-900 dark:text-white">{follower.name}</p>
              <p className="text-sm text-neutral-500">{follower.whatsapp}</p>
              {follower.email && (
                <p className="text-xs text-neutral-400">{follower.email}</p>
              )}
            </div>
            <a
              href={`https://wa.me/${follower.whatsapp}?text=${updateText}`}
              className="btn-whatsapp text-center"
            >
              Send WhatsApp Update
            </a>
          </div>
        ))}
        {followers.length === 0 && (
          <p className="text-sm text-neutral-500">No followers yet.</p>
        )}
      </div>
    </div>
  );
}
