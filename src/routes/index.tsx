import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ContextCard } from "@/components/ContextCard";
import { FeedbackPanel } from "@/components/FeedbackPanel";
import { HistoryList } from "@/components/HistoryList";
import { HowItWorks } from "@/components/HowItWorks";
import { InputPanel } from "@/components/InputPanel";
import { PipelineStrip } from "@/components/PipelineStrip";
import { SiteHeader } from "@/components/SiteHeader";
import { StarterCard } from "@/components/StarterCard";
import { ThemesCard } from "@/components/ThemesCard";
import { api } from "@/lib/api";
import { readHistory, writeHistoryEntry } from "@/lib/local-store";
import type { EventTheme, FactCheckResponse, HistoryEntry } from "@/lib/types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard · Personalized Networking Assistant" },
      {
        name: "description",
        content:
          "Generate personalized professional networking conversation starters from an event description and your interest.",
      },
      { property: "og:title", content: "Personalized Networking Assistant" },
      {
        property: "og:description",
        content:
          "AI-powered conversation starters for meaningful professional networking — event themes, verified context and a ready-to-use opener.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const [eventDescription, setEventDescription] = useState(
    "Cyber Security Summit — a two-day conference on threat intelligence, zero-trust architecture and ethical hacking.",
  );
  const [interest, setInterest] = useState("Ethical Hacking");

  const [themes, setThemes] = useState<EventTheme[]>([]);
  const [classifierModel, setClassifierModel] = useState<string>();
  const [context, setContext] = useState<FactCheckResponse | null>(null);
  const [starter, setStarter] = useState<string | null>(null);
  const [generatorModel, setGeneratorModel] = useState<string>();
  const [entryId, setEntryId] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasResult, setHasResult] = useState(false);

  async function run(nextAttempt: number) {
    if (!eventDescription.trim() || !interest.trim()) {
      setError("Add both an event description and your interest.");
      return;
    }
    setError(null);
    setLoading(true);
    setHasResult(true);
    try {
      const analysis = await api.analyzeEvent({
        event_description: eventDescription,
        interest,
      });
      setThemes(analysis.themes);
      setClassifierModel(analysis.model);

      const verified = await api.factCheck(interest);
      setContext(verified);

      const generated = await api.generateConversation(
        {
          event_description: eventDescription,
          interest,
          themes: analysis.themes,
          context: verified,
        },
        nextAttempt,
      );
      setStarter(generated.conversation_starter);
      setGeneratorModel(generated.model);

      const entry: HistoryEntry = {
        id: `gen-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event_description: eventDescription,
        interest,
        themes: analysis.themes,
        context: verified,
        conversation_starter: generated.conversation_starter,
      };
      setEntryId(entry.id);
      setHistory(writeHistoryEntry(entry));
    } catch {
      setError("Could not reach the analysis service. Check the backend and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleGenerate() {
    setAttempt(0);
    void run(0);
  }

  function handleRegenerate() {
    const next = attempt + 1;
    setAttempt(next);
    void run(next);
  }

  const recent = (history.length > 0 ? history : readHistory()).slice(0, 3);

  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <SiteHeader />

      <main className="mx-auto max-w-6xl px-5 py-8">
        <section className="relative">
          <div className="animate-floaty absolute -top-2 right-6 size-24 rounded-full bg-sun/40" />
          <div className="absolute left-1/2 top-16 size-10 rounded-full bg-grape/20" />
          <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-bold leading-[0.95] tracking-tight">
            Start the <span className="text-coral">right</span> conversation.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            AI-powered conversation starters for meaningful professional networking. Drop in an
            event and your interest — we handle the rest.
          </p>
        </section>

        <section className="mt-8">
          <PipelineStrip />
        </section>

        <div className="mt-8">
          <InputPanel
            eventDescription={eventDescription}
            interest={interest}
            loading={loading}
            onEventDescriptionChange={setEventDescription}
            onInterestChange={setInterest}
            onSubmit={handleGenerate}
          />
          {error ? (
            <p className="mt-3 text-sm font-semibold text-coral-deep">{error}</p>
          ) : null}
        </div>

        {hasResult ? (
          <section className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold">Results</h2>
              <span className="text-xs font-semibold text-ink-soft">
                {loading ? "Running pipeline…" : "Pipeline complete"}
              </span>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              <ThemesCard
                themes={themes}
                model={classifierModel}
                loading={loading && themes.length === 0}
              />
              <ContextCard context={context} loading={loading && !context} />
              <StarterCard
                starter={starter}
                model={generatorModel}
                loading={loading}
                onRegenerate={handleRegenerate}
              />
            </div>
          </section>
        ) : null}

        <section className="mt-10 grid gap-5 lg:grid-cols-3">
          <div className="card-block p-6 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold">Conversation History</h3>
              <Link to="/history" className="text-xs font-semibold text-grape hover:underline">
                View all
              </Link>
            </div>
            <HistoryList entries={recent} />
          </div>

          <FeedbackPanel entryId={entryId} />
        </section>

        <div className="mt-10">
          <HowItWorks />
        </div>

        <footer className="mt-10 pb-6 text-center text-xs text-ink-soft">
          Frontend ready to connect to FastAPI REST endpoints (POST /analyze-event, /fact-check,
          /generate-conversation, /feedback · GET /history, /feedback)
        </footer>
      </main>
    </div>
  );
}
