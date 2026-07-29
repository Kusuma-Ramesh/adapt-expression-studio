export default function MetricCard({ label, value, delta, hint, sub }) {
  const positive = typeof delta === "string" && delta.startsWith("+");

  return (
    <div className="panel smooth p-5 hover:panel-glow">
      <p className="mono-label">{label}</p>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-display text-3xl font-semibold tabular-nums">{value}</span>
        {delta && (
          <span
            className={`rounded-md border px-1.5 py-0.5 font-mono text-[11px] ${
              positive
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {delta}
          </span>
        )}
      </div>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      {hint && <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
