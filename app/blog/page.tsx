'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { blogPosts, BlogPost } from '@/app/blog/[id]/data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar } from 'lucide-react';

<head>
<meta property="og:title" content="Your Blog Title" />
  <meta property="og:description" content="A brief summary of your blog post." />
  <meta property="og:image" content="https://yourwebsite.com/path/to/image.jpg" />
  <meta property="og:url" content="https://yourwebsite.com/blog-post-url" />
  <meta property="og:type" content="article" /> 
</head>

const BlogPage = () => {
  // State for filtered blog posts
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(blogPosts);
  const [activeTag, setActiveTag] = useState<string | null>(null);

  // Get all unique tags for filtering
  const allTags = Array.from(new Set(blogPosts.flatMap(post => post.tags || [])));

  // Filter posts by tag
  const filterByTag = (tag: string | null) => {
    setActiveTag(tag);
    if (!tag) {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.tags?.includes(tag)));
    }
  };

  // Tag to color mapping for UI
  const tagColorMap: Record<string, { bg: string, text: string, border: string, hover: string }> = {
    'Këshilla': {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-200',
    },
    'Teknologji': {
      bg: 'bg-purple-100',
      text: 'text-purple-600',
      border: 'border-purple-200',
      hover: 'hover:bg-purple-200',
    },
    'Klimatizim': {
      bg: 'bg-cyan-100',
      text: 'text-cyan-600',
      border: 'border-cyan-200',
      hover: 'hover:bg-cyan-200',
    },
    'Mirëmbajtje': {
      bg: 'bg-orange-100',
      text: 'text-orange-600',
      border: 'border-orange-200',
      hover: 'hover:bg-orange-200',
    },
    'Ngrohje': {
      bg: 'bg-red-100',
      text: 'text-red-600',
      border: 'border-red-200',
      hover: 'hover:bg-red-200',
    },
    'Efikasitet': {
      bg: 'bg-green-100',
      text: 'text-green-600',
      border: 'border-green-200',
      hover: 'hover:bg-green-200',
    },
    'Problemet e Zakonshme': {
      bg: 'bg-amber-100',
      text: 'text-amber-600',
      border: 'border-amber-200',
      hover: 'hover:bg-amber-200',
    },
    // Default for any tags not explicitly defined
    'default': {
      bg: 'bg-gray-100',
      text: 'text-gray-600',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-200',
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero section */}
      <div className="relative h-[60vh] w-full">
        <Image 
          src="/hero/blog.jpg"
          alt="ECOTEK Blog"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog dhe Lajme</h1>
            <p className="text-lg md:text-xl">Këshilla, artikuj dhe njoftime mbi produktet dhe shërbimet tona</p>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Kryefaqja</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">Blog</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filter buttons */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Artikujt Tanë</h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => filterByTag(null)}
              className={`px-4 py-2 rounded-full border transition-all ${!activeTag ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'}`}
            >
              Të gjitha
            </button>
            {allTags.map((tag) => {
              const tagStyle = tagColorMap[tag] || tagColorMap.default;
              return (
                <button
                  key={tag}
                  onClick={() => filterByTag(tag)}
                  className={`px-4 py-2 rounded-full border transition-all ${activeTag === tag ? 'bg-blue-600 text-white border-blue-600' : `${tagStyle.bg} ${tagStyle.text} ${tagStyle.border} ${tagStyle.hover}`}`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => {
            // Use the first tag's color or default to blue for styling
            const firstTag = post.tags?.[0] || 'Këshilla';
            const tagStyle = tagColorMap[firstTag] || tagColorMap.default;

            return (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Link href={`/blog/${post.id}`} className="h-full block">
                  <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col p-0 border-0" style={{ borderTop: post.accentColor ? `4px solid var(--${post.accentColor.split('-')[0]}-600)` : '4px solid var(--blue-600)' }}>
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardHeader className="flex-shrink-0">
                      {post.subtitle && (
                        <CardDescription className={`${tagStyle.text} font-medium uppercase tracking-wider`}>
                          {post.subtitle}
                        </CardDescription>
                      )}
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {post.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`text-xs ${tagColorMap[tag]?.text || tagColorMap.default.text} px-2 py-0.5 rounded-full ${tagColorMap[tag]?.bg || tagColorMap.default.bg}`}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <CardTitle className="text-2xl font-bold">{post.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-gray-600">{post.content}</p>
                    </CardContent>
                    <CardFooter className="flex justify-between items-center mt-auto">
                      <div className="flex items-center text-sm text-gray-500">
                        {post.date && (
                          <>
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>{post.date}</span>
                          </>
                        )}
                      </div>
                      <span className={`flex items-center gap-1 ${tagStyle.text} font-medium mb-5`}>
                        Lexo më shumë <ArrowRight className="w-4 h-4" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">Nuk u gjetën artikuj</h3>
            <p className="text-gray-600 mb-6">Nuk ka asnjë artikull me filtrat e përzgjedhur.</p>
            <Button onClick={() => filterByTag(null)}>Shfaq të gjitha</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
