import { Link } from "react-router";

export interface TocItem {
  category: string;   // "Dispatch" | "Index" | "Goods"
  to: string;         // route path
  title: string;
  date: string;
}

interface ThisWeekProps {
  items: TocItem[];
}

export function ThisWeek({ items }: ThisWeekProps) {
  return (
    <section className="border-b border-border px-6 py-12 md:px-10 md:py-16">
      <div className="mb-6 flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.15em]">
        <span className="text-accent">↳ This week · {items.length} pieces</span>
        <Link
          to="/dispatches"
          className="text-muted-foreground transition-colors duration-200 hover:text-foreground"
        >
          Archive →
        </Link>
      </div>

      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="group grid grid-cols-[90px_1fr_70px] items-baseline gap-4 py-4 transition-colors duration-200 md:grid-cols-[140px_1fr_90px] md:py-5"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {item.category}
              </span>
              <span className="font-serif text-[18px] leading-[1.25] tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-accent md:text-[22px]">
                {item.title}
              </span>
              <span className="text-right font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
                {item.date}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
