/**
 * Deterministic demo/mock implementations of the FastAPI pipeline.
 * Used whenever VITE_API_BASE_URL is not configured, so the whole UI can be
 * demonstrated before the Python backend is connected.
 */
import type {
  AnalyzeEventRequest,
  AnalyzeEventResponse,
  EventTheme,
  FactCheckResponse,
  GenerateConversationRequest,
  GenerateConversationResponse,
} from "./types";

const THEME_KEYWORDS: Record<string, string[]> = {
  "Cyber Security": ["cyber", "security", "hacking", "threat", "zero-trust", "malware", "infosec"],
  Technology: ["tech", "software", "engineering", "cloud", "platform", "developer", "data"],
  "Artificial Intelligence": ["ai", "machine learning", "ml", "genai", "llm", "model", "neural"],
  Healthcare: ["health", "clinical", "medical", "patient", "hospital", "biotech"],
  Fintech: ["fintech", "payments", "banking", "finance", "compliance", "regtech"],
  Sustainability: ["climate", "sustainab", "carbon", "energy", "green"],
  Startup: ["startup", "founder", "venture", "seed", "pitch"],
  Design: ["design", "ux", "product design", "brand", "creative"],
  Education: ["education", "university", "student", "campus", "learning"],
  Marketing: ["marketing", "growth", "brand", "campaign", "seo"],
  Networking: ["summit", "conference", "meetup", "forum", "mixer", "networking", "expo"],
  Innovation: ["innovation", "future", "emerging", "research", "roadmap"],
};

const CONTEXT_SUMMARIES: Record<string, string> = {
  "ethical hacking":
    "Ethical hacking is the authorized simulation of cyberattacks to find and fix vulnerabilities before malicious actors exploit them.",
  cybersecurity:
    "Cybersecurity is the practice of protecting systems, networks and data from digital attacks, unauthorized access and damage.",
  "machine learning":
    "Machine learning is a branch of artificial intelligence in which systems improve their performance on a task by learning patterns from data.",
  "product design":
    "Product design is the process of identifying a user need and shaping a product's form, function and experience to meet it.",
};

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function jitter(seed: string, min: number, max: number): number {
  const n = (hash(seed) % 1000) / 1000;
  return min + n * (max - min);
}

export function mockAnalyzeEvent(req: AnalyzeEventRequest): AnalyzeEventResponse {
  const haystack = `${req.event_description} ${req.interest}`.toLowerCase();
  const scored: EventTheme[] = [];

  for (const [label, keywords] of Object.entries(THEME_KEYWORDS)) {
    const hits = keywords.filter((k) => haystack.includes(k)).length;
    if (hits > 0) {
      const base = Math.min(0.995, 0.72 + hits * 0.09);
      scored.push({ label, score: Math.min(0.997, base + jitter(label + haystack, 0, 0.06)) });
    }
  }

  if (!scored.some((t) => t.label === "Networking")) {
    scored.push({ label: "Networking", score: jitter("net" + haystack, 0.68, 0.86) });
  }
  if (!scored.some((t) => t.label === "Innovation")) {
    scored.push({ label: "Innovation", score: jitter("inno" + haystack, 0.34, 0.58) });
  }

  return {
    themes: scored.sort((a, b) => b.score - a.score).slice(0, 5),
    model: "distilbert-base-uncased-mnli (zero-shot, mock)",
  };
}

export function mockFactCheck(topic: string): FactCheckResponse {
  const key = topic.trim().toLowerCase();
  const known = CONTEXT_SUMMARIES[key];
  const title = topic.trim().replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    topic: title || "Professional Networking",
    verified: Boolean(known) || key.length > 3,
    summary:
      known ??
      `${title} is an active professional field discussed at industry events, where practitioners share emerging practices, tooling and real-world case studies.`,
    source: "Wikipedia",
    url: `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(topic)}`,
  };
}

const STARTER_TEMPLATES = [
  (interest: string, theme: string) =>
    `I noticed you're interested in ${interest}. What ${theme.toLowerCase()} challenges do you think organizations should be paying more attention to right now?`,
  (interest: string, theme: string) =>
    `Since we're both here for ${theme.toLowerCase()}, I'd love to hear what drew you to ${interest} in the first place.`,
  (interest: string, theme: string) =>
    `What's the most surprising thing you've learned about ${interest} while working in ${theme.toLowerCase()}?`,
  (interest: string, theme: string) =>
    `If you could change one thing about how teams approach ${interest} today, what would it be?`,
  (interest: string, theme: string) =>
    `A lot of the ${theme.toLowerCase()} talks touched on ${interest} — which idea from today do you think will actually stick?`,
];

export function mockGenerateConversation(
  req: GenerateConversationRequest,
  attempt = 0,
): GenerateConversationResponse {
  const interest = req.interest.trim() || "your field";
  const theme = req.themes[0]?.label ?? "this event";
  const seed = hash(`${req.event_description}${interest}`) + attempt;
  const template = STARTER_TEMPLATES[seed % STARTER_TEMPLATES.length] ?? STARTER_TEMPLATES[0]!;

  return {
    conversation_starter: template(interest, theme),
    model: "gpt2 (text-generation, mock)",
  };
}
