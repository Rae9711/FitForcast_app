# Stream 4: Data Quality, Integration & Deployment

**Owner:** QA / Integration Engineer  
**Status:** Depends on Streams 1, 2, 3 for integration; can start scenarios immediately  
**Priority:** CRITICAL (validates data quality, enables deployment)

## Overview

Stream 4 is the quality gate and deployment coordinator. It owns:
- **NLP Parsing:** Rule-based and optional LLM extraction of structured data from natural language logs.
- **Scenarios & Test Cases:** User stories, edge cases, and sample logs that validate all other streams.
- **End-to-End Testing:** Full flow validation (log → parse → baseline → insight).
- **Deployment & DevOps:** Docker, CI/CD, environment setup, seed scripts.

## Scope (MVP)

- **Rule-Based NLP Parser:** Keyword/regex extraction for activity type, duration, intensity, meal type, food tags.
- **LLM Fallback (Optional, Disabled):** GPT/Claude for entries that fail rule-based parsing.
- **Scenario Documentation:** User stories, sample logs, edge cases.
- **E2E Tests:** Playwright or Cypress tests covering primary user flows.
- **Deployment Setup:** Docker, docker-compose, GitHub Actions, environment variables.
- **Seed & Demo Script:** Prepopulate DB with demo users + realistic history.

## Part 1: NLP Parsing

### Rule-Based Parser
Deterministic keyword/regex extraction for:
- Activity type (run, strength, yoga, cycling, etc.)
- Duration extraction
- Intensity classification (low, medium, high)
- Meal type and food tag extraction
- Confidence scoring

### LLM Fallback (Optional, Disabled by Default)
For entries the rule-based parser can't handle, optionally trigger:
- GPT-4 or Claude for improved extraction
- Gated behind config flag: `LLM_PARSER_ENABLED=false`

## Part 2: Scenarios & Test Cases

### User Stories
3+ detailed personas with typical logging patterns:
- **Jordan (28):** Active gym-goer, strength training focus, expects energy insights
- **Alex (35):** Fitness + nutrition conscious, sensitive to meal timing effects
- **Sam (42):** New to structured logging, progression from sparse to dense

### Sample Logs
10+ realistic log entries with expected parse outputs:
- Easy run (low intensity, 30 min)
- Heavy strength session (high intensity, 60 min)
- Nutritious lunch (protein, carbs, vegetables)
- Late dinner (potential issue)
- Sparse/ambiguous logs (edge case)

### Edge Cases
5+ documented scenarios:
- New user with sparse data (day 1)
- Conflicting signals (low energy but high mood)
- Very long log text (multi-activity)
- Typos & abbreviations
- Duplicate logging

## Part 3: End-to-End Tests

Playwright or Cypress tests covering:
- Full user flow: log → baseline → insight
- Parser accuracy on diverse inputs
- Baseline computation determinism
- Insight rule firing at correct thresholds

## Part 4: Deployment & DevOps

### Docker Setup
docker-compose.yml with:
- PostgreSQL service
- Backend API service
- Frontend service
- Volume management for DB persistence

### CI/CD Pipeline
GitHub Actions workflow:
- Lint (prettier, eslint)
- Unit tests (backend, frontend, analytics)
- Integration tests
- E2E tests (optional on PRs)

### Seed & Demo Script
Prepopulate DB with:
- 3 demo users (Jordan, Alex, Sam)
- 40–50 realistic entries each
- Pre/post feelings for most entries
- Insights should fire automatically

## File Structure

```
stream-4-integration/
├── README.md
├── llm/
│   ├── src/
│   │   ├── parser.ts
│   │   ├── llm-fallback.ts
│   │   └── index.ts
│   ├── tests/
│   │   └── parser.test.ts
│   └── README.md
├── scenarios/
│   ├── README.md
│   ├── user_stories.md
│   ├── sample_logs.json
│   ├── edge_cases.md
│   └── personas/
│       ├── jordan.json
│       ├── alex.json
│       └── sam.json
├── tests/
│   ├── e2e/
│   │   └── logging-flow.spec.ts
│   └── integration/
│       └── full-flow.test.ts
├── scripts/
│   └── seed-demo.ts
├── docker-compose.yml
├── .github/
│   └── workflows/
│       └── ci.yml
└── .env.example
```

## Success Criteria

- [ ] Rule-based parser extracts ≥90% of activity types, durations correctly
- [ ] 10+ sample logs with expected outputs
- [ ] 5+ edge cases documented
- [ ] E2E tests cover primary flows (≥80% pass rate)
- [ ] Docker compose up completes in <5 min
- [ ] Demo seed script populates 3 users with 40+ entries each
- [ ] CI/CD pipeline runs on every PR; blocks merge on failure

## Integration Points

- **Stream 1 (Backend):** Parser integrates with LogEntry → ParsedEntry flow; seed script populates DB
- **Stream 2 (Frontend):** E2E tests drive Frontend UI; must support test selectors
- **Stream 3 (Analytics):** Scenario data validates insights; notebooks use sample data

See [../docs/INTEGRATION_CONTRACT.md](../docs/INTEGRATION_CONTRACT.md) for detailed sync plan.

## Next Steps

1. Document user stories and sample logs
2. Define edge cases
3. Build rule-based NLP parser
4. Create sample test fixtures
5. Write E2E tests
6. Set up Docker + CI/CD
7. Create demo seed script
