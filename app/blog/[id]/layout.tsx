import type { Metadata, ResolvingMetadata } from 'next';
import { blogPosts } from './data'; // data.ts is in the same directory

type Props = {
  params: { id: string };
  // searchParams: { [key: string]: string | string[] | undefined }; // Not used here but part of the signature
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // Access to metadata from parent layouts
): Promise<Metadata> {
  const postId = params.id;
  
  // Find the post using the same logic as your page component for consistency
  const post = blogPosts.find(p => p.id === postId || (p.link && p.link.includes(postId)));

  if (!post) {
    // Post not found, return default metadata or handle as an error
    // For example, you could use notFound() from 'next/navigation'
    return {
      title: 'Artikulli nuk u gjet', // "Blog Post Not Found"
      openGraph: {
        title: 'Artikulli nuk u gjet',
        description: 'Përmbajtja e kërkuar nuk është e disponueshme.', // "The requested content is not available."
        images: [], // No specific image if post not found
      },
    };
  }

  // Assuming post.imageUrl is a root-relative path like '/blog/Blog-1.jpg'
  // Next.js will automatically prepend `metadataBase` (if set in root layout) or the deployment URL.
  // Ensure NEXT_PUBLIC_SITE_URL is set in your .env.local or Vercel/Netlify environment variables if metadataBase is not used.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || (await parent).metadataBase?.toString() || '';

  return {
    title: post.title,
    description: post.content, // Using the short 'content' field for OG description
    openGraph: {
      title: post.title,
      description: post.content,
      url: siteUrl ? new URL(post.link, siteUrl).toString() : undefined, // Construct absolute URL for the page
      images: [
        {
          url: post.imageUrl, // Relative path, Next.js handles it if metadataBase or absolute URL is formed
          width: 1200,        // Common OG image width
          height: 630,       // Common OG image height
          alt: post.title,
        },
      ],
      type: 'article',
      // published_time: post.date, // Ensure post.date is in ISO 8601 format if used. The current format might be okay.
      // authors: ['ECOTEK'], // Optional: Add author
    },
    // Optional: Add Twitter card metadata
    // twitter: {
    //   card: 'summary_large_image',
    //   title: post.title,
    //   description: post.content,
    //   images: [post.imageUrl], // Must be an absolute URL or Next.js handles it
    // },
  };
}

// This layout component simply renders its children (the page.tsx)
export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
