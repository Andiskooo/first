import Image from 'next/image';
import Link from 'next/link';
import { getAllProducts } from '@/app/products/[id]/data';
import { getInstallations } from '@/lib/installations/data';
import { pageMetadata } from '@/lib/seo';
import { CollectionCard, InstallationCTA } from '@/components/installations/Portfolio';

export const metadata = pageMetadata('Pompa Termike në Kosovë | Përzgjedhje dhe Instalim',
  'Pompa termike për ngrohje në Kosovë nga ECOTEK. Njihuni me modelet R32 dhe R290 dhe shikoni instalime të realizuara sipas qytetit.', '/pompa-termike', '/produktet/pompa-termike-apex.png');

export default async function HeatPumpsPage() {
  const products = getAllProducts().filter(p => p.subcategory === 'pompa-termike');
  const collections = await getInstallations();
  return <div className="bg-white text-slate-900">
    <div className="container mx-auto px-4 py-6 text-sm text-slate-500"><Link href="/" className="hover:text-blue-600">Ballina</Link> / Pompa termike</div>
    <section className="border-b border-slate-200 bg-slate-50">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <h1 className="max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl">Pompa termike në Kosovë</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-slate-600">ECOTEK ofron pompa termike dhe instalimin e sistemeve të ngrohjes. Këtu mund të krahasoni familjet e produkteve dhe të shikoni punën e ekipit tonë në objekte të ndryshme në Kosovë.</p>
        <Link href="/instalimet" className="mt-6 inline-block font-medium text-blue-600 hover:underline">Shikoni instalimet e pompave termike në Kosovë</Link>
      </div>
    </section>
    <div className="container mx-auto space-y-14 px-4 py-12 md:py-16">
      <section aria-labelledby="models-heading">
        <h2 id="models-heading" className="text-2xl font-semibold sm:text-3xl">Modelet e pompave termike</h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-slate-600">Në katalog gjeni pompa termike me R32 dhe R290. Në faqen e secilit produkt paraqiten modelet, kapacitetet dhe specifikimet e tij; zgjedhja duhet të lidhet me nevojat e objektit tuaj.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{products.map(product => <Link key={product.id} href={`/products/${product.id}`} className="overflow-hidden rounded-xl border border-slate-200 transition-shadow hover:shadow-lg">
          <div className="relative aspect-[3/2] bg-slate-50"><Image src={product.imageUrl} alt={product.title} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-contain p-6" /></div>
          <div className="p-6"><h3 className="text-xl font-semibold">{product.title}</h3><p className="mt-3 text-slate-600">{product.description}</p></div>
        </Link>)}</div>
      </section>
      <section className="max-w-3xl space-y-4 leading-relaxed text-slate-600">
        <h2 className="text-2xl font-semibold text-slate-900">Çfarë kapaciteti i duhet objektit?</h2>
        <p>Sipërfaqja në m² është një pikënisje. Izolimi, humbjet e nxehtësisë, temperatura e kërkuar e ujit dhe përdorimi i radiatorëve apo ngrohjes nën dysheme ndikojnë në dimensionimin e pompës termike.</p>
        <p>Nëse po kërkoni një pompë termike 16 kW ose 20 kW, konsultoni ekipin tonë përpara përzgjedhjes. Një instalim në një objekt me sipërfaqe të ngjashme është shembull pune, jo llogaritje e kapacitetit për shtëpinë tuaj.</p>
        <Link href="/contact-us" className="inline-block font-medium text-blue-600 hover:underline">Kërkoni këshillim për përzgjedhjen dhe instalimin</Link>
      </section>
      <section aria-labelledby="examples-heading">
        <h2 id="examples-heading" className="text-2xl font-semibold sm:text-3xl">Instalime të realizuara sipas vendndodhjes</h2>
        <p className="mt-4 max-w-3xl text-slate-600">Fotografitë e projekteve tregojnë instalimet e ECOTEK. Hapni një vendndodhje për të parë kapacitetin, sipërfaqen dhe sistemin e ngrohjes kur këto të dhëna janë të disponueshme.</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{collections.filter(c => c.isLocation).map(collection => <CollectionCard key={collection.slug} collection={collection} />)}</div>
      </section>
      <InstallationCTA />
    </div>
  </div>;
}
