'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCategoryById, getProductsByCategory, Category, Product } from '@/app/categories/[id]/data';
import { ChevronDown, Filter, ArrowRight } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<Record<string, Set<string>>>({});
  const [availableFilters, setAvailableFilters] = useState<Record<string, string[]>>({});

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
      
      // Extract filter options
      const filters: Record<string, Set<string>> = {};
      
      initialProducts.forEach(product => {
        Object.entries(product.details).forEach(([key, value]) => {
          if (!filters[key]) {
            filters[key] = new Set();
          }
          filters[key].add(value);
        });
      });

      // Convert sets to arrays for the UI
      const filtersObject: Record<string, string[]> = {};
      Object.entries(filters).forEach(([key, valueSet]) => {
        filtersObject[key] = Array.from(valueSet);
      });

      setAvailableFilters(filtersObject);
    }
    setLoading(false);
  }, [id, activeSubcategory]);

  // Apply filters when they change
  useEffect(() => {
    if (!category) return;
    
    let result = getProductsByCategory(id);
    
    // Filter by subcategory
    if (activeSubcategory) {
      result = result.filter(product => product.subcategory === activeSubcategory);
    }
    
    // Apply detail filters
    Object.entries(selectedFilters).forEach(([key, valueSet]) => {
      if (valueSet.size > 0) {
        result = result.filter(product => {
          const productValue = product.details[key];
          return productValue && valueSet.has(productValue);
        });
      }
    });
    
    setFilteredProducts(result);
  }, [category, id, activeSubcategory, selectedFilters]);

  // Toggle a filter value
  const toggleFilter = (key: string, value: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev };
      
      if (!newFilters[key]) {
        newFilters[key] = new Set();
      }
      
      if (newFilters[key].has(value)) {
        newFilters[key].delete(value);
      } else {
        newFilters[key].add(value);
      }
      
      return newFilters;
    });
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({});
  };

  // Select a subcategory
  const selectSubcategory = (subcategoryId: string | null) => {
    setActiveSubcategory(subcategoryId);
    setSelectedFilters({});
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
          <div className="flex space-x-2 min-w-max pb-2">
            <Button 
              variant={activeSubcategory === null ? "default" : "outline"}
              onClick={() => selectSubcategory(null)}
              className="whitespace-nowrap"
            >
              Të gjitha
            </Button>
            {category.subcategories.map(subcategory => (
              <Button
                key={subcategory.id}
                variant={activeSubcategory === subcategory.id ? "default" : "outline"}
                onClick={() => selectSubcategory(subcategory.id)}
                className="whitespace-nowrap"
              >
                {subcategory.title}
              </Button>
            ))}
          </div>
        </div>

        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-6">
          <Button 
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center">
              <Filter className="mr-2 h-4 w-4" />
              Filtro Produktet
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar filters - hidden on mobile unless toggled */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block lg:w-1/4 bg-gray-50 p-6 rounded-lg sticky top-24 self-start`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Filtro</h2>
              {Object.keys(selectedFilters).length > 0 ? (
                <Button 
                  onClick={clearFilters}
                  variant="ghost"
                  size="sm"
                  className="text-sm text-gray-600 hover:text-red-600"
                >
                  Pastro të gjitha
                </Button>
              ) : null}
            </div>

            {/* Detail filters */}
            {Object.entries(availableFilters).map(([filterKey, values]) => (
              <div key={filterKey} className="mb-6">
                <h3 className="font-medium mb-3">{filterKey}</h3>
                <div className="space-y-2">
                  {values.map(value => (
                    <div key={`${filterKey}-${value}`} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${filterKey}-${value}`}
                        checked={selectedFilters[filterKey]?.has(value) || false}
                        onChange={() => toggleFilter(filterKey, value)}
                        className="mr-2"
                      />
                      <label htmlFor={`${filterKey}-${value}`} className="text-gray-700">
                        {value}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Product grid */}
          <div className="w-full lg:w-3/4">
            {/* Results count and sort options */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{filteredProducts.length} produkte</p>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Rendit sipas:</span>
                <select className="border rounded p-1">
                  <option>Më të rejat</option>
                  <option>Më populloret</option>
                </select>
              </div>
            </div>

            {/* Product grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                          className="object-contain p-4"
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
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-600 mb-4">Nuk u gjetën produkte që përputhen me filtrat e zgjedhur.</p>
                <Button onClick={clearFilters} variant="outline">
                  Pastro filtrat
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;