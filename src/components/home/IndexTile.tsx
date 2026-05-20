import { Link } from "react-router";
import { Section } from "@/components/primitives/Section";
import { Text } from "@/components/primitives/Text";
import { cn } from "@/lib/utils";
import { typeClasses } from "@/design/tokens";

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
    <Section variant="elevated" gutter="default" divide="bottom">
      <div className="mb-6">
        <Text scale="caption" tone="accent" as="span">
          ↳ The Index
        </Text>
      </div>
      <div className="grid grid-cols-1 items-end gap-6 md:grid-cols-[auto_1fr_auto] md:gap-12">
        <div>
          <div className="flex items-baseline gap-4">
            <Text scale="hero" as="span">
              {value}
            </Text>
            <span
              className={cn(
                typeClasses.caption,
                "tabular-nums",
                isDown ? "text-[hsl(var(--destructive))]" : "text-accent"
              )}
            >
              {isDown ? "▼" : "▲"} {change} YoY
            </span>
          </div>
          <div className="mt-3">
            <Text scale="caption" tone="muted" as="span" className="tracking-[0.12em]">
              {label}
            </Text>
          </div>
        </div>
        <Text scale="body" tone="muted" as="p" className="italic leading-[1.45]">
          {context}
        </Text>
        <Link
          to="/index"
          className={cn(typeClasses.caption, "text-foreground transition-colors duration-200 hover:text-accent md:self-end")}
        >
          Open the dashboard →
        </Link>
      </div>
    </Section>
  );
}
