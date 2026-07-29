export default function ExpressionStatus({ expressions = [], states = {}, activeLabel = null }) {
  return (
    <div className="flex flex-wrap gap-2">
      {expressions.map((label) => {
        const state = states[label] || "pending";
        const isActive = label === activeLabel;
        const done = state === "done";
        return (
          <div
            key={label}
            className={`smooth flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
              done
                ? "border-primary/35 bg-primary/10 text-foreground"
                : isActive
                  ? "border-accent/45 bg-surface-2 text-foreground"
                  : "border-border bg-surface text-muted-foreground"
            }`}
          >
            <span
              className={`grid h-4 w-4 place-items-center rounded-full border ${
                done
                  ? "border-primary bg-primary/20"
                  : isActive
                    ? "border-accent"
                    : "border-border"
              }`}
            >
              {done ? (
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
                  <path
                    d="M2.5 6.2 5 8.5 9.5 3.5"
                    fill="none"
                    stroke="var(--color-primary)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : isActive ? (
                <span className="animate-status h-1.5 w-1.5 rounded-full bg-accent" />
              ) : null}
            </span>
            {label}
          </div>
        );
      })}
    </div>
  );
}
