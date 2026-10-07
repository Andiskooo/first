import type { MetadataRoute } from 'next';
import { getInstallations, projectPath } from '@/lib/installations/data';
import { getAllProducts } from '@/app/products/[id]/data';
import { categories } from '@/app/categories/[id]/data';
import { blogPosts } from '@/app/blog/[id]/data';
import { siteUrl } from '@/lib/seo';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const collections = await getInstallations();
  const paths = ['/', '/pompa-termike', '/instalimet', '/contact-us', '/blog',
    ...categories.map(c => `/categories/${c.id}`),
    ...getAllProducts().map(p => `/products/${p.id}`),
    ...blogPosts.map(p => `/blog/${p.id}`),
    ...collections.map(c => `/instalimet/${c.slug}`),
  ];
  return [...new Set(paths)].map(path => ({ url: `${siteUrl}${path}` })).concat(
    collections.flatMap(collection => collection.projects.map(project => ({
      url: `${siteUrl}${projectPath(collection, project)}`,
      ...(project.editorial.updatedAt ? { lastModified: project.editorial.updatedAt } : {}),
    }))),
  );
}
