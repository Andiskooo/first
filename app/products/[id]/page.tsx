import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata} from 'next';
import { Button } from '@/components/ui/button';
import { getProductById } from '@/app/products/[id]/data';
import { Battery, Gauge, HelpCircle, ThermometerSnowflake, Timer } from 'lucide-react';
import ProductInteractiveSections from '@/components/products/ProductInteractiveSections';
import ContactButtonClient from '@/components/products/ContactButtonClient';
import { notFound } from 'next/navigation';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(
  { params }: ProductPageProps
): Promise<Metadata> {
  const id = (await params).id;
  const product = getProductById(id);

  if (!product) {
    return {
      title: 'Produkti nuk u gjet - EcoTek',
      description: 'Na vjen keq, por produkti që kërkuat nuk mund të gjendet në EcoTek.',
    };
  }

  const description = product.description || product.longDescription?.substring(0, 160).replace(/<[^>]+>/g, '').trim() || `Shikoni detajet për ${product.title} në EcoTek.`;

  return {
    title: product.title,
    description: description,

  };
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const id = (await params).id;
  const product = getProductById(id);

  if (!product) {
    notFound();
  }

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
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">No Image Available</span>
                </div>
              )}
            </div>
          </div>

          {/* Product info (Static part + Client Component for Interactive parts) */}
          <div className="lg:w-1/2">
            <h1 className="text-3xl font-bold mb-3">{product.title}</h1>
            
            {product.badges && product.badges.length > 0 && (
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
            
            {product.keyCharacteristics && product.keyCharacteristics.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {product.keyCharacteristics.map((characteristic, index: number) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600">
                      {getIcon(characteristic.name)}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">{characteristic.name}</div>
                      <div className="font-medium">{characteristic.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <ProductInteractiveSections product={product} />

          </div>
        </div>
        
        {/* Contact Button below interactive sections */}
        <div className="mt-8">
          <ContactButtonClient />
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
                          src={relatedProduct.imageUrl}
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
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-auto">
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