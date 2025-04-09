import HeroCarousel from "@/components/sections/HeroCarousel";
import Categories from "@/components/sections/Categories";
import BlogSection from "@/components/sections/BlogSection";
import ContactSection from "@/components/sections/ContactSection";
import FeaturedProductsSection from "@/components/sections/FeaturedProductsSection";

export default function Home() {
  return (
    <>
      <HeroCarousel />
      <Categories />
      <FeaturedProductsSection />
      <BlogSection />
      <ContactSection />
    </>
  );
}
