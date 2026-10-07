import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { getCategoryById, getProductsByCategory } from '@/app/categories/[id]/data';
import { ArrowRight } from 'lucide-react';
import { Metadata } from 'next';
import CategoryHero from '@/components/categories/CategoryHero'; // To be created
import CategoryInteractiveContent from '@/components/categories/CategoryInteractiveContent'; // To be created
import { notFound } from 'next/navigation';
import { pageMetadata } from '@/lib/seo';

interface CategoryPageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Promise<{ // searchParams are passed by Next.js
    subcategory?: string;
  }>;
}

// Add default hero image
const DEFAULT_HERO_IMAGE = '/hero/default-hero.jpg';

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = getCategoryById(resolvedParams.id);
  if (!category) {
    return {
      title: 'Kategoria nuk u gjet',
      description: 'Na vjen keq, por kategoria që kërkuat nuk u gjet.',
    };
  }
  return pageMetadata(category.title, category.description, `/categories/${category.id}`, category.heroImage);
}

const CategoryPage = async ({ params, searchParams }: CategoryPageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const resolvedSearchParams = searchParams ? await searchParams : { subcategory: undefined };
  const category = getCategoryById(id);
  const allProducts = category ? getProductsByCategory(id) : [];
  const initialSubcategoryId = resolvedSearchParams?.subcategory || null;
  if (!category) notFound();

  if (!category) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Kategoria nuk u gjet</h1>
        <p className="mb-6">Na vjen keq, por kategoria që kërkuat nuk u gjet.</p>
        <Button asChild>
          <Link href="/">
            <ArrowRight className="mr-2 h-4 w-4" />
            Kthehu në faqen kryesore
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <CategoryHero 
        heroImage={category.heroImage}
        defaultHeroImage={DEFAULT_HERO_IMAGE}
        title={category.title}
        description={category.description}
        categoryId={category.id}
      />

      <CategoryInteractiveContent 
        category={category}
        allProducts={allProducts}
        initialSubcategoryId={initialSubcategoryId}
      />
      {category.subcategories.some(s => s.id === 'pompa-termike') && <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-semibold">Pompa termike dhe instalime në Kosovë</h2>
        <p className="mt-4 max-w-3xl text-slate-600">Njihuni me përzgjedhjen e pompave termike dhe shikoni shembuj të sistemeve të instaluara nga ECOTEK.</p>
        <div className="mt-5 flex flex-wrap gap-6"><Link href="/pompa-termike" className="font-medium text-blue-600 hover:underline">Pompa termike për ngrohje</Link><Link href="/instalimet" className="font-medium text-blue-600 hover:underline">Instalimet e pompave termike në Kosovë</Link></div>
      </section>}
    </div>
  );
};

export default CategoryPage;
