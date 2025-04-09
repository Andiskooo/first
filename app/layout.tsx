import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import MainLayout from '@/components/layout/MainLayout'; // Import the new client layout wrapper
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Metadata MUST be exported from a Server Component
export const metadata: Metadata = {
  title: 'ECOTEK - Zgjidhje Inovative Elektrike & Hidrosanitare',
  description: 'ECOTEK ofron zgjidhje të avancuara për ngrohje qendrore, klimatizim, ventilim dhe energji solare në Kosovë.',
  // Add more metadata: keywords, open graph, etc.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sq" suppressHydrationWarning> {/* Set language to Albanian */}
      {/* Body tag is now rendered by MainLayout, pass className */}
      <MainLayout bodyClassName={inter.className}>
        {children}
      </MainLayout>
    </html>
  );
}

