'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

// Define the type for a featured product
export type FeaturedProduct = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;       // Ensure this is always a string
  link: string;
  imagePosition: 'left' | 'right';
  accentColor?: string;   // Single color for accent bar, button, and subtitle
  subtitle?: string;      // Optional subtitle
};

// Define props interface for the component
interface FeaturedProductsSectionProps {
  products: FeaturedProduct[];
  title?: string;         // Optional section title
  className?: string;     // Optional additional CSS classes
  showArrow?: boolean;    // Optional flag to show/hide arrow in button
  buttonText?: string;    // Optional custom button text
}

// Default featured products as example data
export const defaultFeaturedProducts: FeaturedProduct[] = [
  {
    id: 'heatpump',
    title: 'Pompa Termike Serene Climate – Zgjedhja më e kompletuar për shtëpinë tuaj',
    description: 'Pompa termike Serene Climate ofron ngrohje dhe ftohje të avancuar me efikasitet maksimal. E vlerësuar me klasën energjetike A+++, kjo pajisje ka të gjitha pajisjet përcjellëse të përfshira brenda njësisë – duke eliminuar nevojën për instalime shtesë apo module të jashtme. Me funksionim të qëndrueshëm edhe në temperatura ekstreme, dhe kontroll të integruar WiFi, Serene Climate është zgjidhja ideale për komoditet dhe kursim afatgjatë',
    imageUrl: '/featured/pompa-termike.png',
    link: '/products/pompa-nxehtesie-serene',
    imagePosition: 'right',
    subtitle: 'Cilësia është kursim',
    accentColor: 'red-600',
  },
  {
    id: 'klima',
    title: 'Kondicioneri Pura – Performancë italiane për çdo shtëpi',
    description: 'Modeli Pura nga brendi i njohur italian Candy është zgjedhja më e leverdishme për ambientin tuaj. Me efikasitet të lartë energjetik A+++/A++, funksionim të qetë dhe konsum të ulët, ky kondicioner garanton komoditet të përditshëm me kosto të arsyeshme.',
    imageUrl: '/featured/klima.png',
    link: '/products/kondicioner-aria',
    imagePosition: 'left',
    subtitle: 'Cilësia është kursim',
    accentColor: 'blue-600',
  },
  {
    id: 'boiler',
    title: 'Boiler EcoPump – Efikasitet i avancuar për ngrohjen e ujit në çdo shtëpi',
    description: 'Boileri EcoPump nga ECOTEK është zgjidhja më ekonomike dhe moderne për ngrohjen e ujit sanitar në kushte shtëpiake. I pajisur me një sistem të integruar me pomë termike, ai siguron ujë të ngrohtë me një konsum energjie shumë më të ulët krahasuar me boilerët klasikë me rezistencë elektrike – deri në 5 herë më pak shpenzim.',
    imageUrl: '/featured/bojleri.png',
    link: '/products/boiler-ecopump',
    imagePosition: 'right',
    subtitle: 'Cilësia është kursim',
    accentColor: 'green-600',
  },
];

const FeaturedProductsSection = ({
  products,
  title,
  className = '',
  showArrow = true,
  buttonText = 'Shiko Produktin'
}: FeaturedProductsSectionProps) => {
  const [imgRatios, setImgRatios] = useState<Record<string, number>>({});
  // Color mapping for Tailwind classes
  const colorMap: Record<string, { bg: string, hover: string, text: string }> = {
    'red': {
      bg: 'bg-red-600',
      hover: 'hover:bg-red-700',
      text: 'text-red-600',
    },
    'orange': {
      bg: 'bg-orange-600',
      hover: 'hover:bg-orange-700',
      text: 'text-orange-600',
    },
    'blue': {
      bg: 'bg-blue-600',
      hover: 'hover:bg-blue-700',
      text: 'text-blue-600',
    },
    'green': {
      bg: 'bg-green-600',
      hover: 'hover:bg-green-700',
      text: 'text-green-600',
    },
  }
  
  return (
    <section className={`py-16 space-y-24 ${className}`}>
      {title && (
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        </div>
      )}

      {products.map((product) => (
        <div key={product.id} className={`container mx-auto px-4 overflow-hidden group`}>

          <div
            className={`flex flex-col ${product.imagePosition === 'left' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-stretch overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
          >
            {/* Image Column - 2/3 width on md+ */}
            <div className="w-full lg:w-2/5 relative overflow-hidden">
              {/* Main image */}
              <div className="relative w-full" style={{ aspectRatio: imgRatios[product.id] ?? 16/9 }}>
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  onLoadingComplete={({ naturalWidth, naturalHeight }) => {
                    if (naturalHeight > 0) {
                      const ratio = naturalWidth / naturalHeight;
                      setImgRatios(prev => ({ ...prev, [product.id]: ratio }));
                    }
                  }}
                />
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              </div>
            </div>

            {/* Text Column - 1/3 width on md+ */}
            <div className="w-full lg:w-3/5 p-8 lg:p-12 flex flex-col justify-center text-gray-800 relative">
              {/* Red accent bar - only visible on large screens */}
              {
                /* Get color from map based on first part of accentColor (e.g., 'orange' from 'orange-600') */
                (() => {
                  const colorKey = product.accentColor?.split('-')[0] || 'red';
                  const color = colorMap[colorKey] || colorMap.red;
                  return (
                    <div className={`hidden lg:block absolute top-0 bottom-0 ${product.imagePosition === 'left' ? 'right-0' : 'left-0'} w-2 ${color.bg}`}></div>
                  );
                })()
              }
              {product.subtitle && (
                <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${(() => {
                  const colorKey = product.accentColor?.split('-')[0] || 'red';
                  return colorMap[colorKey]?.text || colorMap.red.text;
                })()}`}>
                  {product.subtitle}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                {product.title}
              </h2>
              <p className="text-base md:text-lg mb-8 opacity-90">
                {product.description}
              </p>
              <Button asChild size="lg" className={`${(() => {
                const colorKey = product.accentColor?.split('-')[0] || 'red';
                const color = colorMap[colorKey] || colorMap.red;
                return `${color.bg} ${color.hover}`;
              })()} text-white group transition-all`}>
                <Link href={product.link}>
                  {buttonText}
                  {showArrow && (
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  )}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};

export default FeaturedProductsSection;
