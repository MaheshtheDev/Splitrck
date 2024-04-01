import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { NextAuthProvider } from "./providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Splitrck",
  description: "Analytics for your Splitwise",
  creator: "MaheshtheDev",
  keywords: ["splitwise", "analytics", "splitrck"],
  icons: [
    {
      href: "/favicon.ico",
      sizes: "64x64",
      type: "image/png",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Splitrck</title>
      </head>
      <NextAuthProvider>
        <body className={montserrat.className + " bg-white"}>{children}</body>
      </NextAuthProvider>
    </html>
  );
}
