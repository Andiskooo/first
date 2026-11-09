import kb from './kb.json';

export interface KbChunk {
  id: string;
  manual: string;
  page: number;
  text: string;
}

export interface ScoredChunk extends KbChunk {
  score: number;
}

const CHUNKS = kb as KbChunk[];

// Albanian + English stopwords for a small local corpus.
const STOPWORDS = new Set(
  'dhe me ne ne te ta se si qe do te jane eshte une ti ai ajo ne ju ata ato kete kjo ky ata per nga tek tek me pa pa si apo ose por edhe vetem shume mund munden kur ku cili cila cilet cilat cfare cdo cdo kjo ky apo nese nese nese nese nese a i e u o'.split(' ').concat(
    'the a an and or of to in on for with is are was were be been it its this that these those as at by from will would can could should have has had not no yes you your we our they their he she him her what which who when where how why do does did there here so than then'.split(' ')
  )
);

// Cross-language intent map: Albanian/English query triggers -> English manual vocabulary.
const INTENTS: Array<{ triggers: string[]; targets: string[] }> = [
  {
    triggers: ['zhbllok', 'bllok', 'bllokuar', 'ekran', 'unlock', 'lock', 'kyç', 'kyc'],
    targets: ['unlock', 'lock', 'keypad', 'hold', 'power', 'disappears'],
  },
  {
    triggers: ['temperatur', 'temperature', 'grade', 'ngroht', 'ftoht', 'nxeht', 'ftohtë', 'rrit', 'ul', 'ngrohje'],
    targets: ['temperature', 'setpoint', 'raise', 'lower', 'target'],
  },
  {
    triggers: ['timer', 'tajmer', 'orar', 'program', 'planifik', 'schedule', 'clock', 'ora'],
    targets: ['timer', 'clock', 'schedule', 'weekly', 'timing'],
  },
  {
    triggers: ['mode', 'modalitet', 'menyra', 'mënyra', 'ngrohje', 'ftohje', 'cooling', 'heating', 'dhw', 'ujë', 'uje', 'ngrohtë'],
    targets: ['mode', 'heating', 'cooling', 'dhw', 'switch'],
  },
  {
    triggers: ['gabim', 'error', 'kod', 'code', 'defekt', 'problem', 'alarm', 'shfaq'],
    targets: ['error', 'failure', 'fault', 'troubleshooting', 'sensor', 'protection', 'alarm'],
  },
  {
    triggers: ['wifi', 'wi-fi', 'smart', 'life', 'app', 'telefon', 'lidhe', 'pairing', 'internet'],
    targets: ['wi-fi', 'wifi', 'smart', 'distribution', 'pairing', 'app', 'hotspot'],
  },
  {
    triggers: ['ikon', 'diell', 'bore', 'bora', 'floke', 'dush', 'sanitar', 'hene', 'hena', 'simbo'],
    targets: ['heating', 'cooling', 'hot', 'water', 'dhw', 'silent', 'icon', 'mode', 'display', 'flashing'],
  },
  {
    triggers: ['eco', 'ekonom', 'kursim', 'energji'],
    targets: ['eco', 'energy-saving', 'energy'],
  },
  {
    triggers: ['silent', 'zhurm', 'qet'],
    targets: ['silent', 'quiet', 'night'],
  },
  {
    triggers: ['steriliz', 'legjion', 'legionella', 'dezinfekt'],
    targets: ['sterilization', 'legionella'],
  },
  {
    triggers: ['ndez', 'fik', 'power', 'ndezje', 'fikje', 'pushtet', 'on/off', 'ndiz'],
    targets: ['power', 'standby', 'turns'],
  },
  {
    triggers: ['status', 'paramet', 'query', 'lexim', 'shiko', 'vler'],
    targets: ['query', 'parameter', 'compressor', 'frequency', 'readout'],
  },
  {
    triggers: ['fabrik', 'reset', 'rivendos', 'factory'],
    targets: ['factory', 'reset', 'maintenance', 'restored'],
  },
  {
    triggers: ['defrost', 'shkrim', 'akull', 'ngrir'],
    targets: ['defrost', 'coil'],
  },
  {
    triggers: ['pomp', 'pump', 'qarkullim', 'ujë', 'rjedh', 'flow'],
    targets: ['pump', 'water', 'flow', 'circulation'],
  },
  {
    triggers: ['booster', 'quick', 'shpejt', 'turbo', 'nxehje'],
    targets: ['booster', 'quick', 'backup', 'heaters'],
  },
];

const CODE_RE = /\b(EA\d|EB\d?|EC\d|E\d{1,3}|P\d{1,2}|F\d{1,2}|L\d{1,3})\b/gi;

export function extractCodes(query: string): string[] {
  const found = new Set<string>();
  for (const m of query.toUpperCase().matchAll(CODE_RE)) {
    // Normalize: E3 -> E03 so "E3" matches "E03" chunks and vice versa.
    let code = m[1].toUpperCase();
    const num = code.match(/^([A-Z]+)(\d+)$/);
    if (num && (num[1] === 'E' || num[1] === 'P') && num[2].length === 1) {
      code = `${num[1]}0${num[2]}`;
    }
    found.add(code);
  }
  return [...found];
}

function fold(s: string): string {
  return s
    .toLowerCase()
    .replace(/ë/g, 'e')
    .replace(/ç/g, 'c');
}

function tokenize(s: string): string[] {
  return fold(s)
    .replace(/[^a-z0-9+\-/]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

export function retrieveRelevant(query: string, topK = 5, maxChars = 4000): KbChunk[] {
  const q = query || '';
  const codes = extractCodes(q);
  const tokens = tokenize(q);
  const foldedQuery = fold(q);

  const activeTargets = new Set<string>();
  for (const intent of INTENTS) {
    if (intent.triggers.some((t) => foldedQuery.includes(fold(t)))) {
      for (const target of intent.targets) activeTargets.add(target);
    }
  }

  const scored: ScoredChunk[] = CHUNKS.map((chunk) => {
    const text = chunk.text;
    const folded = fold(text);
    let score = 0;

    // 1. Exact error/parameter code match dominates (e.g. "E03", "P12").
    for (const code of codes) {
      const variants = new Set([code]);
      const m = code.match(/^([A-Z]+)0(\d)$/);
      if (m) variants.add(`${m[1]}${m[2]}`); // E03 also matches bare E3
      for (const v of variants) {
        const re = new RegExp(`\\b${v}\\b`);
        if (re.test(text.toUpperCase())) score += 100;
      }
    }

    // 2. Term overlap with mild length normalization.
    for (const tok of tokens) {
      const occurrences = folded.split(tok).length - 1;
      if (occurrences > 0) score += Math.min(occurrences, 4) / Math.sqrt(text.length / 300);
    }

    // 3. Cross-language intent boost (Albanian question -> English manual).
    for (const target of activeTargets) {
      if (folded.includes(target)) score += 3;
    }

    return { ...chunk, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const picked: KbChunk[] = [];
  let chars = 0;
  for (const s of scored) {
    if (picked.length >= topK) break;
    if (s.score <= 0) break;
    if (chars + s.text.length > maxChars && picked.length > 0) break;
    picked.push({ id: s.id, manual: s.manual, page: s.page, text: s.text });
    chars += s.text.length;
  }
  return picked;
}

export function formatSources(chunks: KbChunk[]): string {
  const seen = new Map<string, KbChunk>();
  for (const c of chunks) seen.set(`${c.manual}|${c.page}`, c);
  return [...seen.values()].map((c) => `${c.manual}, f. ${c.page}`).join(' • ');
}
