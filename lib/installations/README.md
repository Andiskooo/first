# Installation portfolio and local SEO

## Architecture

Next.js App Router renders `/pompa-termike`, `/instalimet`, municipality pages,
and individual project pages as static HTML at build time. All installation
headings, facts, links, breadcrumbs and JSON-LD exist before client hydration.
Category pages remain server-rendered (they support query-string filters), as do
product pages. No new client dependency was introduced.

`data.ts` discovers photographs in `public/instalimet/`, parses only explicit
filename facts, applies optional verified editorial records, groups photos,
and assigns the actual municipality. The same normalized collections drive
pages, navigation, metadata, breadcrumbs, contextual links and `app/sitemap.ts`.
`getInstallationNavigation()` performs the lightweight filename-only version
so the synchronous root layout does not read image bytes or change hydration.

Current content: 38 projects in 9 municipalities. Rahovec and Graçanicë are
separate municipalities; Dragodan and Vranjevc remain under Prishtinë.
Vitomericë remains under Pejë. The ambiguous name Has retains the source
Gjakovë grouping; confirm a more precise locality before changing it.

## Adding a project

1. Add original photos to `public/instalimet/<municipality>/`.
2. Prefer descriptive names, e.g. `18kW-R32-Location-220m2.jpg`.
   PNG, JPG/JPEG, WebP and AVIF are supported. Spaces, `m²` and `metra katror`
   are understood. Omit unknown facts.
3. Multiple photographs of **one** installation share a base name with `-1`,
   `-2`, `_foto1`, `_foto2` or `(1)`, `(2)` suffixes. Different installations
   must have distinct base names; matching capacity alone never merges projects.
4. Add richer verified content to `projectEditorial` in `editorial.ts` as needed.
   Its key is `<original-folder>/<lowercase base filename without extension or
   photo-sequence suffix>` (the `sourceKey` in the normalized data).
5. Rebuild and deploy. The project, city, hub, menu, metadata, sitemap and
   breadcrumb hierarchy update automatically. A new city needs at least one photo.

Example editorial record (illustrative only, not published):

```ts
'gjakove/18kw-r32-projekti-me-emrin-e-verifikuar': {
  slug: 'pompe-termike-18kw-r32-emri-i-projektit',
  title: 'Titulli i verifikuar i projektit',
  description: ['Përshkrimi i instalimit me fakte të konfirmuara.'],
  municipality: 'Gjakovë',
  metadata: { locality: 'Vendndodhja e konfirmuar' },
  imageAlts: { 'filename-1.jpg': 'Përshkrim i asaj që duket në këtë fotografi' },
}
```

Optional fields include `buildingType`, `relatedProductIds` (only the actual
installed model), and `updatedAt` (an accurate ISO content-modification date).
Do not infer model identity from refrigerant, date from filesystem timestamps,
or a property type/unit count from a photo. Unparsed filename text is reported
for review rather than published as an unverified fact.

## Permanent URLs and images

Project URLs use capacity, refrigerant, locality, area and heating type when
known. They contain no array indexes or generated IDs. Adding another photo
does not change the URL. Duplicate slugs fail the build: resolve them with a
verified, human-readable editorial slug rather than a numeric suffix.

Before renaming source files or changing technical facts, pin the existing
published `slug` in the editorial record. If a published URL must move, add
an explicit permanent redirect in `next.config.ts`. Keep existing photo paths:
they are public URLs and may have external links. SHA-256 version queries
invalidate optimized image caches when bytes change. Galleries retain original
images, use Next Image with responsive sizes, reserve aspect-ratio space, and
lazy-load all except the initial image. Use per-photo `imageAlts` where verified
visual descriptions are available.

Existing municipality URLs continue to work. `/instalimet/prishtin` and
`/instalimet/mitrovic` redirect to their correctly spelled canonical URLs.
The old empty `/instalimet/banesa` redirects to the hub while the folder has no
photos; it can become a real non-geographic collection when content is added.
No existing project-page URLs needed migration: those pages did not exist.
Source image folders were not moved when correcting municipality grouping.

Trailing-slash URLs redirect to slashless URLs through Next.js. Query variants
have clean canonical URLs; genuine project pages self-canonicalize.

## Content and structured data

Project descriptions retain verified facts and omit repetitive sizing advice.
City introductions describe the current evidence; review these introductions
when adding projects that change the described range or mix of systems.
Unknown future cities get a factual introduction from their real project data.

`lib/seo.ts` provides metadata and a site-wide HVACBusiness entity using the
address, phone, opening hours and social profiles already shown on the site.
Installation breadcrumbs provide both visible links and matching BreadcrumbList
JSON-LD. No reviews, ratings, FAQs or invented technical properties are added.
Product installation examples match refrigerant where available and explicitly
do not claim that the pictured unit is that exact catalogue model.

The sitemap includes canonical public content only. Modification dates are
omitted unless explicitly supplied. `app/robots.ts` allows public pages/assets,
blocks API/admin paths, and declares the sitemap. Robots rules are not access
control. Clean project URLs are ready for manual Google Business Profile posts.

## Validation

```sh
npm run test:installations
npm run lint
npx tsc --noEmit
npx next build
npx next start -p 3100
npm run test:seo -- http://localhost:3100
```

`test:seo` checks live production HTML for metadata, titles, canonicals, H1s,
schema, breadcrumbs, images, all sitemap URLs/internal links, redirects and 404s.
`test:installations -- <base-url>` additionally verifies that all served source
images match local file hashes. Use `npx next build` for isolated validation:
the existing `npm run build` prebuild step rewrites `public/feed.xml`.
