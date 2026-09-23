import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { FeedbackPanel } from "@/components/FeedbackPanel";
import { SiteHeader } from "@/components/SiteHeader";
import { api } from "@/lib/api";

export const Route = createFileRoute("/feedback")({
  head: () => ({
    meta: [
      { title: "Feedback · Personalized Networking Assistant" },
      {
        name: "description",
        content:
          "Rate generated conversation starters as useful or not useful and leave optional written feedback.",
      },
      { property: "og:title", content: "Feedback" },
      {
        property: "og:description",
        content: "Tell the assistant which conversation starters worked and which did not.",
      },
    ],
  }),
  component: FeedbackPage,
});

function FeedbackPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: () => api.getFeedback(),
  });

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Feedback</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Every rating is stored against the generated starter so the pipeline can be tuned.
        </p>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <FeedbackPanel entryId={null} />

          <div className="card-block p-6 lg:col-span-2">
            <h2 className="mb-4 font-display text-xl font-bold">Submitted Feedback</h2>
            {isLoading ? (
              <p className="text-sm text-ink-soft">Loading feedback…</p>
            ) : (data?.length ?? 0) === 0 ? (
              <p className="text-sm text-ink-soft">No feedback submitted yet.</p>
            ) : (
              <div className="divide-y divide-line">
                {data?.map((entry) => (
                  <div key={entry.id} className="flex flex-col gap-1 py-4">
                    <div className="flex items-center justify-between text-xs text-ink-soft">
                      <span>{new Date(entry.timestamp).toLocaleString()}</span>
                      <span
                        className={`rounded-full px-2.5 py-1 font-semibold ${
                          entry.rating === "useful"
                            ? "border border-mint/40 bg-mint/20 text-mint"
                            : "border border-coral/40 bg-coral/10 text-coral-deep"
                        }`}
                      >
                        {entry.rating === "useful" ? "Useful" : "Not useful"}
                      </span>
                    </div>
                    {entry.comment ? <p className="text-sm">{entry.comment}</p> : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
