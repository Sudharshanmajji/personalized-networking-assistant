import type { FactCheckResponse } from "@/lib/types";

interface ContextCardProps {
  context: FactCheckResponse | null;
  loading?: boolean | undefined;
}

export function ContextCard({ context, loading }: ContextCardProps) {
  return (
    <div className="card-block p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-mint/15 font-display text-sm font-bold text-mint">
          2
        </span>
        <h3 className="font-display font-bold">Verified Context</h3>
      </div>

      {loading || !context ? (
        <p className="text-sm text-ink-soft">Fetching external context…</p>
      ) : (
        <div className="rounded-2xl border border-line bg-paper/70 p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-display font-bold">{context.topic}</p>
            {context.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-mint/40 bg-mint/20 px-2.5 py-1 text-xs font-semibold text-mint">
                <span className="size-1.5 rounded-full bg-mint" /> Verified
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full border border-sun/50 bg-sun/25 px-2.5 py-1 text-xs font-semibold text-ink">
                Unverified
              </span>
            )}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{context.summary}</p>
          <p className="mt-3 text-xs font-semibold text-ink-soft">Source: {context.source}</p>
        </div>
      )}
    </div>
  );
}
