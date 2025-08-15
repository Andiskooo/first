'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useT } from '@/components/i18n';

interface CategoryHeroProps {
  heroImage: string;
  defaultHeroImage: string;
  title: string;
  description: string;
  categoryId?: string;
}

const CategoryHero: React.FC<CategoryHeroProps> = ({ heroImage, defaultHeroImage, title, description, categoryId }) => {
  const [imageError, setImageError] = useState(false);
  const t = useT();

  const displayTitle = categoryId
    ? t(`categories.hero.${categoryId}.title`, title)
    : title;
  const displayDescription = categoryId
    ? t(`categories.hero.${categoryId}.description`, description)
    : description;

  return (
    <div className="relative h-[60vh] w-full">
      <Image 
        src={imageError ? defaultHeroImage : heroImage}
        alt={displayTitle}
        fill
        className="object-cover"
        priority
        onError={() => setImageError(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{displayTitle}</h1>
          <p className="text-lg md:text-xl">{displayDescription}</p>
        </div>
      </div>
    </div>
  );
};

export default CategoryHero;
