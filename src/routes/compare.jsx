import { createFileRoute } from "@tanstack/react-router";
import { COMPARE_METRICS, PER_EXPRESSION } from "../lib/adaptfer-data";
import { PageShell, Panel } from "../components/adaptfer/ui.jsx";
import MetricCard from "../components/adaptfer/MetricCard.jsx";

export const Route = createFileRoute("/compare")({
  head: () => ({
    meta: [
      { title: "Evaluation — Generic DeepFER vs AdaptFER" },
      {
        name: "description",
        content:
          "Model evaluation dashboard comparing generic DeepFER against the personalized AdaptFER model per expression class.",
      },
      { property: "og:title", content: "Evaluation — Generic DeepFER vs AdaptFER" },
      {
        property: "og:description",
        content: "Accuracy, confidence, stability and per-class deltas after personalization.",
      },
    ],
  }),
  component: Compare,
});

function ConfusionMatrix({ title, seedShift = 0, tone = "muted" }) {
  const n = 7;
  return (
    <Panel>
      <div className="flex items-baseline justify-between">
        <p className="font-display text-sm font-semibold">{title}</p>
        <span className="mono-label">7 × 7</span>
      </div>
      <div className="mt-4 grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {Array.from({ length: n * n }).map((_, k) => {
          const row = Math.floor(k / n);
          const col = k % n;
          const diag = row === col;
          const noise = ((row * 13 + col * 7 + seedShift) % 9) / 40;
          const v = diag ? (tone === "primary" ? 0.92 : 0.66) - noise / 3 : noise;
          return (
            <div
              key={k}
              className="aspect-square rounded-[3px]"
              style={{
                background:
                  tone === "primary"
                    ? `color-mix(in oklab, var(--primary) ${v * 100}%, var(--muted))`
                    : `color-mix(in oklab, var(--accent) ${v * 100}%, var(--muted))`,
              }}
            />
          );
        })}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        Placeholder heatmap — replaced by the backend confusion matrix export.
      </p>
    </Panel>
  );
}

function Compare() {
  return (
    <PageShell
      eyebrow="Stage 05 · Evaluation"
      title="Generic DeepFER vs Personalized AdaptFER"
      description="Held-out evaluation on the personal test split. All figures are mock experiment output pending the TensorFlow evaluation run."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {COMPARE_METRICS.map((m) => (
          <MetricCard
            key={m.label}
            label={m.label}
            value={m.adapt}
            delta={m.delta}
            sub={`generic ${m.generic}`}
            hint={m.hint}
          />
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <Panel>
          <div className="flex items-baseline justify-between">
            <p className="font-display text-sm font-semibold">Per-class F1</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <span className="h-2 w-2 rounded-sm bg-muted-foreground" /> Generic
              </span>
              <span className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
                <span className="h-2 w-2 rounded-sm bg-primary" /> AdaptFER
              </span>
            </div>
          </div>
          <div className="mt-6 flex h-56 items-end gap-3">
            {PER_EXPRESSION.map((e) => (
              <div key={e.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-full w-full items-end justify-center gap-1">
                  <div
                    className="w-1/3 rounded-t-sm bg-muted-foreground/50 smooth"
                    style={{ height: `${e.generic * 100}%` }}
                  />
                  <div
                    className="w-1/3 rounded-t-sm smooth [background:var(--gradient-primary)]"
                    style={{
                      height: `${e.adapt * 100}%`,
                      boxShadow: "0 0 14px color-mix(in oklab, var(--primary) 40%, transparent)",
                    }}
                  />
                </div>
                <span className="mono-label !text-[9px]">{e.label.slice(0, 4)}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="overflow-x-auto">
          <p className="font-display text-sm font-semibold">Expression breakdown</p>
          <table className="mt-4 w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Expression", "Generic", "AdaptFER", "Change"].map((h) => (
                  <th key={h} className="mono-label pb-2 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PER_EXPRESSION.map((e) => {
                const change = e.adapt - e.generic;
                return (
                  <tr key={e.label} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5">{e.label}</td>
                    <td className="py-2.5 font-mono text-xs text-muted-foreground tabular-nums">
                      {e.generic.toFixed(2)}
                    </td>
                    <td className="py-2.5 font-mono text-xs tabular-nums">{e.adapt.toFixed(2)}</td>
                    <td
                      className={`py-2.5 font-mono text-xs tabular-nums ${
                        change > 0 ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {change > 0 ? "+" : ""}
                      {change.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ConfusionMatrix title="Generic Confusion Matrix" seedShift={0} />
        <ConfusionMatrix title="AdaptFER Confusion Matrix" seedShift={3} tone="primary" />
      </div>
    </PageShell>
  );
}
