import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronRight, MapPin, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { InstallationCollection, InstallationProject } from '@/lib/installations/data';
import { heatPumpsUrl, projectCopy, siteUrl } from '@/lib/installations/copy';

export function InstallationBreadcrumbs({ collection }: { collection?: InstallationCollection }) {
  const crumbs = [{ label: 'Ballina', href: '/' }, { label: 'Instalimet', href: '/instalimet' },
    ...(collection ? [{ label: collection.label, href: `/instalimet/${collection.slug}` }] : [])];
  const schema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem', position: index + 1, name: crumb.label, item: `${siteUrl}${crumb.href}`,
    })),
  };
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
    <nav aria-label="Vendndodhja në faqe" className="py-6 text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        {crumbs.map((crumb, index) => <li key={crumb.href} className="flex items-center gap-2">
          {index > 0 && <ChevronRight size={14} aria-hidden="true" />}
          {index === crumbs.length - 1 ? <span aria-current="page" className="text-slate-800">{crumb.label}</span>
            : <Link href={crumb.href} className="transition-colors hover:text-blue-600">{crumb.label}</Link>}
        </li>)}
      </ol>
    </nav>
  </>;
}

export function CollectionCard({ collection, priority = false }: { collection: InstallationCollection; priority?: boolean }) {
  const project = collection.projects[0];
  return <Link href={`/instalimet/${collection.slug}`} className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
    {project ? <div className="relative aspect-[3/2] overflow-hidden bg-slate-100">
      <Image src={project.images[0].src} alt={projectCopy(project, collection).alt} fill
        sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" priority={priority}
        className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
    </div> : <div className="flex aspect-[3/2] items-center justify-center bg-slate-50 text-slate-400"><MapPin size={40} aria-hidden="true" /></div>}
    <div className="flex items-center justify-between gap-4 p-6">
      <div><h2 className="text-2xl font-semibold text-slate-900">{collection.label}</h2>
        <p className="mt-1 text-sm text-slate-500">{project ? `${collection.projects.length} ${collection.projects.length === 1 ? 'projekt i realizuar' : 'projekte të realizuara'}` : 'Fotografitë do të shtohen së shpejti'}</p>
      </div>
      <ArrowRight className="shrink-0 text-blue-600 transition-transform motion-safe:group-hover:translate-x-1" size={22} aria-hidden="true" />
    </div>
  </Link>;
}

export function ProjectSection({ project, collection, index }: { project: InstallationProject; collection: InstallationCollection; index: number }) {
  const copy = projectCopy(project, collection);
  return <article id={project.id} className="grid items-start gap-7 border-b border-slate-200 py-12 first:pt-0 last:border-0 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-12 lg:py-16">
    <div className="min-w-0 space-y-3">
      {project.images.map((image, imageIndex) => <a key={image.src} href={image.src} target="_blank" rel="noopener noreferrer"
        aria-label={`${copy.alt} — fotografia ${imageIndex + 1}, hapet në skedë të re`}
        className="group relative block aspect-[3/2] overflow-hidden rounded-xl bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
        <Image src={image.src} alt={`${copy.alt}${project.images.length > 1 ? ` — pamja ${imageIndex + 1}` : ''}`} fill
          priority={index === 0 && imageIndex === 0} sizes="(max-width: 1023px) 100vw, 60vw" className="object-contain" />
        <span className="absolute bottom-3 right-3 rounded-md bg-white/95 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm">Shiko fotografinë ↗</span>
      </a>)}
    </div>
    <div className="min-w-0 lg:py-4">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-blue-600">ECOTEK / Projekt {String(index + 1).padStart(2, '0')}</p>
      <h2 className="text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">{copy.title}</h2>
      <ul aria-label="Të dhënat e instalimit" className="my-6 flex flex-wrap gap-2">
        {copy.badges.map(badge => <li key={badge} className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700">{badge}</li>)}
      </ul>
      <div className="space-y-4 leading-relaxed text-slate-600">{copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
    </div>
  </article>;
}

export function InstallationCTA({ collection }: { collection?: InstallationCollection }) {
  return <section className="rounded-xl bg-slate-900 px-6 py-10 text-white sm:p-12">
    <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
      <div className="max-w-2xl">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Le të flasim për projektin tuaj</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Po kërkoni pompë termike{collection?.isLocation ? ` në ${collection.label}` : ''}?</h2>
        <p className="mt-4 leading-relaxed text-slate-300">Kontaktoni ekipin tonë për të zgjedhur sistemin e përshtatshëm të ngrohjes për shtëpinë apo biznesin tuaj.</p>
        <Link href={heatPumpsUrl} className="mt-5 inline-flex items-center gap-2 text-sm text-blue-200 underline-offset-4 hover:underline">Njihuni me pompat tona termike <ArrowRight size={16} aria-hidden="true" /></Link>
      </div>
      <div className="flex shrink-0 flex-col gap-3">
        <Button asChild size="lg" className="bg-blue-600 text-white hover:bg-blue-700"><Link href="/contact-us">Kërkoni një konsultim <ArrowRight aria-hidden="true" /></Link></Button>
        <a href="tel:+38344914480" className="inline-flex min-h-11 items-center justify-center gap-2 text-sm text-slate-200 hover:text-white"><Phone size={16} aria-hidden="true" /> +383 44 914 480</a>
      </div>
    </div>
  </section>;
}
