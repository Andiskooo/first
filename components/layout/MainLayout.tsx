'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: React.ReactNode;
  bodyClassName?: string; // Pass the font class name
}

export default function MainLayout({ children, bodyClassName }: MainLayoutProps) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const headerVariant = isHomePage ? 'transparent' : 'solid';

  return (
    <body className={cn(bodyClassName, "flex flex-col min-h-screen bg-background text-foreground")}>
      <Header variant={headerVariant} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </body>
  );
}
