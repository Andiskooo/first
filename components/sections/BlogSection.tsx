'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'Si të zgjidhni sistemin e duhur të ngrohjes për shtëpinë tuaj',
    excerpt: 'Udhëzues i detajuar për zgjedhjen e sistemit të ngrohjes që i përshtatet më mirë nevojave dhe buxhetit tuaj.',
    date: '5 Prill, 2025',
    author: 'Arben Krasniqi',
    image: '/images/blog-1.jpg',
    link: '/blog/si-te-zgjidhni-sistemin-e-duhur-te-ngrohjes',
  },
  {
    id: 2,
    title: 'Përfitimet e sistemeve solare për shtëpitë rezidenciale',
    excerpt: 'Zbuloni si sistemet solare mund të ulin kostot e energjisë dhe të kontribuojnë në mbrojtjen e mjedisit.',
    date: '28 Mars, 2025',
    author: 'Lindita Berisha',
    image: '/images/blog-2.jpg',
    link: '/blog/perfitimet-e-sistemeve-solare',
  },
  {
    id: 3,
    title: 'Mirëmbajtja e sistemeve të klimatizimit për performancë optimale',
    excerpt: 'Këshilla praktike për mirëmbajtjen e rregullt të sistemeve të klimatizimit për të siguruar jetëgjatësi dhe efikasitet.',
    date: '15 Mars, 2025',
    author: 'Driton Hoxha',
    image: '/images/blog-3.jpg',
    link: '/blog/mirembajtja-e-sistemeve-te-klimatizimit',
  },
];

const BlogSection = () => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-12 bg-slate-50"> {/* Reduced padding */}

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Blog & Këshilla</h2>
            <p className="text-lg text-slate-600">
              Informacione dhe këshilla të dobishme nga ekspertët tanë
            </p>
          </div>
          <Link href="/blog" className="text-blue-600 font-medium flex items-center gap-1 group">
            Shiko të gjitha
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="transition-transform group-hover:translate-x-1"
            >
              <path d="M5 12h14"/>
              <path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {blogPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Link href={post.link} className="block h-full">
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-0">
                    <div className="relative h-48 w-full">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-slate-500 mb-3">
                        <span>{post.date}</span>
                        <span>•</span>
                        <span>{post.author}</span>
                      </div>
                      <h3 className="font-semibold text-xl mb-2">{post.title}</h3>
                      <p className="text-slate-600">{post.excerpt}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="p-6 pt-0">
                    <div className="text-blue-600 font-medium flex items-center gap-1 group">
                      Lexo më shumë
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className="transition-transform group-hover:translate-x-1"
                      >
                        <path d="M5 12h14"/>
                        <path d="m12 5 7 7-7 7"/>
                      </svg>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
