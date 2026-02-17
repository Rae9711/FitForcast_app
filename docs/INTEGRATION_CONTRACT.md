# FitForecast MVP: Four-Stream Integration Contract

**Purpose:** Define clear expectations, data contracts, and integration points so all four partner teams can work in parallel.

---

## Stream Responsibilities at a Glance

| Stream | Owner | Outputs | Depends On |
|--------|-------|---------|-----------|
| **1: Backend & Infrastructure** | Backend Engineer | PostgreSQL schema, REST API, baseline computation, seed data | — |
| **2: Frontend & UI** | Frontend Engineer | React app, logging interface, trends dashboards, insights display | Stream 1 API spec + seed data |
| **3: Insights Engine & Analytics** | Data Scientist | Baseline metric definitions, insight rules (3–5), validation notebooks | Stream 1 schema, Stream 4 scenarios |
| **4: Data Quality & Integration** | QA/Integration Eng | NLP parser, scenario tests, E2E tests, deployment setup | All streams (for integration) |

---

## Phase 1: Contracts & Setup (Week 1)

### Day 1–2: Backend → Defines Schema & API Spec
**Stream 1 Delivers:**
- PostgreSQL schema (Prisma `schema.prisma`)
- API specification (OpenAPI/Swagger with example payloads)
- Sample seed data JSON (3 users, 50 entries each)

**Example API Spec (Excerpt):**
```json
{
  "POST /entries": {
    "description": "Create a new log entry (workout or meal)",
    "requestBody": {
      "type": "workout" | "meal",
      "raw_text": "30 min easy run",
      "occurred_at": "2026-02-16T10:00Z"
    },
    "response": {
      "id": "uuid",
      "user_id": "uuid",
      "type": "workout",
      "raw_text": "30 min easy run",
      "occurred_at": "2026-02-16T10:00:00Z",
      "created_at": "2026-02-16T10:15:00Z"
    }
  }
}
```

**Shared With:** Streams 2, 3, 4

---

### Day 3: Frontend → Uses Mock Data
**Stream 2 Starts:**
- Create React project with mock data from Stream 1 seeds
- Build components in isolation (EntryComposer, FeelingCapture, etc.)
- Test all UI flows with mock API responses

**No dependency on live backend yet.**

---

### Day 3–4: Analytics → Defines Insight Rules & Scenarios
**Stream 3 & 4 Start in Parallel:**

**Stream 3 Delivers:**
- Baseline metric definitions (post-strength-energy, late-meal-correlation, etc.)
- Insight rule specifications with thresholds
- Python/Jupyter notebooks for validation

**Stream 4 Delivers:**
- Scenario user stories (Jordan, Alex, Sam)
- Sample logs JSON with expected parse outputs
- Edge case documentation

**Shared With:** Stream 1 (for baseline computation) and all streams (for testing)

---

## Phase 2: Core Implementation (Week 2)

### Stream 1: API & Baseline Computation
**Deliverables:**
- ✓ REST endpoints operational (< 200ms response time)
- ✓ Baseline computation job triggers on FeelingEntry creation
- ✓ Unit tests for baseline calculations (fixed data → reproducible output)
- ✓ Seed script populates test users: `npm run seed`

**Integration Check:**
```bash
# Test baseline computation
curl http://localhost:3001/entries -X POST \
  -H "Content-Type: application/json" \
  -d '{ "type": "workout", "raw_text": "30 min run", "occurred_at": "..." }'

curl http://localhost:3001/trends?user_id=<id>
# Should return { baselines: [...], recent: [...] }
```

---

### Stream 2: React Components
**Deliverables:**
- ✓ Logging page (entry composer + feeling capture)
- ✓ History view (list of past entries)
- ✓ Trends dashboard (charts of baselines)
- ✓ Insights pane (placeholder for insights)
- ✓ All tests pass with mock data
- ✓ Mobile responsive (375px+)

**Integration Check:**
```bash
# Frontend works with mocks; can run standalone
npm run dev # Should load http://localhost:3000 without backend
# Can log entry, add feelings, see history (from mock localStorage)
```

---

### Stream 3: Insight Rules & Validation
**Deliverables:**
- ✓ 3–5 insight rules implemented and tested
- ✓ Validation notebooks show rules fire correctly on sample users
- ✓ Thresholds documented (why 0.8? why ≥5 entries?)
- ✓ Rules available for Backend to integrate

**Integration Check:**
```python
# Run validation notebook
jupyter notebook analytics/notebooks/02_insight_rule_validation.ipynb
# Output shows: "Rule 'energy_uplift_strength' fires for Jordan after entry #5"
```

---

## Phase 3: Integration Testing (Week 3)

### Stream 4: E2E Tests & Cross-Stream Validation

**Deliverables:**
- ✓ Rule-based parser tested against sample logs (≥90% accuracy)
- ✓ E2E tests cover: log → parse → baseline → insight
- ✓ Docker compose works: `docker-compose up` → all services running
- ✓ Seed demo script: `npm run seed:demo` → populated database

**Integration Workflow:**

1. **Start all services:**
   ```bash
   docker-compose up
   # postgres, backend, frontend all running
   ```

2. **Seed demo data:**
   ```bash
   npm run seed:demo
   # Creates 3 users (Jordan, Alex, Sam) with 40–50 entries each
   ```

3. **Run E2E tests:**
   ```bash
   npm run test:e2e
   # Playwright tests: log → baseline → insight
   ```

