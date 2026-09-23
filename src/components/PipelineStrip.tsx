const STAGES = [
  { label: "User Input", className: "bg-ink text-paper" },
  { label: "Theme Analysis", className: "bg-grape/15 text-grape border border-grape/30" },
  { label: "Wikipedia Context", className: "bg-mint/15 text-mint border border-mint/30" },
  { label: "GPT-2 Generation", className: "bg-sun/25 text-ink border border-sun/50" },
  { label: "Personalized Result", className: "bg-coral text-primary-foreground" },
];

export function PipelineStrip() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
      {STAGES.map((stage, i) => (
        <span key={stage.label} className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1.5 ${stage.className}`}>{stage.label}</span>
          {i < STAGES.length - 1 ? <span className="text-ink-soft">→</span> : null}
        </span>
      ))}
    </div>
  );
}
