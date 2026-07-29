export default function ConfidenceIndicator({ value = 0, label = "Confidence", size = 128 }) {
  const pct = Math.max(0, Math.min(1, value));
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-muted)"
            strokeWidth="6"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - pct)}
            style={{
              transition: "stroke-dashoffset var(--transition-smooth)",
              filter: "drop-shadow(0 0 8px color-mix(in oklab, var(--primary) 60%, transparent))",
            }}
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-center">
            <div className="font-display text-2xl font-semibold tabular-nums">
              {(pct * 100).toFixed(0)}
              <span className="text-sm text-muted-foreground">%</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <p className="mono-label">{label}</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {pct > 0.85 ? "High certainty" : pct > 0.6 ? "Usable" : "Low — needs calibration"}
        </p>
      </div>
    </div>
  );
}
