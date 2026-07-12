import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "借代偵探學院",
  description: "給臺灣國中生的借代修辭卡牌冒險",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-Hant-TW" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
