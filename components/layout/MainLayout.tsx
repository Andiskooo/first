'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isTransparentHeader = pathname === "/" || pathname.startsWith("/categories");
  const headerVariant = isTransparentHeader ? 'transparent' : 'solid';

  return (
    <>
      <Header variant={headerVariant} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
