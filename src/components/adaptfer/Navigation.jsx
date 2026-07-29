import { Link, useRouterState } from "@tanstack/react-router";
import { NAV_ITEMS } from "../../lib/adaptfer-data";

function Wordmark() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface-2">
        <span className="absolute inset-0 rounded-xl opacity-60 [background:var(--gradient-halo)]" />
        <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" aria-hidden="true">
          <path
            d="M4 18 9.5 6l3 6.5L15 9l5 9"
            stroke="var(--color-primary)"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="15" cy="9" r="2" fill="var(--color-accent)" opacity="0.85" />
        </svg>
      </span>
      <span className="font-display text-[15px] font-semibold tracking-tight">
        Adapt<span className="text-gradient">FER</span>
      </span>
    </Link>
  );
}

export function SystemStatus({ compact = false }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="animate-status absolute inline-flex h-2 w-2 rounded-full bg-primary" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
      </span>
      <span className="mono-label !text-[10px] text-foreground/80">
        {compact ? "Online" : "System · Online"}
      </span>
    </div>
  );
}

export default function Navigation() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3">
        <Wordmark />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active =
              item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`smooth rounded-lg px-3 py-1.5 text-sm ${
                  active
                    ? "bg-surface-2 text-foreground panel-glow"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <SystemStatus compact />
      </div>

      <div className="flex gap-1 overflow-x-auto border-t border-border px-4 py-2 lg:hidden">
        {NAV_ITEMS.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`smooth shrink-0 rounded-lg px-3 py-1.5 text-xs ${
                active ? "bg-surface-2 text-foreground" : "text-muted-foreground"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
