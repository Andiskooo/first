// Retrieval + grounding tests for the ECOTEK chatbot.
// Usage: npx tsx scripts/test-chatbot.ts
// No network calls — verifies the local index answers core questions.

import { readFileSync } from 'node:fs';
import { retrieveRelevant, extractCodes } from '../lib/chat/retrieve';

let failures = 0;

function check(name: string, cond: boolean, detail = '') {
  if (cond) {
    console.log(`PASS  ${name}`);
  } else {
    failures++;
    console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`);
  }
}

// 1. Knowledge base exists and has page refs.
const kb = JSON.parse(readFileSync(new URL('../lib/chat/kb.json', import.meta.url), 'utf-8'));
check('kb is non-empty', Array.isArray(kb) && kb.length > 20, `got ${kb?.length}`);
check(
  'every chunk cites manual + page',
  kb.every((c: { manual?: string; page?: number; text?: string }) => c.manual && c.page && (c.text?.length || 0) > 40)
);

// 2. Code extraction (incl. bare "E3" -> "E03" normalization).
check('extractCodes finds E03', extractCodes('Çfarë do të thotë E03?').includes('E03'));
check('extractCodes normalizes E3', extractCodes('kodi E3').includes('E03'));
check('extractCodes finds P12 + EA1', (() => {
  const codes = extractCodes('P12 dhe EA1');
  return codes.includes('P12') && codes.includes('EA1');
})());

// 3. Retrieval: Albanian questions must hit the right English manual passages.
const cases: Array<{ q: string; expect: RegExp; label: string }> = [
  { q: 'Si ta zhbllokoj ekranin?', expect: /unlock/i, label: 'unlock screen' },
  { q: 'Si ta ndryshoj temperaturën?', expect: /temperature|setpoint/i, label: 'temperature' },
  { q: 'Si ta aktivizoj timerin?', expect: /timer|clock|weekly/i, label: 'timer' },
  { q: 'Si ta ndërroj modalitetin e ngrohjes dhe ftohjes?', expect: /heating|cooling|mode/i, label: 'mode change' },
  { q: 'Çfarë do të thotë kodi i gabimit E03?', expect: /E03[\s\S]{0,200}water flow/i, label: 'error E03' },
  { q: 'E21 sensori i ambientit', expect: /E21/i, label: 'error E21' },
  { q: 'Kodi P1 në display', expect: /P1\b/, label: 'error P1' },
  { q: 'E88 driver board', expect: /E88/i, label: 'error E88' },
  { q: 'Si lidhem me WiFi Smart Life?', expect: /wi-?fi|distribution|hotspot/i, label: 'wifi pairing' },
  { q: 'Si aktivizohet quick heat?', expect: /quick heat/i, label: 'quick heat (icons PDF)' },
  { q: 'Çfarë do të thotë ikona e diellit?', expect: /heating/i, label: 'sun/heating icon' },
  { q: 'Si bëhet forced defrost?', expect: /defrost|frost/i, label: 'forced defrost (icons PDF)' },
];

const SUPPORT_LINE = '+383 44 914 480';

for (const c of cases) {
  const hits = retrieveRelevant(c.q, 5, 4000);
  const joined = hits.map((h) => h.text).join('\n');
  check(
    `retrieval: ${c.label}`,
    c.expect.test(joined),
    `top ids: ${hits.map((h) => h.id).join(', ') || 'none'}`
  );
  check(
    `sources cited: ${c.label}`,
    hits.length > 0 && hits.every((h) => h.manual && h.page)
  );
}

// 4. Unknown topic returns nothing → API would answer with contact fallback.
const unknown = retrieveRelevant('sa kushton instalimi i pompës në Prishtinë dhe sa zgjat garancia', 5, 4000);
const unknownText = unknown.map((h) => h.text).join(' ');
check(
  'off-topic query has no price/warranty passage',
  !/price|€|warranty|garanci/i.test(unknownText),
  'retrieval should not invent pricing'
);

// 5. API route safety: key must only be read server-side.
const routeSrc = readFileSync(new URL('../app/api/chat/route.ts', import.meta.url), 'utf-8');
check('API reads key server-side only', /process\.env\.GEMINI_API_KEY/.test(routeSrc));
check('API never sends key to client', !/NEXT_PUBLIC_GEMINI/.test(routeSrc));
check('API caps output tokens', /maxOutputTokens/.test(routeSrc));
check('API rate-limits', /MAX_REQUESTS|isRateLimited/.test(routeSrc));
check('API enforces no-model-questions rule', /KURRË mos kërko modelin/i.test(routeSrc));
check('API recommends support number', routeSrc.includes(SUPPORT_LINE));

// 6. UI requirements (ChatPanel used by the /asistenti page, linked from the header).
const uiSrc = readFileSync(new URL('../components/chat/ChatPanel.tsx', import.meta.url), 'utf-8');
const headerSrc = readFileSync(new URL('../components/layout/Header.tsx', import.meta.url), 'utf-8');
const layoutSrc = readFileSync(new URL('../components/layout/MainLayout.tsx', import.meta.url), 'utf-8');
const pageSrc = readFileSync(new URL('../app/asistenti/page.tsx', import.meta.url), 'utf-8');
for (const s of [
  'Si ta zhbllokoj ekranin?',
  'Si ta ndryshoj temperaturën?',
  'Si ta aktivizoj timerin?',
  'Çfarë do të thotë kodi i gabimit?',
]) {
  check(`suggested question present: "${s}"`, uiSrc.includes(s));
}
check(
  'welcome message present',
  uiSrc.includes("Përshëndetje! 👋 Jam asistenti virtual i ECOTEK. Si mund t'ju ndihmoj me pompën tuaj termike?")
);
check(
  'no constant technician banner in chat UI',
  // The number may only survive inside genuine failure fallbacks, never as a banner/link.
  !uiSrc.includes('teknik') && !uiSrc.includes('SUPPORT_TEL') && !uiSrc.includes('<a')
);
check('support number only in unable-to-answer paths', (() => {
  const routeSrc = readFileSync(new URL('../app/api/chat/route.ts', import.meta.url), 'utf-8');
  const idx = routeSrc.indexOf(SUPPORT_LINE);
  // Number must exist (fallback/rate-limit/unanswerable paths) but never in small talk.
  const smallTalk = routeSrc.slice(routeSrc.indexOf('getSmallTalkReply'), routeSrc.indexOf('function buildUserPrompt'));
  return idx > -1 && !smallTalk.includes(SUPPORT_LINE);
})());
check('header links to /asistenti (desktop + mobile)', headerSrc.includes('href="/asistenti"'));
check('no floating bubble mounted globally', !layoutSrc.includes('EcotekChat'));
check('dedicated /asistenti share page exists', pageSrc.includes('ChatPanel') && pageSrc.includes('Asistenti'));

if (failures > 0) {
  console.error(`\n${failures} test(s) failed.`);
  process.exit(1);
}
console.log('\nAll chatbot tests passed.');
