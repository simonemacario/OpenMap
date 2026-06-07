// Schema validation — fails the build loudly if the data is malformed.
// Honesty as credibility: never ship blank names, bad years, or dup slugs.
import companies from "../src/data/companies.json" with { type: "json" };
import macro from "../src/data/macro.json" with { type: "json" };

const REQUIRED = ["slug", "name", "sector", "industry", "city", "firstSeen", "type"];
const TYPES = new Set(["company", "institution"]);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const thisYear = new Date().getFullYear();
const errors = [];
const seen = new Set();

if (!Array.isArray(companies) || companies.length === 0) {
  errors.push("companies.json must be a non-empty array");
}

companies.forEach((row, i) => {
  const id = row.name ?? row.slug ?? `#${i}`;
  for (const f of REQUIRED) {
    if (row[f] === undefined || row[f] === null || row[f] === "") {
      errors.push(`row ${i} (${id}): missing/empty "${f}"`);
    }
  }
  if (row.slug && !SLUG_RE.test(row.slug)) {
    errors.push(`row ${i} (${id}): slug "${row.slug}" must be lowercase-kebab (drives the URL)`);
  }
  if (row.slug) {
    if (seen.has(row.slug)) errors.push(`row ${i} (${id}): duplicate slug "${row.slug}" — would collide on URLs`);
    seen.add(row.slug);
  }
  if (row.type && !TYPES.has(row.type)) {
    errors.push(`row ${i} (${id}): type must be company|institution, got "${row.type}"`);
  }
  if (typeof row.firstSeen === "number" && (row.firstSeen < 1900 || row.firstSeen > thisYear)) {
    errors.push(`row ${i} (${id}): firstSeen ${row.firstSeen} out of range 1900–${thisYear}`);
  }
  if (row.website && !/^https?:\/\//.test(row.website)) {
    errors.push(`row ${i} (${id}): website must start with http(s):// — got "${row.website}"`);
  }
});

// Macro indicators — every figure on the homepage must carry a source + period.
const MACRO_REQ = ["label", "value", "source", "period"];
if (!macro || !Array.isArray(macro.indicators) || macro.indicators.length === 0) {
  errors.push("macro.json must have a non-empty indicators array");
} else {
  macro.indicators.forEach((m, i) => {
    for (const f of MACRO_REQ) {
      if (m[f] === undefined || m[f] === null || m[f] === "") {
        errors.push(`macro ${i} (${m.label ?? "#" + i}): missing/empty "${f}" — a figure with no source/period is not citable`);
      }
    }
  });
}

if (errors.length) {
  console.error(`✗ data check failed (${errors.length}):`);
  for (const e of errors) console.error("  - " + e);
  process.exit(1);
}
console.log(`✓ data check passed: ${companies.length} records valid, ${seen.size} unique slugs, ${macro.indicators.length} macro indicators`);
