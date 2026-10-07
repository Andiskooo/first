# Installation portfolio

The website discovers immediate folders in `public/instalimet/` at build time.
Add photos to a folder, then rebuild/redeploy. No page or navigation code changes
are needed. Keep existing photo names and folders intact.

Image URLs include a SHA-256 content version, so replacing a photo under the same
filename invalidates the optimized image cache automatically. In development,
reload the page after saving photos (public file edits do not always trigger Fast
Refresh). Production image changes require a rebuild/redeploy, like new folders.

- Supported images: PNG, JPG/JPEG, WebP, AVIF.
- Recommended name: `18kW-R32-Location-220m2.jpg`.
- Spaces, underscores, `m²`, and `metra katror` are supported.
- Omit unknown facts. The website never fills in missing capacities, areas,
  refrigerants, or unit counts.
- Multiple views of **one** project: use an identical base name with `-1`, `-2`,
  etc. (or `_foto1`, `_foto2`, or `(1)`, `(2)`).
- Different projects with identical specifications: add a distinct project name
  **before** the photo suffix; never use only the photo suffix to distinguish them.
- Extra/unrecognized filename text is reported by `npx tsx scripts/test-installations.ts`
  for review rather than being turned into unverified public claims. Add verified
  spelling/locality rules to `lib/installations/parser.ts` when needed.
- Existing spelling aliases: `prishtin` → `prishtine` / Prishtinë and `mitrovic`
  → `mitrovice` / Mitrovicë. The filesystem names do not change.
- `banesa` is a project collection, not a municipality. Its empty page is noindex
  until photos are added. `.gitkeep` preserves that empty folder on deployment.
- Folder names must resolve to unique URL slugs; duplicate aliases fail the build
  explicitly instead of publishing ambiguous routes.

All copy comes from verified filename fields and the folder. Named localities
(including Rahovec and Graçanicë) take precedence in project titles and alt text;
the parent collection is retained for browsing. No savings, measured performance,
dates, customers, or property types are invented. A 200 m²-per-house filename
remains 200 m² per house; it is not silently converted into a total surface area.

Checks: `npx tsx scripts/test-installations.ts`, `npx tsc --noEmit`,
`npx eslint app/instalimet components/installations lib/installations scripts/test-installations.ts`,
and `npx next build`. The last command runs the production build without invoking
the existing RSS prebuild script, which rewrites `public/feed.xml`.
