import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import slugify from "slugify";

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: "Handwoven Cotton Saree",
    price: 2499,
    description: "Soft cotton saree with traditional weave and vibrant borders.",
    category: "Sarees",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1699999999/sample.jpg"
    ]
  },
  {
    name: "Brass Puja Thali Set",
    price: 1899,
    description: "Complete brass puja thali set with diya and holders.",
    category: "Home & Decor",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1699999998/sample.jpg"
    ]
  },
  {
    name: "Pure Honey 1kg",
    price: 599,
    description: "Raw, unprocessed honey sourced from local farms.",
    category: "Grocery",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1699999997/sample.jpg"
    ]
  },
  {
    name: "Leather Wallet",
    price: 799,
    description: "Genuine leather wallet with multiple card slots.",
    category: "Accessories",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1699999996/sample.jpg"
    ]
  },
  {
    name: "Terracotta Planter",
    price: 349,
    description: "Handmade terracotta planter for indoor plants.",
    category: "Home & Decor",
    images: [
      "https://res.cloudinary.com/demo/image/upload/v1699999995/sample.jpg"
    ]
  }
];

function makeSlug(name: string) {
  return slugify(name, { lower: true, strict: true });
}

async function main() {
  const shopName = "PALPAL Selection";
  const whatsapp = process.env.SHOP_WHATSAPP || "9033339176";
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin12345";

  await prisma.shopSettings.upsert({
    where: { id: 1 },
    update: {
      shopName,
      whatsappNumber: whatsapp,
      address: "Tuki Gali, Manish Market, Anand",
      hours: "Mon-Sun: 10:00 AM - 9:00 PM",
      deliveryText: "All India Delivery Available",
      announcementText: "Daily new arrivals for ladies fashion!"
    },
    create: {
      id: 1,
      shopName,
      whatsappNumber: whatsapp,
      address: "Tuki Gali, Manish Market, Anand",
      hours: "Mon-Sun: 10:00 AM - 9:00 PM",
      deliveryText: "All India Delivery Available",
      announcementText: "Daily new arrivals for ladies fashion!"
    }
  });

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail }
  });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.adminUser.create({
      data: { email: adminEmail, passwordHash }
    });
  }

  const productCount = await prisma.product.count();
  if (productCount === 0) {
    for (const item of sampleProducts) {
      const slug = makeSlug(item.name);
      await prisma.product.create({
        data: {
          name: item.name,
          slug,
          price: item.price,
          description: item.description,
          category: item.category,
          images: item.images,
          inStock: true
        }
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
