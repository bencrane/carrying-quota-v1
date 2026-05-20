export interface TickerItem {
  label: string;
  value: string;
  delta: number;
}

interface TickerProps {
  items: TickerItem[];
}

export function Ticker({ items }: TickerProps) {
  // Doubled so the marquee can loop seamlessly with translateX(-50% → 0).
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-b border-border bg-black font-mono text-[11px] uppercase tracking-[0.08em]">
      <div className="flex w-max gap-12 whitespace-nowrap py-[10px] [animation:cq-scroll_180s_linear_infinite]">
        {doubled.map((item, i) => (
          <span key={i} className="inline-flex items-baseline gap-3">
            <span className="text-border">●</span>
            <span className="text-muted-foreground">{item.label}</span>
            <span
              className={
                item.delta >= 0
                  ? "text-accent"
                  : "text-[hsl(var(--destructive))]"
              }
            >
              {item.value} {item.delta >= 0 ? "▲" : "▼"}{" "}
              {Math.abs(item.delta).toFixed(1)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
