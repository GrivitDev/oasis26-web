import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Joseph & Praise | Wedding Celebration',
  description: 'Everything you need to celebrate Praise and Joseph.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
