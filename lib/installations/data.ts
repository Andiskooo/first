import { readdir, readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { cache } from 'react';
import { collectionName, parseInstallationFilename, slugify, type InstallationMetadata } from './parser';

export interface InstallationImage { src: string; filename: string }
export interface InstallationProject {
  id: string;
  metadata: InstallationMetadata;
  images: InstallationImage[];
}
export interface InstallationCollection {
  folder: string;
  slug: string;
  label: string;
  isLocation: boolean;
  projects: InstallationProject[];
}
export type InstallationNavItem = Pick<InstallationCollection, 'slug' | 'label'>;

// The root layout only needs names, not image bytes. Keeping this synchronous
// also preserves the existing layout's React/Radix hydration boundary.
export function getInstallationNavigation(): InstallationNavItem[] {
  return readdirSync(path.join(process.cwd(), 'public', 'instalimet'), { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => collectionName(entry.name))
    .sort((a, b) => Number(a.slug === 'banesa') - Number(b.slug === 'banesa') || a.label.localeCompare(b.label, 'sq'));
}

export const getInstallations = cache(async (): Promise<InstallationCollection[]> => {
  const root = path.join(process.cwd(), 'public', 'instalimet');
  const folders = (await readdir(root, { withFileTypes: true })).filter(entry => entry.isDirectory());
  const collections = await Promise.all(folders.map(async folder => {
    const files = (await readdir(path.join(root, folder.name), { withFileTypes: true }))
      .filter(entry => entry.isFile() && /\.(png|jpe?g|webp|avif)$/i.test(entry.name))
      .map(entry => entry.name).sort((a, b) => a.localeCompare(b, 'sq', { numeric: true }));
    const groups = new Map<string, InstallationProject>();
    for (const filename of files) {
      const metadata = parseInstallationFilename(filename, folder.name);
      const existing = groups.get(metadata.groupKey);
      // A replacement with the same filename must invalidate both the browser and
      // next/image caches. React cache only deduplicates this work per render;
      // fresh dev requests read the current bytes, and production hashes at build.
      const bytes = await readFile(path.join(root, folder.name, filename));
      const version = createHash('sha256').update(bytes).digest('hex').slice(0, 16);
      const image = { filename, src: `/instalimet/${encodeURIComponent(folder.name)}/${encodeURIComponent(filename)}?v=${version}` };
      // A matching specification alone is never enough to combine two photos.
      if (existing && (metadata.sequence !== null || existing.metadata.sequence !== null)) {
        existing.images.push(image);
      } else {
        const key = existing ? `${metadata.groupKey}:${filename}` : metadata.groupKey;
        groups.set(key, { id: `${slugify(metadata.groupKey)}-${groups.size + 1}`, metadata, images: [image] });
      }
    }
    return { folder: folder.name, ...collectionName(folder.name), isLocation: slugify(folder.name) !== 'banesa', projects: [...groups.values()] };
  }));
  const slugs = new Set<string>();
  for (const collection of collections) {
    if (slugs.has(collection.slug)) throw new Error(`Duplicate installation URL: ${collection.slug}`);
    slugs.add(collection.slug);
  }
  return collections.sort((a, b) => Number(b.isLocation) - Number(a.isLocation) || a.label.localeCompare(b.label, 'sq'));
});
