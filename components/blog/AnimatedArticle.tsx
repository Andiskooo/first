'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedArticleProps {
  content: string;
  tags?: string[];
  accentColor: string;
  fullContent: string;
}

export function AnimatedArticle({ content, tags, accentColor, fullContent }: AnimatedArticleProps) {
  // Format the markdown-like content with enhanced HTML
  const renderContent = (content: string) => {
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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Short summary/introduction */}
      <p className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">{content}</p>
      
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {tags.map(tag => (
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
      <hr className="my-8 border-gray-200" />
      
      {/* Full content */}
      <article className="mt-8">
        {renderContent(fullContent)}
      </article>
    </motion.div>
  );
}
