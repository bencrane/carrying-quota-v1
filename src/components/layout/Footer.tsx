import { Link } from "react-router";

const links = [
  { label: "Dispatches", to: "/dispatches" },
  { label: "The Index", to: "/index" },
  { label: "Comp", to: "/comp" },
  { label: "Goods", to: "/goods" },
  { label: "About", to: "/about" },
];

export function Footer() {
  return (
    <footer className="border-t border-border px-6 py-8 md:px-10">
      <div className="flex flex-col gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground md:flex-row md:items-center md:justify-between">
        <span>Carrying Quota · © MMXXVI</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="transition-colors duration-200 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
