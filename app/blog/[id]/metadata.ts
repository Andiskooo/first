import type { Metadata } from 'next';
import { blogPosts } from './data';
import { absoluteUrl } from '@/lib/utils';

type Props = {
  params: { id: string };
  searchParams: Record<string, string | string[] | undefined>;
};

export function generateMetadata({ params }: Props): Metadata {
  // Find the blog post with the matching ID
  const post = blogPosts.find((p) => p.id === params.id || p.link.includes(params.id));
  
  // If post is not found, return default metadata
  if (!post) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  // Construct the OG image URL - using the post's image URL
  const ogImageUrl = absoluteUrl(post.imageUrl);

  return {
    title: post.title,
    description: post.content,
    openGraph: {
      title: post.title,
      description: post.content,
      images: [{
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: post.title
      }]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content,
      images: [ogImageUrl],
    }
  };
}
