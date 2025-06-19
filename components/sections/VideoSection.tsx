'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const VideoSection = () => {
  return (
    <section className="py-12 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
          Shijoni freskinë dhe komoditetin maksimal në shtëpinë tuaj me kondicionerët e ajrit CANDY. Zgjidhja ideale për një verë pa stres.
          </p>
        </div>
        <div className="relative aspect-video max-w-4xl mx-auto rounded-lg overflow-hidden shadow-2xl">
          <video
            src="/videos/candyvideo.mp4"
            poster="/hero/default-hero.jpg" // Optional poster image
            controls
            className="w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="text-center mt-12">
          <Button size="lg" asChild>
            <a href="/contact-us">Na Kontaktoni për një Konsultë</a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default VideoSection;
