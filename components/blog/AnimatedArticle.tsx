'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

interface AnimatedArticleProps {
  content: string;
  tags?: string[];
  accentColor: string;
  fullContent: string;
}

export function AnimatedArticle({ content, tags, accentColor, fullContent }: AnimatedArticleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="space-y-6"
    >
      {/* Short summary/introduction */}
      <p className="text-xl text-gray-700 font-medium leading-relaxed">
        {content}
      </p>
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${accentColor}-100 text-${accentColor}-800`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <hr className="border-gray-200 my-6" />

      {/* Full content */}
      <article className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:my-4">
        <ReactMarkdown
          rehypePlugins={[rehypeRaw]}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => <h1 className="text-3xl font-bold mt-8 mb-4 whitespace-pre-line" {...props} />,
            h2: (props) => <h2 className="text-2xl font-bold mt-6 mb-3 whitespace-pre-line" {...props} />,
            h3: (props) => <h3 className="text-xl font-bold mt-5 mb-2 whitespace-pre-line" {...props} />,
            p: (props) => <p className="my-4 whitespace-pre-line" {...props} />,
            ul: (props) => <ul className="list-disc pl-6 my-4" {...props} />,
            ol: (props) => <ol className="list-decimal pl-6 my-4" {...props} />,
            table: (props) => <table className="border-collapse w-full my-6 border border-gray-200 rounded-lg overflow-hidden" {...props} />,
            th: (props) => <th className="border border-gray-200 px-4 py-2 text-left bg-gray-50 font-semibold" {...props} />,
            td: (props) => <td className="border border-gray-200 px-4 py-2" {...props} />,
            thead: (props) => <thead className="bg-gray-50" {...props} />,
            tbody: (props) => <tbody className="divide-y divide-gray-200" {...props} />,
            blockquote: (props) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-6" {...props} />
          }}
        >
          {fullContent}
        </ReactMarkdown>
      </article>
    </motion.div>
  );
}
