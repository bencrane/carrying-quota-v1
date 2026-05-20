export interface DispatchCard {
  slug: string;
  category: string;
  title: string;
  dek: string;
  byline: string;
  date: string;
  /** Full body paragraphs — only completed pieces carry this. */
  body?: string[];
}

export const dispatches: DispatchCard[] = [
  {
    slug: "q2-comp-correction",
    category: "Markets",
    title: "The Q2 comp correction the floor isn't pricing in.",
    dek: "OTE held flat on paper through Q1. Underneath, the mix shifted hard — and the AEs who read it early are already repricing themselves.",
    byline: "CQ Research Desk",
    date: "May 19, 2026",
    body: [
      "For two quarters, the headline number told a comforting story: median enterprise OTE across the AI-infra segment barely moved, ticking from $438K to $445K. Recruiters quoted it. Hiring managers anchored to it. The floor treated it as stability.",
      "The headline lied by omission. Base salary growth stalled — up 1.2% — while the variable component widened its band by nearly nine points. The same OTE now hides far more risk. The reps clearing 120% of quota are pulling further from the median; the reps landing at 70% are taking home materially less than the same attainment paid them a year ago.",
      "We pulled 1,400 verified offer letters dated after March 1. The pattern is consistent across Databricks, Snowflake, and three Series-C infra companies that asked not to be named: comp committees are quietly shifting dollars from guaranteed to earned. It is a bet on a stronger second half. It is also a transfer of risk onto the rep.",
      "The AEs who noticed are doing two things. They are renegotiating base at signing rather than chasing a bigger OTE headline. And they are reading the accelerator language line by line — because in a year where the band widened nine points, the accelerator is where the actual money moved.",
    ],
  },
  {
    slug: "snowflake-diaspora-landed",
    category: "The Index",
    title: "Where the Snowflake diaspora actually landed.",
    dek: "Two years of post-IPO departures, mapped. Three names absorbed more than half of every AE who walked.",
    byline: "CQ Research Desk",
    date: "May 12, 2026",
  },
  {
    slug: "se-to-ae-pipeline",
    category: "Dispatch",
    title: "The SE-to-AE pipeline nobody is funding.",
    dek: "Sales engineers convert to closing roles at a higher attainment rate than external AE hires. So why does nobody build the bridge?",
    byline: "Marcus Vey",
    date: "May 09, 2026",
  },
  {
    slug: "down-round-equity",
    category: "Field Guide",
    title: "What a down round does to your equity, actually.",
    dek: "Preference stacks, repricing, refresh grants — the mechanics nobody explains until your strike price is underwater.",
    byline: "Devon Ash",
    date: "May 05, 2026",
  },
  {
    slug: "fake-400k-ote",
    category: "Field Guide",
    title: "The five questions that out a fake $400K OTE.",
    dek: "Most quoted OTEs are a recruiting fiction. Here is the diligence that separates the real number from the brochure.",
    byline: "Priya Kanagala",
    date: "Apr 30, 2026",
  },
  {
    slug: "ramp-comp-band-decoded",
    category: "The Index",
    title: "Ramp's comp band, decoded.",
    dek: "What the mid-market AE seat at one of fintech's fastest scalers actually pays — base, variable, equity, and the catch.",
    byline: "CQ Research Desk",
    date: "Apr 26, 2026",
  },
];

export function getDispatch(slug: string): DispatchCard | undefined {
  return dispatches.find((d) => d.slug === slug);
}
