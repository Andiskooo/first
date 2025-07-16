import fs from 'fs';
import { Feed } from 'feed';
import { getAllPosts } from '../lib/posts';

async function generateRssFeed() {
  const posts = getAllPosts();
  const siteURL = 'https://ecotek.vercel.app'; // Replace with your actual website URL

  const feedOptions = {
    title: 'ECOTEK Blog | RSS Feed',
    description: 'Latest news and articles from ECOTEK',
    id: siteURL,
    link: siteURL,
    copyright: `All rights reserved ${new Date().getFullYear()}, ECOTEK`,
    author: {
      name: 'ECOTEK',
    },
  };

  const feed = new Feed(feedOptions);

  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${siteURL}/blog/${post.id}`,
      link: `${siteURL}/blog/${post.id}`,
      description: post.subtitle || '',
      date: new Date(post.date || new Date()),
    });
  });

  fs.writeFileSync('./public/feed.xml', feed.rss2());
  console.log('✅ RSS feed generated successfully!');
}

generateRssFeed();
