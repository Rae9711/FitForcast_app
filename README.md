# FitForecast

FitForecast is a personalized workout-and-recovery tracking web app. Users log workouts and meals in natural language, rate how they feel before and after, and get explainable insights plus forward-looking predictions built from their own history.

The current MVP is launchable in local development with:

- JWT authentication
- natural-language workout and meal logging
- pre and post feeling capture
- baseline and trends analysis
- deterministic insights with optional AI wording
- a four-stage personalized prediction system
- demo personas seeded with realistic historical data

## What FitForecast Does

FitForecast is designed around personal baselines instead of generic fitness advice.

- It learns the user’s own timing, fueling, stress, and consistency patterns.
- It compares current behavior against that user’s history, not population averages.
- It explains why an insight or forecast exists with supporting stats.
- It can optionally use an LLM layer to improve narrative wording while keeping the prediction logic deterministic and auditable.

## Current Status

The repository currently supports the full end-to-end MVP flow described in the walkthrough:

- frontend on port 5174
- backend on port 3000
- seeded demo users for Athena, Boris, and Cora
- dashboard, history, trends, and logging flows
- insights generation and rendering
- personalized forecast generation through the new predictions endpoint
- optional Jac bridge for AI narrative rewriting

Important limitation:

- Jac integration is implemented, but if the Jac service does not have a working upstream model configured, the backend falls back to deterministic narrative text.

## Demo Accounts

All demo accounts use the password `password123`.

| Persona | Email | Pattern |
| --- | --- | --- |
| Athena | athena@example.com | Consistent morning exerciser improving steadily |
| Boris | boris@example.com | Inconsistent, stressed, late-day training pattern |
| Cora | cora@example.com | High-performing, optimized routine with strong signals |

## Architecture Overview

### Stream 1: Backend

- Node.js + TypeScript + Express
- Prisma + PostgreSQL
- authentication, entries, feelings, insights, trends, predictions
- deterministic insights engine
- personalized forecast engine

### Stream 2: Frontend

- React 18 + TypeScript + Vite
- route-based pages for login, signup, dashboard, log entry, history, and trends
- prediction and insight panels wired to the backend

### Stream 3: Analytics

- Python notebooks and tests for evaluating rules, baselines, and edge cases

### Stream 4: Integration and LLM

- scenario definitions and persona data
- optional Jac byLLM microservice for insight and forecast narrative rewriting

## Repository Layout

```text
.
├── README.md
├── AUTH_SYSTEM_DOCS.md
├── DEMO_PERSONAS.md
├── DEMO_WALKTHROUGH_GUIDE.md
├── UPDATE_COMPLETE.md
├── docs/
│   ├── INTEGRATION_CONTRACT.md
│   ├── README.md
│   ├── TECHNICAL_PLAN.md
│   ├── USER_JOURNEY.md
│   └── END_TO_END_GUIDE.md
├── stream-1-backend/
├── stream-2-frontend/
├── stream-3-analytics/
└── stream-4-integration/
```

## Core Product Flows

### 1. Authentication

- sign up with email, password, and optional name
- login returns JWT
- protected routes require a valid token
- frontend handles expired sessions and redirects back to login

### 2. Logging

- create workout or meal entries in natural language
- attach pre and post feeling ratings
- store occurred-at timestamp for trend and timing analysis

### 3. Baselines and Trends

- backend computes rolling user-specific baselines
- frontend renders charts for energy, stress, mood, and activity patterns
- trends are based on the user’s own logged history

### 4. Insights

- deterministic rules evaluate user data
- backend returns structured insights with supporting stats
- optional LLM layer rewrites wording for clarity and polish

### 5. Personalized Predictions

FitForecast now includes a four-stage forecast system:

1. Stage 1: Personalized heuristics
2. Stage 2: Per-user predictive scoring
3. Stage 3: Cross-user plus per-user hybrid blending
4. Stage 4: AI narrative personalization

The backend exposes this through `GET /predictions` and the frontend renders it in the dashboard and trends experience.

## Tech Stack

### Backend

- Node.js 18+
- TypeScript
- Express
- Prisma
- PostgreSQL
- Jest

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router

### Analytics

- Python
- Jupyter
- pandas and related analysis tooling

### Optional LLM Layer

- direct OpenAI-compatible provider
- Ollama
- Jac byLLM bridge

## Local Development Setup

### Prerequisites

