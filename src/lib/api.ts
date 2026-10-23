/**
 * Thin REST client for the FastAPI backend.
 *
 * Set VITE_API_BASE_URL (e.g. http://localhost:8000) to talk to the real
 * Python service. When it is absent the client returns realistic demo data
 * so the interface can be reviewed end to end.
 */
import { mockAnalyzeEvent, mockFactCheck, mockGenerateConversation } from "./mock-backend";
import type {
  AnalyzeEventRequest,
  AnalyzeEventResponse,
  ApiInfo,
  FactCheckResponse,
  FeedbackEntry,
  FeedbackRequest,
  GenerateConversationRequest,
  GenerateConversationResponse,
  HealthStatus,
  HistoryEntry,
} from "./types";
import { readFeedback, readHistory, writeFeedbackEntry, writeHistoryEntry } from "./local-store";

const BASE_URL = (import.meta.env["VITE_API_BASE_URL"] as string | undefined)?.replace(/\/$/, "");

export const isLiveBackend = Boolean(BASE_URL);

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`${init?.method ?? "GET"} ${path} failed (${res.status})`);
  return (await res.json()) as T;
}

export const api = {
  async root(): Promise<ApiInfo> {
    if (!BASE_URL) {
      return { name: "Personalized Networking Assistant API", version: "0.1.0", docs: "/docs" };
    }
    return request<ApiInfo>("/");
  },

  async health(): Promise<HealthStatus> {
    if (!BASE_URL) {
      return {
        status: "ok",
        models: { classifier: "distilbert zero-shot", generator: "gpt2" },
        mode: "mock",
      };
    }
    return request<HealthStatus>("/health");
  },

  async analyzeEvent(body: AnalyzeEventRequest): Promise<AnalyzeEventResponse> {
    if (!BASE_URL) {
      await delay(650);
      return mockAnalyzeEvent(body);
    }
    return request<AnalyzeEventResponse>("/analyze-event", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async factCheck(topic: string): Promise<FactCheckResponse> {
    if (!BASE_URL) {
      await delay(550);
      return mockFactCheck(topic);
    }
    return request<FactCheckResponse>("/fact-check", {
      method: "POST",
      body: JSON.stringify({ topic }),
    });
  },

  async generateConversation(
    body: GenerateConversationRequest,
    attempt = 0,
  ): Promise<GenerateConversationResponse> {
    if (!BASE_URL) {
      await delay(700);
      return mockGenerateConversation(body, attempt);
    }
    return request<GenerateConversationResponse>("/generate-conversation", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getHistory(): Promise<HistoryEntry[]> {
    if (!BASE_URL) {
      await delay(200);
      return readHistory();
    }
    return request<HistoryEntry[]>("/history");
  },
  async saveHistory(entry: HistoryEntry): Promise<HistoryEntry> {
    if (!BASE_URL) {
      writeHistoryEntry(entry);
      return entry;
    }

    return request<HistoryEntry>("/history", {
      method: "POST",
      body: JSON.stringify(entry),
    });
  },
  async postFeedback(body: FeedbackRequest): Promise<FeedbackEntry> {
    if (!BASE_URL) {
      await delay(300);
      return writeFeedbackEntry(body);
    }
    return request<FeedbackEntry>("/feedback", {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  async getFeedback(): Promise<FeedbackEntry[]> {
    if (!BASE_URL) {
      await delay(200);
      return readFeedback();
    }
    return request<FeedbackEntry[]>("/feedback");
  },
};
