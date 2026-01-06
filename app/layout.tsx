import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://apilens.kaustubhp.in'),
  title: {
    default: 'ApiLens - Beautiful JSON API Visualizer & Inspector',
    template: '%s | ApiLens'
  },
  description: 'Visualize, format, and explore JSON APIs with an interactive tree view, table view, and graph visualization. Free online JSON viewer and API testing tool.',
  keywords: [
    'JSON viewer',
    'API visualizer',
    'JSON formatter',
    'API testing tool',
    'REST API client',
    'JSON inspector',
    'API explorer',
    'JSON beautifier',
    'Postman alternative',
    'JSON tree view',
    'API response viewer'
  ],
  authors: [{ name: 'Kaustubh Patil' }],
  creator: 'Kaustubh Patil',
  publisher: 'ApiLens',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://apilens.kaustubhp.in',
    siteName: 'ApiLens',
    title: 'ApiLens - Beautiful JSON API Visualizer',
    description: 'Free online tool to visualize, format, and explore JSON APIs with interactive views. Alternative to Postman for API testing.',
    images: [
      {
        url: '/logo/api-lens.png',
        width: 1200,
        height: 630,
        alt: 'ApiLens - JSON Visualizer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ApiLens - Beautiful JSON API Visualizer',
    description: 'Visualize, format, and explore JSON APIs with interactive tree, table, and graph views.',
    images: ['/logo/api-lens.png'],
    creator: '@kaustubh1111', 
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo/api-lens.png',
    shortcut: '/logo/api-lens.png',
    apple: '/logo/api-lens.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://apilens.kaustubhp.in" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}