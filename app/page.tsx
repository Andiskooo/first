import HeroCarousel from "@/components/sections/HeroCarousel";
import Categories from "@/components/sections/Categories";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import FeaturedProductsSection, { defaultFeaturedProducts } from "@/components/sections/FeaturedProductsSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Categories />
      <FeaturedProductsSection 
        products={defaultFeaturedProducts} 
        title="Produktet Tona të Veçanta"
        showArrow={true}
      />
      <BlogSection />
      <ContactSection />
    </>
  );
}
