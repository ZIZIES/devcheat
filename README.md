# cheatsh.dev

programming cheat sheets for every language. retro terminal aesthetic.

## stack
- next.js 14 (pages router)
- typescript
- zero dependencies beyond next/react

## local dev

```bash
npm install
npm run dev
# open http://localhost:3000
```

## deploy to vercel

### option 1 — vercel cli (easiest)
```bash
npm install -g vercel
vercel
# follow the prompts, it auto-detects next.js
```

### option 2 — vercel dashboard
1. push this folder to a github repo
2. go to vercel.com → new project
3. import the repo
4. it'll detect next.js automatically
5. hit deploy

## adding languages
edit `data/languages.ts` — just add a new object to the `languages` array.
each language has sections, each section has cards with `title`, `code`, and optional `note`.

## structure
```
/pages        → next.js pages
/data         → all cheatsheet content (languages.ts)
/styles       → global css + css modules
/public       → static assets
```
