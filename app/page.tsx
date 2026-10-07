import Categories from "@/components/sections/Categories";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import FeaturedProductsSection, { defaultFeaturedProducts } from "@/components/sections/FeaturedProductsSection";
import VideoSection from "@/components/sections/VideoSection"; // Import the new component
import LocalizedHero from "@/components/sections/LocalizedHero";
import Link from 'next/link';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Ngrohje dhe Pompa Termike në Kosovë', 'ECOTEK ofron pompa termike, ngrohje qendrore, klimatizim dhe energji solare në Kosovë. Shikoni produktet dhe instalimet e realizuara.', '/', '/logo.png');

export default function Home() {
  return (
    <>
      {/* Localized Hero picks texts based on current language */}
      <LocalizedHero />
      <Categories />
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-semibold text-slate-900">Pompa termike dhe instalime nga ECOTEK</h2>
        <p className="mt-4 max-w-3xl text-slate-600">Nga përzgjedhja e pajisjes te sistemi i ngrohjes: njihuni me pompat termike dhe shikoni projektet tona të realizuara në Kosovë.</p>
        <div className="mt-5 flex flex-wrap gap-6"><Link href="/pompa-termike" className="font-medium text-blue-600 hover:underline">Pompa termike në Kosovë</Link><Link href="/instalimet" className="font-medium text-blue-600 hover:underline">Shikoni instalimet sipas qytetit</Link></div>
      </section>
      <FeaturedProductsSection 
        products={defaultFeaturedProducts} 
        showArrow={true}
      />
      <VideoSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
