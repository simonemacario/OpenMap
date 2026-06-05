# OpenMap — The State of Italian Business in Malaysia

An **open, free** status report on Italian companies and institutions operating in
Malaysia, by sector and city. No membership, no paywall, free to cite.

This is **not a directory.** The product is the report; the company dataset is the
evidence layer beneath it. (Phase 2 adds browsable company pages; phase 3 makes the
report's numbers clickable into the firms behind them.)

## Why this can exist (and competitors can't copy it)

Every commercial chamber-software product gates its directory because the directory is
how they make money. The data here is contributed and published openly because the goal
is ecosystem visibility, not subscription revenue. That's a position only a
mission-aligned data holder can hold.

## Stack

- **Astro** static site (server-rendered at build, zero client JS for the content).
- Data lives in `src/data/companies.json` + `src/data/meta.json`.
- Every displayed number is **computed at build time** from the data
  (`src/lib/stats.mjs`), never hand-typed. The report page and the tests import the
  same functions, so a number can't silently drift from the data.
- Charts are **static SVG** rendered at build (`src/components/BarChart.astro`).

## ⚠ Before showing this to anyone (Pre-Build Gate #4)

`src/data/companies.json` currently holds **sample placeholder data for layout only.**
Replace it with the real, cleaned seed list (Italian Chamber roster + ICE + SSM,
de-duplicated) and confirm the headline numbers are defensible. A wrong number in front
of ICE or the embassy kills the credibility thesis. Also clear the other gates: data
republishing rights, GDPR (company-level fields only), and hosting ownership.

## Develop

```bash
npm install
npm run dev        # local preview
npm test           # schema check + data-integrity tests (Gate #4)
npm run build      # static output to dist/
```

## Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`: data check → integrity tests →
build → deploy to GitHub Pages. Enable Pages (Settings → Pages → Source: GitHub Actions).
If serving at `https://simonemacario.github.io/OpenMap`, the `base: "/OpenMap"` in
`astro.config.mjs` is already set; for a custom domain, set `site` and clear `base`.

## Roadmap

1. **v1 (this repo)** — the report page.
2. **Phase 2** — company dataset + no-code admin (Directus on Postgres), corrections workflow.
3. **Phase 3** — make report stats clickable into the firms behind them; programmatic SEO pages.
4. **Later** — radar (new entrants, tenders), connector (matchmaking), EU editions.
