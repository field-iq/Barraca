import type { Metadata } from 'next';
import { DM_Serif_Display, Manrope } from 'next/font/google';
import './globals.css';

const heading = DM_Serif_Display({ subsets: ['latin'], weight: '400', variable: '--font-heading' });
const body = Manrope({ subsets: ['latin'], variable: '--font-body' });

export const metadata: Metadata = {
  title: 'La Barraca de Juan — Handmade timber furniture',
  description: 'Custom tables, robes and cabinetry made by hand in Australia.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
