import type { CompIndexDatum } from "@cq/ui";

/**
 * The AE compensation index — representative sample data for `/index`.
 *
 * Fake but plausible: P75 on-target earnings by company, with the base /
 * variable split (OTE = base + variable at 100% attainment) and the
 * four-year equity grant annualized. All figures in $K.
 */
export const compIndex: CompIndexDatum[] = [
  { company: "Anthropic",  segment: "Enterprise · AI Infra",  ote: 445, base: 200, variable: 245, equity: 320 },
  { company: "OpenAI",     segment: "Enterprise · AI Infra",  ote: 420, base: 195, variable: 225, equity: 295 },
  { company: "Cursor",     segment: "Enterprise · AI Infra",  ote: 395, base: 185, variable: 210, equity: 270 },
  { company: "Wiz",        segment: "Enterprise · Security",  ote: 375, base: 172, variable: 203, equity: 230 },
  { company: "Glean",      segment: "Enterprise · AI Infra",  ote: 365, base: 170, variable: 195, equity: 215 },
  { company: "Rippling",   segment: "Enterprise · GTM",       ote: 350, base: 168, variable: 182, equity: 175 },
  { company: "Databricks", segment: "Enterprise · Data",      ote: 385, base: 178, variable: 207, equity: 240 },
  { company: "Snowflake",  segment: "Enterprise · Data",      ote: 340, base: 162, variable: 178, equity: 185 },
  { company: "Figma",      segment: "Enterprise · Design",    ote: 330, base: 156, variable: 174, equity: 150 },
  { company: "Ramp",       segment: "Mid-Market · Fintech",   ote: 310, base: 148, variable: 162, equity: 135 },
  { company: "Deel",       segment: "Enterprise · GTM",       ote: 305, base: 150, variable: 155, equity: 120 },
  { company: "Brex",       segment: "Mid-Market · Fintech",   ote: 290, base: 138, variable: 152, equity: 110 },
  { company: "Notion",     segment: "Mid-Market · SaaS",      ote: 268, base: 130, variable: 138, equity: 95 },
  { company: "Vanta",      segment: "Mid-Market · SaaS",      ote: 255, base: 124, variable: 131, equity: 82 },
];

/**
 * Page copy for `/index` — kept beside the dataset so the route file stays a
 * pure composition of primitives.
 */
export const compIndexMeta = {
  eyebrow: "The Index · Compensation",
  title: "AE compensation, the full read.",
  dek: "Every seat in the index, ranked by P75 on-target earnings. Sort by base, variable, or equity; filter by segment; open any row for the full pay breakdown.",
  caption:
    "P75 on-target earnings by company — base, variable at 100% attainment, and four-year equity annualized.",
  source: "Representative sample · CQ Research Desk · methodology in production",
};
