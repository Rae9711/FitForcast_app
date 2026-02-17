# FitForecast: 4-Stream Organization Guide

## Quick Visual Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FITFORECAST MVP                                 │
│                 "Personal Behavioral Pattern Analyzer"                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                          SHARED ARCHITECTURE                            │
│                           (docs/ folder)                                │
│    TECHNICAL_PLAN.md | INTEGRATION_CONTRACT.md | API_SPEC.md          │
└─────────────────────────────────────────────────────────────────────────┘

       ↓               ↓                  ↓              ↓

┌──────────────┐  ┌──────────────┐  ┌──────────────┐ ┌──────────────┐
│   STREAM 1   │  │   STREAM 2   │  │  STREAM 3    │ │  STREAM 4    │
│  BACKEND &   │  │  FRONTEND &  │  │  INSIGHTS &  │ │   DATA QA &  │
│INFRASTRUCTURE│  │  LOGGING UI  │  │  ANALYTICS   │ │ DEPLOYMENT   │
└──────────────┘  └──────────────┘  └──────────────┘ └──────────────┘
       │                  │                 │              │
   Node/TS            React/TS          Python/TS       Playwright/TS
   PostgreSQL         Tailwind          Jupyter          Docker/CI
   Prisma            React Router       Pandas           E2E Tests
   REST API          Mock-first         Notebooks        Scenarios
       │                  │                 │              │
       └──────────────────┼─────────────────┼──────────────┘
                          ↓
                   (Week 3 Integration)
                          ↓
            ┌─────────────────────────────┐
            │  SHARED TEST DATA           │
            │  (scenarios/ folder)        │
            │  • User stories             │
            │  • Sample logs              │
            │  • Edge cases               │
            │  • Personas (Jordan, etc.)  │
            └─────────────────────────────┘
                          ↓
            ┌─────────────────────────────┐
            │  END-TO-END VALIDATION      │
            │  log → parse → baseline     │
            │  → insights → display       │
            └─────────────────────────────┘
