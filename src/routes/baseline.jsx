import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

import { EXPRESSIONS } from "../lib/adaptfer-data";
import { predictGeneric } from "../api/adaptferApi";

import { PageShell, Button, Panel, Stat } from "../components/adaptfer/ui.jsx";

import CameraPanel from "../components/adaptfer/CameraPanel.jsx";
import ExpressionProbabilityBars from "../components/adaptfer/ExpressionProbabilityBars.jsx";
import ConfidenceIndicator from "../components/adaptfer/ConfidenceIndicator.jsx";

export const Route = createFileRoute("/baseline")({
  head: () => ({
    meta: [
      {
        title: "Baseline Test — AdaptFER",
      },
      {
        name: "description",
        content:
          "Measure how the generic DeepFER model performs on your facial expressions before personalization.",
      },
      {
        property: "og:title",
        content: "Baseline Test — AdaptFER",
      },
      {
        property: "og:description",
        content: "Generic DeepFER baseline pass across all seven expression classes.",
      },
    ],
  }),

  component: Baseline,
});

function Baseline() {
  const cameraRef = useRef(null);
  const intervalRef = useRef(null);

  const [running, setRunning] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  const [prediction, setPrediction] = useState(null);

  const [conf, setConf] = useState(0);

  const [history, setHistory] = useState([]);

  const [error, setError] = useState("");

  const [requestPending, setRequestPending] = useState(false);

  const target = EXPRESSIONS[step];

  const emptyDistribution = EXPRESSIONS.map((expression) => ({
    label: expression,
    value: 0,
  }));

  const dist = prediction
    ? EXPRESSIONS.map((expression) => ({
        label: expression,

        value: prediction.probabilities?.[expression.toLowerCase()] ?? 0,
      }))
    : emptyDistribution;

  async function captureAndPredict() {
    if (requestPending) {
      return;
    }

    try {
      setRequestPending(true);
      setError("");

      const imageBlob = await cameraRef.current?.captureFrame();

      if (!imageBlob) {
        throw new Error("Camera frame is not ready.");
      }

      const result = await predictGeneric(imageBlob);

      setPrediction(result);

      const confidence = Number(result.confidence) || 0;

      setConf(confidence);

      setHistory((previous) => [...previous.slice(-23), confidence]);
    } catch (err) {
      console.error("Baseline prediction error:", err);

      setError(err?.message || "Unable to get prediction.");
    } finally {
      setRequestPending(false);
    }
  }

  const start = () => {
    setStep(0);
    setDone(false);
    setPrediction(null);
    setConf(0);
    setHistory([]);
    setError("");
    setRunning(true);
  };

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    captureAndPredict();

    intervalRef.current = setInterval(captureAndPredict, 900);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [running, step]);

  useEffect(() => {
    if (!running) {
      return undefined;
    }

    const advanceTimer = setTimeout(() => {
      setStep((currentStep) => {
        if (currentStep + 1 >= EXPRESSIONS.length) {
          setRunning(false);
          setDone(true);

          return currentStep;
        }

        return currentStep + 1;
      });
    }, 5000);

    return () => {
      clearTimeout(advanceTimer);
    };
  }, [running, step]);

  return (
    <PageShell
      eyebrow="Stage 02 · Generic model"
      title="Baseline: generic DeepFER on you"
      description="Run the untouched generic DeepFER model across all seven expression classes to establish your personal baseline. Predictions below are produced by the live TensorFlow backend."
      actions={
        <Button onClick={start} disabled={running}>
          {running ? "Test running…" : done ? "Run Baseline Again" : "Begin Baseline Test"}
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-4">
          <CameraPanel
            ref={cameraRef}
            label="Baseline Capture"
            status={
              running ? (requestPending ? "Analyzing" : "Recording") : done ? "Complete" : "Standby"
            }
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
            <Stat label="Requested Expression" value={running ? target : done ? "—" : "Waiting"} />

            <Stat
              label="Detected Expression"
              value={prediction?.emotion ? prediction.emotion.toUpperCase() : "—"}
              tone="primary"
            />

            <Stat label="Confidence" value={prediction ? `${(conf * 100).toFixed(1)}%` : "0.0%"} />
          </div>

          {error && (
            <Panel>
              <p className="font-mono text-sm">Backend error: {error}</p>
            </Panel>
          )}

          <Panel>
            <div className="flex items-baseline justify-between">
              <p className="mono-label">Confidence history</p>

              <p className="font-mono text-[11px] text-muted-foreground">
                {history.length} samples
              </p>
            </div>

            <div className="mt-4 flex h-24 items-end gap-1">
              {(history.length ? history : Array(24).fill(0)).map((value, index) => (
                <div
                  key={index}
                  className="smooth flex-1 rounded-t-sm"
                  style={{
                    height: `${Math.max(4, value * 100)}%`,

                    background:
                      value > 0.65
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
            <ConfidenceIndicator value={conf} label="Top-1 confidence" />
          </Panel>

          <Panel>
            <div className="mb-4 flex items-baseline justify-between">
              <p className="mono-label">Class probabilities</p>

              <p className="font-mono text-[11px] text-muted-foreground">
                softmax · Generic DeepFER
              </p>
            </div>

            <ExpressionProbabilityBars data={dist} />
          </Panel>

          <Panel>
            <p className="mono-label">Live inference</p>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Backend</span>

                <span className="font-mono text-sm">
                  {error ? "Error" : prediction ? "Connected" : "Waiting"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Model</span>

                <span className="font-mono text-sm">{prediction?.model ?? "Generic DeepFER"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Prediction</span>

                <span className="font-mono text-sm uppercase">{prediction?.emotion ?? "—"}</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
