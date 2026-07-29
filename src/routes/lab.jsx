import { useEffect, useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { INTERACTION_MODES, EXPRESSION_COMMANDS } from "../lib/adaptfer-data";
import { PageShell, Button, Panel, Stat } from "../components/adaptfer/ui.jsx";
import CameraPanel from "../components/adaptfer/CameraPanel.jsx";

export const Route = createFileRoute("/lab")({
  head: () => ({
    meta: [
      { title: "Interaction Lab — Hands-free control with AdaptFER" },
      {
        name: "description",
        content:
          "Map personalized facial expressions to interaction commands and demonstrate hands-free control across four demo modes.",
      },
      { property: "og:title", content: "Interaction Lab — AdaptFER" },
      {
        property: "og:description",
        content: "Surprise to advance, Happy to select, Angry to go back — expression-driven UI control.",
      },
    ],
  }),
  component: InteractionLab,
});

const CONTENT = {
  music: ["Nocturne in Static", "Low Orbit", "Paper Machines", "Slow Telemetry"],
  photos: ["Coastline 01", "Studio Light", "Night Transit", "Grain Test"],
  notes: ["Calibration notes", "Model deltas", "Session log", "Next steps"],
  relax: ["Inhale · 4s", "Hold · 4s", "Exhale · 6s", "Rest · 2s"],
};

function InteractionLab() {
  const [mode, setMode] = useState("music");
  const [index, setIndex] = useState(0);
  const [detected, setDetected] = useState("Neutral");
  const [hold, setHold] = useState(0);
  const [action, setAction] = useState("Idle");
  const [selected, setSelected] = useState(null);
  const holdRef = useRef(null);

  const items = CONTENT[mode];
  const confidence = detected === "Neutral" ? 0.72 : 0.88;

  useEffect(() => () => clearInterval(holdRef.current), []);

  const trigger = (expression) => {
    clearInterval(holdRef.current);
    setDetected(expression);
    setSelected(null);
    setHold(0);
    holdRef.current = setInterval(() => {
      setHold((h) => {
        if (h >= 100) {
          clearInterval(holdRef.current);
          commit(expression);
          return 100;
        }
        return h + 10;
      });
    }, 60);
  };

  const commit = (expression) => {
    const map = EXPRESSION_COMMANDS.find((c) => c.expression === expression);
    setAction(map ? map.action : "Idle");
    if (expression === "Surprise") setIndex((i) => (i + 1) % items.length);
    if (expression === "Angry") setIndex((i) => (i - 1 + items.length) % items.length);
    if (expression === "Happy") setSelected(items[index]);
    setTimeout(() => {
      setHold(0);
      setDetected("Neutral");
      setAction("Idle");
    }, 900);
  };

  return (
    <PageShell
      eyebrow="Stage 06 · Applied"
      title="Interaction Lab"
      description="Personalized expressions become deliberate interaction commands. These mappings are control gestures, not interpretations of what the emotions mean."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INTERACTION_MODES.map((m) => {
          const active = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setIndex(0);
                setSelected(null);
              }}
              className={`panel smooth p-5 text-left ${
                active ? "panel-glow" : "hover:bg-surface-2"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-sm font-semibold">{m.label}</p>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    active ? "animate-status bg-primary" : "bg-muted-foreground/50"
                  }`}
                />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{m.note}</p>
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <CameraPanel
            label="Interaction Stream"
            status={hold > 0 ? "Holding" : "Listening"}
            active
            overlay={
              <div className="flex h-full flex-col justify-between p-6">
                <div className="self-end rounded-full border border-primary/35 bg-primary/10 px-3 py-1.5 font-mono text-[11px] text-primary">
                  {mode.toUpperCase()} · item {index + 1}/{items.length}
                </div>
                <div>
                  <div className="panel inline-flex flex-col px-5 py-3">
                    <span className="mono-label">Detected</span>
                    <span className="font-display text-2xl font-semibold uppercase">
                      {detected}
                    </span>
                  </div>
                  <div className="mt-4 max-w-xs">
                    <div className="mb-1.5 flex justify-between">
                      <span className="mono-label">Hold progress</span>
                      <span className="font-mono text-[11px] text-primary">{hold}%</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full [background:var(--gradient-primary)]"
                        style={{ width: `${hold}%`, transition: "width 60ms linear" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            }
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Detected expression" value={detected} />
            <Stat label="Confidence" value={confidence.toFixed(2)} tone="primary" />
            <Stat label="Current action" value={action} />
          </div>

          <Panel>
            <p className="mono-label">Simulate expression</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {EXPRESSION_COMMANDS.map((c) => (
                <Button
                  key={c.expression}
                  variant={c.expression === "Neutral" ? "ghost" : "ghost"}
                  onClick={() => trigger(c.expression)}
                >
                  {c.expression}
                  <span className="font-mono text-[11px] text-muted-foreground">→ {c.action}</span>
                </Button>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Mock trigger buttons stand in for live inference. The real build fires these from the
              personalized model stream.
            </p>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel>
            <p className="mono-label">Expression controls</p>
            <div className="mt-4 space-y-2">
              {EXPRESSION_COMMANDS.map((c) => (
                <div
                  key={c.expression}
                  className={`smooth flex items-center justify-between rounded-lg border px-4 py-3 ${
                    detected === c.expression
                      ? "border-primary/40 bg-primary/10"
                      : "border-border bg-surface"
                  }`}
                >
                  <span className="text-sm">{c.expression}</span>
                  <span className="font-mono text-xs text-muted-foreground">→ {c.action}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <div className="flex items-baseline justify-between">
              <p className="mono-label">{mode} surface</p>
              {selected && (
                <span className="font-mono text-[11px] text-primary">selected</span>
              )}
            </div>
            <div className="mt-4 space-y-2">
              {items.map((item, i) => (
                <div
                  key={item}
                  className={`smooth rounded-lg border px-4 py-3 text-sm ${
                    i === index
                      ? "border-primary/40 bg-surface-2 text-foreground panel-glow"
                      : "border-border bg-surface text-muted-foreground"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{item}</span>
                    {selected === item && (
                      <span className="font-mono text-[11px] text-primary">active</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </PageShell>
  );
}
