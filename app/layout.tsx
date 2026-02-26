import type { Metadata, Viewport } from "next";
import { Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323",
});

export const metadata: Metadata = {
  title: "Ayush Lahiri | Pixel Portfolio",
  description:
    "Explore Ayush Lahiri's portfolio as a 2D pixel Pokemon-style adventure. Walk through the town and enter buildings to discover projects, experience, education, and more.",
  keywords: [
    "Ayush Lahiri",
    "portfolio",
    "pixel art",
    "developer",
    "game portfolio",
    "CS student",
    "full stack",
  ],
  authors: [{ name: "Ayush Lahiri" }],
};

export const viewport: Viewport = {
  themeColor: "#1a1c2c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart.variable} ${vt323.variable}`}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
