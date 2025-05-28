import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layout/MainLayout'; // Import the new client layout wrapper
import './globals.css';
import ClarityAnalytics from '@/components/clarity';

const inter = Inter({ subsets: ['latin'] });

// Metadata MUST be exported from a Server Component
export const metadata: Metadata = {
  title: 'ECOTEK - Zgjidhje Inovative Elektrike & Hidrosanitare',
  description: 'ECOTEK ofron zgjidhje të avancuara për ngrohje qendrore, klimatizim, ventilim dhe energji solare në Kosovë.',
  icons: {
    icon: '/favicon.png',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" suppressHydrationWarning>
      <meta name="facebook-domain-verification" content="xv4f6pb11tao8f8jryy1rgkco6eqs3" />
      <ClarityAnalytics />
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
