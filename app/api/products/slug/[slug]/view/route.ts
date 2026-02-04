import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/db";

type ParamsContext = { params: Promise<{ slug: string }> };

export async function POST(req: Request, context: ParamsContext) {
  const { slug } = await context.params;
  await prisma.product.updateMany({
    where: { slug },
    data: { viewsCount: { increment: 1 } }
  });
  return NextResponse.json({ ok: true });
}
