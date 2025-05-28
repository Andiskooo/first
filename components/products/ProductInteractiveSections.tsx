'use client';

import React, { useState } from 'react';
import { Product, ProductModel, Download as DownloadData } from '@/app/products/[id]/data'; // Added DownloadData alias
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, CircleCheck, Download as DownloadIcon } from 'lucide-react'; // Renamed Download to DownloadIcon
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
        <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
          Shto në shportë
        </Button>
      </div>

      {/* Specifications & Downloads Tabs */}
      {(product.specifications && Object.keys(product.specifications).length > 0) || (product.downloads && product.downloads.length > 0) ? (
        <Tabs defaultValue={(product.specifications && Object.keys(product.specifications).length > 0) ? "specifications" : "downloads"} className="w-full">
          <TabsList className={`grid w-full mb-4 ${
            (product.specifications && Object.keys(product.specifications).length > 0 && product.downloads && product.downloads.length > 0) ? 'grid-cols-2' : 'grid-cols-1'
          }`}>
            {product.specifications && Object.keys(product.specifications).length > 0 && <TabsTrigger value="specifications">Specifikimet</TabsTrigger>}
            {product.downloads && product.downloads.length > 0 && <TabsTrigger value="downloads">Shkarkime</TabsTrigger>}
          </TabsList>
          
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <TabsContent value="specifications">
              <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg">
                <table className="min-w-full text-sm">
                  <tbody>
                    {Object.entries(product.specifications).map(([specName, modelsData], specIndex) => (
                      <React.Fragment key={specIndex}>
                        <tr className="bg-gray-100">
                          <td colSpan={selectedModel && product.models && product.models.length > 0 ? 2 : 1} className="py-2 px-3 font-semibold text-gray-700">
                            {specName}
                          </td>
                        </tr>
                        {selectedModel && product.models && product.models.length > 0 ? (
                           // Display data for selected model if models exist and one is selected
                          <tr>
                            <td className="py-2 px-3 border-b border-gray-200 w-1/2">{selectedModel.name}</td>
                            <td className="py-2 px-3 border-b border-gray-200 w-1/2">
                              {modelsData[selectedModel.id] ?? modelsData[Object.keys(modelsData)[0]] ?? 'N/A'}
                            </td>
                          </tr>
                        ) : (
                          // Fallback if no models or no model selected: display all data or direct values
                          Object.entries(modelsData).map(([key, value]) => {
                            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                              // Nested object (e.g., for products without distinct models but grouped specs)
                              return Object.entries(value as Record<string, string>).map(([subKey, subValue], subIdx) => (
                                <tr key={`${specName}-${key}-${subIdx}`}>
                                  <td className="py-2 px-3 border-b border-gray-200 w-1/2">{subKey}</td>
                                  <td className="py-2 px-3 border-b border-gray-200 w-1/2">{subValue}</td>
                                </tr>
                              ));
                            } else if (typeof value === 'string') {
                               // Direct key-value pair
                               return (
                                <tr key={`${specName}-${key}`}>
                                  <td className="py-2 px-3 border-b border-gray-200 w-1/2">{key}</td>
                                  <td className="py-2 px-3 border-b border-gray-200 w-1/2">{value}</td>
                                </tr>
                              );
                            }
                            return null;
                          })
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}

          {product.downloads && product.downloads.length > 0 && (
            <TabsContent value="downloads">
              <div className="space-y-3">
                {product.downloads.map((downloadItem: DownloadData, index: number) => ( // Typed downloadItem
                  <a 
                    key={index} 
                    href={downloadItem.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">{downloadItem.title}</h4>
                      {downloadItem.description && <p className="text-xs text-gray-500">{downloadItem.description}</p>}
                    </div>
                    <div className="flex items-center space-x-2">
                      {downloadItem.fileSize && <span className="text-xs text-gray-500">{downloadItem.fileSize}</span>}
                      <DownloadIcon className="h-5 w-5 text-blue-600" />
                    </div>
                  </a>
                ))}
              </div>
            </TabsContent>
          )}
        </Tabs>
      ) : null}
    </>
  );
};

export default ProductInteractiveSections;
