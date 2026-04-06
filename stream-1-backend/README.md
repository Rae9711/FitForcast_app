# Stream 1: Backend & Infrastructure

**Owner:** Backend Engineer  
**Status:** Foundation phase  
**Priority:** CRITICAL (blocks all other streams)

## Overview

The Backend is the data and compute foundation for FitForecast. It owns the REST API, PostgreSQL database schema, baseline computation logic, and core business rules that all other streams depend on.

## Scope (MVP)

- **REST API:** Endpoints for logging entries, capturing feelings, retrieving trends, listing insights, and generating personalized forecasts.
- **Database:** PostgreSQL schema with Prisma ORM for User, LogEntry, FeelingEntry, ParsedEntry, BaselineMetric, and Insight entities.
- **Baseline Computation:** Rolling 7/30/365-day aggregations on entry submission, per user and per metric.
- **Deterministic Insights Engine:** Rule evaluation service that fires insights based on baseline deltas.
- **Personalized Prediction Engine:** Hybrid per-user plus cross-user forecasting that uses rolling 7/30/90/180-day heuristics, EMA/Bayesian scoring, logistic regression, and boosted stump ensembles.
- **Validation & Error Handling:** Input validation, error responses, and graceful degradation.

## Key Deliverables

### 1. Database Schema
```
User
├── id (UUID)
├── email (unique)
├── created_at
└── updated_at

LogEntry
├── id (UUID)
├── user_id (FK)
├── type (workout | meal) — enum
├── raw_text — original natural language
├── occurred_at — when the activity happened
├── created_at

FeelingEntry
├── id (UUID)
├── log_entry_id (FK) — linked to LogEntry
├── when (pre | post) — before or after
├── valence (1-5) — positive ↔ negative mood
├── energy (1-5) — low ↔ high energy
├── stress (1-5) — relaxed ↔ stressed
├── notes (optional)
├── created_at

ParsedEntry
├── id (UUID)
├── log_entry_id (FK)
├── activity_type (run, lift, yoga, meal, etc.)
├── duration_min (optional)
├── intensity (low | medium | high)
├── meal_type (breakfast | lunch | dinner | snack) — for meals
├── food_tags (array/text) — e.g., ["protein", "carbs"]
└── created_at

BaselineMetric
├── id (UUID)
├── user_id (FK)
├── scope (workout | meal | mood)
├── metric (e.g., post_strength_energy, morning_energy, stress_variance)
├── value (float) — computed average
├── window_days (7 | 30 | 365)
├── data_points (int) — number of entries used
├── updated_at

Insight
├── id (UUID)
├── user_id (FK)
├── type (e.g., energy_uplift, late_meals, routine_mood)
├── summary (string) — human-readable motive
├── supporting_stats (JSON) — {"baseline": 3.2, "recent": 4.2, "delta": 1.0}
├── rule_name (string) — reference to rule definition
├── created_at
└── is_active (bool) — user can dismiss insights
```

### 2. REST API Endpoints

#### Entry Management
- **POST /entries** — Create a new workout or meal log entry
  - Body: `{ type: "workout" | "meal", raw_text: string, occurred_at: ISO8601 }`
  - Response: `{ id, user_id, type, raw_text, occurred_at, created_at }`
  - Side effects: Triggers optional NLP parsing → Creates ParsedEntry

- **GET /entries** — List user's log entries
  - Query: `?user_id=X&type=workout&limit=50&offset=0`
  - Response: `[{ LogEntry with FeelingEntry[] }]`

- **GET /entries/:id** — Get single entry with feelings
  - Response: `{ LogEntry, feelings: FeelingEntry[] }`

#### Feelings
- **POST /entries/:id/feelings** — Add pre/post feeling entry
  - Body: `{ when: "pre" | "post", valence: 1-5, energy: 1-5, stress: 1-5, notes?: string }`
  - Response: `FeelingEntry`
  - Side effects: Triggers baseline recomputation

#### Trends & Baselines
- **GET /trends** — Retrieve user's current baselines and trends
  - Query: `?user_id=X&window_days=7` (supported: 7, 30, 365)
  - Response: 
    ```json
    {
      "baselines": [
        { "scope": "workout", "metric": "post_energy", "value": 3.5, "data_points": 12 },
        { "scope": "meal", "metric": "frequency", "value": 2.8, "data_points": 8 }
      ],
      "recent": [
        { "entered": "2026-02-15", "type": "workout", "post_energy": 4.2 },
        { "entered": "2026-02-16", "type": "meal", "post_energy": 3.0 }
      ]
    }
    ```

#### Insights
- **GET /insights** — List active insights for user
  - Query: `?user_id=X&limit=5`
  - Response: 
    ```json
    [
      {
        "id": "...",
        "type": "energy_uplift_strength",
        "summary": "You feel +1.2 more energized after strength workouts vs. your average.",
        "supporting_stats": {
          "avg_post_strength": 4.2,
          "overall_avg": 3.0,
          "data_points": 8,
          "threshold_met": true
        },
        "created_at": "2026-02-16",
        "is_active": true
      }
    ]
    ```

#### Personalized Forecasts
- **GET /predictions** — Generate a hybrid personalized forecast bundle for the user's next workout
  - Query: `?user_id=X&planned_hour=7&workout_kind=cardio&include_breakfast=true&include_protein_recovery_meal=true&pre_energy=3&pre_stress=2`
  - Response:
    - `heuristics`: rolling 7/30/90/180-day personalized timing, mood, fueling, and consistency signals with confidence
    - `defaultScenario`: expected post-workout energy, post-workout stress, good-session likelihood, and next-day recovery quality
    - `scenarioComparisons`: alternative timing/fueling what-if scenarios
    - `modelNotes`: per-user vs global weighting and calibration note
    - `narrative`: AI-personalized coaching copy when an upstream LLM is configured, otherwise deterministic fallback text

