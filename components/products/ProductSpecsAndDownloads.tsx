'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download as DownloadIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useT } from '@/components/i18n';

interface DownloadData {
  title: string;
  url: string;
  description?: string;
  fileSize?: string;
}

interface SpecificationValue {
  [modelId: string]: string | number | boolean;
}

interface ProductSpecsAndDownloadsProps {
  specifications?: Record<string, SpecificationValue>;
  downloads?: DownloadData[];
  selectedModel?: {
    id: string;
    name: string;
  } | null;
  models?: Array<{
    id: string;
    name: string;
  }>;
}

export function ProductSpecsAndDownloads({ 
  specifications = {}, 
  downloads = [], 
  selectedModel = null,
  models = []
}: ProductSpecsAndDownloadsProps) {
  const t = useT();
  // Get all unique model IDs from specifications
  const allModelIds = React.useMemo(() => {
    const ids = new Set<string>();
    if (models && models.length > 0) {
      models.forEach(model => ids.add(model.id));
    }
    // Ensure specifications is treated as an object for iteration
    if (specifications) {
      Object.values(specifications).forEach(spec => {
        if (spec && typeof spec === 'object') {
          Object.keys(spec).forEach(key => {
            if (key !== 'name' && key !== 'description') {
              ids.add(key);
            }
          });
        }
      });
    }
    return Array.from(ids);
  }, [specifications, models]);

  const hasSpecs = specifications && Object.keys(specifications).length > 0;
  const hasDownloads = downloads && downloads.length > 0;

  if (!hasSpecs && !hasDownloads) return null;

  return (
    <div className="w-full">
      <Tabs 
        defaultValue={hasSpecs ? "specifications" : "downloads"} 
        className="w-full"
      >
        <TabsList className={`grid w-full mb-4 ${
          (hasSpecs && hasDownloads) ? 'grid-cols-2' : 'grid-cols-1'
        }`}>
          {hasSpecs && <TabsTrigger value="specifications">{t('productPage.ui.tabs.specs', 'Specifikimet')}</TabsTrigger>}
          {hasDownloads && <TabsTrigger value="downloads">{t('productPage.ui.tabs.downloads', 'Shkarkime')}</TabsTrigger>}
        </TabsList>
        
        {hasSpecs && (
          <TabsContent value="specifications">
            <div className="overflow-x-auto bg-gray-50 p-4 rounded-lg">
              <div className="min-w-full inline-block align-middle">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-gray-700 border-b border-gray-200">{t('productPage.ui.table.characteristic', 'Karakteristika')}</th>
                      {allModelIds.map(modelId => {
                        const model = models?.find(m => m.id === modelId);
                        return (
                          <th 
                            key={modelId}
                            className={cn(
                              'py-3 px-4 text-left font-semibold text-gray-700 border-b border-gray-200',
                              selectedModel?.id === modelId && 'bg-blue-50'
                            )}
                          >
                            {model?.name || modelId}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(specifications).map(([specName, modelsData], specIndex) => {
                      // Skip if modelsData is not an object
                      if (typeof modelsData !== 'object' || modelsData === null) {
                        return null;
                      }
                      
                      return (
                        <tr key={specIndex} className="hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900 border-b border-gray-200">
                            {specName}
                          </td>
                          {allModelIds.map(modelId => (
                            <td 
                              key={`${specIndex}-${modelId}`}
                              className={cn(
                                'py-3 px-4 border-b border-gray-200',
                                selectedModel?.id === modelId && 'bg-blue-50'
                              )}
                            >
                              {modelsData[modelId] ?? t('productPage.ui.table.na', 'N/A')}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        )}

        {hasDownloads && (
          <TabsContent value="downloads">
            <div className="space-y-3">
              {downloads.map((downloadItem, index) => (
                <a 
                  key={index}
                  href={downloadItem.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-800">{downloadItem.title}</h4>
                    {downloadItem.description && <p className="text-xs text-gray-500">{t('productPage.ui.downloads.description', 'Description')}: {downloadItem.description}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {downloadItem.fileSize && <span className="text-xs text-gray-500">{t('productPage.ui.downloads.fileSize', 'File size')}: {downloadItem.fileSize}</span>}
                    <DownloadIcon className="h-5 w-5 text-blue-600" />
                  </div>
                </a>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

export default ProductSpecsAndDownloads;
