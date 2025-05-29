
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { blogPosts} from '@/app/blog/[id]/data';
import { Button } from '@/components/ui/button';
import { Metadata } from 'next';
import { NavigationButtons } from '@/components/blog/NavigationButtons';
import { AnimatedContent } from '@/components/blog/AnimatedContent';
import { AnimatedArticle } from '@/components/blog/AnimatedArticle';

type Props = {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({ params }: Props): Promise<Metadata> => {
  const id = (await params).id;
  const post = blogPosts.find((p) => p.id === id || p.link.includes(id)) || null;
  if (!post) {
    // Handle case where post is not found
    return {
      title: 'Artikulli nuk u gjet',
      description: 'Përmbajtja e kërkuar nuk është e disponueshme.',
      openGraph: {
        title: 'Artikulli nuk u gjet',
        description: 'Përmbajtja e kërkuar nuk është e disponueshme.',
        url: 'https://www.ecotek-ks.com/blog',
        siteName: 'ECO TEK',
        images: [
          {
            url: 'https://www.ecotek-ks.com/default-blog-image.jpg', // Default image for not found posts
            width: 1200,
            height: 630,
            alt: 'ECO TEK Blog',
          },
        ],
        locale: 'sq_AL',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Artikulli nuk u gjet',
        description: 'Përmbajtja e kërkuar nuk është e disponueshme.',
        images: ['https://www.ecotek-ks.com/default-blog-image.jpg'],
      },
    };
  }

  // Metadata for a found blog post
  return {
    title: post.title,
    description: post.content, // Assuming post.content is a concise summary for description
    openGraph: {
      title: post.title,
      description: post.content,
      url: `https://www.ecotek-ks.com${post.link}`,
      siteName: 'ECO TEK',
      images: [
        {
          url: `https://www.ecotek-ks.com${post.imageUrl}`,
          width: 1200, // Ideal OG image width
          height: 630, // Ideal OG image height
          alt: post.title,
        },
      ],
      locale: 'sq_AL', // Albanian (Albania). Consider 'sq_XK' for Kosovo.
      type: 'article',
      // Optional: Article specific tags
      // article: {
      //   publishedTime: post.date, // Requires post.date to be in ISO 8601 format
      //   authors: ['Ari Sylafeta'], // Example author
      //   tags: post.tags, // Requires post.tags to be an array of strings
      // },
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content,
      images: [`https://www.ecotek-ks.com${post.imageUrl}`],
      creator: '@EcotekKosova', // Replace with your actual Twitter handle or remove
    },
    // To add Facebook App ID, uncomment the 'other' section and replace 'YOUR_FACEBOOK_APP_ID'
    // other: {
    //   'fb:app_id': 'YOUR_FACEBOOK_APP_ID',
    // },
  };
};

export default async function BlogPostPage({params}: Props) {
  const id = (await params).id;
  // Find the blog post with the matching ID directly
  const post = blogPosts.find((p) => p.id === id || p.link.includes(id)) || null;

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Artikulli nuk u gjet</h1>
        <p className="mb-6">Na vjen keq, por artikulli që kërkuat nuk u gjet.</p>
        <Button asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kthehu në faqen e blogut
          </Link>
        </Button>
      </div>
    );
  }

  // Get accent color
  const accentColor = post.accentColor?.split('-')[0] || 'blue';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with full-width image */}
      <div className="relative h-[50vh] w-full">
        <Image 
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-end">
          <div className="container mx-auto px-4 pb-12 max-w-4xl">
            <AnimatedContent 
              subtitle={post.subtitle}
              title={post.title}
              date={post.date}
              accentColor={accentColor}
            />
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-white py-3 shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-600">
              <Link href="/" className="hover:text-blue-600">Kryefaqja</Link>
              <span className="mx-2">/</span>
              <Link href="/blog" className="hover:text-blue-600">Blog</Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900 font-medium truncate max-w-[200px]">{post.title}</span>
            </div>
            <NavigationButtons postTitle={post.title} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm">
          <AnimatedArticle
            content={post.content}
            tags={post.tags}
            accentColor={accentColor}
            fullContent={post.fullContent}
          />
        </div>

        {/* Related posts or call to action */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold mb-4">Të tjera nga blogu</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
            {blogPosts
              .filter(relatedPost => relatedPost.id !== post.id)
              .slice(0, 3)
              .map(relatedPost => (
                <Link key={relatedPost.id} href={relatedPost.link} className="group">
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="relative h-40 w-full">
                      <Image
                        src={relatedPost.imageUrl}
                        alt={relatedPost.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium group-hover:text-blue-600 transition-colors">{relatedPost.title}</h4>
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
          <div className="mt-8">
            <Button asChild>
              <Link href="/blog">Shiko të gjitha artikujt</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
