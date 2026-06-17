import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import EditProductForm from "../../../../../components/EditProductForm";

// Prisma must run on Node.js in production, and this page should not be prerendered at build time.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type EditPageProps = {
  params: { id: string } | Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditPageProps) {
  const resolved =
    typeof (params as { then?: unknown })?.then === "function"
      ? await (params as Promise<{ id: string }>)
      : (params as { id: string });
  const productId = resolved?.id;
  if (!productId) {
    notFound();
  }
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });
  if (!product) {
    notFound();
  }

  return (
    <div className="border border-[var(--line)] bg-white p-6 dark:bg-[var(--surface)]">
      <h1 className="font-display text-3xl font-medium">Edit Product</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Update details, images, and stock.
      </p>
      <div className="mt-6">
        <EditProductForm
          id={product.id}
          initial={{
            name: product.name,
            price: Number(product.price),
            description: product.description,
            category: product.category,
            inStock: product.inStock,
            images: product.images
          }}
        />
      </div>
    </div>
  );
}
