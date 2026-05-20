import { Link } from "react-router";
import { Section } from "@/components/primitives/Section";
import { Text } from "@/components/primitives/Text";
import { cn } from "@/lib/utils";
import { typeClasses } from "@/design/tokens";

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
    <Section variant="primary" gutter="default" divide="bottom">
      <div className="mb-6 flex items-baseline justify-between">
        <Text scale="caption" tone="accent" as="span">
          ↳ This week · {items.length} pieces
        </Text>
        <Link
          to="/dispatches"
          className={cn(typeClasses.caption, "text-muted-foreground transition-colors duration-200 hover:text-foreground")}
        >
          Archive →
        </Link>
      </div>

      <ul className="divide-y divide-border border-y border-border">
        {items.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className="group grid grid-cols-[90px_1fr_70px] items-baseline gap-4 pt-4 pb-4 transition-colors duration-200 md:grid-cols-[140px_1fr_90px] md:pt-5 md:pb-5"
            >
              <Text scale="caption" tone="muted" as="span">
                {item.category}
              </Text>
              <Text
                scale="lede"
                as="span"
                className="leading-[1.25] tracking-[-0.01em] text-foreground transition-colors duration-200 group-hover:text-accent"
              >
                {item.title}
              </Text>
              <Text scale="caption" tone="muted" as="span" className="text-right tracking-[0.1em]">
                {item.date}
              </Text>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
