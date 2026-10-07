import Link from 'next/link';
import { getInstallations, projectPath } from '@/lib/installations/data';
import { projectCopy } from '@/lib/installations/copy';
import type { Product } from '@/app/products/[id]/data';

export default async function RelatedInstallations({ product }: { product: Product }) {
  if (product.subcategory !== 'pompa-termike') return null;
  const refrigerant = product.badges?.map(b => b.text).join(' ').match(/\bR(?:290|32)\b/)?.[0];
  const collections = await getInstallations();
  // A shared refrigerant is useful context, not evidence of an installed product model.
  const examples = collections.flatMap(collection => collection.projects
    .filter(p => !refrigerant || p.metadata.refrigerant === refrigerant)
    .map(project => ({ collection, project }))).slice(0, 4);
  return <section className="mt-12 rounded-xl border border-slate-200 p-6 sm:p-8">
    <h2 className="text-2xl font-semibold">Instalime me pompa termike{refrigerant ? ` ${refrigerant}` : ''}</h2>
    <p className="mt-4 text-slate-600">Shikoni shembuj të punës së ECOTEK{refrigerant ? ` me gaz ftohës ${refrigerant}` : ''}. Modeli i pajisjes në çdo projekt identifikohet vetëm kur është dokumentuar.</p>
    <ul className="mt-5 space-y-3">{examples.map(({ collection, project }) => <li key={projectPath(collection, project)}><Link href={projectPath(collection, project)} className="text-blue-600 hover:underline">{projectCopy(project, collection).title}</Link></li>)}</ul>
    <p className="mt-5"><Link href="/pompa-termike" className="font-medium text-blue-600 hover:underline">Përzgjedhja dhe instalimi i pompave termike</Link></p>
    <p className="mt-3"><Link href="/instalimet" className="text-blue-600 hover:underline">Të gjitha instalimet në Kosovë</Link></p>
  </section>;
}
