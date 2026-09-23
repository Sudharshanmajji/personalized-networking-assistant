import type { EventTheme } from "@/lib/types";

const BAR_COLORS = ["bg-coral", "bg-grape", "bg-mint", "bg-sun", "bg-ink"];

interface ThemesCardProps {
  themes: EventTheme[];
  model?: string | undefined;
  loading?: boolean | undefined;
}

export function ThemesCard({ themes, model, loading }: ThemesCardProps) {
  return (
    <div className="card-block p-6">
      <div className="mb-4 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-grape/15 font-display text-sm font-bold text-grape">
          1
        </span>
        <h3 className="font-display font-bold">Detected Event Themes</h3>
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft">Running zero-shot classification…</p>
      ) : (
        <div className="space-y-4">
          {themes.map((theme, i) => (
            <div key={theme.label}>
              <div className="mb-1 flex justify-between text-sm font-medium">
                <span>{theme.label}</span>
                <span className="font-display font-bold">{(theme.score * 100).toFixed(1)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-line">
                <div
                  className={`animate-bar h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                  style={{ width: `${theme.score * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {model ? <p className="mt-4 text-xs text-ink-soft">Model: {model}</p> : null}
    </div>
  );
}
