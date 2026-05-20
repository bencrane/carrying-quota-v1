import { motion } from "motion/react";
import { Link, NavLink } from "react-router";

const sections = [
  { label: "Dispatches", to: "/dispatches" },
  { label: "The Index", to: "/index" },
  { label: "Comp", to: "/comp" },
  { label: "Goods", to: "/goods" },
];

export function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="border-b border-border bg-background/85 backdrop-blur-xl"
    >
      <div className="grid grid-cols-[1fr_auto_1fr] items-center px-6 py-3 md:px-10 md:py-[14px]">
        <Link
          to="/"
          className="justify-self-start font-serif text-[18px] font-medium tracking-tight"
        >
          Carrying Quota
        </Link>

        <ul className="hidden gap-7 font-mono text-[11px] uppercase tracking-[0.12em] md:flex">
          {sections.map((s) => (
            <li key={s.to}>
              <NavLink
                to={s.to}
                className={({ isActive }) =>
                  `transition-colors duration-200 ${
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`
                }
              >
                {s.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <Link
          to="/#subscribe"
          className="justify-self-end border border-foreground px-[16px] py-[7px] font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-200 hover:bg-foreground hover:text-background"
        >
          Subscribe
        </Link>
      </div>
    </motion.nav>
  );
}
