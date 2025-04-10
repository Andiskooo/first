'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Product } from '../data'; // Assuming Product type is needed

interface ProductDetailsClientProps {
  product: Product;
}

export default function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);

  return (
    <div className="container mx-auto px-4 py-12 pt-24 md:pt-32">
      {/* Main Product Info Grid (Images + Title/Desc/Button) */}
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Image Gallery Column */}
        <div className="grid gap-4">
          <div className="relative overflow-hidden rounded-lg aspect-square">
            <Image
              alt={product.title}
              className="object-cover w-full h-full"
              height={600}
              src={selectedImage} // Use state for selected image
              width={600}
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {product.images.map((img, index) => (
              <button
                key={index}
                className={`relative overflow-hidden rounded-lg aspect-square border ${selectedImage === img ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setSelectedImage(img)} // Update selected image on click
              >
                <Image
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className="object-cover w-full h-full"
                  height={100}
                  src={img}
                  width={100}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details Column (Title, Desc, Description, Button) */}
        <div className="grid gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.title}</h1>
            <p className="text-muted-foreground mt-2">{product.shortDescription || product.description.substring(0, 100) + '...'} {/* Fallback if no shortDescription */}</p>
          </div>

          {/* Full Description */}
          <div className="prose max-w-none">
             <h3 className="text-lg font-semibold mb-3">Përshkrimi</h3>
            <p>{product.description}</p>
          </div>

          {/* Back Button */}
          <Link href="/produkte">
            <Button size="lg" variant="outline">Kthehu te Produktet</Button>
          </Link>
        </div>
      </div>

      {/* --- Specifications Table Section (Moved Below Grid) --- */}
      <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-700">
         <h2 className="text-2xl font-semibold mb-6 text-center">Specifikimet Teknike</h2>
         <div className="border rounded-lg overflow-hidden max-w-4xl mx-auto"> {/* Centered table */}
            <Table>
              <TableBody>
                {Object.entries(product.details).map(([key, value]) => (
                  <TableRow key={key} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors">
                    <TableCell className="font-medium text-slate-700 dark:text-slate-300 w-1/3 px-4 py-3">{key}</TableCell>
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