import "./globals.css";
import type { Metadata } from "next";
import { Cormorant_Garamond, Lato } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VisitTracker from "../components/VisitTracker";
import { getSettings } from "../lib/settings";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"]
});
const body = Lato({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "700"]
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.shopName,
    description: "Premium ladieswear — sarees, kurtis, salwar suits & more. Order on WhatsApp."
  };
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <VisitTracker />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
