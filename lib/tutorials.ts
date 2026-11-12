/**
 * ECOTEK Video Tutorial Center — centralized tutorial dataset.
 *
 * SHTO NJË VIDEO TË RE: shto një objekt të ri në `tutorials` me
 * `id` unik, `title`, `description`, `playbackId` (nga Mux),
 * `category`, `keywords` dhe opsionalisht `duration`.
 * UI-ja (kërkimi, filtrat, kartat, related) ndërtohet automatikisht.
 *
 * SHËNIM: kërkesa përmendte 10 video, por u dhanë 8 Playback ID.
 * Titujt/përshkrimet më poshtë janë vendosur sipas rendit të dhënë,
 * bazuar në temat e kontrolluesit (operimi, cilësimet, modalitetet,
 * Wi-Fi, probleme). Ndryshoji lirisht këtu pa prekur UI-në.
 */

export type TutorialCategory =
  | 'Kontrolluesi'
  | 'Cilësimet'
  | 'Modalitetet'
  | 'Wi-Fi'
  | 'Probleme';

export interface TutorialChapter {
  title: string;
  /** seconds from start — used only if/when supplied */
  start: number;
}

export type TutorialOrientation = 'portrait' | 'landscape';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  playbackId: string;
  category: TutorialCategory;
  keywords: string[];
  /**
   * 'portrait' = 9:16 phone video, 'landscape' = 16:9. Controls both the
   * gallery thumbnail frame and the fullscreen player sizing, so the video
   * is never cropped or stretched. Set this per video when adding new ones.
   */
  orientation: TutorialOrientation;
  duration?: string;
  chapters?: TutorialChapter[];
}

export function thumbnailUrl(playbackId: string, width = 640): string {
  return `https://image.mux.com/${playbackId}/thumbnail.webp?time=1&width=${width}`;
}

export function streamUrl(playbackId: string): string {
  return `https://stream.mux.com/${playbackId}.m3u8`;
}

export const tutorials: Tutorial[] = [
  {
    id: 'cilësimet-avancuara',
    title: 'Si ta ndezim pompën termike për ngrohje?',
    description:
      'Si ta ndizni pompën termike në modalitetin e ngrohjes për dimër — zgjedhja e modalitetit dhe rregullimet bazë.',
    playbackId: 'xiS02W7Zmsl5KbJLrJFPcQc1Hj8OarS57014f3pmmyMM00',
    category: 'Modalitetet',
    keywords: ['ngrohje', 'heating', 'ndez', 'dimër', 'modalitet', 'radiator', 'dysheme', 'pompë termike'],
    orientation: 'portrait',
  },
  {
    id: 'lidhja-wifi',
    title: 'Si ta ndezim pompën termike për ftohje?',
    description:
      'Si ta ndizni pompën termike në modalitetin e ftohjes për verë — zgjedhja e modalitetit dhe rregullimet bazë.',
    playbackId: 'b1gX0266rP7qpg3kDy8vCC2Ha8Opa002nM02fSzchG9l4w',
    category: 'Modalitetet',
    keywords: ['ftohje', 'cooling', 'ndez', 'verë', 'modalitet', 'ajër i ftohtë', 'pompë termike'],
    orientation: 'portrait',
  },
  {
    id: 'pult-kontrolluesi',
    title: 'Pse nuk ndizet pompa termike?',
    description:
      'Arsyet më të zakonshme pse pompa termike nuk ndizet dhe çfarë të kontrolloni hap pas hapi para se të kërkoni servis.',
    playbackId: 'OXnfoGBRa7zqjoVbsrgBay0200RIUp5CxbZC15b01cx014k',
    category: 'Probleme',
    keywords: ['pse', 'nuk ndizet', 'ndezja', 'problem', 'gabim', 'error', 'troubleshooting', 'ndihmë', 'pompë termike'],
    orientation: 'portrait',
  },
  {
    id: 'zhbllokimi-ekranit',
    title: 'Si ta kalojmë pompën termike në ECO ose FORCE?',
    description:
      'Si ta kaloni pompën termike në modalitetin ECO për kursim energjie ose FORCE për fuqi maksimale, direkt nga kontrolluesi.',
    playbackId: 'pUk011gDf5vNN00Zdw9qKmwIpnAZVthwCIRRG5vrFXs8U',
    category: 'Modalitetet',
    keywords: ['eco', 'force', 'modalitet', 'kursim', 'fuqi', 'mode', 'kontrollues', 'pompë termike'],
    orientation: 'portrait',
  },
  {
    id: 'ndryshimi-temperatures',
    title: 'Si ta aktivizojmë konfigurimin me Wi-Fi?',
    description:
      'Si ta aktivizoni konfigurimin me Wi-Fi në kontrollues dhe ta lidhni pompën termike me rrjetin për kontroll nga distanca.',
    playbackId: 'DIaMj9UYaGmA28nNUWqzwCqpbAUP78C4T5B00Uu9sMCw',
    category: 'Wi-Fi',
    keywords: ['wifi', 'wi-fi', 'konfigurim', 'aktivizim', 'internet', 'rrjet', 'lidhje', 'aplikacion'],
    orientation: 'portrait',
  },
  {
    id: 'modalitetet-funksionimit',
    title: 'Si ta programojmë pompën termike me orar?',
    description:
      'Si ta programoni pompën termike me orar kohor — caktimi i intervaleve të punës për ngrohje dhe ujë sanitar.',
    playbackId: 'fKK00eeCVbzUq1hkR74eTwVj711fJ602WX01kISfbjltN00',
    category: 'Cilësimet',
    keywords: ['programim', 'orar', 'timer', 'tajmer', 'orari', 'caktim', 'aktivizim', 'pompë termike'],
    orientation: 'portrait',
  },
  {
    id: 'timeri-programimi',
    title: 'Modalitetet e pompës termike: Ngrohje, Ftohje, Ujë Sanitar dhe Ngrohje në Dysheme',
    description:
      'Përmbledhje e modaliteteve të pompës termike — ngrohje, ftohje, ujë sanitar dhe ngrohje në dysheme — dhe kur të përdorni secilin.',
    playbackId: 'V5prU1qDLrtIUsckI01fevt14kRPfWTwDhe9XweJthw00',
    category: 'Modalitetet',
    keywords: ['modalitet', 'ngrohje', 'ftohje', 'ujë sanitar', 'dhw', 'dysheme', 'floor', 'heating', 'cooling', 'mode'],
    orientation: 'portrait',
  },
  {
    id: 'problemet-zgjidhjet',
    title: 'Si ta ndalim programimin me orar?',
    description:
      'Si ta ndaloni ose çaktivizoni programimin me orar të pompës termike dhe ta ktheni në punë manuale.',
    playbackId: 'bOxgdTH7kXrJmciwQHvwaBDEn4S3xm8ZyWo2rzXT33I',
    category: 'Cilësimet',
    keywords: ['ndalim', 'ndal', 'programim', 'orar', 'timer', 'tajmer', 'çaktivizim', 'manual'],
    orientation: 'portrait',
  },
  {
    id: 'lidhja-telefon-wifi',
    title: 'Si ta lidhim pompën termike me telefon përmes Wi-Fi?',
    description:
      'Udhëzues hap pas hapi për lidhjen e pompës termike me telefon përmes Wi-Fi, për kontroll nga distanca.',
    playbackId: '8eckr5vi402009eVaKWZwakH2mS5Wh9Cq6itSaFas01vTI',
    category: 'Wi-Fi',
    keywords: ['wifi', 'wi-fi', 'telefon', 'lidhja me telefon', 'aplikacion', 'kontroll nga distanca', 'lidhje', 'internet', 'rrjet', 'distancë', 'smartphone'],
    orientation: 'landscape',
  },
];

