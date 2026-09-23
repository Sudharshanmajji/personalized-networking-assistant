/**
 * Deterministic demo/mock implementations of the FastAPI pipeline.
 * Used whenever VITE_API_BASE_URL is not configured, so the whole UI can be
 * demonstrated before the Python backend is connected.
 *
 * The generation is input-driven: themes come from the event description +
 * interest, and the conversation starter is picked from theme-specific pools
 * using the detected topic keywords, so different inputs give different output.
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
  "Cyber Security": [
    "cyber",
    "security",
    "hacking",
    "hacker",
    "threat",
    "zero-trust",
    "zero trust",
    "malware",
    "infosec",
    "penetration",
    "pentest",
    "vulnerab",
    "ransomware",
    "phishing",
  ],
  "Generative AI": [
    "generative",
    "genai",
    "llm",
    "large language model",
    "rag",
    "retrieval augmented",
    "prompt",
    "diffusion",
    "chatgpt",
    "transformer",
    "embedding",
    "agentic",
    "copilot",
  ],
  "Artificial Intelligence": [
    "ai",
    "machine learning",
    " ml",
    "deep learning",
    "neural",
    "model training",
    "nlp",
    "computer vision",
    "mlops",
  ],
  "Cloud Computing": [
    "cloud",
    "aws",
    "azure",
    "gcp",
    "serverless",
    "deployment",
    "devops",
    "container",
    "docker",
    "kubernetes",
    "infrastructure",
    "cloud-native",
  ],
  "Microservices & Backend": [
    "spring",
    "spring boot",
    "microservice",
    "api",
    "backend",
    "java",
    "rest",
    "grpc",
    "event-driven",
    "distributed system",
    "fastapi",
    "node",
  ],
  "Data Engineering": [
    "data",
    "analytics",
    "pipeline",
    "warehouse",
    "big data",
    "etl",
    "streaming",
    "spark",
    "sql",
  ],
  Healthcare: ["health", "clinical", "medical", "patient", "hospital", "biotech", "pharma"],
  Fintech: ["fintech", "payments", "banking", "finance", "compliance", "regtech", "trading"],
  Sustainability: ["climate", "sustainab", "carbon", "energy", "green", "renewable"],
  Startup: ["startup", "founder", "venture", "seed", "pitch", "incubator", "accelerator"],
  Design: ["design", "ux", "ui", "product design", "brand", "creative", "figma"],
  Education: ["education", "university", "student", "campus", "learning", "bootcamp"],
  Marketing: ["marketing", "growth", "campaign", "seo", "content strategy"],
  Robotics: ["robot", "drone", "automation", "iot", "embedded", "hardware"],
  Blockchain: ["blockchain", "web3", "crypto", "token", "smart contract"],
  Networking: ["summit", "conference", "meetup", "forum", "mixer", "networking", "expo", "hackathon"],
  Innovation: ["innovation", "future", "emerging", "research", "roadmap", "trend"],
};

/** Notable phrases we like to quote back verbatim in a question. */
const KEY_PHRASES = [
  "ethical hacking",
  "zero-trust architecture",
  "zero trust",
  "threat intelligence",
  "penetration testing",
  "ransomware",
  "phishing",
  "cloud security",
  "spring ai",
  "spring boot",
  "microservices",
  "cloud deployment",
  "cloud-native",
  "kubernetes",
  "serverless",
  "devops",
  "observability",
  "llm",
  "llms",
  "rag",
  "retrieval augmented generation",
  "prompt engineering",
  "fine-tuning",
  "ai agents",
  "generative ai",
  "computer vision",
  "mlops",
  "data pipelines",
  "real-time analytics",
  "digital payments",
  "open banking",
  "clinical ai",
  "patient outcomes",
  "product design",
  "design systems",
  "developer experience",
  "sustainability reporting",
  "carbon accounting",
  "smart contracts",
];

