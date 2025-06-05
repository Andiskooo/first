'use client';

import React, { useState } from 'react';
import { Product, ProductModel } from '@/app/products/[id]/data';
import { ChevronDown, ChevronUp, CircleCheck } from 'lucide-react';
import ContactButtonClient from './ContactButtonClient';


interface ProductInteractiveSectionsProps {
  product: Product;
}

const ProductInteractiveSections: React.FC<ProductInteractiveSectionsProps> = ({ product }) => {
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(
    product.models && product.models.length > 0 ? product.models[0] : null
  );
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  const handleModelChange = (model: ProductModel) => {
    setSelectedModel(model);
  };

  const displayPrice = selectedModel?.price ?? product.price;

  return (
    <>
      {/* Description and key features in dropdown */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full py-3 px-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-medium text-gray-800">Karakteristikat Kryesore & Përshkrimi</h3>
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
            
            {product.features && product.features.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Detajet Kryesore</h3>
                <ul className="space-y-1 text-sm">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CircleCheck className="text-green-500 mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
                className={`px-4 py-2 border rounded-md text-sm transition-colors ${
                  selectedModel?.id === model.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600 font-semibold'
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                }`}
              >
                {model.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price and Add to Cart */}
      <div className="mb-8">
        {displayPrice && (
          <p className="text-3xl font-bold text-blue-600 mb-4">€{displayPrice}</p>
        )}
      </div>

      <ContactButtonClient />
    </>
  );
};

export default ProductInteractiveSections;
