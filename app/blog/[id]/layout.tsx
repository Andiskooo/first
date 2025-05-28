import type { Metadata, ResolvingMetadata } from 'next';
import { blogPosts } from './data'; // Ensure data.ts is in the same directory

type Props = {
  params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata // Access to metadata from parent layouts
): Promise<Metadata> {
  const postIdFromUrl = params.id; // This is the slug or ID from the URL, e.g., "1" or "dirty-sock-ac"
  
  // Find the post. The postIdFromUrl should match the last part of post.link or post.id
  const post = blogPosts.find(p => {
    const linkSlug = p.link.split('/').pop(); // Extracts "1" from "/blog/1" or "dirty-sock-ac" from "/blog/dirty-sock-ac"
    return p.id === postIdFromUrl || linkSlug === postIdFromUrl;
  });

  if (!post) {
    // If post not found, try to get some defaults from parent or set generic error messages
    const previousImages = (await parent).openGraph?.images || [];
    return {
      title: 'Artikulli nuk u gjet - ECOTEK', // Post Not Found
      description: 'Përmbajtja e kërkuar nuk është e disponueshme.', // The requested content is not available.
      openGraph: {
        title: 'Artikulli nuk u gjet - ECOTEK',
        description: 'Përmbajtja e kërkuar nuk është e disponueshme.',
        images: previousImages, // Fallback to parent images if any, or a default site image
      },
    };
  }

  // `post.imageUrl` is like '/blog/Blog-1.jpg' (root-relative)
  // `post.link` is like '/blog/1' (root-relative)
  // With `metadataBase` set in the root layout, Next.js will resolve these to absolute URLs.

  return {
    title: `${post.title} - ECOTEK Blog`, // Specific title for the blog post
    description: post.content, // Using the short 'content' field for OG description
    openGraph: {
      title: `${post.title} - ECOTEK Blog`,
      description: post.content,
      url: post.link, // Relative path like '/blog/1', Next.js resolves with metadataBase
      type: 'article',
      // publishedTime: post.date, // If post.date is in ISO 8601 format. Example: '2023-08-25T00:00:00.000Z'
      // authors: ['ECOTEK'],
      images: [
        {
          url: post.imageUrl, // Relative path like '/blog/Blog-1.jpg', Next.js resolves with metadataBase
          width: 1200,        // Standard OG image width
          height: 630,       // Standard OG image height
          alt: post.title,
        },
        // You can add more images if needed
      ],
    },
    // For Twitter Cards
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} - ECOTEK Blog`,
      description: post.content,
      images: [post.imageUrl], // Relative path, Next.js resolves with metadataBase
      // site: '@yourTwitterHandle', // Optional: your Twitter handle
      // creator: '@authorTwitterHandle', // Optional: author's Twitter handle
    },
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
