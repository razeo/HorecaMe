import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'HorecaMe — B2B HORECA Marketplace',
    template: '%s | HorecaMe',
  },
  description:
    'The definitive B2B marketplace for the HORECA sector in Montenegro and the Adriatic. Supplier aggregation, digital procurement, and industry content.',
  keywords: ['HORECA', 'B2B', 'marketplace', 'Montenegro', 'procurement', 'suppliers'],
  authors: [{ name: 'HorecaMe' }],
  creator: 'HorecaMe',
  manifest: '/manifest.json',
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-512x512.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HorecaMe',
  },
};

export const viewport: Viewport = {
  themeColor: '#2D4654',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="me" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
