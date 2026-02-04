import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { followerSchema } from "../../../lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = followerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const data = parsed.data;
  const whatsapp = data.whatsapp.replace(/[^\d]/g, "");
  if (whatsapp.length < 5) {
    return NextResponse.json({ error: "Invalid WhatsApp" }, { status: 400 });
  }

  try {
    await prisma.follower.upsert({
      where: { whatsapp },
      update: {
        name: data.name,
        email: data.email || null
      },
      create: {
        name: data.name,
        whatsapp,
        email: data.email || null
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Unable to save follower. Run migrations if needed."
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
