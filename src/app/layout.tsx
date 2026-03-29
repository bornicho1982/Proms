import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

// Remove this import if you don't use it, but keeping it for PWA
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Proms - AI Prompt Generator",
  description: "Advanced photo-based AI prompt generation pipeline for Flux & Midjourney",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#8b5cf6' }, baseTheme: undefined }}>
      <html lang="es" className="dark" data-scroll-behavior="smooth">
        <head>
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#0f172a" />
          <link rel="apple-touch-icon" href="/icons/icon-192.png" />
          <link rel="icon" href="/icons/icon-192.png" />
        </head>
        <body className={inter.variable}>
          {children}
          <ServiceWorkerRegistration />
        </body>
      </html>
    </ClerkProvider>
  );
}
