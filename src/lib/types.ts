/**
 * Shared types mirroring the FastAPI backend contract.
 *
 * Endpoints:
 *   GET  /                      -> ApiInfo
 *   GET  /health                -> HealthStatus
 *   POST /analyze-event         -> AnalyzeEventResponse
 *   POST /fact-check            -> FactCheckResponse
 *   POST /generate-conversation -> GenerateConversationResponse
 *   GET  /history               -> HistoryEntry[]
 *   POST /feedback              -> FeedbackEntry
 *   GET  /feedback              -> FeedbackEntry[]
 */

export interface ApiInfo {
  name: string;
  version: string;
  docs: string;
}

export interface HealthStatus {
  status: "ok" | "degraded" | "down";
  models: { classifier: string; generator: string };
  mode: "mock" | "live";
}

export interface EventTheme {
  label: string;
  score: number; // 0..1
}

export interface AnalyzeEventRequest {
  event_description: string;
  interest: string;
}

export interface AnalyzeEventResponse {
  themes: EventTheme[];
  model: string;
}

export interface FactCheckRequest {
  topic: string;
}

export interface FactCheckResponse {
  topic: string;
  verified: boolean;
  summary: string;
  source: string;
  url?: string;
}

export interface GenerateConversationRequest {
  event_description: string;
  interest: string;
  themes: EventTheme[];
  context?: FactCheckResponse;
}

export interface GenerateConversationResponse {
  conversation_starter: string;
  model: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string; // ISO
  event_description: string;
  interest: string;
  themes: EventTheme[];
  context: FactCheckResponse;
  conversation_starter: string;
}

export interface FeedbackRequest {
  entry_id: string | null;
  rating: "useful" | "not_useful";
  comment?: string | undefined;
}

export interface FeedbackEntry extends FeedbackRequest {
  id: string;
  timestamp: string;
}
