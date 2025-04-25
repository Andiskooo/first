'use client';

import React, { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getProductById, Product, ProductModel } from '@/app/products/[id]/data';
import { ArrowLeft, Battery, ChevronDown, ChevronUp, CircleCheck, Download, Gauge, HelpCircle, Settings, ThermometerSnowflake, Timer } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(null);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // Load product data
  useEffect(() => {
    const productData = getProductById(id);
    if (productData) {
      setProduct(productData);
      // Set the first model as default selected if models exist
      if (productData.models && productData.models.length > 0) {
        setSelectedModel(productData.models[0]);
      }
    }
    setLoading(false);
  }, [id]);

  // Update price when model changes
  const handleModelChange = (model: ProductModel) => {
    setSelectedModel(model);
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

  // Determine the price to display
  const displayPrice = selectedModel?.price ?? product.price;

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
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
            
            {/* Badges */}
            {product.badges && (
              <div className="flex flex-wrap gap-2 mb-4">
                {product.badges.map((badge, index: number) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: badge.bgColor || '#e5f6fd', 
                      color: badge.textColor || '#0284c7' 
                    }}
                  >
                    {badge.text}
                  </span>
                ))}
              </div>
            )}
            
            {/* Key characteristics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.keyCharacteristics && product.keyCharacteristics.map((characteristic, index: number) => {
                // Function to get the appropriate icon based on characteristic name
                const getIcon = (name: string) => {
                  const lowerName = name.toLowerCase();
                  if (lowerName.includes('fuqi')) return <Gauge className="h-5 w-5" />;
                  if (lowerName.includes('efikas')) return <Battery className="h-5 w-5" />;
                  if (lowerName.includes('garanc')) return <Timer className="h-5 w-5" />;
                  if (lowerName.includes('zhurm') || lowerName.includes('temperat')) 
                    return <ThermometerSnowflake className="h-5 w-5" />;
                  return <HelpCircle className="h-5 w-5" />;
                };
                
                return (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {getIcon(characteristic.name)}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{characteristic.name}</div>
                      <div className="font-medium">{characteristic.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Description and key features in dropdown */}
            <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
                className="w-full py-3 px-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <h3 className="font-medium text-gray-800">Karakteristikat Kryesore</h3>
                {isDescriptionOpen ? 
                  <ChevronUp className="h-5 w-5 text-gray-500" /> : 
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                }
              </button>
              
              {isDescriptionOpen && (
                <div className="p-4 border-t border-gray-200">
                  {product.longDescription && (
                    <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                  )}
                  
                  {/* Key features */}
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Karakteristikat kryesore</h3>
                    <ul className="space-y-1 text-sm">
                      {product.features.slice(0, 4).map((feature: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <CircleCheck className="text-green-500 mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {/* Models selection */}
            {product.models && product.models.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Zgjidhni modelin:</h3>
                <div className="flex flex-wrap gap-2">
                  {product.models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model)}
                      className={`px-4 py-2 border ${
                        selectedModel?.id === model.id
                          ? 'border-blue-600 bg-blue-50 text-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      } rounded-md text-sm font-medium transition-colors`}
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Price */}
            <div className="text-2xl font-bold text-blue-600 mb-6">
              {displayPrice} €
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6">
                Na Kontaktoni
              </Button>
              <Button variant="outline" className="flex-1 py-6">
                Manuali i Perdorimit
              </Button>
            </div>
          </div>
        </div>
        
        {/* Specifications and Downloads Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="w-full border-b flex justify-start mb-6 bg-transparent p-0 h-auto">
              <TabsTrigger 
                value="specifications" 
                className="text-base py-3 px-5 rounded-none border-0 border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                <Settings className="w-4 h-4 mr-2" />
                Specifikimet
              </TabsTrigger>
              <TabsTrigger 
                value="downloads" 
                className="text-base py-3 px-5 rounded-none border-0 border-b-2 data-[state=active]:border-blue-600 data-[state=active]:bg-transparent data-[state=active]:text-blue-600 data-[state=active]:shadow-none"
              >
                <Download className="w-4 h-4 mr-2" />
                Shkarkime
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {product.specifications && Object.entries(product.specifications).map(([key, value]: [string, string]) => (
                  <div key={key} className="flex justify-between border-b border-gray-200 py-3">
                    <span className="font-medium">{key}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="downloads" className="mt-0">
              <div className="space-y-4">
                {product.downloads && product.downloads.map((download, index: number) => (
                  <a 
                    key={index} 
                    href={download.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-md mr-4">
                      <Download className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{download.title}</h4>
                      <p className="text-sm text-gray-500">{download.description}</p>
                    </div>
                  </a>
                ))}
                
                {(!product.downloads || product.downloads.length === 0) && (
                  <div className="text-center py-10">
                    <p className="text-gray-500">Nuk ka shkarkime të disponueshme për këtë produkt.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
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
                    className="group h-full"
                  >
                    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
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
                      <div className="p-4 flex flex-col flex-grow">
                        <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                          {relatedProduct.title}
                        </h3>
                        
                        <div className="text-blue-600 font-medium mt-auto">
                          {relatedProduct.price} €
                        </div>
                      </div>  
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        Shiko detajet
                      </Button>
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