export const tutorialCategories: Array<'Të gjitha' | TutorialCategory> = [
  'Të gjitha',
  'Kontrolluesi',
  'Cilësimet',
  'Modalitetet',
  'Wi-Fi',
  'Probleme',
];

/** Normalizes Albanian diacritics for forgiving search. */
function norm(s: string): string {
  return s.toLowerCase().replace(/ë/g, 'e').replace(/ç/g, 'c');
}

export function searchTutorials(query: string, list: Tutorial[] = tutorials): Tutorial[] {
  const q = norm(query.trim());
  if (!q) return list;
  const terms = q.split(/\s+/);
  return list.filter((t) => {
    const hay = norm([t.title, t.description, t.category, ...t.keywords].join(' '));
    return terms.every((term) => hay.includes(term));
  });
}

/** Single keywords too generic to trigger a video recommendation on their own. */
const GENERIC_KEYWORDS = new Set([
  'pompe',
  'termike',
  'pompë termike',
  'kontrollues',
  'meny',
  'mode',
  'problem',
  'ndihme',
  'error',
  'gabim',
]);

/** Albanian 5-letter stem overlap: tolerant to inflections (timer/timerin, programim/programimin). */
function stemHit(keyword: string, question: string): boolean {
  const ks = keyword.slice(0, 5);
  if (!ks) return false;
  return question
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 3)
    .some((w) => w.startsWith(ks) || ks.startsWith(w.slice(0, 5)));
}

/**
 * Chatbot helper: pick the single tutorial worth recommending for a user
 * question, or null when nothing matches distinctively. Conservative by
 * design — generic questions and ties return null instead of a wrong video.
 */
export function findVideoRecommendation(question: string): Tutorial | null {
  const q = norm(question);
  if (q.trim().length < 3) return null;

  let best: Tutorial | null = null;
  let bestScore = 0;
  let tied = false;

  for (const t of tutorials) {
    let score = 0;
    for (const raw of t.keywords) {
      const k = norm(raw);
      if (!k || GENERIC_KEYWORDS.has(k)) continue;
      if (k.includes(' ')) {
        // Multi-word phrase: every significant word must stem-match.
        const words = k.split(/\s+/).filter((w) => w.length > 3);
        if (words.length > 0 && words.every((w) => stemHit(w, q))) {
          score += 4;
        }
      } else if (k.length > 2 && stemHit(k, q)) {
        score += 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = t;
      tied = false;
    } else if (score === bestScore && score > 0) {
      tied = true;
    }
  }

  if (!best || bestScore < 2 || tied) return null;
  return best;
}

/**
 * Rank tutorials by keyword overlap with a user question.
 * Returns up to `limit` best matches — no backend needed.
 */
export function findRelevantTutorials(question: string, limit = 3): Tutorial[] {
  const q = norm(question);
  if (!q.trim()) return [];
  const scored = tutorials.map((t) => {
    const hayTitle = norm(t.title);
    const hayKeys = t.keywords.map(norm);
    let score = 0;
    for (const k of hayKeys) {
      if (k && q.includes(k)) score += 3;
    }
    // small bonus for word overlap with the title
    for (const w of q.split(/\s+/)) {
      if (w.length > 3 && hayTitle.includes(w)) score += 1;
    }
    return { t, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.t);
}
