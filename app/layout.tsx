// src/app/layout.tsx

import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Great_Vibes } from 'next/font/google';

import './globals.css';

import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

import { SEO } from '@/config/seo';

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
  metadataBase: new URL(SEO.url),

  title: {
    default: SEO.title,
    template: `%s | ${SEO.shortTitle}`,
  },

  description: SEO.description,

  keywords: [...SEO.keywords],

  alternates: {
    canonical: SEO.url,
  },

  applicationName: SEO.shortTitle,

  authors: [
    {
      name: SEO.author.name,
      url: SEO.author.url,
    },
  ],

  creator: SEO.author.name,

  publisher: SEO.author.name,

  category: 'Wedding',

  manifest: '/site.webmanifest',

  icons: {
    icon: [
      {
        url: '/logo/favicon-16x16.png',
        sizes: '16x16',
        type: 'image/png',
      },
      {
        url: '/logo/favicon-32x32.png',
        sizes: '32x32',
        type: 'image/png',
      },
      {
        url: '/logo/favicon.ico',
      },
    ],

    shortcut: '/logo/favicon.ico',

    apple: [
      {
        url: '/logo/apple-touch-icon.png',
        sizes: '180x180',
      },
    ],
  },

  openGraph: {
    title: SEO.title,

    description: SEO.description,

    url: SEO.url,

    siteName: SEO.siteName,

    locale: SEO.locale,

    type: 'website',

    images: [
      {
        url: SEO.image,
        width: 1200,
        height: 630,
        alt: "OASIS'26 | Joseph & Praise Wedding",
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',

    title: SEO.title,

    description: SEO.description,

    images: [SEO.image],
  },

  robots: {
    index: true,

    follow: true,

    nocache: false,

    googleBot: {
      index: true,

      follow: true,

      'max-image-preview': 'large',

      'max-snippet': -1,

      'max-video-preview': -1,
    },
  },

  appleWebApp: {
    capable: true,

    title: SEO.shortTitle,

    statusBarStyle: 'black-translucent',
  },

  formatDetection: {
    telephone: false,

    email: false,

    address: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    {
      media: '(prefers-color-scheme: light)',
      color: SEO.themeColor,
    },
    {
      media: '(prefers-color-scheme: dark)',
      color: SEO.themeColor,
    },
  ],

  width: 'device-width',

  initialScale: 1,

  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${cormorant.variable} ${greatVibes.variable} min-h-screen overflow-x-hidden bg-cream text-ink antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <Navbar />

          <main className="relative z-0 flex-1">
            {children}
          </main>

          <Footer />
        </div>
      </body>
    </html>
  );
}