import fs from 'fs';
import { Feed } from 'feed';
import { getAllPosts } from '../lib/posts.ts'; // Using import and added .js extension

async function generateRssFeed() {
  const posts = await getAllPosts();
  const siteURL = 'https://yourwebsite.com'; // ✅ IMPORTANT: Replace with your website's URL

  const feedOptions = {
    title: 'ECOTEK Blog | RSS Feed', // ✅ Replace with your info
    description: 'Latest news and articles from ECOTEK',
    id: siteURL,
    link: siteURL,
    copyright: `All rights reserved ${new Date().getFullYear()}, ECOTEK`,
    author: {
      name: 'Your Name', // ✅ Replace
    },
  };

  const feed = new Feed(feedOptions);

  posts.forEach(post => {
    feed.addItem({
      title: post.title,
      id: `${siteURL}/blog/${post.slug}`,
      link: `${siteURL}/blog/${post.slug}`,
      description: post.subtitle,
      date: new Date(post.date),
    });
  });

  fs.writeFileSync('./public/feed.xml', feed.rss2());
  console.log('✅ RSS feed generated successfully!');
}

generateRssFeed();