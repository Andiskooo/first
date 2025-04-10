import { notFound } from 'next/navigation';
import { getProductById } from '../data';
import ProductDetailsClient from './product-details-client';

// --- Metadata Generation (Optional but Recommended) ---
// If you need dynamic metadata based on the product
/*
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = getProductById(params.id);

  if (!product) {
    return {
      title: 'Produkti nuk u gjet',
    };
  }

  return {
    title: `${product.title} | ECOTEK`,
    description: product.shortDescription || product.description.substring(0, 160),
    openGraph: {
      title: product.title,
      description: product.shortDescription || product.description.substring(0, 160),
      images: [
        {
          url: product.images[0], // Use the main image
          width: 600,
          height: 600,
          alt: product.title,
        },
      ],
      locale: 'sq_AL',
      type: 'website',
    },
  };
}
*/

// --- Main Page Component (Server Component) ---
interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  // In Next.js 15, params is a Promise that needs to be awaited
  const resolvedParams = await params;
  const id = resolvedParams.id;
  const product = getProductById(id);

  // If product not found by ID, trigger the notFound() function from next/navigation
  if (!product) {
    notFound(); // This will render the nearest not-found.tsx or default 404 page
  }

  // Render the Client Component and pass the fetched product data as a prop
  return <ProductDetailsClient product={product} />;
}