import { Fragment, useId, useMemo, useState } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";

/**
 * One company's P75 AE compensation, all figures in $K.
 */
export interface CompIndexDatum {
  /** Company name. */
  company: string;
  /** Market segment label, e.g. "Enterprise · AI Infra". */
  segment: string;
  /** Total on-target earnings, $K. */
  ote: number;
  /** Base salary, $K. */
  base: number;
  /** Variable / commission at 100% attainment, $K. */
  variable: number;
  /** Four-year equity grant, annualized, $K. */
  equity: number;
}

export interface CompIndexTableProps extends UnsafeClassName {
  /** The compensation index dataset. */
  data: readonly CompIndexDatum[];
  /** Accessible caption for the table. */
  title?: string;
}

type SortKey = "ote" | "base" | "variable" | "equity";

const NUMERIC_COLUMNS: readonly { key: SortKey; label: string }[] = [
  { key: "ote", label: "OTE" },
  { key: "base", label: "Base" },
  { key: "variable", label: "Variable" },
  { key: "equity", label: "Equity" },
];

const SEGMENT_ALL = "All segments";

/**
 * The interactive AE compensation index — the data-product surface of
 * `/index`. A member of the `figures/` family (token-governed, no charting
 * library, no raw color/size): a sortable, segment-filterable table where each
 * row carries an inline OTE bar and expands to its full pay breakdown.
 *
 * Genuinely interactive: sort by any numeric column, filter by market segment,
 * and click a row to drill into base / variable / equity. Rows expose
 * `data-figure-interactive` so the family's interaction contract holds.
 *
 * Embedded into a page through `Figure`, exactly as `CompCurveFigure` is — the
 * figure never hand-rolls its own width or placement.
 */
export function CompIndexTable({
  data,
  title = "AE compensation index — P75 OTE by company",
  unsafe_className,
}: CompIndexTableProps) {
  const captionId = useId();
  const [sortKey, setSortKey] = useState<SortKey>("ote");
  const [sortDesc, setSortDesc] = useState(true);
  const [segment, setSegment] = useState<string>(SEGMENT_ALL);
  const [expanded, setExpanded] = useState<string | null>(null);

  const segments = useMemo(
    () => [SEGMENT_ALL, ...Array.from(new Set(data.map((d) => d.segment))).sort()],
    [data]
  );

  const rows = useMemo(() => {
    const filtered =
      segment === SEGMENT_ALL ? data : data.filter((d) => d.segment === segment);
    return [...filtered].sort((a, b) =>
      sortDesc ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]
    );
  }, [data, segment, sortKey, sortDesc]);

  const max = useMemo(() => Math.max(...data.map((d) => d.ote), 1), [data]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDesc((d) => !d);
    } else {
      setSortKey(key);
      setSortDesc(true);
    }
  }

  return (
    <div className={cn("flex flex-col gap-5", unsafe_className)}>
      {/* Segment filter */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Filter by market segment"
      >
        {segments.map((seg) => {
          const active = seg === segment;
          return (
            <button
              key={seg}
              type="button"
              aria-pressed={active}
              onClick={() => {
                setSegment(seg);
                setExpanded(null);
              }}
              className={cn(
                "border px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-colors",
                active
                  ? "border-accent text-accent"
                  : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {seg}
            </button>
          );
        })}
      </div>

      {/* Resting readout — how the current view is cut. */}
      <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
        Showing{" "}
        <span className="tabular-nums text-foreground">{rows.length}</span> of{" "}
        <span className="tabular-nums text-foreground">{data.length}</span>{" "}
        companies · sorted by{" "}
        <span className="text-accent">{sortKey}</span>{" "}
        {sortDesc ? "high to low" : "low to high"}
      </p>

      {/* The index table */}
      <table className="w-full border-collapse text-left">
        <caption id={captionId} className="sr-only">
          {title}
        </caption>
        <thead>
          <tr className="border-b border-border">
            <th
              scope="col"
              className="py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground"
            >
              Company
            </th>
            <th
              scope="col"
              className="hidden py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground md:table-cell"
            >
              Segment
            </th>
            {NUMERIC_COLUMNS.map((col) => {
              const active = col.key === sortKey;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={
                    active ? (sortDesc ? "descending" : "ascending") : "none"
                  }
                  className="py-3 pl-4 text-right"
                >
                  <button
                    type="button"
                    onClick={() => toggleSort(col.key)}
                    className={cn(
                      "font-mono text-xs uppercase tracking-wider transition-colors",
                      active
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {col.label}
                    <span aria-hidden="true">
                      {active ? (sortDesc ? " ↓" : " ↑") : ""}
                    </span>
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((d) => {
            const open = expanded === d.company;
            const pct = (d.ote / max) * 100;
            const detailId = `${captionId}-${d.company.replace(/\s+/g, "-")}`;
            return (
              <Fragment key={d.company}>
                <tr className="border-b border-border">
                  <td className="py-3 pr-4">
                    <button
                      type="button"
                      data-figure-interactive=""
                      aria-expanded={open}
                      aria-controls={detailId}
                      onClick={() =>
                        setExpanded((cur) => (cur === d.company ? null : d.company))
                      }
                      className="flex items-baseline gap-2 text-left font-serif text-base italic text-foreground transition-colors hover:text-accent"
                    >
                      <span aria-hidden="true" className="font-mono text-xs not-italic text-muted-foreground">
                        {open ? "▾" : "▸"}
                      </span>
                      {d.company}
                    </button>
                  </td>
                  <td className="hidden py-3 pr-4 font-mono text-xs uppercase tracking-wider text-muted-foreground md:table-cell">
                    {d.segment}
                  </td>
                  <td className="py-3 pl-4">
                    <div className="flex items-center justify-end gap-3">
                      <div className="relative hidden h-1.5 w-full bg-card sm:block">
                        <div
                          className="absolute inset-y-0 left-0 bg-accent"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-sm tabular-nums text-foreground">
                        ${d.ote}K
                      </span>
                    </div>
                  </td>
                  <td className="py-3 pl-4 text-right font-mono text-sm tabular-nums text-muted-foreground">
                    ${d.base}K
                  </td>
                  <td className="py-3 pl-4 text-right font-mono text-sm tabular-nums text-muted-foreground">
                    ${d.variable}K
                  </td>
                  <td className="py-3 pl-4 text-right font-mono text-sm tabular-nums text-muted-foreground">
                    ${d.equity}K
                  </td>
                </tr>
                {open ? (
                  <tr id={detailId}>
                    <td colSpan={6} className="border-b border-border bg-card px-4 py-4">
                      <dl className="flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs uppercase tracking-wider">
                        <div className="flex flex-col gap-1">
                          <dt className="text-muted-foreground">Base salary</dt>
                          <dd className="tabular-nums text-foreground">
                            ${d.base}K · {Math.round((d.base / d.ote) * 100)}% of OTE
                          </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                          <dt className="text-muted-foreground">Variable @ 100%</dt>
                          <dd className="tabular-nums text-accent">
                            ${d.variable}K · {Math.round((d.variable / d.ote) * 100)}% of OTE
                          </dd>
                        </div>
                        <div className="flex flex-col gap-1">
                          <dt className="text-muted-foreground">Equity · 4yr annualized</dt>
                          <dd className="tabular-nums text-foreground">${d.equity}K</dd>
                        </div>
                        <div className="flex flex-col gap-1">
                          <dt className="text-muted-foreground">Segment</dt>
                          <dd className="text-foreground">{d.segment}</dd>
                        </div>
                      </dl>
                    </td>
                  </tr>
                ) : null}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
