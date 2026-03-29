import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { LanguageProvider } from '@/context/LanguageContext';
import "./globals.css";

// Remove this import if you don't use it, but keeping it for PWA
import ServiceWorkerRegistration from "@/components/pwa/ServiceWorkerRegistration";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Proms. — Escribe Menos. Genera como un Pro.",
  description: "Advanced photo-based AI prompt generation pipeline for Flux & Midjourney",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#080810",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider 
      appearance={{ 
        variables: { colorPrimary: '#7c3aed', colorBackground: '#0f0f1a', colorText: '#f4f4f5' },
        elements: { card: { backgroundColor: '#0f0f1a', border: '1px solid #1e1e2e' } }
      }}
    >
      <LanguageProvider>
        <html lang="es" className="dark" data-scroll-behavior="smooth">
          <head>
            <link rel="manifest" href="/manifest.json" />
            <link rel="apple-touch-icon" href="/icons/icon-192.png" />
            <link rel="icon" href="/icons/icon-192.png" />
          </head>
          <body className={`${inter.variable} antialiased font-sans`}>
            {children}
            <ServiceWorkerRegistration />
          </body>
        </html>
      </LanguageProvider>
    </ClerkProvider>
  );
}
