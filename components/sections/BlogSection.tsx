'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts as defaultBlogPosts } from '@/app/blog/[id]/data';
import { BlogPost } from '@/app/blog/[id]/data';
import { ArrowRight } from 'lucide-react';

// Color mapping for Tailwind classes
const colorMap: Record<string, { bg: string, hover: string, text: string }> = {
  'red': {
    bg: 'bg-red-600',
    hover: 'hover:bg-red-700',
    text: 'text-red-600',
  },
  'orange': {
    bg: 'bg-orange-600',
    hover: 'hover:bg-orange-700',
    text: 'text-orange-600',
  },
  'blue': {
    bg: 'bg-blue-600',
    hover: 'hover:bg-blue-700',
    text: 'text-blue-600',
  },
  'green': {
    bg: 'bg-green-600',
    hover: 'hover:bg-green-700',
    text: 'text-green-600',
  },
  'purple': {
    bg: 'bg-purple-600',
    hover: 'hover:bg-purple-700',
    text: 'text-purple-600',
  },
};

interface BlogSectionProps {
  posts?: BlogPost[];
  title?: string;
  className?: string;
}

const BlogSection = ({ 
  posts = defaultBlogPosts,
  title = 'Blog and news',
  className = ''
}: BlogSectionProps) => {
  const [activePost, setActivePost] = useState<BlogPost>(posts[0]);

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.4 } 
    },
    exit: { 
      opacity: 0, 
      x: -50,
      transition: { duration: 0.3 } 
    }
  };

  return (
    <section className={`py-16 bg-gray-100 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left side - Blog post list */}
          <div className="w-full lg:w-1/3 bg-gray-700 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
            
            <div className="space-y-6">
              {posts.map((post) => {
                const isActive = activePost.id === post.id;
                const colorKey = post.accentColor?.split('-')[0] || 'red';
                const color = colorMap[colorKey] || colorMap.red;
                
                return (
                  <button
                    key={post.id}
                    onClick={() => setActivePost(post)}
                    className={`w-full text-left group transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`flex items-center justify-center ${color.bg} w-10 h-10 rounded-lg text-white font-bold shrink-0`}>
                        {post.id}
                      </div>
                      <div>
                        <h3 className="text-white font-medium text-lg group-hover:underline">
                          {post.title}
                        </h3>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <Link
              href="/blog"
              className="flex items-center justify-center gap-2 text-white mt-8 px-4 py-2 border border-white rounded mx-auto transition-colors duration-200 bg-transparent hover:bg-white/20"
            >
              Blog and news
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {/* Right side - Active blog post content */}
          <div className="w-full lg:w-2/3 relative overflow-hidden rounded-lg">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activePost.id}
                className="flex flex-col md:flex-row h-full"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                {/* Image spans full height, clipped on right */}
                <div className="w-full md:w-1/2 relative">
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <Image
                      src={activePost.imageUrl}
                      alt={activePost.title}
                      fill
                      className="object-cover object-left"
                      priority
                    />
                  </div>
                </div>
                
                {/* Content */}
                <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white">
                  {activePost.subtitle && (
                    <p className={`text-sm font-medium uppercase tracking-wider mb-2 ${activePost.accentColor ? 'text-' + activePost.accentColor.split('-')[0] + '-600' : 'text-red-600'}`}>
                      {activePost.subtitle}
                    </p>
                  )}
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    {activePost.title}
                  </h2>
                  <p className="text-gray-700 mb-6">
                    {activePost.content}
                  </p>
                  <Link 
                    href={activePost.link}
                    className={`inline-flex items-center gap-2 font-medium ${activePost.accentColor ? 'text-' + activePost.accentColor.split('-')[0] + '-600' : 'text-red-600'} hover:underline`}
                  >
                    Read more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