- Node.js 18 or newer
- npm
- PostgreSQL 14 or newer
- Python 3.11 if you want to run the Jac service locally

### Backend Setup

```bash
cd stream-1-backend
npm install
cp .env.example .env
```

Set at least these environment variables in `stream-1-backend/.env`:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/fitforecast"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_ISSUER="fitforecast"
JWT_AUDIENCE="fitforecast-web"
```

Then run:

```bash
npx prisma migrate dev
npm run seed
npm run dev
```

Backend URLs:

- app API: http://localhost:3000
- health: http://localhost:3000/health
- API docs: http://localhost:3000/docs

### Frontend Setup

```bash
cd stream-2-frontend
npm install
npm run dev
```

Frontend URL:

- app: http://localhost:5174

### Optional Jac Setup

Jac is optional. The app works without it.

If you want Jac-based narrative rewriting:

```bash
cd stream-4-integration/llm/jac_service
python3.11 -m venv .venv311
source .venv311/bin/activate
pip install -r requirements.txt
python server.py
```

Then set backend environment variables before starting the backend:

```bash
INSIGHTS_LLM_PROVIDER=jac
JAC_LLM_URL=http://127.0.0.1:8787
JAC_LLM_API_KEY=fitforecast-local
```

Supported backend LLM providers:

- `off`
- `openai`
- `ollama`
- `jac`

## Running the Full Stack

Open three terminals.

Terminal 1:

```bash
cd stream-1-backend
npm run dev
```

Terminal 2:

```bash
cd stream-2-frontend
npm run dev
```

Terminal 3, optional:

```bash
cd stream-4-integration/llm/jac_service
source .venv311/bin/activate
python server.py
```

## Validation Commands

### Backend

```bash
cd stream-1-backend
npm run build
npm test
```

### Frontend

```bash
cd stream-2-frontend
npm run build
```

### Analytics

```bash
cd stream-3-analytics
pytest
```

## Key API Endpoints

### Authentication

- `POST /auth/signup`
- `POST /auth/login`
- `GET /auth/me`

### Entries and Feelings

- `POST /entries`
- `GET /entries`
- `POST /entries/:id/feelings`

### Analysis

- `GET /insights`
- `GET /trends`
- `GET /predictions`

## Personalized Prediction System

The `/predictions` endpoint returns a forecast bundle that can include:

- high-confidence user heuristics over 7, 30, 90, and 180 day windows
- a default scenario for the user’s likely next session
- scenario comparisons such as different workout timing or fueling choices
- model notes showing how much weight comes from personal vs broader learned patterns
- narrative coaching copy with deterministic fallback if no LLM provider is active

This lets the product get more precise as the user logs more entries.

## Documentation Map

- `README.md`: primary setup, architecture, and product guide
- `docs/END_TO_END_GUIDE.md`: step-by-step usage guide for demo users and real users
- `DEMO_WALKTHROUGH_GUIDE.md`: persona-based walkthrough reference
- `DEMO_PERSONAS.md`: seeded persona descriptions
- `AUTH_SYSTEM_DOCS.md`: authentication implementation details
- `docs/TECHNICAL_PLAN.md`: technical planning notes
- `docs/INTEGRATION_CONTRACT.md`: integration contract across streams
- `UPDATE_COMPLETE.md`: implementation summary

## Troubleshooting

### Frontend cannot reach backend

Check:

- backend is running on port 3000
- frontend is running on port 5174
- frontend API base URL points to the backend

### Login works but insights or predictions are missing

Check:

- database was migrated
- seed data was loaded or the user has enough logged entries
- backend logs for route or auth errors

### Jac returns 502 or no rewritten text

That usually means:

- the Jac service is not running
- the Jac service has no valid upstream model configured
- the backend cannot reach `JAC_LLM_URL`

The app should still function with deterministic fallback text.

### Python dependency issues for Jac on macOS

Use Python 3.11 for the Jac environment. Python 3.9 has already shown incompatibility with the required `jaclang` dependency path in this repo.

## Notes on Repository Cleanliness

This repository should only track source, docs, and intentional config. Generated build output, local virtual environments, and accidental nested clones should not be committed.

## Recommended Reading Order

1. Read this file for setup and architecture
2. Read `docs/END_TO_END_GUIDE.md` to use the product end to end
3. Read `DEMO_WALKTHROUGH_GUIDE.md` for persona-based demo flow
4. Read stream-specific READMEs if you are changing internals
