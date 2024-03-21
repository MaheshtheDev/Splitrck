import type { Metadata } from "next";
import { Dongle } from "next/font/google";

import { NextAuthProvider } from "./providers";
import "./globals.css";

const dongle = Dongle({
  weight: ["300", "400", "700"],
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: "Splitrck",
  description: "Spend. Track. Save.",
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
        <body className={dongle.className + " bg-white"}>{children}</body>
      </NextAuthProvider>
    </html>
  );
}
