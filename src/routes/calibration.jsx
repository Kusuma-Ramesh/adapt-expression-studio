import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { EXPRESSIONS } from "../lib/adaptfer-data";
import { PageShell, Button, Panel } from "../components/adaptfer/ui.jsx";
import CameraPanel from "../components/adaptfer/CameraPanel.jsx";
import CalibrationProgress from "../components/adaptfer/CalibrationProgress.jsx";
import ExpressionStatus from "../components/adaptfer/ExpressionStatus.jsx";

export const Route = createFileRoute("/calibration")({
  head: () => ({
    meta: [
      { title: "Calibration — Teach AdaptFER how you express" },
      {
        name: "description",
        content:
          "A short seven-step capture pass that adapts facial-expression recognition to your personal expression patterns.",
      },
      { property: "og:title", content: "Calibration — AdaptFER" },
      {
        property: "og:description",
        content: "Hold each expression naturally while AdaptFER captures your personal samples.",
      },
    ],
  }),
  component: Calibration,
});

function Calibration() {
  const [index, setIndex] = useState(0);
  const [states, setStates] = useState({});
  const [phase, setPhase] = useState("idle"); // idle | countdown | capturing | done
  const [count, setCount] = useState(3);
  const [capture, setCapture] = useState(0);
  const tick = useRef(null);

  const current = EXPRESSIONS[index];
  const calibrated = Object.values(states).filter((s) => s === "done").length;

  useEffect(() => {
    if (phase !== "countdown") return undefined;
    setCount(3);
    tick.current = setInterval(() => {
      setCount((c) => {
        if (c <= 1) {
          clearInterval(tick.current);
          setPhase("capturing");
          return 0;
        }
        return c - 1;
      });
    }, 900);
    return () => clearInterval(tick.current);
  }, [phase]);

  useEffect(() => {
    if (phase !== "capturing") return undefined;
    setCapture(0);
    const id = setInterval(() => {
      setCapture((p) => {
        if (p >= 100) {
          clearInterval(id);
          setStates((s) => ({ ...s, [current]: "done" }));
          setIndex((i) => {
            const next = i + 1;
            if (next >= EXPRESSIONS.length) {
              setPhase("done");
              return i;
            }
            setPhase("countdown");
            return next;
          });
          return 100;
        }
        return p + 5;
      });
    }, 70);
    return () => clearInterval(id);
  }, [phase, current]);

  const reset = () => {
    setIndex(0);
    setStates({});
    setPhase("idle");
    setCapture(0);
  };

  return (
    <PageShell
      eyebrow="Stage 03 · Personalization"
      title="Teach AdaptFER how you express."
      description="Seven short captures. Each one anchors a class to your own facial signal instead of a population average."
      actions={
        phase === "done" ? (
          <div className="flex gap-3">
            <Link to="/adaptfer">
              <Button>Open AdaptFER Live</Button>
            </Link>
            <Button variant="ghost" onClick={reset}>
              Recalibrate
            </Button>
          </div>
        ) : (
          <Button onClick={() => setPhase("countdown")} disabled={phase !== "idle"}>
            {phase === "idle" ? "Start Calibration" : "Calibrating…"}
          </Button>
        )
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <CameraPanel
          label="Calibration Capture"
          status={
            phase === "capturing" ? "Capturing" : phase === "countdown" ? "Get ready" : phase === "done" ? "Complete" : "Standby"
          }
          active={phase === "capturing" || phase === "countdown"}
          overlay={
            <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
              {phase === "countdown" && (
                <span className="font-display text-7xl font-semibold text-primary tabular-nums">
                  {count}
                </span>
              )}
              {phase !== "done" && phase !== "idle" && (
                <div className="animate-rise">
                  <p className="font-display text-3xl font-semibold uppercase tracking-[0.18em]">
                    {current}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Show this expression naturally and hold.
                  </p>
                </div>
              )}
              {phase === "idle" && (
                <p className="text-sm text-muted-foreground">
                  Position your face inside the guide and start calibration.
                </p>
              )}
              {phase === "done" && (
                <p className="font-display text-xl font-semibold text-primary">
                  Personal profile ready
                </p>
              )}

              {phase === "capturing" && (
                <div className="absolute inset-x-8 bottom-8">
                  <div className="mb-2 flex justify-between">
                    <span className="mono-label">Capture progress</span>
                    <span className="font-mono text-[11px] text-primary">{capture}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full [background:var(--gradient-primary)]"
                      style={{ width: `${capture}%`, transition: "width 70ms linear" }}
                    />
                  </div>
                </div>
              )}
            </div>
          }
        />

        <div className="space-y-6">
          <Panel className="flex flex-col items-center">
            <CalibrationProgress
              current={calibrated}
              total={EXPRESSIONS.length}
              sublabel={
                phase === "done" ? "All classes anchored" : `Now capturing: ${current}`
              }
            />
          </Panel>

          <Panel>
            <p className="mono-label">Expression status</p>
            <div className="mt-4">
              <ExpressionStatus
                expressions={EXPRESSIONS}
                states={states}
                activeLabel={phase === "idle" || phase === "done" ? null : current}
              />
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
