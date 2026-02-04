import { prisma } from "../../../lib/db";
import { withTimeout } from "../../../lib/utils";

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
    <div className="card-soft p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Followers</h1>
        <p className="text-sm text-neutral-500">
          These customers opted in for daily arrivals. Tap to message updates.
        </p>
      </div>
      <div className="space-y-3">
        {followers.map((follower) => (
          <div
            key={follower.id}
            className="bg-white border border-pink-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            <div>
              <p className="font-semibold">{follower.name}</p>
              <p className="text-sm text-neutral-500">{follower.whatsapp}</p>
              {follower.email && (
                <p className="text-xs text-neutral-400">{follower.email}</p>
              )}
            </div>
            <a
              href={`https://wa.me/${follower.whatsapp}?text=${updateText}`}
              className="rounded-full bg-brand-600 text-white px-4 py-2 text-sm font-semibold text-center"
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
