import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launch Notes",
  description: "A minimal Vercel + Next.js + Supabase landing page."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
