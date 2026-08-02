import { useEffect, useState } from "react";
import { getResults } from "../api/adaptferApi";
import { createFileRoute } from "@tanstack/react-router";
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
        Confusion matrix visualization will be integrated in a future update.
      </p>
    </Panel>
  );
}

function Compare() {

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function loadResults() {

      try {

        const data = await getResults();

        console.log("Results:", data);

        setResults(data);

      } catch (err) {

        console.error(err);

        setError(err.message);

      } finally {

        setLoading(false);

      }

    }

    loadResults();

  }, []);

  if (loading) {

    return (
      <PageShell
        eyebrow="Stage 05 · Evaluation"
        title="Loading Results..."
        description="Fetching experiment results from backend..."
      />
    );

  }

  if (error) {

    return (
      <PageShell
        eyebrow="Stage 05 · Evaluation"
        title="Backend Error"
        description={error}
      />
    );

  }
  return (
    <PageShell
      eyebrow="Stage 05 · Evaluation"
      title="Generic DeepFER vs Personalized AdaptFER"
      description="Evaluation results comparing Generic DeepFER and Personalized AdaptFER on the personal test dataset."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Generic Accuracy"
          value={`${(results.generic.accuracy * 100).toFixed(2)}%`}
          sub="Before Personalization"
        />

        <MetricCard
          label="AdaptFER Accuracy"
          value={`${(results.adaptfer.accuracy * 100).toFixed(2)}%`}
          delta={`+${results.comparison.accuracy_improvement_percentage_points.toFixed(2)}%`}
          sub="After Personalization"
        />

        <MetricCard
          label="Average Confidence"
          value={`${(results.adaptfer.average_confidence * 100).toFixed(2)}%`}
          sub={`Generic ${(results.generic.average_confidence * 100).toFixed(2)}%`}
        />

        <MetricCard
          label="Error Reduction"
          value={`${(results.comparison.relative_error_reduction * 100).toFixed(2)}%`}
          sub="Relative Error Reduction"
        />
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
          <div className="mt-6 flex items-end gap-3">
            {Object.entries(results.per_emotion).map(([emotion, values]) => (
              <div key={emotion} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center gap-1" style={{ height: 180 }}>
                  <div
                    className="w-1/3 rounded-t-sm bg-muted-foreground/50"
                    style={{
                      height: `${values.generic_recall * 180}px`,
                    }}
                  />

                  <div
                    className="w-1/3 rounded-t-sm [background:var(--gradient-primary)]"
                    style={{
                      height: `${values.adaptfer_recall * 180}px`,
                    }}
                  />
                </div>

                <span className="mono-label !text-[9px]">{emotion.slice(0, 4).toUpperCase()}</span>
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
              {Object.entries(results.per_emotion).map(([emotion, values]) => {
                const change = values.adaptfer_recall - values.generic_recall;

                return (
                  <tr key={emotion} className="border-b border-border/60 last:border-0">
                    <td className="py-2.5">{emotion}</td>

                    <td className="py-2.5 font-mono text-xs text-muted-foreground tabular-nums">
                      {values.generic_recall.toFixed(2)}
                    </td>

                    <td className="py-2.5 font-mono text-xs tabular-nums">
                      {values.adaptfer_recall.toFixed(2)}
                    </td>

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
