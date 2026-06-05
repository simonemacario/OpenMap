// Schema validation — fails the build loudly if the data is malformed.
// Honesty as credibility: never ship blank names or impossible years.
import companies from "../src/data/companies.json" with { type: "json" };

const REQUIRED = ["name", "sector", "city", "firstSeen", "type"];
const TYPES = new Set(["company", "institution"]);
const thisYear = new Date().getFullYear();
const errors = [];

if (!Array.isArray(companies) || companies.length === 0) {
  errors.push("companies.json must be a non-empty array");
}

companies.forEach((row, i) => {
  for (const f of REQUIRED) {
    if (row[f] === undefined || row[f] === null || row[f] === "") {
      errors.push(`row ${i} (${row.name ?? "?"}): missing/empty "${f}"`);
    }
  }
  if (row.type && !TYPES.has(row.type)) {
    errors.push(`row ${i} (${row.name}): type must be company|institution, got "${row.type}"`);
  }
  if (typeof row.firstSeen === "number" && (row.firstSeen < 1900 || row.firstSeen > thisYear)) {
    errors.push(`row ${i} (${row.name}): firstSeen ${row.firstSeen} out of range 1900–${thisYear}`);
  }
});

if (errors.length) {
  console.error(`✗ data check failed (${errors.length}):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ data check passed: ${companies.length} records valid`);
