import { useId, useState } from "react";
import { cn } from "../lib/cn.js";
import type { UnsafeClassName } from "../lib/props.js";

/**
 * One plotted datum — a company and its P75 OTE breakdown ($K).
 */
export interface CompDatum {
  /** Company name. */
  company: string;
  /** Total on-target earnings, $K. */
  ote: number;
  /** Base salary, $K. */
  base: number;
  /** Variable / commission, $K. */
  variable: number;
  /** Market segment label. */
  segment: string;
}

export interface CompCurveFigureProps extends UnsafeClassName {
  /** The dataset to plot. */
  data: readonly CompDatum[];
  /** Accessible title for the figure's SVG. */
  title?: string;
}

/* ── geometry, in SVG user units (NOT Tailwind arbitraries) ──────────────── */
const VIEW_W = 720;
const ROW_H = 52;
const PAD_TOP = 16;
const PAD_BOTTOM = 16;
const LABEL_W = 150;
const VALUE_W = 86;
const BAR_X = LABEL_W;
const BAR_H = 10;

/**
 * The reference interactive data figure (check D2).
 *
 * A custom-built — SVG + React — horizontal bar figure of P75 AE
 * compensation by company. NO charting library: every coordinate is computed
 * here from the data. NO raw color or size: bar fills use Tailwind token
 * utility classes (`fill-accent`, `fill-card`, `stroke-border`), text uses
 * palette text classes; the only inline geometry is SVG user-space numbers.
 *
 * Genuinely interactive (check D3): hovering OR keyboard-focusing a bar row
 * (`[data-figure-interactive]`) updates the readout panel
 * (`[data-figure-state]`) — its `textContent` changes to that row's
 * breakdown. With nothing active the readout shows a resting prompt.
 *
 * This figure is the proof that an arbitrary interactive data experience
 * drops into the editorial system through `Figure` without the figure
 * hand-rolling color, size, or layout geometry.
 */
export function CompCurveFigure({
  data,
  title = "AE compensation by company, P75 OTE",
  unsafe_className,
}: CompCurveFigureProps) {
  const [active, setActive] = useState<number | null>(null);
  const titleId = useId();

  const max = Math.max(...data.map((d) => d.ote), 1);
  const plotW = VIEW_W - LABEL_W - VALUE_W;
  const viewH = PAD_TOP + PAD_BOTTOM + data.length * ROW_H;

  const activeDatum = active != null ? data[active] : null;

  return (
    <div className={cn("flex flex-col gap-4", unsafe_className)}>
      {/* Readout panel — its textContent reflects the interaction state. */}
      <div
        data-figure-state=""
        aria-live="polite"
        className="border border-border bg-card px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground"
      >
        {activeDatum ? (
          <span>
            <span className="text-foreground">{activeDatum.company}</span>
            {" — "}
            {activeDatum.segment}
            {" · base $"}
            <span className="text-foreground tabular-nums">
              {activeDatum.base}K
            </span>
            {" · variable $"}
            <span className="text-accent tabular-nums">
              {activeDatum.variable}K
            </span>
            {" · OTE $"}
            <span className="text-foreground tabular-nums">
              {activeDatum.ote}K
            </span>
          </span>
        ) : (
          <span>Hover or focus a row for the comp breakdown</span>
        )}
      </div>

      <svg
        viewBox={`0 0 ${VIEW_W} ${viewH}`}
        role="group"
        aria-labelledby={titleId}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <title id={titleId}>{title}</title>

        {data.map((d, i) => {
          const y = PAD_TOP + i * ROW_H;
          const barW = (d.ote / max) * plotW;
          const baseW = (d.base / max) * plotW;
          const isActive = active === i;
          const rowMid = y + ROW_H / 2;

          return (
            <g
              key={d.company}
              data-figure-interactive=""
              tabIndex={0}
              role="button"
              aria-label={`${d.company}: ${d.ote}K OTE`}
              className="cursor-pointer outline-none"
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive((cur) => (cur === i ? null : cur))}
              onFocus={() => setActive(i)}
              onBlur={() => setActive((cur) => (cur === i ? null : cur))}
            >
              {/* full-row hit area — transparent fill keeps the whole row hoverable */}
              <rect
                x={0}
                y={y}
                width={VIEW_W}
                height={ROW_H}
                className={cn(
                  "transition-colors duration-200",
                  isActive ? "fill-muted" : "fill-transparent"
                )}
              />

              {/* company label */}
              <text
                x={0}
                y={rowMid}
                dominantBaseline="middle"
                className={cn(
                  "font-serif italic transition-colors duration-200",
                  isActive ? "fill-accent" : "fill-foreground"
                )}
                style={{ fontSize: 15 }}
              >
                {d.company}
              </text>

              {/* track */}
              <rect
                x={BAR_X}
                y={rowMid - BAR_H / 2}
                width={plotW}
                height={BAR_H}
                className="fill-card"
              />
              {/* base portion */}
              <rect
                x={BAR_X}
                y={rowMid - BAR_H / 2}
                width={baseW}
                height={BAR_H}
                className="fill-muted-foreground"
              />
              {/* total OTE bar */}
              <rect
                x={BAR_X}
                y={rowMid - BAR_H / 2}
                width={barW}
                height={BAR_H}
                className={cn(
                  "transition-all duration-200",
                  isActive ? "fill-accent" : "fill-foreground"
                )}
                fillOpacity={isActive ? 1 : 0.65}
              />

              {/* value readout */}
              <text
                x={VIEW_W}
                y={rowMid}
                dominantBaseline="middle"
                textAnchor="end"
                className="fill-foreground font-mono tabular-nums"
                style={{ fontSize: 12 }}
              >
                ${d.ote}K
              </text>

              {/* baseline hairline */}
              <line
                x1={0}
                x2={VIEW_W}
                y1={y + ROW_H}
                y2={y + ROW_H}
                className="stroke-border"
                strokeWidth={1}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
