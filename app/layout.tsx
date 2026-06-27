import type { Metadata } from "next";
import "./globals.css";

/**
 * Font note
 * ---------
 * This build environment has no access to fonts.googleapis.com, so the
 * project ships with a system-font fallback stack (see --font-display /
 * --font-body in globals.css). On your own machine, you can upgrade to the
 * original webfont pairing (Inter Tight for display, Inter for body) by
 * uncommenting the block below — the CSS variable names already line up,
 * so nothing else needs to change.
 *
 *   import { Inter, Inter_Tight } from "next/font/google";
 *
 *   const interTight = Inter_Tight({
 *     variable: "--font-display",
 *     subsets: ["latin"],
 *     weight: ["500", "600", "700", "800"],
 *     display: "swap",
 *   });
 *
 *   const inter = Inter({
 *     variable: "--font-body",
 *     subsets: ["latin"],
 *     weight: ["400", "500", "600"],
 *     display: "swap",
 *   });
 *
 * Then add `className={`${interTight.variable} ${inter.variable}`}` to the
 * <html> tag below.
 */

export const metadata: Metadata = {
  title: "Harsh Wardhan — AI Generalist",
  description:
    "Portfolio of Harsh Wardhan, AI Generalist — building at the intersection of artificial intelligence, cinematic storytelling, and modern frontend engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
