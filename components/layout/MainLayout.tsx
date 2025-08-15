'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <LanguageProvider>
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </LanguageProvider>
    </>
  );
}
