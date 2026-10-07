export interface InstallationMetadata {
  capacityKw: number | null;
  refrigerant: 'R32' | 'R290' | null;
  areaM2: number | null;
  units: number | null;
  houses: number | null;
  areaPerHouse: boolean;
  heating: 'underfloor' | 'radiators' | null;
  locality: string | null;
  sequence: number | null;
  groupKey: string;
  unparsed: string | null;
}

export function slugify(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Spelling corrections only: discovery of collections always comes from disk.
const names: Record<string, { slug: string; label: string }> = {
  prishtin: { slug: 'prishtine', label: 'Prishtinë' },
  prishtine: { slug: 'prishtine', label: 'Prishtinë' },
  mitrovic: { slug: 'mitrovice', label: 'Mitrovicë' },
  mitrovice: { slug: 'mitrovice', label: 'Mitrovicë' },
  gjakove: { slug: 'gjakove', label: 'Gjakovë' },
  peje: { slug: 'peje', label: 'Pejë' },
  gracanice: { slug: 'gracanice', label: 'Graçanicë' },
};

export function collectionName(folder: string) {
  const slug = slugify(folder);
  return names[slug] ?? { slug, label: folder.replace(/[-_]/g, ' ').replace(/\b\p{L}/gu, c => c.toUpperCase()) };
}

const localities: [RegExp, string][] = [
  [/\brahovec\b/i, 'Rahovec'],
  [/\bgra[qçc]anic[eë]?\b/i, 'Graçanicë'],
  [/\bdragodan\b/i, 'Dragodan'],
  [/\bvranjevc\b/i, 'Vranjevc'],
  [/\bvitomeric[eë]?\b/i, 'Vitomericë'],
  [/\b(?:fshati\s+)?has\b/i, 'Has'],
];

/** Never infer a missing value; only explicit photo suffixes establish a group. */
export function parseInstallationFilename(filename: string, folder: string): InstallationMetadata {
  const stem = filename.replace(/\.[^.]+$/, '').trim();
  const sequenceMatch = stem.match(/(?:[-_]\s*(?:foto|photo|img)?\s*(\d{1,3})|\s*\((\d{1,3})\))$/i);
  const base = sequenceMatch ? stem.slice(0, sequenceMatch.index).trim() : stem;
  const text = base.replace(/_/g, ' ');
  const capacity = text.match(/\b(\d+(?:[.,]\d+)?)\s*kw\b/i);
  const refrigerant = text.match(/\br\s*[- ]?\s*(290|32)\b/i);
  const area = text.match(/\b(\d+(?:[.,]\d+)?)\s*(?:m\s*[2²]|metra\s+katror[eë]?)(?!\w)/i);
  const units = text.match(/\b(\d+)\s*pompa\s+termike\b/i);
  const houses = text.match(/\b(\d+)\s*sht[eë]pi\b/i);
  const localityMatch = localities.find(([pattern]) => pattern.test(text));
  const numeric = (match: RegExpMatchArray | null) => match ? Number(match[1].replace(',', '.')) : null;
  let remaining = text;
  for (const match of [capacity, refrigerant, area, units, houses]) {
    if (match) remaining = remaining.replace(match[0], ' ');
  }
  if (localityMatch) remaining = remaining.replace(localityMatch[0], ' ');
  const aliases = [folder, collectionName(folder).slug, collectionName(folder).label];
  for (const alias of aliases) {
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    remaining = remaining.replace(new RegExp(`\\b${escaped}(?=$|[\\s,;_-])`, 'gi'), ' ');
  }
  remaining = remaining.replace(/\b(?:refrigirant|refrigerant|ngrohje|dysheme|radiator[eë]?|me|nga|prishtin[eë]?)\b/gi, ' ')
    .replace(/[\s,;_-]+/g, ' ').trim();
  return {
    capacityKw: numeric(capacity),
    refrigerant: refrigerant ? `R${refrigerant[1]}` as 'R32' | 'R290' : null,
    areaM2: numeric(area), units: numeric(units), houses: numeric(houses),
    areaPerHouse: Boolean(houses && /\bnga\b/i.test(text)),
    heating: /\bdysheme\b/i.test(text) ? 'underfloor' : /\bradiator/i.test(text) ? 'radiators' : null,
    locality: localityMatch?.[1] ?? null,
    sequence: sequenceMatch ? Number(sequenceMatch[1] ?? sequenceMatch[2]) : null,
    // Preserve meaningful punctuation and project names to avoid merging lookalikes.
    groupKey: base.normalize('NFC').toLowerCase(),
    unparsed: remaining || null,
  };
}
