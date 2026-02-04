import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
const shouldUseDirect =
  process.env.USE_DIRECT_DB === "true" ||
  (process.env.VERCEL && directUrl && databaseUrl?.includes("pooler"));

if (shouldUseDirect && directUrl) {
  process.env.DATABASE_URL = directUrl;
}

// Reuse PrismaClient across hot reloads in development to avoid connection leaks.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["warn", "error"]
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
