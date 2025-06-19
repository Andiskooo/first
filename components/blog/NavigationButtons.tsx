'use client';

import React from 'react';
import { ArrowLeft, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationButtonsProps {
  postTitle: string;
}

export function NavigationButtons({ postTitle }: NavigationButtonsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => window.history.back()}>
        <ArrowLeft className="w-4 h-4 mr-1" /> Kthehu
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        onClick={() => {
          if (typeof navigator !== 'undefined' && navigator.share) {
            navigator.share({ 
              title: postTitle, 
              url: window.location.href 
            });
          }
        }}
      >
        <Share2 className="w-4 h-4" />
      </Button>
    </div>
  );
}
