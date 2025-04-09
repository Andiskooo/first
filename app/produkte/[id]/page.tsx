'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation'; // Import notFound
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Product, getProductById } from '../data'; // Import from data.ts

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchedProduct = getProductById(params.id);
    if (fetchedProduct) {
      setProduct(fetchedProduct);
      setSelectedImage(fetchedProduct.images[0]); // Set initial image
    } else {
      // If product not found by ID, trigger the notFound() function
      notFound();
    }
    setIsLoading(false);
  }, [params.id]); // Re-run effect if id changes

  // Display loading state
  if (isLoading) {
    return <div className="container mx-auto px-4 py-12 pt-24 md:pt-32 text-center">Duke ngarkuar...</div>;
  }

  // Product guaranteed to be non-null here due to notFound() call
  if (!product || !selectedImage) {
     // This should technically not be reached if notFound() works correctly,
     // but it's good practice for type safety and fallback.
     return <div>Gabim në ngarkimin e produktit.</div>
  }


  return (
    <div className="container mx-auto px-4 py-12 pt-28 md:pt-36"> {/* Increased padding top */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* === Image Gallery === */}
        <div className="flex flex-col items-center">
          {/* Main Image Display */}
          <div className="mb-4 w-full max-w-lg aspect-square relative overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700">
            <Image
              src={selectedImage} // Source is the currently selected image state
              alt={`${product.title} - Imazhi Kryesor`}
              fill // Use fill to cover the container
              sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 600px" // Provide responsive sizes
              style={{ objectFit: 'contain' }} // 'contain' to show the whole image without cropping
              className="transition-opacity duration-300 ease-in-out"
              priority // Prioritize loading the main visible image
              unoptimized={selectedImage.startsWith('/')} // Avoid optimization for local placeholders if needed
            />
          </div>
          {/* Thumbnail Selector */}
          <div className="flex flex-wrap justify-center gap-2 overflow-x-auto pb-2 w-full max-w-lg">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(img)}
                onMouseEnter={() => setSelectedImage(img)} // Change image on hover for preview
                aria-label={`Shiko imazhin ${index + 1}`}
                className={`w-16 h-16 md:w-20 md:h-20 relative flex-shrink-0 overflow-hidden rounded-md border-2 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/80 ${selectedImage === img ? 'border-primary scale-105 shadow-md' : 'border-slate-300 dark:border-slate-600 hover:border-primary/50 hover:scale-105'}`}
              >
                <Image
                  src={img}
                  alt={`${product.title} - Miniaturë ${index + 1}`}
                  fill
                  sizes="80px" // Size of the thumbnail container
                  style={{ objectFit: 'cover' }} // 'cover' to fill the thumbnail area
                  className="rounded-sm" // Slight rounding for thumbnail images
                  unoptimized={img.startsWith('/')}
                />
              </button>
            ))}
          </div>
        </div>

        {/* === Product Info Section === */}
        <div className="flex flex-col pt-4 md:pt-0">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-slate-900 dark:text-slate-50 leading-tight">{product.title}</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-6 text-base lg:text-lg leading-relaxed">{product.description}</p>

          {/* Models/Variants (Optional) */}
          {product.models && product.models.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-300 uppercase tracking-wide">Modelet:</h3>
              <div className="flex flex-wrap gap-2">
                {product.models.map((model) => (
                  <Button key={model.name} variant="outline" size="sm" className="cursor-default">
                    {model.name}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Contact Button */}
          <div className="mt-4">
            <Link href={`/kontakti?produkt=${encodeURIComponent(product.title)}`} passHref legacyBehavior>
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 shadow-md hover:shadow-lg transition-shadow">
                Kontakto për Ofertë
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* === Details Table Section === */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
        <h2 className="text-2xl lg:text-3xl font-semibold mb-6 text-slate-900 dark:text-slate-50">Detajet Teknike</h2>
        <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <Table>
            <TableBody>
              {Object.entries(product.details).map(([key, value]) => (
                <TableRow key={key} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                  <TableCell className="font-medium text-slate-600 dark:text-slate-300 w-1/3 px-4 py-3">{key}</TableCell>
                  <TableCell className="text-slate-800 dark:text-slate-100 px-4 py-3">{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}