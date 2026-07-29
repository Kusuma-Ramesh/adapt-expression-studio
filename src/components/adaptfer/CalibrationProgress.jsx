export default function CalibrationProgress({ current = 0, total = 7, sublabel = "", size = 240 }) {
  const pct = total ? current / total : 0;
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-muted)" strokeWidth="3" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r - 10}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="1"
          strokeDasharray="2 8"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          style={{
            transition: "stroke-dashoffset var(--transition-smooth)",
            filter: "drop-shadow(0 0 12px color-mix(in oklab, var(--primary) 65%, transparent))",
          }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="font-display text-4xl font-semibold tabular-nums">
          {current}
          <span className="text-xl text-muted-foreground">/{total}</span>
        </div>
        <p className="mono-label mt-1">Calibrated</p>
        {sublabel && <p className="mt-2 max-w-[10rem] text-xs text-muted-foreground">{sublabel}</p>}
      </div>
    </div>
  );
}
