'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import type { InstallationNavItem } from '@/lib/installations/data';

interface MainLayoutProps {
  children: React.ReactNode;
  installationLocations: InstallationNavItem[];
}

export default function MainLayout({ children, installationLocations }: MainLayoutProps) {
  return (
    <>
      <LanguageProvider>
        <Header installationLocations={installationLocations} />
        <main>
          {children}
        </main>
        <Footer />
      </LanguageProvider>
    </>
  );
}
