'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { Product, ProductModel } from '@/app/products/[id]/data';
import { ChevronDown, ChevronUp, CircleCheck } from 'lucide-react';
import ContactButtonClient from './ContactButtonClient';
import { dict, useT } from '@/components/i18n';
import { useLanguage } from '@/components/LanguageProvider';


interface ProductInteractiveSectionsProps {
  product: Product;
}

const ProductInteractiveSections: React.FC<ProductInteractiveSectionsProps> = ({ product }) => {
  const t = useT();
  const { locale } = useLanguage();
  const [selectedModel, setSelectedModel] = useState<ProductModel | null>(
    product.models && product.models.length > 0 ? product.models[0] : null
  );
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);

  const handleModelChange = (model: ProductModel) => {
    setSelectedModel(model);
  };

  const displayPrice = selectedModel?.price ?? product.price;

  // Helper to resolve any value from dict by dot path for current locale
  const getFromDict = useCallback((path?: string): unknown => {
    if (!path) return undefined;
    const parts = path.split('.');
    const get = (obj: unknown): unknown =>
      parts.reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object') {
          return (acc as Record<string, unknown>)[key];
        }
        return undefined;
      }, obj);
    const fromLocale = get(dict[locale as keyof typeof dict]);
    if (fromLocale !== undefined) return fromLocale;
    return get(dict.sq);
  }, [locale]);

  type ProductWithKeys = Product & {
    featuresKey?: string;
    detailsKey?: string;
    descriptionKey?: string;
    longDescriptionKey?: string;
  };
  const pWithKeys = product as ProductWithKeys;

  const featuresResolved: string[] | undefined = useMemo(() => {
    const fromKey = getFromDict(pWithKeys.featuresKey);
    if (Array.isArray(fromKey)) return fromKey as string[];
    return product.features;
  }, [product, pWithKeys.featuresKey, getFromDict]);

  const detailsResolved: Record<string, string> | undefined = useMemo(() => {
    const fromKey = getFromDict(pWithKeys.detailsKey);
    if (fromKey && typeof fromKey === 'object' && !Array.isArray(fromKey)) {
      return fromKey as Record<string, string>;
    }
    return product.details;
  }, [product, pWithKeys.detailsKey, getFromDict]);

  return (
    <>
      {/* Description and key features in dropdown */}
      <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <button
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
          className="w-full py-3 px-4 flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <h3 className="font-medium text-gray-800">{t('productPage.sections.overview', 'Karakteristikat Kryesore & Përshkrimi')}</h3>
          {isDescriptionOpen ? 
            <ChevronUp className="h-5 w-5 text-gray-500" /> : 
            <ChevronDown className="h-5 w-5 text-gray-500" />
          }
        </button>
        
        {isDescriptionOpen && (
          <div className="p-4 border-t border-gray-200">
            {/* Short description */}
            {(product.descriptionKey || product.description) && (
              <p className="text-sm text-gray-700 mb-3">
                {product.descriptionKey ? t(product.descriptionKey, product.description) : product.description}
              </p>
            )}

            {/* Long description (may contain HTML) */}
            {(product.longDescriptionKey || product.longDescription) && (
              <div
                className="prose prose-sm max-w-none mb-4"
                dangerouslySetInnerHTML={{
                  __html: product.longDescriptionKey
                    ? t(product.longDescriptionKey, product.longDescription)
                    : (product.longDescription as string),
                }}
              />
            )}
            
            {featuresResolved && featuresResolved.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('productPage.sections.keyDetails', 'Detajet Kryesore')}</h3>
                <ul className="space-y-1 text-sm">
                  {featuresResolved.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CircleCheck className="text-green-500 mr-2 h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {detailsResolved && Object.keys(detailsResolved).length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">{t('productPage.sections.details', 'Detajet')}</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  {Object.entries(detailsResolved).map(([k, v]) => (
                    <div key={k} className="flex justify-between gap-4 border-b border-gray-100 py-1">
                      <dt className="text-gray-500">{k}</dt>
                      <dd className="font-medium text-gray-800">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Models selection */}
      {product.models && product.models.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">{t('productPage.sections.selectModel', 'Zgjidhni modelin:')}</h3>
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
