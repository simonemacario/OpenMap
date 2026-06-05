// Data-integrity tests — the automated form of Pre-Build Gate #4.
// A wrong number shown to ICE/the embassy kills the credibility thesis,
// so these guard that the parts always sum to the displayed totals.
import { test } from "node:test";
import assert from "node:assert/strict";
import companies from "../src/data/companies.json" with { type: "json" };
import { headlineStats, bySector, byCity } from "../src/lib/stats.mjs";

test("sector breakdown sums to the companies headline", () => {
  const stats = headlineStats(companies);
  const sum = bySector(companies).reduce((a, s) => a + s.count, 0);
  assert.equal(sum, stats.companies, "sum of per-sector counts must equal total companies");
});

test("city breakdown sums to all entities (companies + institutions)", () => {
  const sum = byCity(companies).reduce((a, c) => a + c.count, 0);
  assert.equal(sum, companies.length, "sum of per-city counts must equal total entities");
});

test("sector count equals number of distinct company sectors", () => {
  const stats = headlineStats(companies);
  assert.equal(stats.sectors, bySector(companies).length);
});

test("no company is silently dropped from the sector rollup", () => {
  const stats = headlineStats(companies);
  const companyRows = companies.filter((c) => c.type === "company").length;
  assert.equal(stats.companies, companyRows);
});

test("bars are sorted descending (chart contract)", () => {
  const s = bySector(companies);
  for (let i = 1; i < s.length; i++) assert.ok(s[i - 1].count >= s[i].count);
});
