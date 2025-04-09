'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// Define the type for a featured product
type FeaturedProduct = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;       // Ensure this is always a string
  imageUrl2: string;      // Ensure this is always a string
  link: string;
  imagePosition: 'left' | 'right';
  bgColor: string;
  textColor: string;
  buttonColor: string;
};

const featuredProducts: FeaturedProduct[] = [ // Apply the type

  {
    id: 'heatpump',
    title: 'Pompa Nxehtësie Inverter ECOTHERM Monoblock',
    description: 'Efikasitet superior dhe performancë e lartë për ngrohje dhe ftohje. Teknologji Inverter për kursim maksimal të energjisë dhe komoditet optimal gjatë gjithë vitit.',
    imageUrl: '/featured/klima-1.jpg', // Replace with actual image path
    imageUrl2: '/featured/klima-2.jpg', // Replace with second actual image path
    link: '/produkte/pompa-nxehtesie',
    imagePosition: 'right',
    bgColor: 'bg-gradient-to-br from-orange-50 to-amber-100',
    textColor: 'text-gray-800', // Use neutral color
    buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white', // Consistent button style
  },
  {
    id: 'klima',
    title: 'Kondicioner Inverter ECOKLIMA',
    description: 'Freski dhe ajër i pastër në shtëpinë tuaj. Dizajn modern, operim i qetë dhe teknologji Inverter për të mbajtur temperaturën ideale me konsum minimal energjie.',
    imageUrl: '/featured/klima-1.jpg', // Replace with actual image path
    imageUrl2: '/featured/klima-2.jpg', // Replace with second actual image path
    link: '/produkte/kondicioner',
    imagePosition: 'left',
    bgColor: 'bg-gradient-to-br from-blue-50 to-sky-100',
    textColor: 'text-gray-800', // Use neutral color
    buttonColor: 'bg-blue-600 hover:bg-blue-700 text-white', // Consistent button style
  },
];

const FeaturedProductsSection = () => {
  return (
    <section className="py-8 space-y-24"> {/* Increased spacing between items */}

      {featuredProducts.map((product) => (
        <div key={product.id} className={`container mx-auto px-4 overflow-hidden`}> {/* Removed card styling */}

          <div
            className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${product.imagePosition === 'right' ? 'md:flex-row-reverse' : ''}`}
          >
            {/* Image Column - 2/3 width on md+, one image on mobile */}
            <div className="w-full md:w-2/3 flex flex-col sm:flex-row gap-4 h-80 md:h-[500px]"> {/* Image container takes 2/3 width on md+ */}

              <div className="relative w-full sm:w-1/2 h-full">
                 <Image
                   src={product.imageUrl}
                   alt={`${product.title} - Image 1`}
                   layout="fill"
                   objectFit="cover" // Changed to cover
                 />
              </div>
              {/* Second image hidden on smallest screens (mobile) */}
              <div className="relative w-full sm:w-1/2 h-full hidden sm:block">
                 <Image
                   src={product.imageUrl2} // Second image
                   alt={`${product.title} - Image 2`}
                   layout="fill"
                   objectFit="cover" // Changed to cover
                 />
              </div>
            </div>

            {/* Text Column - 1/3 width on md+ */}
            <div className={`w-full md:w-1/3 p-8 md:p-12 ${product.textColor}`}> {/* Text container takes 1/3 width on md+ */}
              <p className="text-sm font-medium text-blue-600 uppercase tracking-wider mb-2">
                Zgjedhje moderne {/* Added subtitle */}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {product.title}
              </h2>
              <p className="text-lg mb-8 opacity-90">
                {product.description}
              </p>
              <Button asChild size="lg" className={`${product.buttonColor} group transition-all`}>
                <Link href={product.link}>
                  Shiko Produktin
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
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
