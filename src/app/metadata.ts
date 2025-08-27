import { Metadata } from "next";

export const metadata: Metadata = {
  title: "VirtuFit360 - Virtual Try-On for Pakistani Wear",
  description: "Experience traditional Pakistani clothing with our AI-powered virtual try-on technology",
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1e1b4b' },
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://virtufit360.com',
    siteName: 'VirtuFit360',
    title: 'VirtuFit360 - Virtual Try-On for Pakistani Wear',
    description: 'Experience traditional Pakistani clothing with our AI-powered virtual try-on technology',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VirtuFit360 - Virtual Try-On for Pakistani Wear',
    description: 'Experience traditional Pakistani clothing with our AI-powered virtual try-on technology',
  },
};
