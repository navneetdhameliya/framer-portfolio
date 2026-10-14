import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { PlatformBar } from "@/components/layout/PlatformBar";
import { siteConfig } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: `%s — ${siteConfig.title}` },
  description: siteConfig.description,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {/* Boska (display serif) and Switzer (sans) from Fontshare, free for commercial use */}
        <link rel="preconnect" href="https://api.fontshare.com" crossOrigin="" />
        {/* Requested separately: combining both families in one URL drops Switzer */}
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=boska@700,900&display=swap" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=switzer@400,500,600&display=swap" />
      </head>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <PlatformBar />
      </body>
    </html>
  );
}
