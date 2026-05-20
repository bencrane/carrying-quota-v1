import { cn } from "@/lib/utils";

interface AbstractBannerProps {
  /** Rotates the gradient focal points so a grid of banners isn't templated. */
  seed?: number;
  className?: string;
}

const fields = [
  { light: "115% 95% at 74% 10%", glow: "45% 70% at 18% 88%" },
  { light: "120% 90% at 22% 14%", glow: "50% 65% at 84% 82%" },
  { light: "115% 100% at 50% 4%", glow: "44% 72% at 50% 100%" },
  { light: "125% 88% at 88% 46%", glow: "52% 62% at 14% 28%" },
];

const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")`;

/**
 * Generated abstract banner — a dark radial-gradient field with a faint
 * accent glow and grain. No photography, no network. `seed` rotates the
 * gradient focal points. Fills its parent; the parent owns aspect + border.
 */
export function AbstractBanner({ seed = 0, className }: AbstractBannerProps) {
  const field = fields[seed % fields.length]!;
  return (
    <div className={cn("absolute inset-0", className)}>
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(${field.light}, hsl(0 0% 18%) 0%, hsl(0 0% 8%) 48%, hsl(0 0% 4%) 100%)`,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(${field.glow}, hsl(var(--accent) / 0.08) 0%, transparent 72%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  );
}
