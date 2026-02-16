import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} font-sans antialiased bg-[#0a0a0a] text-white`}
      >
        {children}
      </body>
    </html>
  );
}
