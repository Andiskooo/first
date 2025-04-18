import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layout/MainLayout'; // Import the new client layout wrapper
import './globals.css';

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
      <body className={inter.className}>
        <MainLayout>
          {children}
        </MainLayout>
      </body>
    </html>
  );
}
