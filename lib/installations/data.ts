import { readdir, readFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { cache } from 'react';
import { collectionName, parseInstallationFilename, slugify, type InstallationMetadata } from './parser';
import { projectEditorial, projectMunicipality, type ProjectEditorial } from './editorial';

export interface InstallationImage { src: string; filename: string }
export interface InstallationProject {
  id: string;
  slug: string;
  sourceKey: string;
  editorial: ProjectEditorial;
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
  const root = path.join(process.cwd(), 'public', 'instalimet');
  const locations = new Map<string, InstallationNavItem>();
  for (const folder of readdirSync(root, { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    for (const file of readdirSync(path.join(root, folder.name)).filter(name => /\.(png|jpe?g|webp|avif)$/i.test(name))) {
      const parsed = parseInstallationFilename(file, folder.name);
      const editorial = projectEditorial[`${folder.name}/${parsed.groupKey}`];
      const metadata = { ...parsed, ...editorial?.metadata };
      const location = collectionName(editorial?.municipality ?? projectMunicipality(folder.name, metadata.locality));
      locations.set(location.slug, location);
    }
  }
  return [...locations.values()].sort((a, b) => Number(a.slug === 'banesa') - Number(b.slug === 'banesa') || a.label.localeCompare(b.label, 'sq'));
}

export function projectPath(collection: Pick<InstallationCollection, 'slug'>, project: Pick<InstallationProject, 'slug'>) {
  return `/instalimet/${collection.slug}/${project.slug}`;
}

export function projectSlug(m: InstallationMetadata) {
  return slugify([m.units ? `${m.units}-pompa-termike` : 'pompe-termike',
    m.capacityKw ? `${m.capacityKw}kw` : '', m.refrigerant, m.locality,
    m.areaM2 ? `${m.areaM2}m2${m.areaPerHouse ? '-per-shtepi' : ''}` : '',
    m.heating === 'underfloor' ? 'ngrohje-nen-dysheme' : m.heating === 'radiators' ? 'radiatore' : '',
  ].filter(Boolean).join('-'));
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
      const parsed = parseInstallationFilename(filename, folder.name);
      const sourceKey = `${folder.name}/${parsed.groupKey}`;
      const editorial = projectEditorial[sourceKey] ?? {};
      const metadata = { ...parsed, ...editorial.metadata };
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
        groups.set(key, { id: `${slugify(metadata.groupKey)}-${groups.size + 1}`, slug: editorial.slug ?? projectSlug(metadata), sourceKey, editorial, metadata, images: [image] });
      }
    }
    return { folder: folder.name, ...collectionName(folder.name), isLocation: slugify(folder.name) !== 'banesa', projects: [...groups.values()] };
  }));
  const normalized = new Map<string, InstallationCollection>();
  for (const collection of collections) {
    for (const project of collection.projects) {
      const location = collectionName(project.editorial.municipality ?? projectMunicipality(collection.folder, project.metadata.locality));
      const target = normalized.get(location.slug) ?? { ...collection, ...location, isLocation: location.slug !== 'banesa', projects: [] };
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project.slug)) throw new Error(`Invalid project slug: ${project.sourceKey}`);
      if (target.projects.some(p => p.slug === project.slug)) throw new Error(`Duplicate project URL: ${location.slug}/${project.slug}. Set a verified descriptive slug in editorial.ts.`);
      target.projects.push(project);
      normalized.set(location.slug, target);
    }
  }
  return [...normalized.values()].sort((a, b) => Number(b.isLocation) - Number(a.isLocation) || a.label.localeCompare(b.label, 'sq'));
});