const CONTEXT_SUMMARIES: Record<string, string> = {
  "ethical hacking":
    "Ethical hacking is the authorized simulation of cyberattacks to find and fix vulnerabilities before malicious actors exploit them.",
  cybersecurity:
    "Cybersecurity is the practice of protecting systems, networks and data from digital attacks, unauthorized access and damage.",
  "machine learning":
    "Machine learning is a branch of artificial intelligence in which systems improve their performance on a task by learning patterns from data.",
  "product design":
    "Product design is the process of identifying a user need and shaping a product's form, function and experience to meet it.",
  "generative ai":
    "Generative AI refers to models that create new text, images, code or audio by learning statistical patterns from large training corpora.",
  "spring ai":
    "Spring AI is a Spring-ecosystem framework that gives Java applications a consistent abstraction over AI models, embeddings and vector stores.",
  "spring boot":
    "Spring Boot is a Java framework that simplifies building production-ready, stand-alone services with opinionated auto-configuration.",
  microservices:
    "Microservices architecture structures an application as a set of small, independently deployable services communicating over a network.",
  rag: "Retrieval-augmented generation combines a retrieval step over an external knowledge source with a language model so answers are grounded in real documents.",
  "retrieval augmented generation":
    "Retrieval-augmented generation combines a retrieval step over an external knowledge source with a language model so answers are grounded in real documents.",
  llm: "A large language model is a neural network trained on very large text corpora to predict and generate natural language.",
  "cloud computing":
    "Cloud computing delivers on-demand compute, storage and services over the internet, billed by usage instead of owned hardware.",
  kubernetes:
    "Kubernetes is an open-source platform that automates deployment, scaling and operation of containerised applications.",
  devops:
    "DevOps is a set of practices combining software development and IT operations to shorten delivery cycles with continuous automation.",
  "data engineering":
    "Data engineering builds and maintains the pipelines and storage systems that make data reliable and usable for analytics and machine learning.",
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
  const haystack = ` ${req.event_description} ${req.interest} `.toLowerCase();
  const scored: EventTheme[] = [];

  for (const [label, keywords] of Object.entries(THEME_KEYWORDS)) {
    const hits = keywords.filter((k) => haystack.includes(k)).length;
    if (hits > 0) {
      const base = Math.min(0.995, 0.74 + hits * 0.07);
      scored.push({ label, score: Math.min(0.997, base + jitter(label + haystack, 0, 0.05)) });
    }
  }

  const interestLabel = titleCase(req.interest.trim());
  if (interestLabel && !scored.some((t) => t.label.toLowerCase() === interestLabel.toLowerCase())) {
    scored.push({ label: interestLabel, score: jitter("int" + haystack, 0.9, 0.985) });
  }

  if (scored.length < 3 && !scored.some((t) => t.label === "Networking")) {
    scored.push({ label: "Networking", score: jitter("net" + haystack, 0.68, 0.86) });
  }
  if (scored.length < 3 && !scored.some((t) => t.label === "Innovation")) {
    scored.push({ label: "Innovation", score: jitter("inno" + haystack, 0.34, 0.58) });
  }

  return {
    themes: scored.sort((a, b) => b.score - a.score).slice(0, 5),
    model: "distilbert-base-uncased-mnli (zero-shot, mock)",
  };
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function mockFactCheck(topic: string): FactCheckResponse {
  const key = topic.trim().toLowerCase();
  const known =
    CONTEXT_SUMMARIES[key] ??
    Object.entries(CONTEXT_SUMMARIES).find(([k]) => key.includes(k) || k.includes(key))?.[1];
  const title = titleCase(topic.trim());

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

/* ------------------------------------------------------------------ */
/* Conversation generation                                             */
/* ------------------------------------------------------------------ */

type Builder = (c: Ctx) => string;

interface Ctx {
  interest: string;
  theme: string;
  secondTheme: string;
  phrase: string;
  altPhrase: string;
  event: string;
  contextHint: string;
}

/** Theme-specific question pools, keyed by detected theme label. */
const THEME_POOLS: Record<string, Builder[]> = {
  "Cyber Security": [
    (c) => `What challenges in ${c.interest.toLowerCase()} do you think organizations are currently finding hardest to address?`,
    (c) => `With ${c.phrase} coming up so often here, which vulnerabilities do you think teams still underestimate?`,
    (c) => `How has your approach to ${c.interest.toLowerCase()} changed as attackers have got faster?`,
    (c) => `Where do you think security teams should invest first — detection, ${c.altPhrase}, or people?`,
  ],
  "Generative AI": [
    (c) => `With LLMs and RAG becoming increasingly common, which applications of ${c.interest.toLowerCase()} are you most interested in exploring?`,
    (c) => `How are you handling grounding and evaluation when you put ${c.phrase} in front of real users?`,
    (c) => `Which part of the ${c.interest.toLowerCase()} stack do you think will look completely different a year from now?`,
    (c) => `Have you found ${c.phrase} works better as a product feature or as an internal tool?`,
  ],
  "Artificial Intelligence": [
    (c) => `Where are you seeing ${c.interest.toLowerCase()} move from experiments into something teams actually depend on?`,
    (c) => `What's been the hardest part of getting ${c.phrase} models reliable enough for production?`,
    (c) => `How do you decide when a problem genuinely needs ${c.interest.toLowerCase()} rather than simpler logic?`,
  ],
  "Cloud Computing": [
    (c) => `How are you seeing ${c.phrase} practices change as organizations adopt more AI-driven applications?`,
    (c) => `What's your take on balancing cost and resilience in ${c.interest.toLowerCase()} today?`,
    (c) => `Has ${c.phrase} made your releases genuinely calmer, or just moved the complexity somewhere else?`,
  ],
  "Microservices & Backend": [
    (c) => `How are you approaching the challenges of integrating ${c.phrase} with cloud-native deployments?`,
    (c) => `Where do you draw service boundaries when you're working on ${c.interest.toLowerCase()}?`,
    (c) => `What's helped most with observability once ${c.phrase} started spanning several teams?`,
  ],
  "Data Engineering": [
    (c) => `What's the trickiest part of keeping ${c.phrase} trustworthy as the number of consumers grows?`,
    (c) => `How do you think ${c.interest.toLowerCase()} changes once AI workloads start pulling from the same pipelines?`,
  ],
  Healthcare: [
    (c) => `Where do you see ${c.interest.toLowerCase()} changing patient outcomes first?`,
    (c) => `How are clinical teams reacting when ${c.phrase} shows up in their day-to-day workflow?`,
  ],
  Fintech: [
    (c) => `How do you balance frictionless experience with compliance when you're working on ${c.interest.toLowerCase()}?`,
    (c) => `Which part of ${c.phrase} do you think regulation will reshape the most?`,
  ],
  Sustainability: [
    (c) => `What's actually moving the needle in ${c.interest.toLowerCase()} beyond reporting requirements?`,
    (c) => `How do you get ${c.phrase} taken seriously when budgets tighten?`,
  ],
  Startup: [
    (c) => `What made you go after ${c.interest.toLowerCase()} rather than an easier first problem?`,
    (c) => `At this stage, how are you deciding what to build in-house around ${c.phrase}?`,
  ],
  Design: [
    (c) => `How do you keep ${c.interest.toLowerCase()} decisions consistent once several teams are shipping?`,
    (c) => `What's the most useful signal you've found for judging whether ${c.phrase} is working?`,
  ],
  Robotics: [
    (c) => `Where is ${c.interest.toLowerCase()} still blocked by hardware rather than software?`,
    (c) => `How much of your ${c.phrase} work ends up being integration versus new capability?`,
  ],
  Blockchain: [
    (c) => `Which ${c.interest.toLowerCase()} use cases do you think have actually earned their complexity?`,
  ],
  Education: [
    (c) => `How are you seeing ${c.interest.toLowerCase()} change what students expect to graduate knowing?`,
  ],
  Marketing: [
    (c) => `What channel has surprised you most in your ${c.interest.toLowerCase()} work this year?`,
  ],
};

/** Generic-but-still-specific fallbacks that always name the input. */
const FALLBACK_POOL: Builder[] = [
  (c) => `${c.contextHint}What problem in ${c.interest.toLowerCase()} are you hoping someone here can help you think through?`,
  (c) => `Given how much ${c.theme.toLowerCase()} came up in "${c.event}", what's your current view on ${c.interest.toLowerCase()}?`,
  (c) => `What drew you to ${c.interest.toLowerCase()} in the first place, and what's keeping you there?`,
  (c) => `Which idea from the ${c.theme.toLowerCase()} sessions do you think will actually stick in ${c.interest.toLowerCase()} work?`,
];

function findPhrases(text: string): string[] {
  const lower = ` ${text.toLowerCase()} `;
  const found = KEY_PHRASES.filter((p) => lower.includes(p));
  found.sort((a, b) => b.length - a.length);
  return found;
}

export function mockGenerateConversation(
  req: GenerateConversationRequest,
  attempt = 0,
): GenerateConversationResponse {
  const interest = req.interest.trim() || "your field";
  const sorted = [...req.themes].sort((a, b) => b.score - a.score);
  const event = req.event_description.trim();

  const phrases = findPhrases(`${event} ${interest}`);
  const phrase = phrases[0] ?? interest.toLowerCase();
  const altPhrase = phrases[1] ?? phrases[0] ?? interest.toLowerCase();

  const contextHint =
    req.context?.verified && req.context.summary
      ? `${req.context.topic} is really about ${firstClause(req.context.summary)} — `
      : "";

  // Build a candidate pool from every detected theme that has one, highest
  // confidence first, then fallbacks. Different inputs => different pools.
  const candidates: Array<{ theme: string; build: Builder }> = [];
  for (const t of sorted) {
    const pool = THEME_POOLS[t.label] ?? matchPoolByName(t.label);
    if (pool) for (const build of pool) candidates.push({ theme: t.label, build });
  }
  for (const build of FALLBACK_POOL) candidates.push({ theme: sorted[0]?.label ?? "this event", build });

  const seed = hash(`${event}|${interest}|${sorted.map((t) => t.label).join(",")}`);
  const index = (seed + attempt * 7 + 1) % candidates.length;
  const chosen = candidates[index] ?? candidates[0]!;

  const ctx: Ctx = {
    interest,
    theme: chosen.theme,
    secondTheme: sorted[1]?.label ?? chosen.theme,
    phrase,
    altPhrase,
    event: event.length > 48 ? `${event.slice(0, 48).trim()}…` : event || "this event",
    contextHint: attempt % 2 === 1 ? contextHint : "",
  };

  return {
    conversation_starter: capitalize(chosen.build(ctx)),
    model: "gpt2 (text-generation, mock)",
  };
}

function matchPoolByName(label: string): Builder[] | undefined {
  const lower = label.toLowerCase();
  for (const [theme, pool] of Object.entries(THEME_POOLS)) {
    const t = theme.toLowerCase();
    if (lower.includes(t) || t.includes(lower)) return pool;
  }
  for (const [theme, keywords] of Object.entries(THEME_KEYWORDS)) {
    if (keywords.some((k) => lower.includes(k.trim()))) return THEME_POOLS[theme];
  }
  return undefined;
}

function firstClause(summary: string): string {
  const s = summary.replace(/^[A-Z][^ ]*\s+(is|are|refers to)\s+/i, "");
  const cut = s.split(/[,.;]/)[0] ?? s;
  return cut.trim().toLowerCase();
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
