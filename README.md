# הפרלמנט — Phrase-to-Episode Search

Web app that fuzzy-searches phrases across transcripts of the Israeli sitcom *הפרלמנט* and returns the matching episode + timestamp.

## Stack

- Next.js 15 (App Router) — static export → GitHub Pages
- TypeScript, Tailwind v4
- Framer Motion (channel-flip transitions)
- RTL Hebrew (Heebo, Assistant, JetBrains Mono)

## Phase 1 — design + shell (this codebase)

- CRT-frame visual layer: scanlines + grain + vignette + phosphor glow
- Idle hero: logo + "channel input" search bar + lower-third
- Results: TV-guide rows with episode tag, speaker chyron, ±1 context, Mako deep-link
- Empty state: static-noise no-signal screen
- All effects gated by `prefers-reduced-motion`
- Mock data in `public/mock/transcripts.json` (2 episodes hand-typed)
- `lib/search.ts` is a substring stub — Fuse.js swap in Phase 2

## Phase 2 — TODO

- Whisper batch script: Mako audio → JSON in `data/episodes/`
- `scripts/build-index.ts`: concat episodes → `public/index.json` + Fuse.js index
- Speaker diarization (manual or pyannote)
- Mako deep-link timestamp format research
- Episode detail page with full transcript + jump-to-line

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static out/
npm run serve    # serve out/
```

## Deploy

Push to `main`. GitHub Actions builds and deploys to `https://<user>.github.io/Haparlamentor/`.