### 3. Baseline Computation Service

Runs asynchronously after each FeelingEntry is created. Computes per-user, per-metric rolling windows.

### 4. Insights Engine

Deterministic rule evaluator integrated with baseline metrics.

### 5. Personalized Forecast Engine

The prediction service adds four layers on top of the baseline system:

- **Stage 1:** Personalized heuristics over 7/30/90/180-day windows with recency weighting and confidence thresholds
- **Stage 2:** Per-user predictive scoring for post-workout energy, post-workout stress, good-session likelihood, and next-day recovery quality using EMA, Bayesian smoothing, logistic regression, and boosted stumps
- **Stage 3:** Cross-user plus per-user hybrid blending with calibration so the model gets more personal as each user logs more data
- **Stage 4:** Optional AI narrative personalization for forecast summaries and next-step coaching

## Tech Stack

- **Framework:** Express.js or Fastify (TypeScript)
- **Database:** PostgreSQL + Prisma ORM
- **Validation:** Zod or Joi for request validation
- **Testing:** Jest + supertest for API tests
- **Documentation:** OpenAPI/Swagger

## File Structure

```
stream-1-backend/
├── README.md
├── src/
│   ├── index.ts
│   ├── api/
│   │   ├── entries.ts
│   │   ├── feelings.ts
│   │   ├── trends.ts
│   │   ├── insights.ts
│   │   └── predictions.ts
│   ├── db/
│   │   ├── prisma.ts
│   │   └── schema.prisma
│   ├── services/
│   │   ├── baseline.ts
│   │   ├── insights.ts
│   │   ├── llm.ts
│   │   └── predictions.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── validation.ts
│   └── utils/
├── tests/
├── seeds/
├── .env.example
├── package.json
└── tsconfig.json
```

## Success Criteria

<!-- Success Criteria Checklist -->
- [ ] API endpoints respond in <200ms (p95) with valid JSON
- [ ] Baseline calculations complete within 5 seconds on 100+ entries
- [ ] Sample seed data available: 3 test users, 50+ entries each
- [ ] OpenAPI spec shared with other teams
- [ ] All endpoints covered by unit + integration tests (>80% coverage)
- [ ] Error handling: 400 for validation, 404 for not found, 500 with error logs

## Integration Points

- **Stream 2 (Frontend):** Consumes all `/entries`, `/feelings`, `/trends`, `/insights`, `/predictions`
- **Stream 3 (Analytics):** Receives baseline data, returns insight objects
- **Stream 4 (Integration):** Optional NLP enrichment of ParsedEntry

See [../docs/INTEGRATION_CONTRACT.md](../docs/INTEGRATION_CONTRACT.md) for detailed sync plan.

## Next Steps

<!-- Next Steps Checklist -->
1. Scaffold Node/TypeScript project
2. Setup PostgreSQL with Prisma
3. Define schema in `schema.prisma`
4. Implement REST endpoints
5. Build baseline computation service
6. Create sample seeds with 3 users, 50+ entries
7. Share OpenAPI spec with other streams

## Run & Development (local)

Set environment variables (example):

```bash
export DATABASE_URL="postgresql://user:pass@localhost:5432/fitforecast"
export JWT_SECRET="replace-me"
export INSIGHTS_LLM_PROVIDER="off" # off | openai | ollama | jac
```

Optional LLM provider variables:

```bash
# OpenAI-compatible
export OPENAI_API_KEY="..."
export OPENAI_BASE_URL="https://api.openai.com/v1"
export OPENAI_MODEL="gpt-4.1-mini"

# Ollama
export OLLAMA_BASE_URL="http://127.0.0.1:11434"
export OLLAMA_MODEL="llama3.1"

# Jac microservice bridge
export JAC_LLM_URL="http://127.0.0.1:8787"
export JAC_LLM_API_KEY="change-me-if-exposed"
```

Install and run migrations, then seed sample data (seed is configurable):

```bash
npm ci
npx prisma migrate dev --name init
# Seed 200 entries per user for realistic perf tests
SEED_ENTRY_COUNT=200 npx ts-node seeds/seed.ts
```

Start the server:

```bash
npm start
```

When `INSIGHTS_LLM_PROVIDER=jac`, the backend sends deterministic insight drafts to the Stream 4 Jac service and falls back to deterministic copy if that service is unavailable.

Run tests and coverage locally:

```bash
npm test
# with coverage
npm test -- --coverage
```

Measured results from local runs (your mileage may vary):

- Seed: `SEED_ENTRY_COUNT=200` entries per user used for perf tests.
- Baseline recompute: ~47ms on the seeded dataset (single-user recompute).
- Load test (example): 50 connections × 60s → p99 ≈ 17ms, 0 errors (see `scripts/` for autocannon helper).
- Current local test coverage: ~85.49% (from `npm test -- --coverage`).

OpenAPI / Docs

The OpenAPI spec lives at `docs/openapi.yaml`. The server can optionally mount Swagger UI to serve the spec during local development (see `src/index.ts`).

CI

We recommend adding a GitHub Actions workflow to run tests and enforce a coverage threshold (80%). A sample workflow file is included in `.github/workflows/test.yml`.
