export default function ExpressionProbabilityBars({ data = [], highlight = null, compact = false }) {
  const top = data.reduce((a, b) => (b.value > (a?.value ?? 0) ? b : a), null);
  const peak = highlight ?? top?.label;

  return (
    <div className={compact ? "space-y-2" : "space-y-3"}>
      {data.map((d) => {
        const isPeak = d.label === peak;
        return (
          <div key={d.label} className="group">
            <div className="mb-1 flex items-baseline justify-between">
              <span
                className={`text-xs smooth ${
                  isPeak ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {d.label}
              </span>
              <span
                className={`font-mono text-[11px] tabular-nums smooth ${
                  isPeak ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {(d.value * 100).toFixed(1)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full smooth"
                style={{
                  width: `${Math.max(2, d.value * 100)}%`,
                  background: isPeak
                    ? "var(--gradient-primary)"
                    : "color-mix(in oklab, var(--foreground) 28%, transparent)",
                  boxShadow: isPeak
                    ? "0 0 14px color-mix(in oklab, var(--primary) 55%, transparent)"
                    : "none",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
