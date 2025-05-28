'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface AnimatedContentProps {
  subtitle?: string;
  title: string;
  date?: string;
  accentColor: string;
}

export function AnimatedContent({ subtitle, title, date, accentColor }: AnimatedContentProps) {
  return (
    <>
      {subtitle && (
        <motion.p 
          className={`text-sm md:text-base font-medium uppercase tracking-wider text-white py-1 px-3 bg-${accentColor}-600 inline-block mb-4 rounded`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
      <motion.h1 
        className="text-3xl md:text-5xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {title}
      </motion.h1>
      {date && (
        <motion.div 
          className="flex items-center text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Calendar className="w-4 h-4 mr-2" />
          <span>{date}</span>
        </motion.div>
      )}
    </>
  );
}
