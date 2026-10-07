import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      { pathname: '/**', search: '' },
      // Content-version queries invalidate optimized photos after an edit.
      { pathname: '/instalimet/**' },
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
      },
      // Add other domains as needed
      {
        protocol: 'https',
        hostname: '**.example.com', // Replace with your actual domains
      },
    ],
  },
  // Other Next.js config options can be added here
};

export default nextConfig;
