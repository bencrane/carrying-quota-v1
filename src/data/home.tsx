import type { TickerItem } from "@/components/editorial/Ticker";
import type { CompanyComp } from "@/components/home/LeadChart";
import type { TocItem } from "@/components/home/ThisWeek";

export type { TickerItem };

export const tickerItems: TickerItem[] = [
  { label: "Snowflake AE OTE",       value: "$340K", delta:  4.2 },
  { label: "Databricks Enterprise",  value: "$385K", delta:  7.1 },
  { label: "Salesforce MM",          value: "$245K", delta: -1.8 },
  { label: "OpenAI GTM",             value: "$420K", delta: 12.4 },
  { label: "Ramp AE",                value: "$310K", delta:  3.6 },
  { label: "Notion Enterprise",      value: "$265K", delta: -2.1 },
  { label: "Vanta MM",               value: "$255K", delta:  5.5 },
  { label: "Figma Enterprise",       value: "$330K", delta:  2.9 },
  { label: "Avg Attainment Q1",      value: "63%",   delta: -8.0 },
  { label: "Anthropic AE",           value: "$445K", delta: 18.0 },
];

export const hero = {
  issue: "Issue 14 · Vol. 01",
  date: "Tuesday, May 19, 2026",
  headline: "The AE labor market, on the record.",
  dek: "A weekly newsletter for the people who actually move the number. Original data on comp, attainment, and where talent moves next. Free.",
  readerCount: "12,847 reading",
  monthGrowth: "+2,341",
};

const leadData: CompanyComp[] = [
  { company: "Anthropic",   ote: 445, base: 195, commission: 250, equity: 320, segment: "Enterprise · AI Infra" },
  { company: "OpenAI",      ote: 420, base: 190, commission: 230, equity: 290, segment: "Enterprise · GTM" },
  { company: "Databricks",  ote: 385, base: 175, commission: 210, equity: 240, segment: "Enterprise · Data" },
  { company: "Snowflake",   ote: 340, base: 160, commission: 180, equity: 180, segment: "Enterprise · Data" },
  { company: "Figma",       ote: 330, base: 155, commission: 175, equity: 145, segment: "Enterprise · Design" },
  { company: "Ramp",        ote: 310, base: 145, commission: 165, equity: 130, segment: "Mid-Market · Fintech" },
  { company: "Notion",      ote: 265, base: 130, commission: 135, equity:  90, segment: "Enterprise · SaaS" },
  { company: "Vanta",       ote: 255, base: 125, commission: 130, equity:  85, segment: "Mid-Market · Security" },
  { company: "Salesforce",  ote: 245, base: 145, commission: 100, equity:  40, segment: "Mid-Market · CRM" },
  { company: "Atlassian",   ote: 235, base: 125, commission: 110, equity:  55, segment: "Mid-Market · Dev Tools" },
];

export const leadStory = {
  category: "The Index · Compensation",
  headline: "Where AEs make the most, right now.",
  dek: "The top 10 paying enterprise sales seats in tech this quarter, ranked by P75 OTE. AI infra has pulled $100K of clear daylight on every other segment.",
  byline: "CQ Research Desk",
  readTime: "8 min read",
  slug: "where-aes-make-the-most-q2-2026",
  data: leadData,
};

export const thisWeek: TocItem[] = [
  {
    category: "Dispatch",
    to: "/dispatches/eight-figure-sheraton",
    title: "I closed an eight-figure deal in a Sheraton parking lot.",
    date: "Apr 08",
  },
  {
    category: "Index",
    to: "/index/snowflake-diaspora",
    title: "Where Snowflake AEs went after IPO — the post-exit map.",
    date: "Apr 06",
  },
  {
    category: "Dispatch",
    to: "/dispatches/line-cook-to-cro",
    title: "From line cook to RVP: how she out-sold the Stanford MBAs.",
    date: "Apr 03",
  },
  {
    category: "Goods",
    to: "/goods/drop-04",
    title: "Drop 04 — Spring '26: the Closer Coat, four pieces, made once.",
    date: "Spring",
  },
];

export const indexTile = {
  label: "AE attainment · Q1 2026 · n=4,200",
  value: "63%",
  change: "8pp",
  direction: "down" as const,
  context:
    "Quarter-over-quarter attainment fell to its lowest read since Q2 2023. AI Infra held steady at 78%; Mid-Market SaaS dragged the average.",
};
