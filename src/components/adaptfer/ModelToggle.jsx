export default function ModelToggle({ value = "adaptfer", onChange = () => {} }) {
  const options = [
    { id: "generic", label: "Generic DeepFER" },
    { id: "adaptfer", label: "AdaptFER" },
  ];

  return (
    <div className="relative inline-flex rounded-xl border border-border bg-surface p-1">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => onChange(o.id)}
            className={`smooth relative rounded-lg px-4 py-2 text-xs sm:text-sm ${
              active
                ? "bg-surface-2 text-foreground panel-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
