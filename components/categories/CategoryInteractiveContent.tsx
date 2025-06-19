'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Category, Product} from '@/app/categories/[id]/data'; // Assuming data types are exported
import {  CircleCheck } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface CategoryInteractiveContentProps {
  category: Category;
  allProducts: Product[];
  initialSubcategoryId: string | null;
}

const CategoryInteractiveContent: React.FC<CategoryInteractiveContentProps> = ({ category, allProducts, initialSubcategoryId }) => {
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(initialSubcategoryId);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const products = activeSubcategory
      ? allProducts.filter(product => product.subcategory === activeSubcategory)
      : allProducts;
    setFilteredProducts(products);

    // Construct the new query parameters
    const newParams = new URLSearchParams(searchParams.toString());
    if (activeSubcategory) {
      newParams.set('subcategory', activeSubcategory);
    } else {
      newParams.delete('subcategory');
    }
    
    const newQueryString = newParams.toString();

    // Only call router.replace if the query string actually needs to change
    if (searchParams.toString() !== newQueryString) {
      router.replace(`${pathname}?${newQueryString}`, { scroll: false });
    }

  }, [activeSubcategory, allProducts, router, pathname, searchParams]);

  const selectSubcategory = (subcategoryId: string | null) => {
    setActiveSubcategory(subcategoryId);
  };

  const currentSubcategoryDetails = activeSubcategory 
    ? category.subcategories.find(sub => sub.id === activeSubcategory) 
    : null;

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Kryefaqja</Link>
            <span className="mx-2">/</span>
            <Link href={`/categories/${category.id}`} className="hover:text-blue-600">{category.title}</Link>
            {currentSubcategoryDetails && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">
                  {currentSubcategoryDetails.title}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Subcategory tabs */}
        {category.subcategories && category.subcategories.length > 0 && (
          <div className="mb-8 overflow-x-auto">
            <div className="flex space-x-3 pb-2">
              <button
                onClick={() => selectSubcategory(null)}
                className={`flex items-center justify-center space-x-0 sm:space-x-2 transition p-2 ${activeSubcategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full`}
              >
                <Image
                  src="/icons/info.svg" // Generic icon for 'All'
                  alt="Të gjitha"
                  width={32}
                  height={32}
                  className={`w-8 h-8 sm:w-6 sm:h-6 filter ${activeSubcategory === null ? 'brightness-90' : 'brightness-110'}`}
                />
                <span className="hidden sm:inline font-medium">Të gjitha</span>
              </button>
              {category.subcategories.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => selectSubcategory(sub.id)}
                  className={`flex items-center justify-center space-x-0 sm:space-x-2 transition p-2 ${activeSubcategory === sub.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full`}
                >
                  <Image
                    src={`/${sub.icon}`}
                    alt={sub.title}
                    width={32}
                    height={32}
                    className={`w-8 h-8 sm:w-6 sm:h-6 filter ${activeSubcategory === sub.id ? 'brightness-90' : 'brightness-110'}`}
                  />
                  <span className="hidden sm:inline font-medium">{sub.title}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Product grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <Link 
                href={`/products/${product.id}`} 
                key={product.id}
                className="group h-full"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                      {product.title}
                    </h3>
                    <hr className="my-4 border-gray-300" />
                    {product.features && product.features.length > 0 && (
                      <div className="space-y-1 mb-4">
                        {product.features.slice(0, 3).map((feature, index) => ( // Show only first 3 features for brevity
                          <div key={index} className="flex items-start">
                            <CircleCheck className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-auto">
                      Shiko detajet
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-xl font-semibold mb-2">Nuk ka produkte</h2>
            <p className="text-gray-600">Na vjen keq, nuk ka produkte që përputhen me këtë nënkategori.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryInteractiveContent;
