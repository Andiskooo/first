import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout'; // Import the new client layout wrapper
import './globals.css';
import ClarityAnalytics from '@/components/clarity';
import { getInstallationNavigation } from '@/lib/installations/data';
import { businessSchema, siteUrl } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });

// Metadata MUST be exported from a Server Component
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
  const installationLocations = getInstallationNavigation();
  return (
    <html lang="sq" suppressHydrationWarning>
      <head>
        <meta name="facebook-domain-verification" content="xv4f6pb11tao8f8jryy1rgkco6eqs3" />
        <ClarityAnalytics />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema).replace(/</g, '\\u003c') }} />
        <MainLayout installationLocations={installationLocations}>
          {children}
        </MainLayout>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
