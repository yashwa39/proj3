import type { Metadata } from "next";
import { Fira_Code, Inter } from "next/font/google";
import "@/styles/globals.css";
import { env } from "@/lib/env";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbonMirror — Your Future Climate Self",
  description:
    "See the future you're creating. Switch timelines, explore paths, and change what matters.",
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${firaCode.variable}`}>
      <body className="bg-bg text-slate-100 antialiased">{children}</body>
    </html>
  );
}
