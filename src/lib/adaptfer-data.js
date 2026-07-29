// Mock data layer. Every export here is a stand-in for a future call to the
// Python/TensorFlow backend. Keep the shapes stable so swapping in real
// fetch() calls only touches this file.

export const EXPRESSIONS = [
  "Happy",
  "Sad",
  "Angry",
  "Fear",
  "Surprise",
  "Disgust",
  "Neutral",
];

const seededDist = (peakIndex, peak) => {
  const rest = (1 - peak) / (EXPRESSIONS.length - 1);
  return EXPRESSIONS.map((label, i) => ({
    label,
    value: i === peakIndex ? peak : Math.max(0.01, rest * (0.6 + ((i * 37) % 13) / 14)),
  }));
};

export function mockDistribution(peakLabel, peak = 0.72) {
  const idx = Math.max(0, EXPRESSIONS.indexOf(peakLabel));
  const raw = seededDist(idx, peak);
  const sum = raw.reduce((a, b) => a + b.value, 0);
  return raw.map((d) => ({ ...d, value: d.value / sum }));
}

export const PIPELINE = [
  { id: "generic", label: "Generic DeepFER", note: "pre-trained · 7 classes" },
  { id: "baseline", label: "Baseline", note: "measure on you" },
  { id: "calibration", label: "Calibration", note: "7 short captures" },
  { id: "adaptfer", label: "Personalized AdaptFER", note: "adapted head" },
  { id: "interaction", label: "Interaction", note: "hands-free control" },
];

export const OVERVIEW_CARDS = [
  {
    title: "7 Expression Classes",
    body: "Happy, Sad, Angry, Fear, Surprise, Disgust and Neutral, scored continuously.",
  },
  {
    title: "Personal Calibration",
    body: "A sixty-second capture pass encodes how you specifically express each class.",
  },
  {
    title: "Real-Time Recognition",
    body: "Frame-level inference with temporal smoothing and a stability estimate.",
  },
  {
    title: "Generic vs Personalized",
    body: "Side-by-side evaluation so the gain from adaptation is measurable, not assumed.",
  },
];

export const COMPARE_METRICS = [
  { label: "Accuracy", generic: "68.4%", adapt: "89.1%", delta: "+20.7", hint: "held-out personal set" },
  { label: "Avg. Confidence", generic: "0.61", adapt: "0.84", delta: "+0.23", hint: "mean top-1 softmax" },
  { label: "Prediction Stability", generic: "54%", adapt: "87%", delta: "+33", hint: "label persistence / 30 frames" },
  { label: "Expressions Improved", generic: "—", adapt: "6 / 7", delta: "+6", hint: "per-class F1 gain" },
];

export const PER_EXPRESSION = [
  { label: "Happy", generic: 0.82, adapt: 0.94 },
  { label: "Sad", generic: 0.61, adapt: 0.86 },
  { label: "Angry", generic: 0.66, adapt: 0.88 },
  { label: "Fear", generic: 0.48, adapt: 0.79 },
  { label: "Surprise", generic: 0.77, adapt: 0.93 },
  { label: "Disgust", generic: 0.43, adapt: 0.81 },
  { label: "Neutral", generic: 0.92, adapt: 0.91 },
];

export const INTERACTION_MODES = [
  { id: "music", label: "Music", note: "track control" },
  { id: "photos", label: "Photos", note: "gallery browse" },
  { id: "notes", label: "Notes", note: "card stack" },
  { id: "relax", label: "Relax", note: "breathing guide" },
];

export const EXPRESSION_COMMANDS = [
  { expression: "Surprise", action: "Next" },
  { expression: "Happy", action: "Select" },
  { expression: "Angry", action: "Back" },
  { expression: "Neutral", action: "Idle" },
];

export const NAV_ITEMS = [
  { to: "/", label: "Overview" },
  { to: "/baseline", label: "Baseline" },
  { to: "/calibration", label: "Calibration" },
  { to: "/adaptfer", label: "AdaptFER" },
  { to: "/compare", label: "Compare" },
  { to: "/lab", label: "Interaction Lab" },
];
