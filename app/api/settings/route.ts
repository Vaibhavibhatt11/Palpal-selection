import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { settingsSchema } from "../../../lib/validation";
import { requireAdmin } from "../../../lib/apiAuth";

// Prisma must run on Node.js in production.
export const runtime = "nodejs";

export async function PUT(req: Request) {
  const isAdmin = await requireAdmin(req);
  if (!isAdmin) {
    return NextResponse.json(
      {
        error:
          "Unauthorized. Please sign in again on the same URL (localhost vs IP) and retry."
      },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message || "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const data = parsed.data;

  const settings = await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {
      shopName: data.shopName,
      whatsappNumber: data.whatsappNumber,
      address: data.address,
      hours: data.hours,
      deliveryText: data.deliveryText,
      announcementText: data.announcementText || null
    },
    create: {
      id: 1,
      shopName: data.shopName,
      whatsappNumber: data.whatsappNumber,
      address: data.address,
      hours: data.hours,
      deliveryText: data.deliveryText,
      announcementText: data.announcementText || null
    }
  });

  return NextResponse.json(settings);
}
