import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { mockProducts, Product } from '@/app/produkte/data';

import ContactSection from '@/components/sections/ContactSection';
import FeaturedProductsSection, { FeaturedProduct } from '@/components/sections/FeaturedProductsSection';

// Filter products for this category
const categoryProducts = mockProducts.filter((product: Product) => 
  product.category === 'pompa-termike' || 
  product.title.toLowerCase().includes('pompa') || 
  product.title.toLowerCase().includes('termike')
);

// Convert products to featured product format
const featuredCategoryProducts: FeaturedProduct[] = categoryProducts.map((product: Product) => ({
  id: product.id,
  title: product.title,
  description: product.shortDescription || product.description.substring(0, 150) + '...',
  imageUrl: product.images[0] || '/placeholder-product.jpg',
  link: `/produkte/${product.id}`,
  imagePosition: Math.random() > 0.5 ? 'left' : 'right', // Randomize image position
  subtitle: 'Pompa Termike'
}));

export default function PompaTermikePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] w-full">
        <div className="absolute inset-0 z-0">
          <Image 
            src="/hero-2.jpg" 
            alt="Pompa Termike" 
            fill 
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Pompa Termike
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8">
            Zgjidhje moderne dhe efikase për ngrohje dhe ftohje të shtëpisë tuaj, me kursim maksimal të energjisë elektrike.
          </p>
          <Button size="lg" className="bg-transparent hover:bg-white/10 text-white border border-white w-fit transition-colors">
            <a href="#produktet">
              Shiko Produktet
            </a>
          </Button>
        </div>
      </section>
      
      {/* Introduction Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Pse të zgjidhni Pompat Termike?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Pompat termike janë sisteme moderne që ofrojnë ngrohje, ftohje dhe ujë të ngrohtë sanitar me efikasitet të lartë energjetik. 
              Duke përdorur teknologjinë inverter, këto sisteme reduktojnë konsumin e energjisë deri në 75% krahasuar me sistemet tradicionale.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Kursim Energjie</h3>
                <p className="text-gray-600 text-center">Reduktim i konsumit të energjisë elektrike deri në 75% krahasuar me sistemet tradicionale.</p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Komfort Gjithë Vjetor</h3>
                <p className="text-gray-600 text-center">Një sistem i vetëm për ngrohje, ftohje dhe ujë të ngrohtë sanitar gjatë gjithë vitit.</p>
              </div>
              
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Ekologjike</h3>
                <p className="text-gray-600 text-center">Reduktim i emetimeve të CO2 dhe përdorim i energjisë së rinovueshme për një mjedis më të pastër.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section id="produktet" className="py-16">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold mb-12 text-center">Produktet Tona</h2>
        </div>
        
        {categoryProducts.length > 0 ? (
          <FeaturedProductsSection 
            products={featuredCategoryProducts}
            buttonText="Shiko Detajet"
            showArrow={true}
          />
        ) : (
          <div className="container mx-auto px-4 text-center py-12">
            <p className="text-lg text-gray-600">Nuk u gjetën produkte në këtë kategori. Ju lutemi kontaktoni për më shumë informacion.</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white mt-4">
              <Link href="/kontakti">
                Na Kontaktoni
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </section>
      
      {/* Contact Section */}
      <ContactSection />
    </>
  );
}
