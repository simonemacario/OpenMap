# OpenMap — Market Intelligence on Italian Business in Malaysia

A continuously updated record of Italian companies and institutions operating in
Malaysia: a searchable company database, a detail page per company, key people, and
a market-stats homepage set against the macro indicators that move the market.

## What this is

OpenMap is a market-intelligence product, not a one-off report. The homepage gives the
snapshot (how many firms, which sectors, which cities) plus the latest Malaysia macro
data; the company database is the evidence layer beneath it. It updates continuously
rather than in dated editions.

## Stack

- **Astro** static site. Every page is pre-rendered at build; there is **no database and no server**.
- **Light client-side JavaScript** powers search / filter / sort on the company database. It is progressive enhancement — the full table renders with JavaScript off.
- Data lives in `src/data/companies.json` (the register), `src/data/macro.json` (macro indicators), and `src/data/meta.json` (titles, sources, copy).
- Every displayed company number is **computed at build time** from the data (`src/lib/stats.mjs`); the pages and the tests import the same functions, so a number can't drift from the data.
- Charts are **static SVG** (`src/components/BarChart.astro`). The design system lives in `src/styles/global.css`.

## Pages

| Route | What |
|-------|------|
| `/` | Overview: snapshot + macro snapshot + institutions |
| `/companies` | Company database — search, filter, sort |
| `/company/[slug]` | One page per company/institution (facts, key people, JSON-LD) |
| `/institutions` | Italian institutions in the region |
| `/sector/[slug]` | Per-sector drill-down |

## ⚠ Before promoting this to anyone

`src/data/companies.json` and `src/data/macro.json` currently hold **placeholder sample
data for layout only.** Replace them with the verified register (Italian Chamber roster +
ICE + SSM, de-duplicated) and real macro figures, and confirm the headline numbers are
defensible, before showing this to any institution. A wrong number in front of ICE or the
embassy undermines the credibility this product is built on.

## Develop

```bash
npm install
npm run dev        # local preview
npm test           # data-check (schema + macro) + integrity tests
npm run build      # static output to dist/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: data check → integrity tests →
build → deploy to GitHub Pages. A weekly `schedule` rebuild keeps macro and company data
current. Pages must be enabled (Settings → Pages → Source: GitHub Actions). Served at
`https://simonemacario.github.io/OpenMap`, so `base: "/OpenMap"` is set in
`astro.config.mjs`; for a custom domain, set `site` and clear `base`.

## Roadmap

1. **v0.2 (this repo)** — institutional redesign + company database + macro snapshot, static + light client search.
2. **Real data** — replace placeholder company and macro data with verified figures; wire macro feeds to official sources.
3. **Later** — richer company profiles, a real map view, and (when scale or monetization demand it) a dynamic backend with accounts and saved searches.
