# Changelog

All notable changes to OpenMap are documented here.

## [0.2.0] - 2026-06-06

### Added
- Institutional design system: Source Serif 4 + Public Sans, OM monogram wordmark, restrained Italian-tricolor rule, warm-paper/deep-ink palette. Shared `Layout.astro` (nav + colophon) so every page is consistent.
- Company database at `/companies`: Crunchbase-style table with client-side search, Sector/City/Type filters, and sortable columns. Progressive enhancement — the full table still renders with JavaScript off.
- Homepage macro snapshot: latest Malaysia indicators (GDP, inflation, unemployment, MYR/EUR, Italy–Malaysia trade) from `src/data/macro.json`, each carrying a source and period.
- Institutions page at `/institutions` and per-sector drill-down pages at `/sector/[slug]` (browsing + SEO).
- Key people listed on company detail pages.
- Scheduled weekly rebuild in the deploy workflow so company and macro data stay current.

### Changed
- Repositioned from an "open/free annual report" to a continuously updated market-intelligence database. Dropped the edition framing and the open-source voice.
- Homepage reorganized into snapshot, macro, and institutions blocks.
- `meta.json` and the data check now cover macro indicators — the build fails if any figure lacks a source or period.

### Fixed
- Company JSON-LD is no longer wrapped in a stray `<set:html>` element (it now injects via `<Fragment set:html>`).

## [0.1.0]

### Added
- Initial static report: homepage stat row + static-SVG sector/city charts, `/companies` index, and a static `/company/[slug]` page per record with schema.org `Organization` JSON-LD.
- Build-time data integrity tests asserting report totals equal the record count.
- GitHub Pages deploy workflow.
