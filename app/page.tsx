import HeroCarousel from "@/components/sections/HeroCarousel";
import Categories from "@/components/sections/Categories";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import FeaturedProductsSection, { defaultFeaturedProducts } from "@/components/sections/FeaturedProductsSection";
import { heroSlidesData } from '@/app/data';

export default function Home() {
  return (
    <>
      <HeroCarousel slides={heroSlidesData} />
      <Categories />
      <FeaturedProductsSection 
        products={defaultFeaturedProducts} 
        title="Produktet Tona"
        showArrow={true}
      />
      <BlogSection />
      <ContactSection />
    </>
  );
}
