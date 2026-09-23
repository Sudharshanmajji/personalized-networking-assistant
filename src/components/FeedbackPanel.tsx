import { useState } from "react";

import { api } from "@/lib/api";

interface FeedbackPanelProps {
  entryId: string | null;
}

export function FeedbackPanel({ entryId }: FeedbackPanelProps) {
  const [rating, setRating] = useState<"useful" | "not_useful" | null>(null);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit() {
    if (!rating) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      await api.postFeedback({ entry_id: entryId, rating, comment: comment.trim() || undefined });
      setStatus("sent");
      setComment("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="card-block p-6">
      <h3 className="mb-4 font-display text-xl font-bold">Your Feedback</h3>
      <p className="mb-3 text-sm text-ink-soft">Was this starter useful?</p>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setRating("useful")}
          className={`rounded-xl border-2 py-3 font-display font-bold ${
            rating === "useful"
              ? "border-mint bg-mint text-ink"
              : "border-mint bg-mint/20 text-mint"
          }`}
        >
          Useful
        </button>
        <button
          onClick={() => setRating("not_useful")}
          className={`rounded-xl border-2 py-3 font-display font-bold ${
            rating === "not_useful"
              ? "border-coral bg-coral text-primary-foreground"
              : "border-coral/40 bg-coral/10 text-coral-deep"
          }`}
        >
          Not useful
        </button>
      </div>
      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Optional notes for the model…"
        className="field-block mt-4 resize-none placeholder:text-ink-soft/60"
      />
      <button
        onClick={submit}
        disabled={status === "sending"}
        className="mt-3 w-full rounded-xl bg-ink py-3 font-display font-bold text-paper disabled:opacity-60"
      >
        {status === "sending" ? "Submitting…" : "Submit Feedback"}
      </button>
      {status === "sent" ? (
        <p className="mt-3 text-sm font-semibold text-mint">Thanks — feedback recorded.</p>
      ) : null}
      {status === "error" ? (
        <p className="mt-3 text-sm font-semibold text-coral-deep">
          Pick Useful or Not useful first.
        </p>
      ) : null}
    </div>
  );
}
