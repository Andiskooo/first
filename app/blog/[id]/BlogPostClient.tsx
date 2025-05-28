'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Share2 } from 'lucide-react';
import { blogPosts, BlogPost } from '@/app/blog/[id]/data';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface BlogPostClientProps {
  id: string;
}

export default function BlogPostClient({ id }: BlogPostClientProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Find the blog post with the matching ID
    const foundPost = blogPosts.find((p) => p.id === id || p.link.includes(id));
    setPost(foundPost || null);
    setLoading(false);
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
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

  // Format the markdown-like content with enhanced HTML
  function renderContent(content: string) {
    // Process the content in multiple steps for better formatting
    let formattedContent = content.trim();
    
    // Step 1: Handle headings
    formattedContent = formattedContent
      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold my-6 text-gray-800 border-b pb-2">$1</h2>')
      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold my-4 text-gray-800">$1</h3>')
      .replace(/^#### (.+)$/gm, '<h4 class="text-lg font-bold my-3 text-gray-800">$1</h4>');
    
    // Step 2: Handle text formatting
    formattedContent = formattedContent
      .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold">$1</strong>')
      .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
      .replace(/`(.+?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded font-mono text-sm">$1</code>');
    
    // Step 3: Handle lists - wrap in proper ul tags
    const listRegex = /((?:^- .+\n?)+)/gm;
    formattedContent = formattedContent.replace(listRegex, (match) => {
      const listItems = match
        .split('\n')
        .filter(line => line.trim().startsWith('- '))
        .map(line => line.replace(/^- (.+)$/, '<li class="ml-5 my-1">$1</li>'))
        .join('');
      return `<ul class="list-disc my-4 space-y-2">${listItems}</ul>`;
    });
    
    // Step 4: Handle paragraphs and spacing
    const paragraphs = formattedContent
      .split('\n\n')
      .map(para => {
        if (!para.trim().startsWith('<') && para.trim() !== '') {
          return `<p class="my-4 text-gray-700 leading-relaxed">${para.replace(/\n/g, ' ')}</p>`;
        }
        return para;
      })
      .join('\n');
    
    return (
      <div 
        className="prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:font-bold prose-a:text-blue-600 prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: paragraphs }} 
      />
    );
  };

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
            {post.subtitle && (
              <motion.p 
                className={`text-sm md:text-base font-medium uppercase tracking-wider text-white py-1 px-3 ${`bg-${accentColor}-600`} inline-block mb-4 rounded`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {post.subtitle}
              </motion.p>
            )}
            <motion.h1 
              className="text-3xl md:text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {post.title}
            </motion.h1>
            {post.date && (
              <motion.div 
                className="flex items-center text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Calendar className="w-4 h-4 mr-2" />
                <span>{post.date}</span>
              </motion.div>
            )}
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
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.history.back()}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Kthehu
              </Button>
              <Button variant="outline" size="icon" onClick={() => navigator.share({ title: post.title, url: window.location.href })}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Short summary/introduction */}
            <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">{post.content}</p>
            
            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map(tag => {
                  const accentColor = post.accentColor?.split('-')[0] || 'blue';
                  return (
                    <span 
                      key={tag} 
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${accentColor}-100 text-${accentColor}-800`}
                    >
                      {tag}
                    </span>
                  );
                })}
              </div>
            )}
            
            {/* Divider */}
            <hr className="my-8 border-gray-200" />
            
            {/* Full content */}
            <article className="mt-8">
              {renderContent(post.fullContent)}
            </article>
            
            {/* Footer with navigation links */}
            <div className="mt-16 pt-8 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                <Button variant="outline" asChild>
                  <Link href="/blog">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kthehu në faqen e blogut
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
