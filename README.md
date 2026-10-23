# Personalized Networking Assistant

An AI-powered web application that helps users prepare for professional networking events by generating personalized conversation starters from event descriptions and user interests.

## Features

- **Event Theme Analysis:** Identify relevant themes using DistilBERT zero-shot classification.
- **Context Verification:** Retrieve supporting information using the Wikipedia API.
- **Conversation Generation:** Generate networking questions using GPT-2, with fallback responses.
- **History Management:** Save and retrieve previous generations using JSON storage.
- **User Feedback:** Submit and retrieve feedback on generated conversations.
- **Web Interface:** React and TanStack Start frontend connected to a FastAPI backend.

## Technology Stack

**Frontend:** React, TypeScript, TanStack Start, Tailwind CSS

**Backend:** Python, FastAPI

**AI/NLP:** Hugging Face Transformers, DistilBERT, GPT-2

**External Knowledge:** Wikipedia API

**Storage:** JSON files

## Application Workflow

1. Enter an event description and an area of interest.
2. Analyze the event to identify relevant themes.
3. Retrieve contextual information from Wikipedia.
4. Generate a personalized conversation starter.
5. Review previous generations and submit feedback.

## Project Structure

```text
.
├── backend/
│   ├── app.py
│   ├── routes.py
│   ├── services/
│   ├── utils/
│   └── database/
├── public/
├── src/
├── .env.example
├── package.json
└── README.md
```

## Prerequisites

- Node.js and npm
- Python 3.10 or a version supported by the backend dependencies
- Internet access for external APIs and model downloads

## Setup

### 1. Clone the repository

```bash
git clone <YOUR_NEW_REPOSITORY_URL>
cd <YOUR_REPOSITORY_DIRECTORY>
```

### 2. Configure the frontend

Create a local `.env` file using `.env.example` as a reference:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 3. Install frontend dependencies

```bash
npm ci
```

### 4. Install backend dependencies

Install the Python packages listed in the project's backend dependency file. If no dependency file exists yet, create one containing the packages actually required by the backend.

### 5. Start the backend

From the project root:

```bash
python -m uvicorn backend.app:app --reload --host 127.0.0.1 --port 8000
```

Backend API documentation is available at `http://127.0.0.1:8000/docs`.

### 6. Start the frontend

Open a second terminal in the project root:

```bash
npm run dev
```

Use the local URL printed by the development server.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | Root endpoint |
| GET | `/health` | Health check |
| POST | `/analyze-event` | Analyze event themes |
| POST | `/fact-check` | Retrieve factual context |
| POST | `/generate-conversation` | Generate a conversation starter |
| GET | `/history` | Retrieve conversation history |
| POST | `/history` | Save a history entry |
| POST | `/feedback` | Submit feedback |
| GET | `/feedback` | Retrieve feedback |

## Validation

Run the following checks from the project root:

```bash
npm run lint
npm run build
python -m compileall -q backend
```

The lint command may report non-blocking React Fast Refresh warnings.

## Limitations

- Generated conversation quality depends on the capabilities of the selected language model.
- GPT-2 may produce generic or imperfect suggestions.
- Wikipedia context retrieval depends on external service availability.
- JSON files provide simple local persistence and are not a substitute for a production database.

## Future Improvements

- Improve response relevance and factual grounding.
- Add automated backend tests.
- Introduce persistent database storage.
- Improve error handling and deployment configuration.
