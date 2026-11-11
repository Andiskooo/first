'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { LanguageProvider } from '@/components/LanguageProvider';
import type { InstallationNavItem } from '@/lib/installations/data';
import { usePathname } from 'next/navigation';

interface MainLayoutProps {
  children: React.ReactNode;
  installationLocations: InstallationNavItem[];
}

export default function MainLayout({ children, installationLocations }: MainLayoutProps) {
  const pathname = usePathname();
  // Fullscreen app-like chat route: hide site chrome on mobile so only the
  // chatbot is visible; desktop keeps the normal header/footer.
  const isChatPage = pathname === '/asistenti';

  return (
    <>
      <LanguageProvider>
        {isChatPage ? (
          <>
            <div className="hidden md:block">
              <Header installationLocations={installationLocations} />
            </div>
            {/* Mobile: the chat tab fills exactly one viewport height (its own
                messages container scrolls); the video tab scrolls the page
                normally — hence min-h, never a scroll lock. */}
            <main className="min-h-dvh md:h-auto">
              {children}
            </main>
            <div className="hidden md:block">
              <Footer />
            </div>
          </>
        ) : (
          <>
            <Header installationLocations={installationLocations} />
            <main>{children}</main>
            <Footer />
          </>
        )}
      </LanguageProvider>
    </>
  );
}
