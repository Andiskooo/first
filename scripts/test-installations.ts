import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { collectionName, parseInstallationFilename } from '../lib/installations/parser';
import { getInstallations, getInstallationNavigation, projectPath, projectSlug } from '../lib/installations/data';
import { projectMunicipality } from '../lib/installations/editorial';
import { collectionCopy, projectCopy } from '../lib/installations/copy';

async function main() {
  for (const filename of ['18kW-R32-Prishtine-220m2.jpg', '18kw_R32_Prishtine_220m².PNG', '18 kw R32 Prishtine 220 metra katror.webp']) {
    const parsed = parseInstallationFilename(filename, 'prishtin');
    assert.equal(parsed.capacityKw, 18);
    assert.equal(parsed.refrigerant, 'R32');
    assert.equal(parsed.areaM2, 220);
    assert.equal(parsed.sequence, null);
  }
  const multiple = parseInstallationFilename('2 Pompa Termike 18kW-R32 refrigirant, 2 shtepi nga 200 m2, Rahovec.png', 'gjakove');
  assert.equal(multiple.units, 2);
  assert.equal(multiple.houses, 2);
  assert.equal(multiple.areaM2, 200);
  assert.equal(multiple.areaPerHouse, true);
  assert.equal(multiple.locality, 'Rahovec');
  assert.equal(multiple.unparsed, null);
  const unknown = parseInstallationFilename('projekt-i-ri.jpg', 'Gjilan');
  assert.equal(unknown.capacityKw, null);
  assert.equal(unknown.refrigerant, null);
  assert.equal(unknown.areaM2, null);
  assert.equal(unknown.units, null);
  assert.equal(unknown.unparsed, 'projekt i ri');
  const first = parseInstallationFilename('18kW-R32-Gjakove-220m2-1.jpg', 'gjakove');
  const second = parseInstallationFilename('18kW-R32-Gjakove-220m2-2.jpg', 'gjakove');
  assert.equal(first.groupKey, second.groupKey);
  assert.equal(first.sequence, 1);
  assert.equal(second.sequence, 2);
  assert.notEqual(first.groupKey, parseInstallationFilename('20kW-R32-Gjakove-220m2-2.jpg', 'gjakove').groupKey);
  assert.notEqual(first.groupKey, parseInstallationFilename('18kW-R290-Gjakove-220m2-2.jpg', 'gjakove').groupKey);
  assert.equal(parseInstallationFilename('18kW-R32 Peje.png', 'peje').areaM2, null);
  assert.equal(parseInstallationFilename('10kW-120 m2 Vitomeric.png', 'peje').refrigerant, null);
  assert.equal(parseInstallationFilename('18kW-R290 Rahovec, 200 metra katror, ngrohje dysheme.png', 'gjakove').heating, 'underfloor');
  assert.equal(parseInstallationFilename('10kW-R32 refrigirant, 80 metra Katror me radiator.png', 'gjakove').heating, 'radiators');
  assert.equal(collectionName('prishtin').slug, 'prishtine');
  assert.equal(collectionName('mitrovic').label, 'Mitrovicë');
  assert.equal(collectionName('Gjilan').slug, 'gjilan');

  const collections = await getInstallations();
  assert.equal(projectMunicipality('gjakove', 'Rahovec'), 'Rahovec');
  assert.equal(projectMunicipality('prishtin', 'Graçanicë'), 'Graçanicë');
  assert.equal(projectMunicipality('prishtin', 'Dragodan'), 'prishtin');
  assert.equal(projectSlug(first), projectSlug(second), 'Extra photographs must not change a project URL');
  assert.ok(collections.every(c => c.projects.length > 0), 'Empty collections must not create landing pages');
  const paths = collections.flatMap(c => c.projects.map(p => projectPath(c, p)));
  assert.equal(new Set(paths).size, paths.length);
  const titles = collections.flatMap(c => c.projects.map(p => projectCopy(p, c).title));
  assert.equal(new Set(titles).size, titles.length, 'Project titles must be distinct');
  assert.equal(collections.find(c => c.slug === 'rahovec')?.projects.length, 2);
  assert.equal(collections.find(c => c.slug === 'gracanice')?.projects.length, 2);
  assert.deepEqual(getInstallationNavigation(), collections.map(({ slug, label }) => ({ slug, label })));
  const baseUrl = process.argv[2];
  let photos = 0;
  let projects = 0;
  for (const collection of collections) {
    assert.ok(collectionCopy(collection).title);
    assert.equal(new Set(collection.projects.map(project => project.id)).size, collection.projects.length);
    for (const project of collection.projects) {
      projects++;
      const copy = projectCopy(project, collection);
      assert.ok(!copy.title.includes('null'));
      assert.ok(!copy.paragraphs.join(' ').includes('undefined'));
      if (!project.metadata.refrigerant) assert.ok(!copy.alt.includes('gaz ftohës'));
      if (!project.metadata.areaM2) assert.ok(!copy.alt.includes('m²'));
      if (project.metadata.unparsed) console.warn(`REVIEW: ${collection.folder}/${project.images[0].filename}: ${project.metadata.unparsed}`);
      for (const image of project.images) {
        photos++;
        const url = new URL(image.src, 'https://www.ecotek-ks.com');
        const bytes = await readFile(path.join(process.cwd(), 'public', decodeURIComponent(url.pathname)));
        assert.equal(url.searchParams.get('v'), createHash('sha256').update(bytes).digest('hex').slice(0, 16), 'Image URL must match current file contents');
        if (baseUrl) {
          const response = await fetch(new URL(image.src, baseUrl));
          assert.equal(response.status, 200, `Image must be served: ${image.filename}`);
          const served = Buffer.from(await response.arrayBuffer());
          assert.equal(createHash('sha256').update(served).digest('hex'), createHash('sha256').update(bytes).digest('hex'), `Served image must match edited file: ${image.filename}`);
        }
      }
    }
    console.log(`${collection.folder} -> /instalimet/${collection.slug}: ${collection.projects.length} projects`);
  }
  console.log(`PASS: parser edge cases, copy safeguards, ${collections.length} collections, ${projects} projects, ${photos} existing images.`);
  if (baseUrl) console.log(`PASS: all ${photos} served originals match the current files byte-for-byte.`);
}
main().catch(error => { console.error(error); process.exitCode = 1; });
