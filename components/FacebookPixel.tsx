'use client';

import { useEffect } from 'react';
import Image from 'next/image';

type FacebookPixelFunction = {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  push?: unknown;
  loaded?: boolean;
  version?: string;
};

declare global {
  interface Window {
    fbq: (method: string, ...args: unknown[]) => void;
    _fbq: FacebookPixelFunction;
  }
}

export default function FacebookPixel() {
  useEffect(() => {
    // Add Facebook Pixel base code
    const addFacebookPixel = () => {
      // Create script element
      const script = document.createElement('script');
      script.innerHTML = `
        !function(f,b,e,v,n,t,s) {
          if(f.fbq) return; 
          n = f.fbq = function() {
            n.callMethod ? n.callMethod.apply(n,arguments) : n.queue.push(arguments)
          };
          if(!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = true;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = true;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s);
        }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '1395799244872352');
        fbq('track', 'PageView');
      `;
      
      // Add script to document
      document.head.appendChild(script);
    };

    // Only run in the browser, not during server-side rendering
    if (typeof window !== 'undefined') {
      addFacebookPixel();
    }
    
    // Clean up function (optional)
    return () => {
      // Nothing to clean up in this case
    };
  }, []);

  return (
    <>
      <noscript>
        <div style={{ display: 'none' }}>
          <Image 
            height={1} 
            width={1} 
            src="https://www.facebook.com/tr?id=1395799244872352&ev=PageView&noscript=1"
            alt="Facebook Pixel"
            unoptimized={true} // Important for tracking pixels
            priority
          />
        </div>
      </noscript>
    </>
  );
}
