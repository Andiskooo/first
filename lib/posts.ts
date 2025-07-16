// We import BOTH the data array and the type from your data.ts file
import { blogPosts, BlogPost } from '../app/blog/[id]/data';

export function getAllPosts() {
  // Use the imported 'blogPosts' variable
  const sortedPosts = blogPosts.sort((a: BlogPost, b: BlogPost) => {
    // This handles cases where a date might not be set on a post
    if (!a.date) return 1;
    if (!b.date) return -1;

    if (new Date(a.date) < new Date(b.date)) {
      return 1; // Sorts the newest posts first
    } else {
      return -1;
    }
  });

  return sortedPosts;
}