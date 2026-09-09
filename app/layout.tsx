import type { Metadata } from 'next';

import './globals.css';

export const metadata: Metadata = {
  title: 'Tolu & Chinedu | Wedding Celebration',
  description: 'Everything you need to celebrate Tolu and Chinedu.',
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
