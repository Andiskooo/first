'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Define the type for a featured product
export type FeaturedProduct = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;       // Ensure this is always a string
  link: string;
  imagePosition: 'left' | 'right';
  bgColor?: string;       // Made optional with default in component
  textColor?: string;     // Made optional with default in component
  buttonColor?: string;   // Made optional with default in component
  subtitle?: string;      // Added optional subtitle
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
    title: 'Pompa Nxehtësie Inverter ECOTHERM Monoblock',
    description: 'Efikasitet superior dhe performancë e lartë për ngrohje dhe ftohje. Teknologji Inverter për kursim maksimal të energjisë dhe komoditet optimal gjatë gjithë vitit.',
    imageUrl: '/featured/pompa-termike.jpg',
    link: '/produkte/pompa-nxehtesie',
    imagePosition: 'right',
    subtitle: 'Zgjedhje moderne',
  },
  {
    id: 'klima',
    title: 'Kondicioner Inverter ECOKLIMA',
    description: 'Freski dhe ajër i pastër në shtëpinë tuaj. Dizajn modern, operim i qetë dhe teknologji Inverter për të mbajtur temperaturën ideale me konsum minimal energjie.',
    imageUrl: '/featured/klima.jpg',
    link: '/produkte/kondicioner',
    imagePosition: 'left',
    subtitle: 'Zgjedhje moderne',
  },
];

const FeaturedProductsSection = ({
  products,
  title,
  className = '',
  showArrow = true,
  buttonText = 'Shiko Produktin'
}: FeaturedProductsSectionProps) => {
  // Default styles
  const defaultTextColor = 'text-gray-800';
  const defaultButtonColor = 'bg-blue-600 hover:bg-blue-700 text-white';
  
  return (
    <section className={`py-8 space-y-24 ${className}`}>
      {title && (
        <div className="container mx-auto px-4 text-center mb-12">
          <h2 className="text-3xl font-bold">{title}</h2>
        </div>
      )}

      {products.map((product) => (
        <div key={product.id} className={`container mx-auto px-4 overflow-hidden`}> {/* Removed card styling */}

          <div
            className={`flex flex-col ${product.imagePosition === 'left' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center overflow-hidden rounded-xl p-2 md:p-4 ${product.bgColor || 'bg-gradient-to-br from-gray-50 to-gray-100'}`}
          >
            {/* Image Column - 2/3 width on md+ */}
            <div className="w-full md:w-2/3 relative overflow-hidden">
              {/* Main image */}
              <div className="relative w-full h-64 md:h-[400px]">
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain' }}
                  className="transition-transform hover:scale-105 duration-700"
                  priority
                />
              </div>
            </div>

            {/* Text Column - 1/3 width on md+ */}
            <div className={`w-full md:w-1/3 p-8 md:p-12 ${product.textColor || defaultTextColor}`}> {/* Text container takes 1/3 width on md+ */}
              {product.subtitle && (
                <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">
                  {product.subtitle}
                </p>
              )}
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {product.title}
              </h2>
              <p className="text-lg mb-8 opacity-90">
                {product.description}
              </p>
              <Button asChild size="lg" className={`${product.buttonColor || defaultButtonColor} group transition-all`}>
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
