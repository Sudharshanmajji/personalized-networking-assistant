interface StarterCardProps {
  starter: string | null;
  model?: string | undefined;
  loading?: boolean | undefined;
  onRegenerate: () => void;
}

export function StarterCard({ starter, model, loading, onRegenerate }: StarterCardProps) {
  return (
    <div className="rounded-3xl border-2 border-ink bg-ink p-6 text-paper shadow-block-coral">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-coral font-display text-sm font-bold text-primary-foreground">
          3
        </span>
        <h3 className="font-display font-bold">Conversation Starter</h3>
      </div>

      <p className="font-display text-xl leading-snug">
        {loading ? "Generating a personalized opener…" : starter ? `"${starter}"` : "—"}
      </p>

      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="flex-1 rounded-xl bg-sun px-4 py-3 font-display text-sm font-bold text-ink shadow-block-sm disabled:opacity-60"
        >
          Regenerate
        </button>
      </div>

      {model ? <p className="mt-4 text-xs text-paper/60">Model: {model}</p> : null}
    </div>
  );
}
