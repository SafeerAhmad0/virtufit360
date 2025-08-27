import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist, Geist_Mono } from 'next/font/google';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1b4b' },
  ],
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "VirtuFit360 - Virtual Try-On for Pakistani Wear",
  description: "Experience traditional Pakistani clothing with our AI-powered virtual try-on technology",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'VirtuFit360 - Virtual Try-On for Pakistani Wear',
    description: 'Experience traditional Pakistani clothing with our AI-powered virtual try-on technology',
    type: 'website',
    locale: 'en_US',
  },
};

import HoveringNavbar from '../components/HoveringNavbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-full">
        {children}
        <HoveringNavbar />
      </body>
    </html>
  );
}
