# Changelog

All notable changes to OpenMap are documented here.

## [0.3.0] - 2026-06-09

### Added
- Real seed data: replaced placeholder records with **62 verified entries** — 59 companies with a confirmed Italian connection (ownership, founding, brand/distribution, ITALCHAM membership, or high-confidence research) plus the 3 Italian institutions. The 193 listed-but-unverified firms from the source list are held back pending verification.
- `scripts/import-seed.mjs`: reproducible importer that transforms the research CSV into `companies.json`, filters to confirmed-Italian, and guards PII (role-based emails only). The raw seed stays local (gitignored `seed/`).
- Company detail pages now show the Italian link (parent, HQ, relationship, presence type), chamber membership, LinkedIn, SSM registration, a logo, and a verification line with sources.
- Company logos in the database table.

### Changed
- Database "Since" column replaced with "Presence" (founding-year data isn't available for the verified set).
- Homepage "notable firms" now surfaces the best-documented firms rather than sorting by year.
- City stats and chart exclude records without a city; the data-check no longer requires `firstSeen` / `city` / `industry`.
- Methodology rewritten to state the confirmed-Italian publishing rule.

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
