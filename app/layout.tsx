// src/app/layout.tsx

import type { Metadata } from 'next';
import { Cormorant_Garamond, Great_Vibes } from 'next/font/google';

import './globals.css';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
});

const greatVibes = Great_Vibes({
  variable: '--font-great-vibes',
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Joseph & Praise | Wedding Celebration",
  description: 'Everything you need to celebrate Praise and Joseph.',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    shortcut: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${cormorant.variable} ${greatVibes.variable} min-h-screen bg-cream text-ink antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}