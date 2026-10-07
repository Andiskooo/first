import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { getInstallations } from '@/lib/installations/data';
import { collectionCopy, siteUrl } from '@/lib/installations/copy';
import { InstallationBreadcrumbs, InstallationCTA, ProjectSection } from '@/components/installations/Portfolio';

interface Props { params: Promise<{ municipality: string }> }
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getInstallations()).map(collection => ({ municipality: collection.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { municipality } = await params;
  const collection = (await getInstallations()).find(c => c.slug === municipality);
  if (!collection) notFound();
  const copy = collectionCopy(collection);
  const url = `${siteUrl}/instalimet/${collection.slug}`;
  const image = collection.projects[0]?.images[0];
  return {
    title: `${copy.title} | ECOTEK`, description: copy.description,
    alternates: { canonical: url },
    robots: collection.projects.length ? undefined : { index: false, follow: true },
    openGraph: { title: copy.title, description: copy.description, url, siteName: 'ECOTEK', locale: 'sq_AL', type: 'website',
      images: image ? [{ url: `${siteUrl}${image.src}`, alt: copy.title }] : [] },
  };
}
export default async function MunicipalityPage({ params }: Props) {
  const { municipality } = await params;
  const collections = await getInstallations();
  const collection = collections.find(c => c.slug === municipality);
  if (!collection) notFound();
  const copy = collectionCopy(collection);
  const position = collections.indexOf(collection);
  const related = [...collections.slice(position + 1), ...collections.slice(0, position)].filter(c => c.isLocation).slice(0, 4);
  return <div className="bg-white text-slate-900">
    <div className="container mx-auto px-4"><InstallationBreadcrumbs collection={collection} /></div>
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Instalimet / {collection.label}</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{copy.title}</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">{copy.intro}</p>
        {collection.projects.length > 0 && <p className="mt-6 text-sm font-medium text-slate-500">{collection.projects.length} projekte të realizuara nga ekipi ynë</p>}
      </div>
    </section>
    <div className="container mx-auto px-4 py-10 md:py-16">
      <section aria-label={`Projektet — ${collection.label}`}>
        {collection.projects.length ? collection.projects.map((project, index) => <ProjectSection key={project.id} project={project} collection={collection} index={index} />)
          : <div className="mb-12 rounded-xl border border-slate-200 p-8 sm:p-12"><h2 className="text-2xl font-semibold">Fotografitë do të shtohen së shpejti</h2><p className="mt-3 max-w-2xl leading-relaxed text-slate-600">Ky koleksion nuk ka ende fotografi të publikuara. Ndërkohë, shikoni instalimet në vendndodhjet e tjera ose na kontaktoni për projektin tuaj.</p><Link href="/instalimet" className="mt-5 inline-flex items-center gap-2 font-medium text-blue-600 hover:underline">Të gjitha instalimet <ArrowRight size={16} aria-hidden="true" /></Link></div>}
      </section>
      <div className="mt-8"><InstallationCTA collection={collection} /></div>
      <section aria-labelledby="related-heading" className="pt-12 md:pt-16">
        <h2 id="related-heading" className="text-xl font-semibold sm:text-2xl">Shiko instalimet edhe në qytete të tjera</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{related.map(other => <Link key={other.slug} href={`/instalimet/${other.slug}`} className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 p-5 font-medium transition-colors hover:border-blue-300 hover:bg-blue-50">{other.label}<ArrowRight size={18} className="text-blue-600" aria-hidden="true" /></Link>)}</div>
      </section>
    </div>
  </div>;
}
