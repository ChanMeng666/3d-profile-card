import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: '3D Profile Card',
  description: 'Interactive 3D profile card built with Next.js and Three.js',
  keywords: ['Next.js', 'Three.js', '3D', 'Profile', 'Portfolio'],
  authors: [{ name: 'Your Name' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-gradient-to-br from-background to-foreground min-h-screen">
        <main className="flex min-h-screen flex-col items-center justify-center p-4">
          {children}
        </main>
      </body>
    </html>
  );
}
