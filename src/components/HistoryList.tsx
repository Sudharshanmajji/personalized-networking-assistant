import type { HistoryEntry } from "@/lib/types";

function formatTimestamp(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface HistoryListProps {
  entries: HistoryEntry[];
  loading?: boolean | undefined;
  detailed?: boolean | undefined;
}

export function HistoryList({ entries, loading, detailed }: HistoryListProps) {
  if (loading) {
    return <p className="text-sm text-ink-soft">Loading history…</p>;
  }

  if (entries.length === 0) {
    return <p className="text-sm text-ink-soft">No conversation starters generated yet.</p>;
  }

  return (
    <div className="divide-y divide-line">
      {entries.map((entry) => (
        <div key={entry.id} className="flex flex-col gap-1 py-4">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-soft">
            <span>{formatTimestamp(entry.timestamp)}</span>
            <span className="font-semibold">
              {entry.event_description.length > 60
                ? `${entry.event_description.slice(0, 60)}…`
                : entry.event_description}
            </span>
          </div>
          <p className="text-sm font-medium">
            Interest: {entry.interest} · Themes: {entry.themes.map((t) => t.label).join(", ")}
          </p>
          <p className="text-sm text-ink-soft">"{entry.conversation_starter}"</p>
          {detailed ? (
            <p className="mt-1 text-xs text-ink-soft">
              Context: {entry.context.topic} · Source: {entry.context.source}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
