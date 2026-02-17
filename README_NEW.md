# FitForecast: Personal Behavioral Pattern Analyzer

[![CI Tests](https://github.com/Rae9711/FitForcast_app/actions/workflows/test.yml/badge.svg)](https://github.com/Rae9711/FitForcast_app/actions/workflows/test.yml)
[![coverage](https://img.shields.io/badge/coverage-85.49%25-yellow.svg)](https://github.com/Rae9711/FitForcast_app/actions/workflows/test.yml)

FitForecast helps users discover **their own patterns**—not through generic tracking or coaching, but through personalized behavioral insights derived from their unique baseline. Users log workouts and meals in natural language, capture how they felt before and after, and receive explainable insights tied to their personal trends.

## Product Promise: Personalization-First

Every insight is **personal to the user**:
- Baselines are per-user, per-category (workouts vs. meals, mood deltas).
- Insights surface *deviations from your baseline*, not population norms.
- Rules are explainable: "Your energy is +1.2 higher after strength sessions vs. your average."
- Users see *trends relative to themselves*, enabling self-discovery.

## MVP Success Criteria

✓ Users can log workouts and meals in natural language.  
✓ Users capture pre/post feelings on 1–5 scales (valence, energy, stress).  
✓ Per-user baselines compute automatically on rolling windows (14 and 30 days).  
✓ At least 3 personalized insight rules fire and surface in the UI.  
✓ Insights include supporting stats that explain *why* the rule triggered.  
✓ Users see personal trend charts (baseline vs. recent activity).  

## Out of Scope (MVP)

- Coaching plans, calorie targets, or medical advice.
- Body composition or biometric predictions.
- Social feeds, leaderboards, or challenges.
- Wearable integrations.
- Full nutrition database replacement.

---

## MVP Delivery: Four Independent Work Streams

Each stream can be developed and tested in parallel. Integration happens via **shared API contracts** and **sample data fixtures**.

### **Stream 1: Backend & Infrastructure** *(Platform Foundation)*

**Owns:** API, database schema, baseline computation, REST endpoints.

**Deliverables:**
- PostgreSQL schema for User, LogEntry, FeelingEntry, ParsedEntry, BaselineMetric, Insight.
- Express/Fastify REST API with endpoints:
  - `POST /entries` → Create log entry (workout or meal).
  - `POST /entries/:id/feelings` → Attach pre/post feelings.
  - `GET /entries?user_id=X` → Retrieve user history.
  - `GET /trends?user_id=X` → Return baselines + recent metrics.
  - `GET /insights?user_id=X` → Retrieve active insights.
- Baseline computation service: rolling 14/30-day aggregations (e.g., average post-workout energy, meal frequency, mood variance).
- Database migrations and seeding scripts with sample users and test data.
- OpenAPI/Swagger docs for API.

**Success Criteria:**
- API endpoints respond with correct schema within 200ms (p95).
- Baseline calculations complete within 5s on datasets with 100+ entries.
- Sample seed data fixtures available for frontend and analytics teams.

**Dependencies:**
- Must deliver API spec + sample JSON payloads *before* Frontend starts.
- Analytics needs baseline metric definitions early for validation.

**Integration Points:**
- Frontend: consumes `/entries`, `/feelings`, `/trends`, `/insights`.
- Stream 3 (Insights Engine): receives baseline data, returns insight objects.
- Stream 4 (NLP): optionally enriches ParsedEntry fields in [stream-4-integration/llm/](stream-4-integration/llm/).

---

### **Stream 2: Frontend Experience** *(Logging & Insights UI)*

**Owns:** React app, logging composer, feeling capture, trends dashboard, insights display.

**Deliverables:**
- React + TypeScript app.
- **Logging Page:** Rich textarea for natural-language entry (workout/meal), type switcher, quick-submit button.
- **Feeling Capture:** Pre/post modal with three 1–5 sliders (valence, energy, stress) + optional notes field.
- **History View:** Sortable/filterable list of past entries with feeling tags.
- **Trends Dashboard:** Charts showing user baseline + recent activity (14-day rolling window), with adjustable date range.
- **Insights Pane:** Display active insights with supporting stats ("You average X, but last week was Y").
- Optimistic UI updates (entry appears immediately before server confirm).
- Error boundaries and toast notifications for network/validation failures.

**Success Criteria:**
- Logging flow completes in <3 interactions (entry + pre-feeling + post-feeling).
- Trends visualizations update in <1s on new data.
- UI renders correctly on desktop + mobile viewports.
- All pages accessible from mockups or Figma designs before coding starts.

**Dependencies:**
- Requires API spec + sample payloads from Stream 1 *before* starting.
- Requires sample seed data fixtures from Stream 1 for development/testing.
- Tests should mock API responses; no live backend required initially.

**Integration Points:**
- Stream 1 (Backend): fetches entries, trends, insights.
- Stream 3 (Insights Engine): displays insights and supporting metrics.
- No direct dependency on Stream 4 (NLP) for MVP (server-side parsing is optional).

---

### **Stream 3: Insights Engine & Analytics** *(Personalized Rules & Validation)*

**Owns:** Baseline metric definitions, insight rule evaluation, analytics validation, scenario testing.

**Deliverables:**
- **Baseline Metrics Service:** Compute and store rolling averages for:
  - Post-workout energy, pre-meal energy, post-meal energy.
  - Workout frequency, meal frequency.
  - Mood variance (stress/valence spread).
- **Insight Rules Engine:** Deterministic rules that fire on baseline deltas:
  - Rule 1: "Energy uplift after strength" (post-strength energy > baseline + 1.0, min. 5 entries).
  - Rule 2: "Late meals correlate with lower morning energy" (post 9pm meals → next-morning energy delta).
  - Rule 3: "Routine days stabilize mood" (days with both workout + meal → lower stress variance).
  - *(Define 2–3 more rules tailored to MVP insight goals.)*
- **Analytics Notebooks/Scripts:** Validate thresholds and insight accuracy against synthetic and real user scenarios.
- **Scenario Simulation:** Test insights with input data from [stream-4-integration/scenarios/](stream-4-integration/scenarios/) to ensure rules remain stable with sparse data.
- Insight generation job (triggered on new feeling entries); return insights with `summary`, `stats`, `created_at`.

**Success Criteria:**
- Insight rules are deterministic and reproducible (same input → same output).
- Rules fire correctly on ≥5 entries per category (no false positives on sparse data).
- Each insight includes ≥2 supporting stats (e.g., "Your avg post-strength energy: 4.2, overall avg: 3.1").
- Thresholds validated via analytics notebooks; document assumptions and edge cases.

**Dependencies:**
- Requires BaselineMetric schema + baseline computation from Stream 1 *before* starting.
- Requires sample scenarios from [stream-4-integration/scenarios/](stream-4-integration/scenarios/) for testing.
- Should align with Frontend on which insights to surface first.

**Integration Points:**
- Stream 1 (Backend): receives baseline data, returns insight objects via Insight entity.
- Stream 2 (Frontend): displays insights + supporting stats.
- Stream 4 (NLP): optional—improved parsing may refine insight inputs (e.g., better activity detection).

---

### **Stream 4: Data Quality & Integration** *(NLP Parsing, Testing, Deployment)*

**Owns:** Natural language parsing, scenario testing, end-to-end validation, deployment setup.

**Deliverables:**
- **Rule-Based NLP Parser:** Keyword/regex extraction for LogEntry raw text:
  - Detect activity type (run, lift, yoga, cycling, etc.).
  - Extract duration (e.g., "30 mins").
  - Classify intensity (easy, moderate, hard).
  - Detect meal type and food tags from seed list.
  - Store results in ParsedEntry; keep raw_text for future re-parsing.
- **LLM Fallback (Optional, Disabled by Default):** Test GPT/Claude for entries that fail rule-based parsing; gate behind config flag.
- **Scenario-Driven Tests:** Use [stream-4-integration/scenarios/](stream-4-integration/scenarios/) (user stories, edge cases, sample logs) to validate:
  - Parsing accuracy on diverse input (abbreviations, typos, etc.).
  - End-to-end flows: log → baseline update → insight generation.
  - Insight accuracy on multi-user data.
- **Deployment Setup:** Docker containerization, CI/CD pipeline (lint + unit tests + optional e2e), environment configuration (env vars for DB, API keys).
- **Seed & Demo Script:** Prepopulate DB with demo users and realistic logging history for stakeholder demos.

**Success Criteria:**
- Rule-based parser correctly extracts ≥90% of activity types and durations on scenario samples.
- End-to-end tests cover: login → log entry → feeling capture → insight generation.
- Deployment pipeline runs in <5 min; can promote from staging to production.
- Demo script loads 3 users with 30–50 realistic entries each; insights surface within 1s.

**Dependencies:**
- Requires sample scenarios + test fixtures from [stream-4-integration/scenarios/](stream-4-integration/scenarios/) *before* starting.
- Requires full API + baseline logic from Streams 1 & 3 for end-to-end testing.
- Requires frontend from Stream 2 for UI-level end-to-end tests.

**Integration Points:**
- All Streams: validates cross-stream integration via e2e tests.
- Deployment affects all services; coordinate rollout timing.

---

## Repo Structure (4-Stream Organization)

Each stream is an independent, self-contained work package. Teams can develop and test in parallel.

```
.
├── README.md                                    ← You are here
│
├── docs/                                        ← Shared Architecture & Contracts
│   ├── TECHNICAL_PLAN.md                        ← Product & technical vision
│   ├── INTEGRATION_CONTRACT.md                  ← Cross-stream sync plan
│   └── API_SPEC.md                              ← (Stream 1 creates)
│
├── stream-1-backend/                            ← Backend & Infrastructure
│   ├── README.md                                ← Stream 1 deliverables & checklist
│   ├── src/
│   │   ├── api/                                 ← REST endpoints
│   │   ├── db/                                  ← Prisma schema, migrations
│   │   ├── services/                            ← Baseline computation, insights engine
│   │   └── index.ts                             ← Server entry
│   ├── tests/                                   ← Unit + integration tests
│   ├── seeds/                                   ← Sample data fixtures
│   ├── package.json
│   └── tsconfig.json
│
├── stream-2-frontend/                           ← Frontend & Logging UI
│   ├── README.md                                ← Stream 2 deliverables & checklist
│   ├── src/
│   │   ├── pages/                               ← Dashboard, LogEntry, History, Trends
│   │   ├── components/                          ← EntryComposer, FeelingCapture, Charts
│   │   ├── api/                                 ← API client wrappers
│   │   └── context/                             ← State management
│   ├── tests/                                   ← Component + page tests
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
│
├── stream-3-analytics/                          ← Insights Engine & Analytics
│   ├── README.md                                ← Stream 3 deliverables & checklist
│   ├── src/
│   │   ├── metrics/                             ← Baseline metric definitions
│   │   ├── rules/                               ← Insight rule implementations
│   │   └── utils/                               ← Helper functions
│   ├── notebooks/                               ← Jupyter notebooks for validation
│   │   ├── 01_baseline_definitions.ipynb
│   │   ├── 02_insight_rule_validation.ipynb
│   │   └── 03_edge_case_testing.ipynb
│   ├── test_data/                               ← Sample users, edge cases
│   ├── tests/                                   ← Unit tests for rules
│   ├── requirements.txt
│   └── package.json
│
├── stream-4-integration/                        ← Data Quality, QA & Deployment
│   ├── README.md                                ← Stream 4 deliverables & checklist
│   │
│   ├── llm/                                     ← NLP Parsing
│   │   ├── src/
│   │   │   ├── parser.ts                        ← Rule-based extraction
│   │   │   └── llm-fallback.ts                  ← Optional LLM enrichment (disabled by default)
│   │   └── tests/
│   │
│   ├── scenarios/                               ← User Stories & Test Data
│   │   ├── README.md
│   │   ├── user_stories.md                      ← Jordan, Alex, Sam personas
│   │   ├── sample_logs.json                     ← 10+ test fixtures with expected outputs
│   │   ├── edge_cases.md                        ← Sparse data, typos, conflicts
│   │   └── personas/
│   │       ├── jordan.json
│   │       ├── alex.json
│   │       └── sam.json
│   │
│   ├── tests/                                   ← E2E & integration tests
│   │   ├── e2e/
│   │   │   └── logging-flow.spec.ts             ← Playwright/Cypress tests
│   │   └── integration/
│   │       └── full-flow.test.ts
│   │
│   ├── scripts/
│   │   └── seed-demo.ts                         ← Demo data generator
│   │
│   ├── docker-compose.yml                       ← Local dev environment
│   ├── .github/
│   │   └── workflows/
│   │       └── ci.yml                           ← GitHub Actions pipeline
│   └── .env.example
```

---

## Getting Started: Partner Onboarding

### **Stream 1 Partner (Backend):**
1. Start with [stream-1-backend/README.md](stream-1-backend/README.md).
2. Define PostgreSQL schema (use Prisma).
3. Implement REST endpoints with validation.
4. Create sample data fixtures in `stream-1-backend/seeds/`.
5. Share OpenAPI spec with other streams.

### **Stream 2 Partner (Frontend):**
1. Start with [stream-2-frontend/README.md](stream-2-frontend/README.md).
2. Wait for API spec from Stream 1.
3. Use sample fixtures to mock API calls.
4. Build components: logging, feelings, history, trends, insights.
5. Test with mock data; integrate API once available.

### **Stream 3 Partner (Analytics & Insights):**
1. Start with [stream-3-analytics/README.md](stream-3-analytics/README.md).
2. Collaborate with Stream 1 on BaselineMetric schema.
3. Define insight rules + thresholds.
4. Create validation notebooks.
5. Test against scenarios from Stream 4.

### **Stream 4 Partner (Data Quality & Deployment):**
1. Start with [stream-4-integration/README.md](stream-4-integration/README.md).
2. Document user stories and sample logs in [stream-4-integration/scenarios/](stream-4-integration/scenarios/).
3. Build rule-based NLP parser in [stream-4-integration/llm/](stream-4-integration/llm/).
4. Create end-to-end tests once other streams have deliverables.
5. Set up Docker + CI/CD.

---

## Integration Milestones

1. **Week 1:** All streams define and share contracts (API spec, schema, sample data).
2. **Week 2:** Streams 1, 2, and 3 deliver core functionality and mock tests.
3. **Week 3:** Stream 4 integrates all pieces; runs end-to-end tests. Polish, stress-test, prepare for stakeholder demo.

---

## Documentation

- **Product & Architecture:** [docs/TECHNICAL_PLAN.md](docs/TECHNICAL_PLAN.md)
- **Integration Contract:** [docs/INTEGRATION_CONTRACT.md](docs/INTEGRATION_CONTRACT.md)
- **API Specification:** [docs/API_SPEC.md](docs/API_SPEC.md) *(Stream 1 deliverable)*
- **Stream 1 (Backend):** [stream-1-backend/README.md](stream-1-backend/README.md)
- **Stream 2 (Frontend):** [stream-2-frontend/README.md](stream-2-frontend/README.md)
- **Stream 3 (Analytics):** [stream-3-analytics/README.md](stream-3-analytics/README.md)
- **Stream 4 (Integration):** [stream-4-integration/README.md](stream-4-integration/README.md)
- **Scenarios & Test Data:** [stream-4-integration/scenarios/README.md](stream-4-integration/scenarios/README.md)

## CI & Docs (local snapshot)

- Current local test coverage (example run): **85.49%**. Add the CI workflow to enforce an 80% threshold across branches.
- OpenAPI spec for Stream 1: [stream-1-backend/docs/openapi.yaml](stream-1-backend/docs/openapi.yaml)

When ready, add a GitHub Actions badge and host the OpenAPI docs via the server or GitHub Pages.
