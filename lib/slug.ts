import slugify from "slugify";
import { prisma } from "./db";

export async function generateUniqueSlug(name: string) {
  const base = slugify(name, { lower: true, strict: true });
  let slug = base;
  let count = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${count}`;
    count += 1;
  }
  return slug;
}
