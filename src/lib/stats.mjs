// Single source of truth for every number on the page.
// The report page AND the data-integrity test both import these functions,
// so a displayed number can never silently drift from the underlying data.
// (Pre-Build Gate #4: number defensibility.)

/** Companies only (institutions are counted separately). */
export const companiesOnly = (rows) => rows.filter((r) => r.type === "company");

export function headlineStats(rows) {
  const companies = companiesOnly(rows);
  const institutions = rows.filter((r) => r.type === "institution");
  const sectors = new Set(companies.map((r) => r.sector));
  const cities = new Set(rows.filter((r) => r.city).map((r) => r.city));
  const thisYear = new Date().getFullYear();
  const newThisYear = rows.filter((r) => r.firstSeen === thisYear).length;
  return {
    companies: companies.length,
    institutions: institutions.length,
    sectors: sectors.size,
    cities: cities.size,
    newThisYear,
  };
}

/** [{ label, count }] sorted desc, companies only. */
export function bySector(rows) {
  const counts = new Map();
  for (const r of companiesOnly(rows)) {
    counts.set(r.sector, (counts.get(r.sector) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** [{ label, count }] sorted desc, all rows (companies + institutions). */
export function byCity(rows) {
  const counts = new Map();
  for (const r of rows) { if (!r.city) continue; counts.set(r.city, (counts.get(r.city) ?? 0) + 1); }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}
