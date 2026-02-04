import { notFound } from "next/navigation";
import { prisma } from "../../../../../lib/db";
import EditProductForm from "../../../../../components/EditProductForm";

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
    <div className="card-soft p-6">
      <h1 className="text-2xl font-bold mb-2">Edit Product</h1>
      <p className="text-sm text-neutral-500 mb-6">
        Update details, images, and stock. Changes save immediately.
      </p>
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
  );
}
