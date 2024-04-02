import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

import { NextAuthProvider } from "./providers";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://splitrck.mtd.wtf/"),
  title: "Splitrck",
  description: "Analytics for your Splitwise",
  creator: "MaheshtheDev",
  keywords: ["splitwise", "analytics", "splitrck"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://splitrck.mtd.wtf/",
    siteName: "Splitrck",
    description: "Analytics for your Splitwise",
  },
  icons: {
    icon: "/favicon.ico",
  },
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
        <link rel="icon" href="/favicon.ico" />
      </head>
      <NextAuthProvider>
        <body className={montserrat.className + " bg-white"}>{children}</body>
      </NextAuthProvider>
    </html>
  );
}
