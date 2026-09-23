import { createFileRoute } from "@tanstack/react-router";

import { HowItWorks } from "@/components/HowItWorks";
import { PipelineStrip } from "@/components/PipelineStrip";
import { SiteHeader } from "@/components/SiteHeader";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How It Works · Personalized Networking Assistant" },
      {
        name: "description",
        content:
          "The pipeline behind the assistant: user input, event theme analysis, Wikipedia context, AI generation and a personalized result.",
      },
      { property: "og:title", content: "How It Works" },
      {
        property: "og:description",
        content:
          "Input → theme analysis → external context → AI generation → personalized conversation starter.",
      },
    ],
  }),
  component: HowItWorksPage,
});

const STAGES = [
  {
    n: "01",
    title: "User Input",
    body: "You describe the event and name the professional interest you want to talk about.",
    api: "Collected in the dashboard form",
  },
  {
    n: "02",
    title: "Event Theme Analysis",
    body: "A zero-shot classifier scores candidate themes against the event description and returns confidence values.",
    api: "POST /analyze-event",
  },
  {
    n: "03",
    title: "External Context",
    body: "The named topic is looked up for a short factual summary, giving the generator something grounded to work with.",
    api: "POST /fact-check",
  },
  {
    n: "04",
    title: "AI Conversation Generation",
    body: "The event, interest, top themes and verified context are combined into a prompt for the text generator.",
    api: "POST /generate-conversation",
  },
  {
    n: "05",
    title: "Personalized Result",
    body: "One short, friendly, professional question you can actually open with — plus history and feedback capture.",
    api: "GET /history · POST /feedback",
  },
];

function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-paper font-body text-ink">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-5 py-8">
        <h1 className="font-display text-4xl font-bold tracking-tight">How It Works</h1>
        <p className="mt-3 max-w-xl text-lg text-ink-soft">
          Five stages turn a short description of an event into one conversation starter worth
          using.
        </p>

        <div className="mt-6">
          <PipelineStrip />
        </div>

        <div className="mt-8 space-y-4">
          {STAGES.map((stage) => (
            <div key={stage.n} className="card-block p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-grape/15 font-display font-bold text-grape">
                    {stage.n}
                  </span>
                  <h2 className="font-display text-lg font-bold">{stage.title}</h2>
                </div>
                <span className="rounded-full border border-line bg-paper/70 px-3 py-1 text-xs font-semibold text-ink-soft">
                  {stage.api}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-ink-soft">{stage.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <HowItWorks />
        </div>

        <section className="card-block mt-8 p-6">
          <h2 className="font-display text-xl font-bold">Technology</h2>
          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="font-display font-bold">Backend</p>
              <p className="text-ink-soft">FastAPI (Python), JSON file storage</p>
            </div>
            <div>
              <p className="font-display font-bold">NLP</p>
              <p className="text-ink-soft">Hugging Face Transformers · DistilBERT zero-shot</p>
            </div>
            <div>
              <p className="font-display font-bold">Generative AI</p>
              <p className="text-ink-soft">GPT-2 text generation</p>
            </div>
            <div>
              <p className="font-display font-bold">External Knowledge</p>
              <p className="text-ink-soft">Wikipedia API</p>
            </div>
            <div>
              <p className="font-display font-bold">This Frontend</p>
              <p className="text-ink-soft">
                Talks to the service over REST; set VITE_API_BASE_URL to switch from demo data to
                the live backend.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
