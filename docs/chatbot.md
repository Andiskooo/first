# ECOTEK AI Customer Support Chatbot

Floating Albanian-language support chatbot for heat-pump customers. Answers come
**only** from the three PDF manuals in `public/ECOTEK – Controller & Error Code Guide/`
— the bot never asks for heat-pump model or capacity, and never invents procedures.

## Architecture (minimal cost, no hosted services)

```
PDFs (public/…) → scripts/build-chat-index.mjs → lib/chat/kb.json (82 chunks, ~44k chars)
User question → lib/chat/retrieve.ts (keyword + error-code + intent scoring, top-5 ≤ 4000 chars)
            → app/api/chat/route.ts → Gemini 3.5 Flash-Lite (max 600 tokens, temp 0.3)
            → components/chat/ChatPanel.tsx (shared chat UI)
```

- **PDF parsing** happens once at build/index time (`pdf-parse`, dev-time only).
- **Retrieval** is dependency-free TypeScript (exact code-match boost for `E03`, `P12`,
  `EA1`…, plus an Albanian→English intent map since manuals are in English).
- The **Gemini API key** stays in `process.env.GEMINI_API_KEY` on the server; the
  browser only talks to `/api/chat`.
- If the key is missing or Gemini fails, the API returns a grounded fallback answer
  built from the retrieved passages plus the support number — the chatbot never breaks.

## Setup

1. `npm install`
2. `npm run build:chat-index` (rebuilds `lib/chat/kb.json` from the PDFs)
3. Copy `.env.example` → `.env.local` and set `GEMINI_API_KEY`
   (free key: https://aistudio.google.com/apikey)
4. `npm run dev` — the assistant lives at `/asistenti` (linked as "Asistenti" in the
   top nav, next to Produkte / Instalimet / Kompania). Share that URL directly.

## Updating the knowledge base

1. Replace/add `.pdf` files in `public/ECOTEK – Controller & Error Code Guide/`.
   (Keep the folder name; the script finds it by the `ECOTEK` prefix.)
2. Run `npm run build:chat-index`.
3. The script prints per-PDF page/char counts. If a PDF yields `<100` chars it is
   flagged as **scanned/unreadable** — re-export it with a text layer (or OCR it)
   and rebuild; it is skipped, never silently indexed as empty.
4. Run `npm run test:chatbot` to verify retrieval still answers the core questions.
5. Commit the regenerated `lib/chat/kb.json`.

## Cost controls

- Only top-5 passages (~4000 chars) are sent to Gemini — never whole manuals.
- History capped at last 6 messages (500 chars each), answers capped at 600 tokens.
- In-memory rate limit: 20 requests / 10 min / IP on `/api/chat`.

## Safety

- System prompt grounds every technical claim in the retrieved passages and forces
  "nuk është specifikuar në dokumentacion" when a detail is absent.
- User/assistant instructions that try to override the rules, switch language, or
  request out-of-scope (electrical/technician) work are ignored; the bot recommends
  ECOTEK at **+383 44 914 480**.
- No model/capacity questions — all manuals apply universally.

## Verification

`npm run test:chatbot` checks retrieval (unlock, temperature, timer, mode, E03, E21,
P1, E88) plus API grounding rules (no key leak, Albanian fallback, source citations).
