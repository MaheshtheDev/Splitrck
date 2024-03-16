import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { NextAuthProvider } from "./providers";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

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
        <body className={montserrat.className + " bg-white"}>{children}</body>
      </NextAuthProvider>
    </html>
  );
}
