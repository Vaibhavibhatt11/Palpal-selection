import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { productSchema } from "../../../../lib/validation";
import { requireAdmin } from "../../../../lib/apiAuth";

// Prisma must run on Node.js in production.
export const runtime = "nodejs";

type ParamsContext = { params: Promise<{ id: string }> };

export async function PUT(req: Request, context: ParamsContext) {
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
  const { id } = await context.params;
  const body = await req.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message || "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
  const data = parsed.data;
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        price: data.price,
        description: data.description || "",
        category: data.category || null,
        inStock: data.inStock,
        images: data.images
      }
    });
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request, context: ParamsContext) {
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
  const { id } = await context.params;
  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to delete product." },
      { status: 500 }
    );
  }
}
