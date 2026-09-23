import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { HistoryList } from "@/components/HistoryList";
import { SiteHeader } from "@/components/SiteHeader";
import { api } from "@/lib/api";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History · Personalized Networking Assistant" },
      {
        name: "description",
        content:
          "Every generated networking conversation starter with its timestamp, event, interest and detected themes.",
      },
      { property: "og:title", content: "Conversation History" },
      {
        property: "og:description",
        content: "Past events, interests, detected themes and generated conversation starters.",
      },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: () => api.getHistory(),
  });

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">Conversation History</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Every generated starter, with the event, your interest, the detected themes and the
          external context used.
        </p>

        <div className="card-block mt-8 p-6">
          <HistoryList entries={data ?? []} loading={isLoading} detailed />
        </div>
      </main>
    </div>
  );
}
