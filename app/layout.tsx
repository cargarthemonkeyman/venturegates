import type { Metadata } from "next";
import { Inter, Playfair_Display, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VentureGates — Discover What Venture You Should Build",
  description:
    "No more generic ideas. VentureGates analyzes your founder profile, generates a personalized Gate system, and shows you ventures that fit YOU — not just the market.",
  keywords: [
    "startup ideas",
    "venture building",
    "founder-market fit",
    "entrepreneurship",
    "AI venture generator",
  ],
  openGraph: {
    title: "VentureGates — Discover What Venture You Should Build",
    description:
      "No more generic ideas. VentureGates analyzes your founder profile and shows you ventures that fit YOU.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} ${ibmPlexMono.variable} font-sans antialiased dot-pattern-bg min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
