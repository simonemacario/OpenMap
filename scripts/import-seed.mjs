// Transform the research seed CSV → src/data/companies.json.
//
// Publishes only CONFIRMED-Italian records: companies with a real Italian tie
// (ownership / founding / brand / distributor, OR chamber membership, OR a known
// Italian parent, OR high-confidence research) plus Italian institutions.
// Records explicitly flagged not-Italian are dropped. The 193 listed-but-unverified
// rows stay in the CSV (seed/, gitignored) for later verification — they are NOT
// published. A wrong "Italian" inclusion is exactly the credibility risk this gate exists for.
//
// Usage: node scripts/import-seed.mjs [path/to/seed.csv]   (default: seed/openmap_seed.csv)
import fs from "node:fs";
import path from "node:path";

const csvPath = process.argv[2] || "seed/openmap_seed.csv";
if (!fs.existsSync(csvPath)) {
  console.error(`✗ seed CSV not found at ${csvPath}. The raw seed is gitignored (seed/); place it there or pass a path.`);
  process.exit(1);
}

function parseCSV(s) {
  const rows = []; let row = [], field = "", i = 0, inQ = false;
  while (i < s.length) {
    const c = s[i];
    if (inQ) {
      if (c === '"') { if (s[i + 1] === '"') { field += '"'; i += 2; continue; } inQ = false; i++; continue; }
      field += c; i++; continue;
    } else {
      if (c === '"') { inQ = true; i++; continue; }
      if (c === ",") { row.push(field); field = ""; i++; continue; }
      if (c === "\r") { i++; continue; }
      if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; i++; continue; }
      field += c; i++; continue;
    }
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const raw = parseCSV(fs.readFileSync(csvPath, "utf8"));
const header = raw[0];
const recs = raw.slice(1).filter(r => r.length > 1).map(r => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));

const ITALIAN_REL = new Set(["Italian-owned", "Italian-founded", "brand-licensed", "distributor of Italian brand"]);
const notItalian = (r) => /EXCLUDE/i.test(r.flags) || r.italyRelationship === "not Italian";
const confirmed = (r) =>
  r.type === "institution" ? !notItalian(r) :
  !notItalian(r) && (ITALIAN_REL.has(r.italyRelationship) || r.chamberMember === "yes" || !!r.italianParent || r.researchConfidence === "high");

// PII guard: publish only role-based business mailboxes, never personal/free-provider addresses.
const ROLE = /^(info|sales|contact|enquiry|enquiries|hello|marketing|ask|general|office|admin|feedback|support)@/i;
const FREE = /@(gmail|hotmail|yahoo|outlook|icloud|live|qq|163)\./i;
const cleanEmail = (e) => (e && ROLE.test(e) && !FREE.test(e)) ? e.replace(/\.$/, "") : "";
const yr = (v) => (/^\d{4}$/.test(v) ? Number(v) : null);
const url = (v) => (/^https?:\/\//i.test(v) ? v : "");
const put = (o, k, v) => { if (v !== undefined && v !== null && v !== "") o[k] = v; };

const out = recs.filter(confirmed).map((r) => {
  const o = {};
  o.slug = r.slug;
  o.name = r.name;
  put(o, "legalName", r.legalName && r.legalName !== r.name ? r.legalName : "");
  o.type = r.type;
  o.sector = r.sector || "Other";
  o.industry = r.industry || r.sector || "";
  put(o, "city", r.city);
  put(o, "region", r.region);
  const fs1 = yr(r.firstSeen); if (fs1) o.firstSeen = fs1;
  put(o, "website", url(r.website));
  put(o, "logo", url(r.logo));
  put(o, "employees", r.employees);
  put(o, "description", r.description);
  put(o, "italianParent", r.italianParent);
  put(o, "italyHQ", r.italyHQ);
  put(o, "italyRelationship", r.italyRelationship);
  put(o, "presenceType", r.presenceType);
  const yf = yr(r.yearFoundedGlobal); if (yf) o.yearFoundedGlobal = yf;
  put(o, "ssmRegNo", r.ssmRegNo);
  if (r.chamberMember === "yes") o.chamberMember = true;
  put(o, "linkedin", url(r.linkedin));
  put(o, "address", r.address && !/^TBC$/i.test(r.address) ? r.address : "");
  put(o, "generalEmail", cleanEmail(r.generalEmail));
  put(o, "generalPhone", r.generalPhone ? r.generalPhone.replace(/\s+/g, " ").trim().replace(/[,/]\s*$/, "") : "");
  put(o, "notableActivity", r.notableActivity);
  put(o, "researchConfidence", r.researchConfidence);
  put(o, "status", r.status);
  put(o, "sources", r.sources);
  put(o, "sourceRef", url((r.sourceRef || "").split("|")[0].trim()));
  return o;
}).sort((a, b) => a.name.localeCompare(b.name));

fs.mkdirSync("src/data", { recursive: true });
fs.writeFileSync("src/data/companies.json", JSON.stringify(out, null, 2) + "\n");

// summary
const by = (k) => { const m = {}; for (const r of out) { const v = r[k] || "(none)"; m[v] = (m[v] || 0) + 1; } return Object.entries(m).sort((a, b) => b[1] - a[1]); };
const have = (k) => out.filter(r => r[k] !== undefined && r[k] !== "").length;
console.log(`✓ wrote src/data/companies.json — ${out.length} records (${out.filter(r=>r.type==="company").length} companies, ${out.filter(r=>r.type==="institution").length} institutions)`);
console.log("  sectors:", by("sector").map(([k, v]) => `${k} ${v}`).join(" · "));
console.log("  with: city", have("city"), "| website", have("website"), "| logo", have("logo"), "| description", have("description"), "| italianParent", have("italianParent"), "| chamberMember", out.filter(r=>r.chamberMember).length);
console.log("  cities w/ value:", new Set(out.filter(r=>r.city).map(r=>r.city)).size, "| blank city:", out.filter(r=>!r.city).length);
