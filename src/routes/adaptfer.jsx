import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { EXPRESSIONS, mockDistribution } from "../lib/adaptfer-data";
import { PageShell, Panel, Stat } from "../components/adaptfer/ui.jsx";
import CameraPanel from "../components/adaptfer/CameraPanel.jsx";
import ExpressionProbabilityBars from "../components/adaptfer/ExpressionProbabilityBars.jsx";
import ConfidenceIndicator from "../components/adaptfer/ConfidenceIndicator.jsx";
import ModelToggle from "../components/adaptfer/ModelToggle.jsx";

export const Route = createFileRoute("/adaptfer")({
  head: () => ({
    meta: [
      { title: "AdaptFER Live — Personalized Recognition" },
      {
        name: "description",
        content:
          "Real-time personalized facial-expression recognition with generic and adapted model comparison.",
      },
      { property: "og:title", content: "AdaptFER Live — Personalized Recognition" },
      {
        property: "og:description",
        content: "Switch between generic DeepFER and your personalized AdaptFER model in real time.",
      },
    ],
  }),
  component: LiveScreen,
});

const CYCLE = ["Happy", "Neutral", "Surprise", "Sad", "Neutral", "Angry"];

function LiveScreen() {
  const [model, setModel] = useState("adaptfer");
  const [i, setI] = useState(0);
  const [jitter, setJitter] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setI((v) => (v + 1) % CYCLE.length);
      setJitter(Math.random() * 0.06);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const personalized = model === "adaptfer";
  const label = CYCLE[i];
  const confidence = (personalized ? 0.87 : 0.58) + jitter;
  const stability = personalized ? "88%" : "51%";
  const dist = mockDistribution(label, personalized ? 0.82 : 0.49);

  return (
    <PageShell
      eyebrow="Stage 04 · Live inference"
      title="AdaptFER live recognition"
      description="Personalized inference running against your calibration profile. Toggle the model to see how the adapted head changes the same signal."
      actions={<ModelToggle value={model} onChange={setModel} />}
    >
      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-4">
          <CameraPanel
            label={personalized ? "AdaptFER Stream" : "Generic DeepFER Stream"}
            status="Live"
            active
            overlay={
              <div className="flex h-full items-end justify-between gap-4 p-6">
                <div key={label + model} className="panel animate-rise px-5 py-3">
                  <span className="mono-label">
                    {personalized ? "Personalized prediction" : "Generic prediction"}
                  </span>
                  <p className="mt-1 font-display text-3xl font-semibold uppercase tracking-wide">
                    {label}
                  </p>
                </div>
                <span
                  className={`rounded-full border px-3 py-1.5 font-mono text-[11px] ${
                    personalized
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  {personalized ? "Calibration active" : "Calibration bypassed"}
                </span>
              </div>
            }
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Prediction" value={label} />
            <Stat label="Confidence" value={confidence.toFixed(2)} tone="primary" />
            <Stat label="Signal Stability" value={stability} />
          </div>
        </div>

        <div className="space-y-6">
          <Panel>
            <ConfidenceIndicator value={confidence} label="Top-1 confidence" />
            <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-5">
              <div>
                <p className="mono-label">Model</p>
                <p className="mt-1 text-sm">{personalized ? "AdaptFER v1" : "DeepFER generic"}</p>
              </div>
              <div>
                <p className="mono-label">Profile</p>
                <p className="mt-1 text-sm">
                  {personalized ? `${EXPRESSIONS.length}/7 classes` : "none"}
                </p>
              </div>
            </div>
          </Panel>

          <Panel>
            <div className="mb-4 flex items-baseline justify-between">
              <p className="mono-label">Class distribution</p>
              <p className="font-mono text-[11px] text-muted-foreground">live · mock</p>
            </div>
            <ExpressionProbabilityBars data={dist} highlight={label} />
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
