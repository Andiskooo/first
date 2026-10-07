import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { getInstallations } from '@/lib/installations/data';
import { pageMetadata } from '@/lib/seo';
import { CollectionCard, InstallationBreadcrumbs, InstallationCTA } from '@/components/installations/Portfolio';

const title = 'Instalime të pompave termike në Kosovë';
const description = 'Shikoni instalimet e pompave termike nga ECOTEK në Kosovë. Projekte të realizuara, fotografi dhe specifikime teknike sipas vendndodhjes.';
export async function generateMetadata(): Promise<Metadata> {
  const collections = await getInstallations();
  const image = collections.flatMap(c => c.projects)[0]?.images[0];
  return pageMetadata(title, description, '/instalimet', image?.src);
}

export default async function InstallationsPage() {
  const collections = await getInstallations();
  const projectCount = collections.reduce((sum, c) => sum + c.projects.length, 0);
  return <div className="bg-white text-slate-900">
    <div className="container mx-auto px-4"><InstallationBreadcrumbs /></div>
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="container mx-auto grid gap-10 px-4 py-12 md:py-20 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-end">
        <div className="max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">Instalimet / ECOTEK</p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">Shikoni disa nga instalimet e pompave termike të realizuara nga ECOTEK në Kosovë. Fotografitë dhe të dhënat e çdo projekti tregojnë zgjidhje ngrohjeje për sipërfaqe dhe sisteme të ndryshme.</p>
          <Link href="/pompa-termike" className="mt-5 inline-block font-medium text-blue-600 hover:underline">Pompa termike për ngrohje në Kosovë</Link>
          <a href="#vendndodhjet" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800">Eksploroni instalimet <ArrowDown size={16} aria-hidden="true" /></a>
        </div>
        <div className="flex gap-10 border-t border-slate-200 pt-6 lg:justify-end lg:border-t-0 lg:pb-2">
          <div><p className="text-4xl font-semibold tracking-tight">{projectCount}</p><p className="mt-2 text-sm text-slate-500">projekte të paraqitura</p></div>
          <div><p className="text-4xl font-semibold tracking-tight">{collections.filter(c => c.isLocation).length}</p><p className="mt-2 text-sm text-slate-500">vendndodhje</p></div>
        </div>
      </div>
    </section>
    <div className="container mx-auto px-4 py-12 md:py-16">
      <section id="vendndodhjet" aria-labelledby="locations-heading" className="scroll-mt-6">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3"><h2 id="locations-heading" className="text-2xl font-semibold sm:text-3xl">Puna jonë, nga afër</h2><p className="text-sm text-slate-500">Zgjidhni një vendndodhje për të parë projektet</p></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{collections.filter(c => c.isLocation).map((collection, index) => <CollectionCard key={collection.slug} collection={collection} priority={index === 0} />)}</div>
        {collections.filter(c => !c.isLocation).map(collection => <Link key={collection.slug} href={`/instalimet/${collection.slug}`} className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 px-6 py-5 hover:bg-slate-50"><span className="font-medium">Instalime në {collection.label.toLowerCase()}</span><span className="inline-flex items-center gap-2 text-sm text-blue-600">Shiko koleksionin <ArrowRight size={16} aria-hidden="true" /></span></Link>)}
      </section>
      <div className="mt-16"><InstallationCTA /></div>
    </div>
  </div>;
}