4. **Validate each stream's output:**
   - **Stream 1 check:** Baselines computed correctly
   - **Stream 2 check:** UI displays entries, trends, insights
   - **Stream 3 check:** Insight rules fired at expected points
   - **Stream 4 check:** Parser extracted correct fields

---

## Data Flow Diagram

```
USER INPUT
   ↓
[Entry Composer] (Stream 2)
   ↓
POST /entries
   ↓
[Backend API] (Stream 1)
   ↓
LogEntry created → [NLP Parser] (Stream 4)
                      ↓
                   ParsedEntry stored
   ↓
Prompt for feelings
   ↓
[Feeling Capture] (Stream 2)
   ↓
POST /entries/:id/feelings
   ↓
[Backend API] (Stream 1)
   ↓
FeelingEntry created → [Baseline Computation] (Stream 1)
                           ↓
                        BaselineMetric updated
   ↓
[Insights Engine] (Stream 3)
   ↓
Insight rules evaluated
   ↓
Insight created (if threshold met)
   ↓
GET /insights
   ↓
[Insights Pane] (Stream 2)
   ↓
USER SEES: "You feel +1.2 more energized after strength workouts"
```

---

## Acceptance Criteria by Stream

### Stream 1: Backend ✓ Ready for Integration
- [ ] All 5 REST endpoints implemented and tested
- [ ] Baseline computation deterministic (same input → same output)
- [ ] Seed data available: 3 users × 50+ entries
- [ ] OpenAPI spec published
- [ ] <200ms response time (p95)

### Stream 2: Frontend ✓ Ready for Integration
- [ ] All pages render correctly
- [ ] Logging flow completes in <3 interactions
- [ ] Works with mock data (can run standalone)
- [ ] Mobile responsive
- [ ] Ready to wire to real API

### Stream 3: Analytics ✓ Ready for Integration
- [ ] 3–5 rules defined and validated
- [ ] Thresholds justified + documented
- [ ] Insight payloads include supporting_stats
- [ ] Rules deterministic
- [ ] Notebooks prove rules work on sample data

### Stream 4: QA/Integration ✓ Ready for Launch
- [ ] Parser ≥90% accurate on sample logs
- [ ] E2E tests pass: full user flows work
- [ ] Docker Compose works: all services up together
- [ ] Demo seed data loads in <30s
- [ ] CI/CD pipeline green (lint + tests)

---

## Shared Test Data Location

All teams reference:

```
scenarios/
├── user_stories.md — Personas (Jordan, Alex, Sam)
├── sample_logs.json — Test fixture (10+ logs with expected outputs)
├── edge_cases.md — Edge case scenarios
└── personas/
    ├── jordan.json — Full 50-entry history
    ├── alex.json — Full 25-entry history
    └── sam.json — Progression (sparse → dense)
```

---

## Communication Protocol

### Weekly Sync (Every Monday)
- **Participants:** All 4 stream leads
- **Duration:** 30 min
- **Agenda:**
  - Blockers & dependencies
  - Update on API/schema/rule changes
  - Confirm integration points still aligned

### Slack/Discord Channel: `#fitforecast-dev`
- Quick questions, blockers, PRs
- Integration updates

### Integration Pre-Check (Thursday of Week 2)
- Each stream runs integration tests against mock data from other streams
- Confirm contracts are honored (API shape, data format, etc.)

---

## Rollback & Iteration Risks

### Risk: Backend schema changes mid-project
**Mitigation:** Frontend and Analytics should mock/validate against API spec, not live DB. Small schema changes handled via Prisma migrations that all teams re-run.

### Risk: Insight rules don't fire as expected
**Mitigation:** Stream 3 validates thresholds in notebooks before Stream 1 implements. If thresholds wrong, adjust and re-test (deterministic, so reproducible).

### Risk: Parser fails on real user input
**Mitigation:** Stream 4 builds rule-based → LLM fallback progression. MVP ships rule-based only (LLM disabled). Real user data can be added post-launch to refine parser.

### Risk: Frontend UI doesn't match Backend API response shape
**Mitigation:** OpenAPI spec + example payloads from Stream 1 lock the contract. Frontend tests against mocks that match spec. Integration tests validate shape at runtime.

---

## Post-MVP Roadmap (Rough)

Once MVP ships (Week 4+):

- **Stream 1:** Optimize queries, add caching, multi-user scaling
- **Stream 2:** Analytics dashboard, export, notifications
- **Stream 3:** Add 2–3 more insight rules, personalization tuning
- **Stream 4:** LLM-enhanced parser, real user data validation, mobile app

---

## Success = Parallel Delivery

The goal is **independence:**
- Stream 1 can finish backend without waiting for frontend.
- Stream 2 can finish frontend using mocks without waiting for real API.
- Stream 3 can validate rules in notebooks without waiting for backend.
- Stream 4 can test scenarios and E2E flows in parallel.

**Integration happens in Week 3, not Week 1.**

This contract ensures each team knows exactly what to build, what to depend on, and when to integrate.

---

## Sign-Off

- [ ] **Stream 1 (Backend):** Confirm API spec, schema, seed data ready by **Monday EOD, Week 1**
- [ ] **Stream 2 (Frontend):** Confirm mock data received, starting component work **Tuesday, Week 1**
- [ ] **Stream 3 (Analytics):** Confirm scenario data received, starting rules work **Tuesday, Week 1**
- [ ] **Stream 4 (QA/Integration):** Confirm all streams' work items aligned; starting scenario docs **Tuesday, Week 1**

---

## Questions?

- Reach out in `#fitforecast-dev` or during weekly sync.
- All teams have **read access** to all READMEs and can leave comments/PRs for clarifications.
