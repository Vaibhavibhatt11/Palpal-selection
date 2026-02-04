import Link from "next/link";
import { prisma } from "../../lib/db";
import { todayString, withTimeout } from "../../lib/utils";
import { subDays, format } from "date-fns";
import type { DailyVisit } from "@prisma/client";

export default async function AdminDashboardPage() {
  const today = todayString();
  const startDate = format(subDays(new Date(), 6), "yyyy-MM-dd");
  let dailyVisits: DailyVisit[] = [];
  try {
    dailyVisits = await withTimeout(
      prisma.dailyVisit.findMany({
        where: { date: { gte: startDate } },
        orderBy: { date: "asc" }
      }),
      []
    );
  } catch {
    dailyVisits = [];
  }

  const range = Array.from({ length: 7 }, (_, idx) =>
    format(subDays(new Date(), 6 - idx), "yyyy-MM-dd")
  );
  const normalized = range.map((date) => {
    const found = dailyVisits.find((item) => item.date === date);
    return (
      found || {
        date,
        totalVisits: 0,
        uniqueVisits: 0
      }
    );
  });

  const totalVisits = normalized.reduce(
    (sum, item) => sum + item.totalVisits,
    0
  );
  const todayVisits =
    normalized.find((item) => item.date === today)?.totalVisits ?? 0;
  const maxVisits =
    normalized.reduce((max, item) => Math.max(max, item.totalVisits), 1) || 1;
  let followerCount = 0;
  try {
    followerCount = await withTimeout(prisma.follower.count(), 0);
  } catch {
    followerCount = 0;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl shadow-soft p-6 border border-orange-100">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Link
            href="/"
            className="rounded-full bg-brand-600 text-white px-4 py-2 text-sm font-semibold"
          >
            Open Website
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-brand-50 p-4">
            <p className="text-sm text-neutral-600">Total visits (7d)</p>
            <p className="text-2xl font-semibold">{totalVisits}</p>
          </div>
          <div className="rounded-2xl bg-white border border-orange-100 p-4">
            <p className="text-sm text-neutral-600">Today</p>
            <p className="text-2xl font-semibold">{todayVisits}</p>
          </div>
          <div className="rounded-2xl bg-white border border-orange-100 p-4">
            <p className="text-sm text-neutral-600">Unique (7d)</p>
            <p className="text-2xl font-semibold">
              {normalized.reduce((sum, item) => sum + item.uniqueVisits, 0)}
            </p>
          </div>
          <div className="rounded-2xl bg-white border border-orange-100 p-4">
            <p className="text-sm text-neutral-600">Followers</p>
            <p className="text-2xl font-semibold">{followerCount}</p>
            <Link
              href="/admin/followers"
              className="text-xs text-brand-700 mt-1 inline-block"
            >
              View followers
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-soft p-6 border border-orange-100">
        <h2 className="text-lg font-semibold mb-4">Last 7 Days</h2>
        <div className="grid grid-cols-7 gap-2 items-end h-40">
          {normalized.map((day) => (
            <div key={day.date} className="text-center">
              <div
                className="mx-auto w-6 rounded-full bg-brand-600"
                style={{
                  height: `${Math.max(
                    20,
                    (day.totalVisits / maxVisits) * 140
                  )}px`
                }}
              />
              <p className="text-[10px] text-neutral-500 mt-2">
                {day.date.slice(5)}
              </p>
            </div>
          ))}
        </div>
        {totalVisits === 0 && (
          <p className="text-sm text-neutral-500">No visits recorded yet.</p>
        )}
      </div>
    </div>
  );
}
