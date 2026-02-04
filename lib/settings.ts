import { prisma } from "./db";
import { withTimeout } from "./utils";

export async function getSettings() {
  try {
    const settings = await withTimeout(
      prisma.shopSettings.findUnique({
        where: { id: 1 }
      }),
      null,
      1500
    );
    if (settings) {
      return settings;
    }
  } catch {
    // If DB is temporarily unavailable, fall back to defaults.
  }
  return {
    id: 1,
    shopName: "PALPAL Selection",
    whatsappNumber: "9033339176",
    address: "Tuki Gali, Manish Market, Anand",
    hours: "Mon-Sun: 10:00 AM - 9:00 PM",
    deliveryText: "All India Delivery Available",
    announcementText: "Daily new arrivals for ladies fashion!"
  };
}
