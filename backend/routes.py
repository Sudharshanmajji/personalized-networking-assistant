
from datetime import datetime, timezone
from typing import Literal
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from backend.services.event_analyzer import analyze_event
from backend.services.fact_checker import verify_topic
from backend.services.topic_generator import generate_conversation
from backend.utils.json_storage import read_records, write_records

router = APIRouter()


class Theme(BaseModel):
    label: str
    score: float


class FactCheckResult(BaseModel):
    topic: str
    verified: bool
    summary: str
    source: str
    url: str | None = None


class GenerateConversationRequest(BaseModel):
    event_description: str
    interest: str
    themes: list[Theme]
    context: FactCheckResult | None = None


class FactCheckRequest(BaseModel):
    topic: str


class AnalyzeEventRequest(BaseModel):
    event_description: str
    interest: str


class HistoryEntry(BaseModel):
    id: str
    timestamp: str
    event_description: str
    interest: str
    themes: list[Theme]
    context: FactCheckResult
    conversation_starter: str


class FeedbackRequest(BaseModel):
    entry_id: str | None = None
    rating: Literal["useful", "not_useful"]
    comment: str | None = Field(default=None, max_length=2000)


class FeedbackEntry(FeedbackRequest):
    id: str
    timestamp: str


def utc_now() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("/")
def root():
    return {
        "name": "Personalized Networking Assistant API",
        "version": "0.1.0",
        "docs": "/docs",
    }


@router.get("/health")
def health():
    return {
        "status": "ok",
        "models": {
            "classifier": "distilbert zero-shot",
            "generator": "gpt2",
        },
        "mode": "live",
    }


@router.post("/analyze-event")
def analyze_event_route(request: AnalyzeEventRequest):
    themes = analyze_event(request.event_description)
    return {
        "themes": themes,
        "model": "typeform/distilbert-base-uncased-mnli",
    }


@router.post("/fact-check", response_model=FactCheckResult)
def fact_check(request: FactCheckRequest):
    return verify_topic(request.topic)


@router.post("/generate-conversation")
def generate_conversation_route(request: GenerateConversationRequest):
    summary = request.context.summary if request.context else ""

    conversation = generate_conversation(
        event_description=request.event_description,
        interest=request.interest,
        themes=[theme.model_dump() for theme in request.themes],
        summary=summary,
    )

    return {
        "conversation_starter": conversation,
        "model": "gpt2",
    }


@router.get("/history", response_model=list[HistoryEntry])
def get_history():
    try:
        entries = read_records("history.json")
        return sorted(
            entries,
            key=lambda entry: entry.get("timestamp", ""),
            reverse=True,
        )
    except (RuntimeError, OSError) as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not read conversation history",
        ) from exc


@router.post("/history", response_model=HistoryEntry)
def save_history(entry: HistoryEntry):
    try:
        entries = read_records("history.json")
        # Avoid duplicate entries if the same ID is submitted again.
        entries = [item for item in entries if item.get("id") != entry.id]
        entries.insert(0, entry.model_dump())
        write_records("history.json", entries[:50])
        return entry
    except (RuntimeError, OSError) as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not save conversation history",
        ) from exc


@router.get("/feedback", response_model=list[FeedbackEntry])
def get_feedback():
    try:
        entries = read_records("feedback.json")
        return sorted(
            entries,
            key=lambda entry: entry.get("timestamp", ""),
            reverse=True,
        )
    except (RuntimeError, OSError) as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not read feedback",
        ) from exc


@router.post("/feedback", response_model=FeedbackEntry)
def save_feedback(request: FeedbackRequest):
    entry = FeedbackEntry(
        **request.model_dump(),
        id=str(uuid4()),
        timestamp=utc_now(),
    )

    try:
        entries = read_records("feedback.json")
        entries.insert(0, entry.model_dump())
        write_records("feedback.json", entries[:100])
        return entry
    except (RuntimeError, OSError) as exc:
        raise HTTPException(
            status_code=500,
            detail="Could not save feedback",
        ) from exc
