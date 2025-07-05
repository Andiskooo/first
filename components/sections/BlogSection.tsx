'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { blogPosts as defaultBlogPosts } from '@/app/blog/[id]/data';
import { BlogPost } from '@/app/blog/[id]/data';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogSectionProps {
  posts?: BlogPost[];
  title?: string;
  className?: string;
  slidesToShow?: number;
  autoplay?: boolean;
  autoplaySpeed?: number;
}

const BlogSection = ({ 
  posts = defaultBlogPosts,
  title = 'Artikujt dhe Informata',
  className = '',
  autoplay = true,
  autoplaySpeed = 5000


}: BlogSectionProps) => {
  const [activePost, setActivePost] = useState(posts[0]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const [isPaused, setIsPaused] = useState(false);

  // Responsive handling moved to CSS
  
  // Navigation handlers
  const handleNext = useCallback(() => {
    setDirection(1);
    const newIndex = (currentIndex + 1) % posts.length;
    setCurrentIndex(newIndex);
    setActivePost(posts[newIndex]);
  }, [currentIndex, posts]);
  
  const handlePrev = useCallback(() => {
    setDirection(-1);
    const newIndex = currentIndex === 0 ? posts.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setActivePost(posts[newIndex]);
  }, [currentIndex, posts]);
  
  // Handle automatic slide change
  useEffect(() => {
    if (!autoplay || isPaused) return;
    
    const timer = setTimeout(() => {
      handleNext();
    }, autoplaySpeed);
    
    return () => clearTimeout(timer);
  }, [currentIndex, autoplay, autoplaySpeed, isPaused, handleNext]);
  

  

  
  // Animation variants
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -500 : 500,
      opacity: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      },
    }),
  };

  return (
    <section className={`py-12 md:py-16 bg-gray-600 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-stretch w-full gap-8">
          {/* Left side - Blog list */}
          <div className="w-full md:w-1/2 lg:w-5/12">
            <h2 className="text-3xl font-bold text-white mb-8">{title}</h2>
            
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-1 custom-scrollbar">
              <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                  width: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                  background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                  background-color: red;
                  height: 60px;
                }
              `}</style>
              {posts.map((post, index) => {
                const isActive = post.id === activePost.id;
                
                return (
                  <button
                    key={post.id}
                    onClick={() => {
                      setActivePost(post);
                      setCurrentIndex(index);
                    }}
                    className={`w-full text-left py-4 border-l-4 pl-4 transition-all ${isActive ? 'border-red-600 bg-gray-500/20' : 'border-transparent'} hover:border-red-400`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl font-bold text-white opacity-80 w-8">{String(index + 1).padStart(2, '0')}</span>
                      <div>
                        <h3 className="font-medium text-white">{post.title}</h3>
                        {post.subtitle && (
                          <p className="text-sm text-gray-300 mt-1">{post.subtitle}</p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            <Link 
              href="/blog"
              className="block text-center py-3 mt-6 bg-red-600 hover:bg-red-700 text-white transition-colors rounded"
            >
             SHIKO ARITKUJT 
            </Link>
          </div>
          
          {/* Right side - Active blog post */}
          <div className="w-full md:w-1/2 lg:w-7/12">
            <div 
              className="relative overflow-hidden h-full"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={activePost.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full h-full"
                >
                  <div className="rounded-none overflow-hidden h-full">
                    <div className="relative h-[400px] overflow-hidden">
                      <Image
                        src={activePost.imageUrl}
                        alt={activePost.title}
                        fill
                        className="object-cover"
                        priority
                      />
                      <div className="absolute inset-0 flex items-center justify-start p-12">
                        <div className="max-w-md bg-black/50 p-6 rounded-md">
                          <h2 className="text-4xl font-bold text-white mb-4">
                            {activePost.title}
                          </h2>
                          <p className="text-white/90">
                            {activePost.subtitle || activePost.content.substring(0, 100) + '...'}
                          </p>
                        </div>
                      </div>
                      
                      {/* Left arrow */}
                      <button 
                        onClick={handlePrev}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-6 h-6 text-white" />
                      </button>
                      
                      {/* Right arrow */}
                      <button 
                        onClick={handleNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-6 h-6 text-white" />
                      </button>
                    </div>
                    <Link 
                      href={`/blog/${activePost.id}`}
                      className="block w-full py-4 mt-2 text-center bg-gray-800 hover:bg-gray-700 text-white font-medium transition-colors"
                    >
                      Lexo me shume
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                  {[0, 1, 2].slice(0, Math.min(3, posts.length)).map((i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > currentIndex ? 1 : -1);
                        setCurrentIndex(i);
                        setActivePost(posts[i]);
                      }}
                      className={`w-3 h-3 rounded-full transition-all ${currentIndex === i ? 'bg-white' : 'bg-gray-400'}`}
                      aria-label={`Go to slide ${i + 1}`}
                      tabIndex={0}
                    />
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrev}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-5 h-5 text-white" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
