import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "../../../lib/db";
import { todayString } from "../../../lib/utils";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const headers = new Headers(req.headers);
  const ip =
    headers.get("x-forwarded-for")?.split(",")[0] ||
    headers.get("x-real-ip") ||
    "unknown";
  const ua = headers.get("user-agent") || "unknown";
  const date = todayString();
  const hash = crypto.createHash("sha256").update(`${ip}-${ua}-${date}`).digest("hex");

  try {
    await prisma.dailyVisit.upsert({
      where: { date },
      update: { totalVisits: { increment: 1 } },
      create: { date, totalVisits: 1, uniqueVisits: 0 }
    });

    const fingerprint = await prisma.visitFingerprint.findUnique({
      where: { date_hash: { date, hash } }
    });

    if (!fingerprint) {
      await prisma.visitFingerprint.create({ data: { date, hash } });
      await prisma.dailyVisit.update({
        where: { date },
        data: { uniqueVisits: { increment: 1 } }
      });
    }
  } catch {
    // Ignore tracking failures in production to avoid breaking UX.
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}
