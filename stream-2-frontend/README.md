# Stream 2: Frontend & Insights UI

**Owner:** Frontend Engineer  
**Status:** Depends on Stream 1 API spec  
**Priority:** HIGH (user-facing, validates product direction)

## Overview

The Frontend is the user-facing web application built with React and TypeScript. It provides the interface for logging workouts and meals, capturing pre/post feelings, viewing personal trends, and discovering personalized insights.

## Scope (MVP)

- **Logging Interface:** Natural-language text entry for workouts and meals, with type selection.
- **Feeling Capture:** Pre/post feeling sliders (valence, energy, stress) and optional notes.
- **History View:** Paginated/sortable list of past entries with feelings tags.
- **Trends Dashboard:** Charts showing user baseline vs. recent activity, adjustable windows.
- **Insights Pane:** Display active insights with supporting statistics.
- **API Integration:** Mock-first development, then wire to real endpoints.
- **Error Handling:** Validation feedback, network error toast messages, graceful fallbacks.

## Key Deliverables

### 1. Pages & Components

#### Home / Dashboard
- Quick summary: streak counts, recent insights, baseline status
- Call-to-action to log a new entry
- Quick links to trends and history

#### Logging Page
- **Entry Composer:**
  - Type selector: workout | meal
  - Text area: natural language input
  - Occurred-at date picker
  - Submit button

- **Feeling Capture (Modal/Sidebar):**
  - Pre-feeling sliders (valence, energy, stress)
  - Post-feeling sliders
  - Optional notes field
  - Submit button

#### History View
- Table/list of past entries (newest first)
- Each row: date, type icon, raw text, pre/post feelings
- Filters: type, date range
- Pagination (50 per page)

#### Trends Dashboard
- **Baseline Charts:**
  - Line chart: baseline vs. rolling windows
  - Metric dropdowns (post-energy, frequency, etc.)
- **Personalized Insights:**
  - Display active insights in a pane
  - Title, summary, supporting stats
  - Dismissal button
- Date range picker (14/30/90 days, custom)

### 2. API Client Layer

```typescript
export interface ApiClient {
  createEntry(type, raw_text, occurred_at): Promise<Entry>
  getEntries(userId, limit?): Promise<Entry[]>
  addFeeling(entryId, when, valence, energy, stress): Promise<FeelingEntry>
  getTrends(userId, windowDays?): Promise<TrendsData>
  getInsights(userId): Promise<Insight[]>
  dismissInsight(insightId): Promise<void>
}
```

## Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Charts:** Recharts or Chart.js
- **Forms:** React Hook Form + Zod
- **HTTP Client:** Axios or Fetch
- **State:** React Context + useReducer
- **Testing:** Vitest + React Testing Library

## File Structure

```
stream-2-frontend/
├── README.md
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── LogEntry.tsx
│   │   ├── History.tsx
│   │   └── Trends.tsx
│   ├── components/
│   │   ├── EntryComposer.tsx
│   │   ├── FeelingCapture.tsx
│   │   ├── EntryList.tsx
│   │   ├── TrendsChart.tsx
│   │   └── InsightCard.tsx
│   ├── api/
│   │   ├── client.ts
│   │   └── mocks.ts
│   ├── context/
│   │   ├── AppContext.ts
│   │   └── AppProvider.tsx
│   ├── types/
│   │   └── index.ts
│   └── styles/
├── tests/
├── public/
├── package.json
└── tsconfig.json
```

## Success Criteria

- [ ] Logging flow completes in <3 interactions
- [ ] Trends visualizations load and update in <1s
- [ ] Mobile responsive (375px+)
- [ ] Keyboard accessible (tab, enter, escape)
- [ ] Component test coverage >70%
- [ ] Lighthouse Accessibility score ≥90

## Integration Points

- **Stream 1 (Backend):** Consumes REST endpoints once API spec ready
- **Stream 3 (Analytics):** Displays insights and supporting stats from backend
- **Stream 4 (Integration):** E2E tests use Frontend for UI validation

See [../docs/INTEGRATION_CONTRACT.md](../docs/INTEGRATION_CONTRACT.md) for sync timeline.

## Next Steps

1. Scaffold Vite + React + TypeScript
2. Create mock data fixtures (based on Stream 1 seeds)
3. Build components in isolation
4. Connect to mock API
5. Test all pages with mock data
6. Integrate real API once Stream 1 ready
