export function PageShell({ eyebrow, title, description, actions, children }) {
  return (
    <main className="halo mx-auto max-w-7xl px-5 pb-24 pt-10 sm:pt-14">
      <div className="relative z-10">
        <div className="animate-rise flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            {eyebrow && <p className="mono-label">{eyebrow}</p>}
            <h1 className="mt-3 font-display text-3xl font-semibold sm:text-4xl">{title}</h1>
            {description && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                {description}
              </p>
            )}
          </div>
          {actions}
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}

export function Button({ variant = "primary", className = "", ...props }) {
  const base =
    "smooth inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45";
  const variants = {
    primary:
      "text-primary-foreground [background:var(--gradient-primary)] hover:brightness-110 panel-glow",
    ghost:
      "border border-border bg-surface text-foreground hover:bg-surface-2",
    subtle: "text-muted-foreground hover:text-foreground",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function Panel({ className = "", children }) {
  return <div className={`panel p-6 ${className}`}>{children}</div>;
}

export function Stat({ label, value, tone = "default" }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3">
      <p className="mono-label">{label}</p>
      <p
        className={`mt-1.5 font-display text-lg font-semibold tabular-nums ${
          tone === "primary" ? "text-primary" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}
