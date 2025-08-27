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
import { CartProvider } from '../context/CartContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`h-full ${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased flex flex-col min-h-full">
        <Toaster position="top-left" toastOptions={{
          style: {
            fontWeight: '600',
            fontSize: '1rem',
            borderRadius: '0.75rem',
            background: '#4f46e5',
            color: '#fff',
            boxShadow: '0 4px 32px 0 rgba(80, 80, 140, 0.10)'
          },
          iconTheme: {
            primary: '#34d399',
            secondary: '#fff',
          },
        }} />
        <AuthProvider>
          <CartProvider>
            {children}
            <HoveringNavbar />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
