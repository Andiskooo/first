import assert from 'node:assert/strict';
import { getInstallations, projectPath } from '../lib/installations/data';
import { getAllProducts } from '../app/products/[id]/data';
import { categories } from '../app/categories/[id]/data';
import { siteUrl } from '../lib/seo';

const base = process.argv[2] ?? 'http://localhost:3100';
const decode = (s: string) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const attributes = (tag: string) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1], decode(m[2])]));

async function main() {
  const collections = await getInstallations();
  const pages = ['/', '/pompa-termike', '/instalimet', ...collections.map(c => `/instalimet/${c.slug}`),
    ...collections.flatMap(c => c.projects.map(p => projectPath(c, p))),
    ...getAllProducts().map(p => `/products/${p.id}`), ...categories.map(c => `/categories/${c.id}`)];
  const sitemapResponse = await fetch(`${base}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => decode(m[1]));
  assert.equal(urls.length, new Set(urls).size);
  assert.ok(!sitemap.includes('<lastmod>'), 'No synthetic modification dates for current content');
  assert.ok(!urls.some(url => /\/api\/|\/admin|\?|\/banesa/.test(url)));
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`));
  assert.ok(robots.includes('Disallow: /api/'));
  const titles = new Set<string>();
  const descriptions = new Set<string>();
  const links = new Set<string>();
  for (const pathname of pages) {
    const response = await fetch(`${base}${pathname}`);
    assert.equal(response.status, 200, pathname);
    const html = await response.text();
    // Inspect real document markup, not React's serialized hydration payload.
    const document = html.replace(/<script\b(?![^>]*application\/ld\+json)[\s\S]*?<\/script>/gi, '');
    const title = document.match(/<title>(.*?)<\/title>/)?.[1];
    assert.ok(title, `Missing title: ${pathname}`);
    assert.ok(!titles.has(title), `Duplicate title: ${pathname}: ${title}`);
    titles.add(title);
    const metas = [...document.matchAll(/<meta\s[^>]*>/g)].map(m => attributes(m[0]));
    const description = metas.find(m => m.name === 'description')?.content;
    assert.ok(description, `Missing description: ${pathname}`);
    if (pathname.startsWith('/instalimet')) {
      assert.ok(!descriptions.has(description), `Duplicate installation description: ${pathname}`);
      descriptions.add(description);
    }
    assert.ok(!metas.some(m => /robots|googlebot/.test(m.name ?? '') && /noindex|nofollow/.test(m.content ?? '')), pathname);
    const canonical = [...document.matchAll(/<link\s[^>]*>/g)].map(m => attributes(m[0])).filter(m => m.rel === 'canonical');
    assert.deepEqual(canonical.map(m => new URL(m.href).href), [new URL(`${siteUrl}${pathname}`).href], `Canonical: ${pathname}`);
    assert.equal((document.match(/<h1\b/g) ?? []).length, 1, `One server-rendered H1: ${pathname}`);
    assert.ok(urls.includes(`${siteUrl}${pathname}`), `Missing sitemap URL: ${pathname}`);
    const schemas = [...document.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
    assert.ok(schemas.some(s => s['@type'] === 'HVACBusiness'), pathname);
    if (pathname.startsWith('/instalimet')) {
      const breadcrumb = schemas.find(s => s['@type'] === 'BreadcrumbList');
      assert.ok(breadcrumb, `Breadcrumb schema: ${pathname}`);
      assert.equal(breadcrumb.itemListElement.at(-1).item, `${siteUrl}${pathname}`);
      assert.equal(breadcrumb.itemListElement.length, pathname.split('/').length);
      for (const crumb of breadcrumb.itemListElement.slice(0, -1)) {
        const href = new URL(crumb.item).pathname;
        assert.ok(document.includes(`href="${href}"`), `Visible breadcrumb: ${href}`);
      }
      assert.ok(metas.some(m => m.property === 'og:image' && m.content.startsWith(siteUrl)), pathname);
      assert.ok(metas.some(m => m.name === 'twitter:card' && m.content === 'summary_large_image'), pathname);
      assert.ok(document.includes('/_next/image?'), `Optimized photos: ${pathname}`);
    }
    for (const match of document.matchAll(/<a\s[^>]*>/g)) {
      const href = attributes(match[0]).href;
      if (href?.startsWith('/') && !href.startsWith('//')) links.add(href.split('#')[0]);
    }
  }
  const broken: string[] = [];
  for (const href of links) {
    const response = await fetch(`${base}${href}`, { method: 'HEAD' });
    if (response.status !== 200) broken.push(`${response.status}: ${href}`);
  }
  assert.deepEqual(broken, [], 'Broken internal links');
  for (const url of urls) assert.equal((await fetch(`${base}${new URL(url).pathname}`, { method: 'HEAD' })).status, 200, `Sitemap URL: ${url}`);
  for (const [source, target] of [['/instalimet/banesa', '/instalimet'], ['/instalimet/prishtin', '/instalimet/prishtine'], ['/instalimet/mitrovic', '/instalimet/mitrovice'], ['/instalimet/gjakove/', '/instalimet/gjakove']]) {
    const response = await fetch(`${base}${source}`, { redirect: 'manual' });
    assert.equal(response.status, 308, source);
    assert.equal(new URL(response.headers.get('location')!, base).pathname, target);
  }
  for (const pathname of ['/instalimet/unknown', '/instalimet/gjakove/unknown', '/categories/unknown', '/products/unknown']) {
    assert.equal((await fetch(`${base}${pathname}`)).status, 404, pathname);
  }
  const queryHtml = await (await fetch(`${base}/instalimet/gjakove?utm_source=test`)).text();
  assert.ok(queryHtml.includes(`rel="canonical" href="${siteUrl}/instalimet/gjakove"`));
  console.log(`PASS: ${pages.length} pages; unique titles, canonical URLs, rendered H1s, metadata, JSON-LD, ${urls.length} sitemap URLs, ${links.size} internal links, redirects and 404s.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
