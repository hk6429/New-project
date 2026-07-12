import type { Metadata } from "next";
import { Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import { SiteShell } from "@/components/navigation/site-shell";
import "./globals.css";

const sans = Noto_Sans_TC({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Noto_Serif_TC({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "借代偵探學院",
  description: "給臺灣國中生的借代修辭卡牌冒險",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" data-scroll-behavior="smooth" className={`${sans.variable} ${serif.variable}`}>
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
