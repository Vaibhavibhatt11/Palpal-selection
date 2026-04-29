import "./globals.css";
import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import VisitTracker from "../components/VisitTracker";
import { getSettings } from "../lib/settings";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-heading" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.shopName,
    description: "Local shop product catalog"
  };
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const themeScript = `
    (() => {
      try {
        const stored = localStorage.getItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        if ((stored && stored === "dark") || (!stored && prefersDark)) {
          document.documentElement.classList.add("dark");
        }
      } catch {}
    })();
  `;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${manrope.variable} ${space.variable}`}
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <VisitTracker />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
