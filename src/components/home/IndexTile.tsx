import { Link } from "react-router";

interface IndexTileProps {
  label: string;         // "AE attainment · Q1 2026"
  value: string;         // "63%"
  change: string;        // "8pp" — sign comes from `direction`
  direction: "up" | "down";
  context: string;       // one-line interpretation
}

export function IndexTile({
  label,
  value,
  change,
  direction,
  context,
}: IndexTileProps) {
  const isDown = direction === "down";
  return (
    <section className="border-b border-border px-6 py-12 md:px-10 md:py-16">
      <div className="mb-6 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
        ↳ The Index
      </div>
      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[auto_1fr_auto] md:gap-12">
        <div>
          <div className="flex items-baseline gap-4">
            <span className="font-serif text-[64px] font-light leading-none tracking-[-0.035em] md:text-[88px]">
              {value}
            </span>
            <span
              className={`font-mono text-[12px] tabular-nums ${
                isDown
                  ? "text-[hsl(var(--destructive))]"
                  : "text-accent"
              }`}
            >
              {isDown ? "▼" : "▲"} {change} YoY
            </span>
          </div>
          <div className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            {label}
          </div>
        </div>
        <p className="max-w-[44ch] font-serif text-[15px] italic leading-[1.45] text-muted-foreground md:text-[17px]">
          {context}
        </p>
        <Link
          to="/index"
          className="font-mono text-[10px] uppercase tracking-[0.12em] text-foreground transition-colors duration-200 hover:text-accent md:self-end"
        >
          Open the dashboard →
        </Link>
      </div>
    </section>
  );
}
