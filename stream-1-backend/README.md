# Stream 1: Backend & Infrastructure

**Owner:** Backend Engineer  
**Status:** Foundation phase  
**Priority:** CRITICAL (blocks all other streams)

## Overview

The Backend is the data and compute foundation for FitForecast. It owns the REST API, PostgreSQL database schema, baseline computation logic, and core business rules that all other streams depend on.

## Scope (MVP)

- **REST API:** Endpoints for logging entries, capturing feelings, retrieving trends, and listing insights.
- **Database:** PostgreSQL schema with Prisma ORM for User, LogEntry, FeelingEntry, ParsedEntry, BaselineMetric, and Insight entities.
- **Baseline Computation:** Rolling 14/30-day aggregations on entry submission, per user and per metric.
- **Deterministic Insights Engine:** Rule evaluation service that fires insights based on baseline deltas.
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
├── window_days (14 | 30)
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
  - Query: `?user_id=X&window_days=14`
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

### 3. Baseline Computation Service

Runs asynchronously after each FeelingEntry is created. Computes per-user, per-metric rolling windows.

### 4. Insights Engine

Deterministic rule evaluator integrated with baseline metrics.

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
│   │   └── insights.ts
│   ├── db/
│   │   ├── prisma.ts
│   │   └── schema.prisma
│   ├── services/
│   │   ├── baseline.ts
│   │   └── insights.ts
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

- [ ] API endpoints respond in <200ms (p95) with valid JSON
- [ ] Baseline calculations complete within 5 seconds on 100+ entries
- [ ] Sample seed data available: 3 test users, 50+ entries each
- [ ] OpenAPI spec shared with other teams
- [ ] All endpoints covered by unit + integration tests (>80% coverage)
- [ ] Error handling: 400 for validation, 404 for not found, 500 with error logs

## Integration Points

- **Stream 2 (Frontend):** Consumes all `/entries`, `/feelings`, `/trends`, `/insights`
- **Stream 3 (Analytics):** Receives baseline data, returns insight objects
- **Stream 4 (Integration):** Optional NLP enrichment of ParsedEntry

See [../docs/INTEGRATION_CONTRACT.md](../docs/INTEGRATION_CONTRACT.md) for detailed sync plan.

## Next Steps

1. Scaffold Node/TypeScript project
2. Setup PostgreSQL with Prisma
3. Define schema in `schema.prisma`
4. Implement REST endpoints
5. Build baseline computation service
6. Create sample seeds with 3 users, 50+ entries
7. Share OpenAPI spec with other streams
