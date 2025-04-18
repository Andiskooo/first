'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/app/products/[id]/data';
import { Product } from '@/app/categories/[id]/data';
import { ArrowLeft, Check, ShoppingCart, Heart } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

const ProductPage = ({ params }: ProductPageProps) => {
  // Unwrap the params Promise using React.use
  const { id } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'specifications'>('details');
  const [quantity, setQuantity] = useState(1);

  // Load product data
  useEffect(() => {
    const productData = getProductById(id);
    if (productData) {
      setProduct(productData);
    }
    setLoading(false);
  }, [id]);

  // Handle quantity changes
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Produkti nuk u gjet</h1>
        <p className="mb-6">Na vjen keq, por produkti që kërkuat nuk u gjet.</p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kthehu në faqen kryesore
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Kryefaqja</Link>
            <span className="mx-2">/</span>
            <Link href={`/categories/${product.category}`} className="hover:text-blue-600">
              {product.category.split('-').map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">{product.title}</span>
          </div>
        </div>
      </div>

      {/* Product details */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Product image */}
          <div className="lg:w-1/2">
            <div className="bg-gray-50 rounded-lg p-8 relative aspect-square">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Product info */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold mb-4">{product.title}</h1>
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="text-2xl font-bold text-blue-600 mb-6">
              {product.price} €
            </div>
            
            {/* Key features */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Karakteristikat kryesore</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="text-green-500 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Quantity selector */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Sasia</h3>
              <div className="flex items-center">
                <button 
                  onClick={decreaseQuantity}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-l-md"
                >
                  -
                </button>
                <div className="w-16 h-10 border-t border-b border-gray-300 flex items-center justify-center">
                  {quantity}
                </div>
                <button 
                  onClick={increaseQuantity}
                  className="w-10 h-10 border border-gray-300 flex items-center justify-center rounded-r-md"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Shto në shportë
              </Button>
              <Button variant="outline" className="flex-1 py-6">
                <Heart className="mr-2 h-5 w-5" />
                Shto në të preferuarat
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs for details and specifications */}
        <div className="mt-16">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('details')}
                className={`py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'details'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Detaje
              </button>
              <button
                onClick={() => setActiveTab('specifications')}
                className={`py-4 px-1 border-b-2 font-medium text-lg ${
                  activeTab === 'specifications'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Specifikimet
              </button>
            </div>
          </div>
          
          <div className="py-8">
            {activeTab === 'details' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.details).map(([key, value]: [string, string]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 py-3">
                    <span className="font-medium">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'specifications' && product.specifications && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(product.specifications || {}).map(([key, value]: [string, string]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 py-3">
                    <span className="font-medium">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Related products */}
        {product.relatedProducts && product.relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">Produkte të ngjashme</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {product.relatedProducts.map((relatedId: string) => {
                const relatedProduct = getProductById(relatedId);
                if (!relatedProduct) return null;
                
                return (
                  <Link 
                    href={`/products/${relatedProduct.id}`} 
                    key={relatedProduct.id}
                    className="group"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                      {/* Product image */}
                      <div className="relative h-48 bg-gray-100">
                        <Image
                          src={relatedProduct.image}
                          alt={relatedProduct.title}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                      
                      {/* Product info */}
                      <div className="p-4">
                        <h3 className="text-lg font-medium mb-2 group-hover:text-blue-600 transition-colors">
                          {relatedProduct.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                          {relatedProduct.description}
                        </p>
                        
                        <div className="text-blue-600 font-bold mb-4">
                          {relatedProduct.price} €
                        </div>
                        
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                          Shiko detajet
                        </Button>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;