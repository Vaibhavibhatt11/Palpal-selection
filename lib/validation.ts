import { z } from "zod";

const imagePathSchema = z
  .string()
  .min(1)
  .refine((value) => value.startsWith("http") || value.startsWith("/"), {
    message: "Invalid image url"
  });

export const productSchema = z.object({
  name: z.string().min(2).max(120),
  price: z.coerce.number().positive().max(1_000_000),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().max(80).optional().or(z.literal("")),
  inStock: z.coerce.boolean().default(true),
  images: z.array(imagePathSchema).min(1)
});

export const settingsSchema = z.object({
  shopName: z.string().min(2).max(120),
  whatsappNumber: z.string().min(5).max(20),
  address: z.string().min(5).max(200),
  hours: z.string().min(3).max(100),
  deliveryText: z.string().min(3).max(120),
  announcementText: z.string().max(200).optional().or(z.literal(""))
});

export const followerSchema = z.object({
  name: z.string().min(2).max(80),
  whatsapp: z.string().min(5).max(20),
  email: z.string().email().optional().or(z.literal(""))
});
