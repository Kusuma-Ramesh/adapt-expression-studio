import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { EXPRESSIONS, mockDistribution } from "../lib/adaptfer-data";
import { PageShell, Button, Panel, Stat } from "../components/adaptfer/ui.jsx";
import CameraPanel from "../components/adaptfer/CameraPanel.jsx";
import ExpressionProbabilityBars from "../components/adaptfer/ExpressionProbabilityBars.jsx";
import ConfidenceIndicator from "../components/adaptfer/ConfidenceIndicator.jsx";

export const Route = createFileRoute("/baseline")({
  head: () => ({
    meta: [
      { title: "Baseline Test — AdaptFER" },
      {
        name: "description",
        content:
          "Measure how the generic DeepFER model performs on your own facial expressions before personalization.",
      },
      { property: "og:title", content: "Baseline Test — AdaptFER" },
      {
        property: "og:description",
        content: "Generic DeepFER baseline pass across all seven expression classes.",
      },
    ],
  }),
  component: Baseline,
});

function Baseline() {
  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [conf, setConf] = useState(0.42);
  const [history, setHistory] = useState([0.4, 0.52, 0.38, 0.61, 0.44]);
  const timer = useRef(null);

  const target = EXPRESSIONS[step];
  const dist = mockDistribution(target, running ? 0.4 + conf * 0.35 : 0.34);

  useEffect(() => {
    if (!running) return undefined;
    timer.current = setInterval(() => {
      const next = 0.35 + Math.random() * 0.45;
      setConf(next);
      setHistory((h) => [...h.slice(-23), next]);
    }, 700);
    return () => clearInterval(timer.current);
  }, [running]);

  useEffect(() => {
    if (!running) return undefined;
    const adv = setTimeout(() => {
      setStep((s) => {
        if (s + 1 >= EXPRESSIONS.length) {
          setRunning(false);
          setDone(true);
          return s;
        }
        return s + 1;
      });
    }, 3200);
    return () => clearTimeout(adv);
  }, [running, step]);

  const start = () => {
    setStep(0);
    setDone(false);
    setHistory([]);
    setRunning(true);
  };

  return (
    <PageShell
      eyebrow="Stage 02 · Generic model"
      title="Baseline: generic DeepFER on you"
      description="Run the untouched pre-trained model across all seven classes to establish a personal reference point. Values below are mock inference output."
      actions={
        <Button onClick={start} disabled={running}>
          {running ? "Test running…" : done ? "Run Baseline Again" : "Begin Baseline Test"}
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-4">
          <CameraPanel
            label="Baseline Capture"
            status={running ? "Recording" : done ? "Complete" : "Standby"}
            active={running}
            overlay={
              running ? (
                <div className="flex h-full flex-col justify-end p-6">
                  <div className="panel animate-rise inline-flex w-fit flex-col gap-1 px-5 py-3">
                    <span className="mono-label">Show</span>
                    <span className="font-display text-2xl font-semibold uppercase tracking-wide">
                      {target}
                    </span>
                    <span className="mt-1 font-mono text-[11px] text-muted-foreground">
                      Expression {step + 1} of {EXPRESSIONS.length}
                    </span>
                  </div>
                </div>
              ) : null
            }
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Current Expression" value={running ? target : done ? "—" : "Waiting"} />
            <Stat
              label="Confidence"
              value={running ? conf.toFixed(2) : "0.00"}
              tone="primary"
            />
            <Stat label="Live Signal" value={running ? "Locked" : "No stream"} />
          </div>

          <Panel>
            <div className="flex items-baseline justify-between">
              <p className="mono-label">Confidence history</p>
              <p className="font-mono text-[11px] text-muted-foreground">
                {history.length} samples
              </p>
            </div>
            <div className="mt-4 flex h-24 items-end gap-1">
              {(history.length ? history : Array(24).fill(0)).map((v, i) => (
                <div
                  key={i}
                  className="smooth flex-1 rounded-t-sm"
                  style={{
                    height: `${Math.max(4, v * 100)}%`,
                    background:
                      v > 0.65
                        ? "var(--gradient-primary)"
                        : "color-mix(in oklab, var(--foreground) 22%, transparent)",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 flex justify-between">
              <span className="mono-label">t-24</span>
              <span className="mono-label">now</span>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <ConfidenceIndicator value={running ? conf : done ? 0.61 : 0} label="Top-1 confidence" />
          </Panel>
          <Panel>
            <div className="mb-4 flex items-baseline justify-between">
              <p className="mono-label">Class probabilities</p>
              <p className="font-mono text-[11px] text-muted-foreground">softmax · mock</p>
            </div>
            <ExpressionProbabilityBars data={dist} />
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
