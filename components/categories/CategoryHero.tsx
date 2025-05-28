'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface CategoryHeroProps {
  heroImage: string;
  defaultHeroImage: string;
  title: string;
  description: string;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ heroImage, defaultHeroImage, title, description }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative h-[60vh] w-full">
      <Image 
        src={imageError ? defaultHeroImage : heroImage}
        alt={title}
        fill
        className="object-cover"
        priority
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
        <div className="text-center text-white px-4 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryHero;
