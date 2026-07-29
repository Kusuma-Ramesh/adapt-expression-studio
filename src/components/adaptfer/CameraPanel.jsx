/**
 * CameraPanel — replaceable webcam surface.
 * Today it renders a stylized placeholder. To integrate a real stream later,
 * swap the inner <div> for a <video ref={...} autoPlay muted playsInline />
 * fed by navigator.mediaDevices.getUserMedia — the chrome stays identical.
 */
export default function CameraPanel({
  label = "Camera Feed",
  status = "Standby",
  active = false,
  overlay = null,
  corners = true,
  className = "",
}) {
  return (
    <div
      className={`panel relative aspect-[4/3] w-full overflow-hidden ${
        active ? "panel-glow" : ""
      } ${className}`}
    >
      <div className="grid-field absolute inset-0 opacity-70" />
      <div className="absolute inset-0 [background:radial-gradient(70%_60%_at_50%_45%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_75%)]" />

      {active && (
        <div className="animate-scan absolute inset-x-0 top-0 h-16 [background:linear-gradient(to_bottom,transparent,color-mix(in_oklab,var(--primary)_22%,transparent),transparent)]" />
      )}

      {/* face silhouette guide */}
      <svg
        viewBox="0 0 200 200"
        className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 opacity-40"
        fill="none"
        aria-hidden="true"
      >
        <ellipse
          cx="100"
          cy="100"
          rx="56"
          ry="72"
          stroke="var(--color-primary)"
          strokeWidth="1"
          strokeDasharray="4 7"
        />
        <path d="M100 40v120M44 100h112" stroke="var(--color-grid)" strokeWidth="1" />
        {[
          [78, 88],
          [122, 88],
          [100, 112],
          [82, 132],
          [118, 132],
          [100, 60],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.4" fill="var(--color-primary)" opacity="0.9" />
        ))}
      </svg>

      {corners &&
        [
          "left-4 top-4 border-l border-t",
          "right-4 top-4 border-r border-t",
          "left-4 bottom-4 border-l border-b",
          "right-4 bottom-4 border-r border-b",
        ].map((pos) => (
          <span
            key={pos}
            className={`absolute h-5 w-5 rounded-[3px] border-primary/60 ${pos}`}
          />
        ))}

      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4">
        <span className="mono-label">{label}</span>
        <span className="flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-1">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              active ? "animate-status bg-primary" : "bg-muted-foreground"
            }`}
          />
          <span className="mono-label !text-[10px]">{status}</span>
        </span>
      </div>

      {overlay && <div className="absolute inset-0 z-10">{overlay}</div>}
    </div>
  );
}