```

---

## The 4 Streams Explained

### **Stream 1: Backend & Infrastructure** 🔧
**Location:** `stream-1-backend/`  
**Owner:** Backend Engineer  
**What They Build:**
- PostgreSQL database schema (6 tables: User, LogEntry, FeelingEntry, ParsedEntry, BaselineMetric, Insight)
- REST API (5 endpoints: POST /entries, POST /feelings, GET /trends, GET /insights, GET /entries)
- Baseline computation service (rolling 14/30-day aggregations per user)
- Insights engine (evaluates rules on baselines)
- Sample seed data (3 users, 50+ entries each)

**When It's Ready:**
- All endpoints respond <200ms
- Baselines compute in <5 seconds
- OpenAPI spec published for other teams
- Seed data available for mocking

**Key Deliverable:** `stream-1-backend/seeds/*.json` (used by all other teams)

---

### **Stream 2: Frontend & Insights UI** 🎨
**Location:** `stream-2-frontend/`  
**Owner:** Frontend Engineer  
**What They Build:**
- React app with TypeScript
- Logging page (entry composer + feeling capture)
- History view (sortable list)
- Trends dashboard (baseline charts)
- Insights pane (displays personalized insights)
- Mock API client (works without backend)

**When It's Ready:**
- All pages render correctly
- Logging flow: entry → pre-feeling → post-feeling (3 clicks)
- Mobile responsive
- Tests pass with mock data
- Ready to wire to real API

**Key Dependency:** Stream 1's OpenAPI spec + seed data for mocks

---

### **Stream 3: Insights Engine & Analytics** 📊
**Location:** `stream-3-analytics/`  
**Owner:** Data Scientist / Analytics Engineer  
**What They Build:**
- Baseline metric definitions (e.g., post-strength-energy, late-meal-energy)
- 3–5 insight rules with thresholds
- Jupyter validation notebooks
- Tests against sample scenarios
- Rule implementation for Backend to use

**When It's Ready:**
- Rules are deterministic (same input → same output)
- Rules fire correctly on ≥5 data points
- Thresholds documented with rationale
- Validation notebooks pass
- Rule config shared with Stream 1

**Key Dependency:** Stream 1's BaselineMetric schema; Stream 4's scenarios

---

### **Stream 4: Data Quality, Integration & Deployment** 🧪
**Location:** `stream-4-integration/`  
**Owner:** QA / Integration Engineer  
**What They Build:**

**Part A - Scenarios & Test Data (`stream-4-integration/scenarios/`):**
- 3 detailed user personas (Jordan, Alex, Sam)
- 10+ sample logs with expected parse outputs
- 5+ edge case scenarios
- Source of truth for test data

**Part B - NLP Parsing (`stream-4-integration/llm/`):**
- Rule-based parser (regex/keyword extraction)
- Optional LLM fallback (disabled by default)
- Parser tests (≥90% accuracy on sample logs)

**Part C - E2E Testing & Deployment:**
- Playwright/Cypress E2E tests (log → baseline → insight)
- Docker setup (docker-compose.yml)
- GitHub Actions CI/CD pipeline
- Demo seed script (auto-populates DB)

**When It's Ready:**
- Parser accurate on sample logs
- E2E tests cover primary flows
- Docker environment works locally
- Demo loads in <30 seconds
- CI/CD pipeline passing

**Key Role:** Validates integration of all 4 streams in Week 3

---

## Work Timeline

### **Week 1: Contracts & Setup**
- **Stream 1:** Publishes API spec, schema, seed data
- **Streams 2, 3, 4:** Receive contracts; plan their work

### **Week 2: Core Implementation (Parallel)**
- **Stream 1:** API endpoints, baseline computation, tests
- **Stream 2:** React components, logging/feelings UI, tests (with mocks)
- **Stream 3:** Insight rules, validation notebooks
- **Stream 4:** Scenarios, NLP parser, deployment setup

### **Week 3: Integration Testing**
- **All Streams:** Run E2E tests together
- **Stream 4:** Validates cross-stream integration
- **Blockers resolved:** Any API mismatches, data format issues

### **Week 4: Polish & Demo**
- Fix any bugs from integration testing
- Prepare demo for stakeholders
- Document known limitations + next steps

---

## Folder Structure at a Glance

```
FitForecast/
│
├── README.md                              ← Main overview (this document context)
│
├── docs/                                  ← Shared architecture/contracts
│   ├── TECHNICAL_PLAN.md
│   ├── INTEGRATION_CONTRACT.md
│   └── API_SPEC.md (Stream 1 creates)
│
├── stream-1-backend/                      ← Backend API + Database
│   ├── README.md                          ← Stream 1 spec
│   ├── src/
│   ├── tests/
│   ├── seeds/                             ← Sample data for other teams
│   └── package.json
│
├── stream-2-frontend/                     ← React UI
│   ├── README.md                          ← Stream 2 spec
│   ├── src/
│   ├── tests/
│   └── package.json
│
├── stream-3-analytics/                    ← Insights & validation
│   ├── README.md                          ← Stream 3 spec
│   ├── src/
│   ├── notebooks/                         ← Jupyter for validation
│   ├── tests/
│   └── requirements.txt
│
└── stream-4-integration/                  ← QA, NLP, Deployment
    ├── README.md                          ← Stream 4 spec
    │
    ├── scenarios/                         ← Shared test data
    │   ├── README.md
    │   ├── user_stories.md
    │   ├── sample_logs.json
    │   └── edge_cases.md
    │
    ├── llm/                               ← NLP parser
    │   ├── src/
    │   └── tests/
    │
    ├── tests/                             ← E2E & integration tests
    │   ├── e2e/
    │   └── integration/
    │
    ├── scripts/
    │   └── seed-demo.ts
    │
    ├── docker-compose.yml
    ├── .github/
    │   └── workflows/
    │       └── ci.yml
    └── package.json
```

---

## Key Integration Points

```
┌─────────────────────┐
│  STREAM 1: Backend  │
│  • PostgreSQL DB    │
│  • REST API         │
│  • Baselines        │
│  • Insights Engine  │
└──────────┬──────────┘
           │ Publishes:
           ├─ OpenAPI spec
           ├─ Seed data (3 users, 50+ entries)
           └─ BaselineMetric schema
           │
    ┌──────┴──────┬─────────┬──────────┐
    │             │         │          │
    ▼             ▼         ▼          ▼
┌────────┐  ┌────────┐ ┌────────┐  ┌────────┐
│STREAM 2│  │STREAM 3│ │STREAM 4│  │STREAM 4│
│Frontend│  │ Rules  │ │Scenarios│ │ Parser │
│(mocks  │  │ (validates)(defines)  (tests) │
│data)   │  │ rules) │ │test cases│ │accuracy│
└────────┘  └────────┘ └────────┘  └────────┘
    │            │         │          │
    └────────┬───┴─────────┴──────────┘
             │
             ▼ (Week 3)
    ┌──────────────────┐
    │ E2E Integration  │
    │  Test (Stream 4  │
    │  orchestrates)   │
    └──────────────────┘
```

---

## Communication Protocol

### **Slack Channel:** `#fitforecast-dev`
- Daily quick questions, blockers, PRs
- No long discussions (use weekly sync for that)

### **Weekly Sync (Mondays, 2pm):**
- 30 minutes, all 4 stream leads
- **Agenda:**
  - Blockers & dependencies
  - API/schema/rule changes
  - Confirm contracts still aligned

### **Integration Pre-Check (Thursday, Week 2):**
- Each stream runs validation against other teams' deliverables
- Confirm API contracts honored
- Report any mismatches before Week 3 integration

---

## Success Checklist

### ✅ Stream 1 Done
- [ ] API responds <200ms
- [ ] Baseline computation <5s
- [ ] Seed data ready
- [ ] OpenAPI spec published

### ✅ Stream 2 Done
- [ ] All pages render
- [ ] Logging flow <3 clicks
- [ ] Mobile responsive
- [ ] Tests pass with mocks
- [ ] Ready to swap to real API

### ✅ Stream 3 Done
- [ ] 3–5 rules defined
- [ ] Validation notebooks pass
- [ ] Thresholds documented
- [ ] Rule config shared

### ✅ Stream 4 Done
- [ ] Parser ≥90% accurate
- [ ] E2E tests passing
- [ ] Docker works locally
- [ ] Demo loads <30s
- [ ] CI/CD green

### ✅ Integration
- [ ] All 4 streams E2E tests pass together
- [ ] API shape matches spec
- [ ] Insights fire at expected thresholds
- [ ] No data format mismatches

---

## Questions?

- **For your stream:** Check your stream's README (e.g., `stream-1-backend/README.md`)
- **For cross-stream:** Check [docs/INTEGRATION_CONTRACT.md](../docs/INTEGRATION_CONTRACT.md)
- **For test data:** Check [stream-4-integration/scenarios/](stream-4-integration/scenarios/)
- **For sync:** Reach out in `#fitforecast-dev` or ask during Monday sync

---

**Remember:** Each stream can develop independently until Week 3. Use mock data, assume stable contracts, and focus on your own deliverables. 🚀
