import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "上线笔记",
  description: "一个最小可用的 Vercel + Next.js + Supabase 落地页示例。"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
