interface InputPanelProps {
  eventDescription: string;
  interest: string;
  loading: boolean;
  onEventDescriptionChange: (value: string) => void;
  onInterestChange: (value: string) => void;
  onSubmit: () => void;
}

export function InputPanel({
  eventDescription,
  interest,
  loading,
  onEventDescriptionChange,
  onInterestChange,
  onSubmit,
}: InputPanelProps) {
  return (
    <section className="card-block p-6 shadow-block-lg">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <label htmlFor="event" className="font-display text-sm font-semibold">
            Event Description
          </label>
          <textarea
            id="event"
            rows={3}
            value={eventDescription}
            onChange={(e) => onEventDescriptionChange(e.target.value)}
            placeholder="e.g. Cyber Security Summit — two days of threat intelligence and zero-trust talks."
            className="field-block mt-2 resize-none placeholder:text-ink-soft/60"
          />
        </div>
        <div>
          <label htmlFor="interest" className="font-display text-sm font-semibold">
            Your Interest
          </label>
          <input
            id="interest"
            value={interest}
            onChange={(e) => onInterestChange(e.target.value)}
            placeholder="e.g. Ethical Hacking"
            className="field-block mt-2 placeholder:text-ink-soft/60"
          />
          <div className="mt-4">
            <button
              onClick={onSubmit}
              disabled={loading}
              className="inline-flex w-full items-center gap-2 rounded-2xl bg-coral px-7 py-4 font-display text-lg font-bold text-primary-foreground shadow-block-sm transition-colors hover:bg-coral-deep disabled:opacity-60 md:w-auto"
            >
              {loading ? "Generating…" : "Generate Conversation Starter"}
              <span className="text-xl leading-none">→</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
