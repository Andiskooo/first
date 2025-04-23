'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCategoryById, getProductsByCategory, Category, Product } from '@/app/categories/[id]/data';
import { ArrowRight } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  // Unwrap the params Promise using React.use
  const { id } = use(params);
  const searchParams = useSearchParams();
  const subcategoryId = searchParams.get('subcategory');
  
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(subcategoryId);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  // Load category and products
  useEffect(() => {
    const categoryData = getCategoryById(id);
    if (categoryData) {
      setCategory(categoryData);
      
      // Get all products for this category
      const allProducts = getProductsByCategory(id);
      
      // Filter by subcategory if specified
      const initialProducts = activeSubcategory
        ? allProducts.filter(product => product.subcategory === activeSubcategory)
        : allProducts;
        
      setFilteredProducts(initialProducts);
    }
    setLoading(false);
  }, [id, activeSubcategory]);

  // Select a subcategory
  const selectSubcategory = (subcategoryId: string | null) => {
    setActiveSubcategory(subcategoryId);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Kategoria nuk u gjet</h1>
        <p className="mb-6">Na vjen keq, por kategoria që kërkuat nuk u gjet.</p>
        <Button asChild>
          <Link href="/">
            <ArrowRight className="mr-2 h-4 w-4" />
            Kthehu në faqen kryesore
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section with image that covers the header */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src={category.heroImage}
          alt={category.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.title}</h1>
            <p className="text-lg md:text-xl">{category.description}</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Kryefaqja</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{category.title}</span>
            {activeSubcategory && (
              <>
                <span className="mx-2">/</span>
                <span className="text-gray-900 font-medium">
                  {category.subcategories.find(sub => sub.id === activeSubcategory)?.title}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Subcategory tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-3 pb-2">
            <button
              onClick={() => selectSubcategory(null)}
              className={`flex items-center justify-center space-x-0 sm:space-x-2 transition p-2 ${activeSubcategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2 lg:px-6 lg:py-3 rounded-full`}
            >
              <Image
                src="/icons/info.svg"
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

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <Link 
              href={`/products/${product.id}`} 
              key={product.id}
              className="group"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Product image */}
                <div className="relative h-48 bg-gray-100">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                {/* Product info */}
                <div className="p-4">
                  <h3 className="text-lg font-medium mb-2 group-hover:text-blue-600 transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {product.description}
                  </p>
                  
                  {/* Key features */}
                  <div className="space-y-1 mb-4">
                    {product.features.slice(0, 2).map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Shiko detajet
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;