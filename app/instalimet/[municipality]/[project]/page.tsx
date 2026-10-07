import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getInstallations, projectPath } from '@/lib/installations/data';
import { projectCopy } from '@/lib/installations/copy';
import { pageMetadata } from '@/lib/seo';
import { InstallationBreadcrumbs, InstallationCTA, ProjectSection } from '@/components/installations/Portfolio';
import { getProductById } from '@/app/products/[id]/data';

interface Props { params: Promise<{ municipality: string; project: string }> }
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getInstallations()).flatMap(collection => collection.projects.map(project => ({ municipality: collection.slug, project: project.slug })));
}
async function resolveProject(params: Props['params']) {
  const route = await params;
  const collection = (await getInstallations()).find(c => c.slug === route.municipality);
  const project = collection?.projects.find(p => p.slug === route.project);
  if (!collection || !project) notFound();
  return { collection, project };
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { collection, project } = await resolveProject(params);
  const copy = projectCopy(project, collection);
  return pageMetadata(copy.title, `${copy.paragraphs[0]} Shikoni fotografitë e instalimit nga ECOTEK.`, projectPath(collection, project), project.images[0].src);
}
export default async function ProjectPage({ params }: Props) {
  const { collection, project } = await resolveProject(params);
  const copy = projectCopy(project, collection);
  const products = (project.editorial.relatedProductIds ?? []).flatMap(id => {
    const product = getProductById(id);
    return product ? [product] : [];
  });
  return <div className="bg-white text-slate-900">
    <div className="container mx-auto px-4"><InstallationBreadcrumbs collection={collection} project={project} /></div>
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-10 md:py-16">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">ECOTEK / {collection.label}</p>
        <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">{copy.title}</h1>
      </div>
    </section>
    <div className="container mx-auto px-4 py-10 md:py-16">
      <ProjectSection project={project} collection={collection} index={collection.projects.indexOf(project)} detail />
      <section className="space-y-4 py-10" aria-labelledby="more-installations">
        <h2 id="more-installations" className="text-2xl font-semibold">Më shumë për ngrohjen me pompa termike</h2>
        <p><Link href={`/instalimet/${collection.slug}`} className="text-blue-600 hover:underline">Shiko më shumë instalime në {collection.label}</Link></p>
        <p><Link href="/instalimet" className="text-blue-600 hover:underline">Të gjitha instalimet e pompave termike në Kosovë</Link></p>
        <p><Link href="/pompa-termike" className="text-blue-600 hover:underline">Pompat termike dhe përzgjedhja e sistemit të ngrohjes</Link></p>
        {products.map(product => <p key={product.id}><Link href={`/products/${product.id}`} className="text-blue-600 hover:underline">{product.title}</Link></p>)}
      </section>
      <InstallationCTA collection={collection} />
    </div>
  </div>;
}
