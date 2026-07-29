import { createFileRoute, Link } from "@tanstack/react-router";
import { PIPELINE, OVERVIEW_CARDS, EXPRESSIONS } from "../lib/adaptfer-data";
import { Button } from "../components/adaptfer/ui.jsx";
import CameraPanel from "../components/adaptfer/CameraPanel.jsx";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AdaptFER — Personalized Facial Expression Recognition" },
      {
        name: "description",
        content:
          "AdaptFER personalizes facial-expression recognition through lightweight user calibration on top of a generic DeepFER model.",
      },
      { property: "og:title", content: "AdaptFER — AI that adapts to the way you express" },
      {
        property: "og:description",
        content:
          "Baseline, calibrate and compare a personalized 7-class facial-expression recognition model.",
      },
    ],
  }),
  component: Overview,
});

function PipelineStage({ stage, index, last }) {
  return (
    <div className="flex flex-1 items-center gap-3">
      <div className="panel smooth w-full min-w-0 p-4 hover:panel-glow">
        <div className="flex items-center justify-between">
          <span className="mono-label">0{index + 1}</span>
          <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
        </div>
        <p className="mt-3 font-display text-sm font-semibold leading-tight">{stage.label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{stage.note}</p>
      </div>
      {!last && (
        <svg viewBox="0 0 24 8" className="hidden h-3 w-6 shrink-0 lg:block" aria-hidden="true">
          <path
            d="M0 4h20m0 0-4-3m4 3-4 3"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1"
            opacity="0.7"
          />
        </svg>
      )}
    </div>
  );
}

function Overview() {
  return (
    <main className="halo mx-auto max-w-7xl px-5 pb-24 pt-12 sm:pt-20">
      <div className="relative z-10 grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="animate-rise">
          <span className="mono-label rounded-full border border-border bg-surface px-3 py-1.5">
            Adaptive FER Research Platform
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] sm:text-5xl lg:text-6xl">
            AI that adapts to <span className="text-gradient">the way you express.</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            AdaptFER personalizes facial-expression recognition through lightweight user
            calibration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/calibration">
              <Button>Start Personalization</Button>
            </Link>
            <Link to="/baseline">
              <Button variant="ghost">Explore System</Button>
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
            {[
              ["Classes", "7"],
              ["Calibration", "~60s"],
              ["Adaptation", "on-device head"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="mono-label">{k}</p>
                <p className="mt-1 font-display text-lg font-semibold">{v}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-rise" style={{ animationDelay: "120ms" }}>
          <CameraPanel label="Signal Preview" status="Idle" active />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXPRESSIONS.map((e) => (
              <span
                key={e}
                className="rounded-lg border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground"
              >
                {e}
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="relative z-10 mt-20">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-xl font-semibold">System pipeline</h2>
          <p className="mono-label">generic → personalized</p>
        </div>
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-stretch">
          {PIPELINE.map((s, i) => (
            <PipelineStage key={s.id} stage={s} index={i} last={i === PIPELINE.length - 1} />
          ))}
        </div>
      </section>

      <section className="relative z-10 mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_CARDS.map((c) => (
          <div key={c.title} className="panel smooth p-5 hover:panel-glow">
            <p className="font-display text-sm font-semibold">{c.title}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
