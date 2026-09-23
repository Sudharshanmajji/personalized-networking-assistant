const STEPS = [
  { n: "01", title: "User Input", detail: "Event + interest" },
  { n: "02", title: "Theme Analysis", detail: "DistilBERT zero-shot" },
  { n: "03", title: "External Context", detail: "Wikipedia API" },
  { n: "04", title: "AI Generation", detail: "GPT-2" },
  { n: "05", title: "Personalized Result", detail: "Your starter" },
];

export function HowItWorks() {
  return (
    <section className="rounded-3xl border-2 border-ink bg-grape p-6 text-paper shadow-block-lg md:p-8">
      <h2 className="mb-5 font-display text-2xl font-bold">How It Works</h2>
      <div className="grid gap-3 text-sm sm:grid-cols-5">
        {STEPS.map((step) => (
          <div key={step.n} className="rounded-2xl bg-paper/10 p-4">
            <p className="font-display font-bold text-sun">{step.n}</p>
            <p className="mt-1 font-semibold">{step.title}</p>
            <p className="mt-1 text-xs text-paper/70">{step.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
