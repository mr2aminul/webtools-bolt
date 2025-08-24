import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';
import GAMScript from '@/components/layout/GAMScript';
import { initializeGAM } from '@/lib/config/gam';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pixora Tools - Professional Online Utilities',
  description: 'Comprehensive multi-domain suite of online tools for PDF, image, code, QR code, SEO, and utility processing. Convert, compress, format, and transform files with ease.',
  keywords: 'online tools, PDF tools, image tools, code formatter, QR code generator, SEO tools, utilities, file converter',
  authors: [{ name: 'Pixora Tools' }],
  openGraph: {
    title: 'Pixora Tools - Professional Online Utilities',
    description: 'Comprehensive multi-domain suite of online tools for professionals and developers.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
            <GAMScript />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}