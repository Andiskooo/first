// Builds the ECOTEK chatbot knowledge base from the 3 PDF manuals.
// Usage: node scripts/build-chat-index.mjs
// Output: lib/chat/kb.json (array of {id, manual, page, text} chunks)
//
// The PDFs live in public/"ECOTEK – Controller & Error Code Guide" (en-dash).
// Page numbers are preserved per chunk so the chatbot can cite sources.

import { createRequire } from 'node:module';
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);
const { PDFParse } = require('pdf-parse');

const ROOT = process.cwd();
const GUIDE_DIR = readdirSync(path.join(ROOT, 'public')).find((n) => n.startsWith('ECOTEK'));
if (!GUIDE_DIR) {
  console.error('ERROR: ECOTEK guide folder not found in public/. Rebuild skipped.');
  process.exit(1);
}
const GUIDE_PATH = path.join(ROOT, 'public', GUIDE_DIR);

const SHORT_NAMES = {
  'ecotek-controller-user-guide.pdf': 'Udhëzuesi ECOTEK për kontrolluesin',
  'User guide and Error codes.pdf': 'Udhëzuesi i përdorimit dhe kodet e gabimit',
  'User guide and Error codes extensive.pdf': 'Udhëzuesi i zgjeruar dhe kodet e gabimit',
};

function cleanText(raw) {
  return (raw || '')
    .replace(/\0/g, '')
    .replace(/[­\u00AD]/g, '') // soft hyphens
    .replace(/(\w)-\n(\w)/g, '$1$2') // de-hyphenate line breaks
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function chunkPage(text, maxLen = 700, overlap = 80) {
  // Split on sentence boundaries; merge short sentences into chunks.
  const sentences = text.split(/(?<=[.!?;:])\s+|\n+/).map((s) => s.trim()).filter(Boolean);
  const chunks = [];
  let current = '';
  for (const s of sentences) {
    if ((current + ' ' + s).trim().length > maxLen && current) {
      chunks.push(current.trim());
      // overlap: carry the tail of the previous chunk
      current = current.slice(-overlap) + ' ' + s;
      if (current.trim().length > maxLen) {
        // single very long sentence: hard-split it
        while (current.trim().length > maxLen) {
          chunks.push(current.trim().slice(0, maxLen));
          current = current.trim().slice(maxLen - overlap);
        }
      }
    } else {
      current = (current + ' ' + s).trim();
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.filter((c) => c.length >= 40);
}

async function extractPages(filePath) {
  const buffer = readFileSync(filePath);
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  const result = await parser.getText();
  await parser.destroy();
  // pdf-parse v2: result.pages = [{ num, text, ... }]
  const pages = Array.isArray(result.pages) ? result.pages : [];
  const pageTexts = pages
    .slice()
    .sort((a, b) => (a.num || 0) - (b.num || 0))
    .map((p) => cleanText([p.text, p.lines ? '' : ''].join('') || ''));
  return { numpages: result.total || pages.length, pageTexts };
}

const files = readdirSync(GUIDE_PATH).filter((f) => f.toLowerCase().endsWith('.pdf')).sort();
if (files.length === 0) {
  console.error(`ERROR: no PDFs found in public/${GUIDE_DIR}`);
  process.exit(1);
}

const kb = [];
const report = [];
for (const file of files) {
  const { numpages, pageTexts } = await extractPages(path.join(GUIDE_PATH, file));
  const totalChars = pageTexts.reduce((a, t) => a + t.length, 0);
  const manual = SHORT_NAMES[file] || file;
  report.push({ file, manual, pages: numpages, chars: totalChars });
  if (totalChars < 100) {
    console.error(
      `WARNING: "${file}" yielded only ${totalChars} chars — it may be scanned/unreadable. ` +
        'Re-export it as a text-based PDF or add an OCR text layer, then rebuild the index.'
    );
    continue;
  }
  pageTexts.forEach((pageText, idx) => {
    if (!pageText || pageText.length < 40) return;
    const chunks = chunkPage(pageText);
    chunks.forEach((text, ci) => {
      kb.push({ id: `${file}#p${idx + 1}c${ci + 1}`, manual, page: idx + 1, text });
    });
  });
}

mkdirSync(path.join(ROOT, 'lib', 'chat'), { recursive: true });
writeFileSync(path.join(ROOT, 'lib', 'chat', 'kb.json'), JSON.stringify(kb, null, 1), 'utf-8');

console.log('ECOTEK chat index built:');
for (const r of report) console.log(` - ${r.file}: ${r.pages} pages, ${r.chars} chars`);
console.log(`Total chunks: ${kb.length} -> lib/chat/kb.json`);
