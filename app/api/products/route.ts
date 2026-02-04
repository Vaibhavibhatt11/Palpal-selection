import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { productSchema } from "../../../lib/validation";
import { generateUniqueSlug } from "../../../lib/slug";
import { requireAdmin } from "../../../lib/apiAuth";

// Prisma must run on Node.js in production.
export const runtime = "nodejs";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" }
  });
  return NextResponse.json(products);
}

export async function POST(req: Request) {
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
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    const message = parsed.error.errors[0]?.message || "Invalid data";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug(data.name);

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug,
        price: data.price,
        description: data.description,
        category: data.category || null,
        inStock: data.inStock,
        images: data.images
      }
    });

    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Failed to create product." },
      { status: 500 }
    );
  }
}
