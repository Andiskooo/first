import type { NextConfig } from "next";
import { readdirSync } from 'node:fs';
import path from 'node:path';

const nextConfig: NextConfig = {
  trailingSlash: false,
  async redirects() {
    return [
      ...(readdirSync(path.join(process.cwd(), 'public/instalimet/banesa')).some(name => /\.(png|jpe?g|webp|avif)$/i.test(name))
        ? [] : [{ source: '/instalimet/banesa', destination: '/instalimet', permanent: true }]),
      { source: '/instalimet/prishtin', destination: '/instalimet/prishtine', permanent: true },
      { source: '/instalimet/mitrovic', destination: '/instalimet/mitrovice', permanent: true },
    ];
  },
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
