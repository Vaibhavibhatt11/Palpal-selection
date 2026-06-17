import Link from "next/link";
import { prisma } from "../../lib/db";
import { todayString, withTimeout } from "../../lib/utils";
import { subDays, format } from "date-fns";
import type { DailyVisit } from "@prisma/client";

// Prisma must run on Node.js in production, and this page should not be prerendered at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
      <div className="border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-700">Admin</p>
            <h1 className="mt-1 font-display text-3xl font-medium">Dashboard</h1>
          </div>
          <Link
            href="/"
            className="btn-secondary"
          >
            Open Website
          </Link>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-4">
          <div className="border border-[var(--line)] bg-cream-50 p-4 dark:bg-[var(--surface-muted)]">
            <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Total visits (7d)</p>
            <p className="mt-1 text-2xl font-semibold">{totalVisits}</p>
          </div>
          <div className="border border-[var(--line)] bg-white p-4 dark:bg-[var(--surface)]">
            <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Today</p>
            <p className="mt-1 text-2xl font-semibold">{todayVisits}</p>
          </div>
          <div className="border border-[var(--line)] bg-white p-4 dark:bg-[var(--surface)]">
            <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Unique (7d)</p>
            <p className="mt-1 text-2xl font-semibold">
              {normalized.reduce((sum, item) => sum + item.uniqueVisits, 0)}
            </p>
          </div>
          <div className="border border-[var(--line)] bg-white p-4 dark:bg-[var(--surface)]">
            <p className="text-xs uppercase tracking-[0.1em] text-neutral-500">Followers</p>
            <p className="mt-1 text-2xl font-semibold">{followerCount}</p>
            <Link
              href="/admin/followers"
              className="mt-2 inline-block text-xs font-medium text-brand-700"
            >
              View followers
            </Link>
          </div>
        </div>
      </div>

      <div className="border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-700">Last 7 Days</h2>
        <div className="grid grid-cols-7 gap-2 items-end h-40">
          {normalized.map((day) => (
            <div key={day.date} className="text-center">
              <div
                className="mx-auto w-6 bg-brand-700"
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
        {totalVisits === 0 && <p className="mt-4 text-sm text-neutral-500">No visits recorded yet.</p>}
      </div>
    </div>
  );
}
