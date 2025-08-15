import Categories from "@/components/sections/Categories";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import FeaturedProductsSection, { defaultFeaturedProducts } from "@/components/sections/FeaturedProductsSection";
import VideoSection from "@/components/sections/VideoSection"; // Import the new component
import LocalizedHero from "@/components/sections/LocalizedHero";

export default function Home() {
  return (
    <>
      {/* Localized Hero picks texts based on current language */}
      <LocalizedHero />
      <Categories />
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
