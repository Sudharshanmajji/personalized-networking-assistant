/**
 * Browser-side persistence used only while the app runs on mock data.
 * The real backend stores history/feedback in JSON files on the FastAPI side.
 */
import type { FeedbackEntry, FeedbackRequest, HistoryEntry } from "./types";

const HISTORY_KEY = "pna.history.v1";
const FEEDBACK_KEY = "pna.feedback.v1";

export const SEED_HISTORY: HistoryEntry[] = [
  {
    id: "seed-1",
    timestamp: "2026-09-23T14:32:00.000Z",
    event_description:
      "Cyber Security Summit — a two-day conference on threat intelligence, zero-trust architecture and ethical hacking.",
    interest: "Ethical Hacking",
    themes: [
      { label: "Cyber Security", score: 0.997 },
      { label: "Networking", score: 0.825 },
      { label: "Technology", score: 0.823 },
      { label: "Innovation", score: 0.486 },
    ],
    context: {
      topic: "Ethical Hacking",
      verified: true,
      summary:
        "Ethical hacking is the authorized simulation of cyberattacks to find and fix vulnerabilities before malicious actors exploit them.",
      source: "Wikipedia",
    },
    conversation_starter:
      "What's the most surprising vulnerability you've found in a recent engagement?",
  },
  {
    id: "seed-2",
    timestamp: "2026-09-22T09:15:00.000Z",
    event_description: "FinTech Founders Meetup — payments, compliance and early-stage growth.",
    interest: "Product Design",
    themes: [
      { label: "Fintech", score: 0.941 },
      { label: "Startup", score: 0.878 },
      { label: "Design", score: 0.804 },
    ],
    context: {
      topic: "Product Design",
      verified: true,
      summary:
        "Product design is the process of identifying a user need and shaping a product's form, function and experience to meet it.",
      source: "Wikipedia",
    },
    conversation_starter:
      "How do you balance frictionless UX with compliance in payments?",
  },
  {
    id: "seed-3",
    timestamp: "2026-09-21T18:02:00.000Z",
    event_description: "AI in Healthcare Forum — clinical machine learning and patient outcomes.",
    interest: "Clinical AI",
    themes: [
      { label: "Healthcare", score: 0.962 },
      { label: "Artificial Intelligence", score: 0.933 },
      { label: "Innovation", score: 0.512 },
    ],
    context: {
      topic: "Clinical AI",
      verified: true,
      summary:
        "Clinical AI applies machine learning to diagnosis, triage and treatment planning, usually under strict regulatory validation.",
      source: "Wikipedia",
    },
    conversation_starter:
      "Where do you see diagnostic AI changing patient outcomes first?",
  },
];

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable */
  }
}

export function readHistory(): HistoryEntry[] {
  const stored = read<HistoryEntry[]>(HISTORY_KEY, []);
  return [...stored, ...SEED_HISTORY];
}

export function writeHistoryEntry(entry: HistoryEntry): HistoryEntry[] {
  const stored = read<HistoryEntry[]>(HISTORY_KEY, []);
  const next = [entry, ...stored].slice(0, 50);
  write(HISTORY_KEY, next);
  return [...next, ...SEED_HISTORY];
}

export function readFeedback(): FeedbackEntry[] {
  return read<FeedbackEntry[]>(FEEDBACK_KEY, []);
}

export function writeFeedbackEntry(body: FeedbackRequest): FeedbackEntry {
  const entry: FeedbackEntry = {
    ...body,
    id: `fb-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  write(FEEDBACK_KEY, [entry, ...readFeedback()].slice(0, 100));
  return entry;
}
