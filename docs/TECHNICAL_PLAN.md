# FitForecast MVP Technical Plan

Date: 2026-02-11

## Product Summary

FitForecast is a personal pattern analyzer for workouts and food. The MVP proves that personalized behavioral insights are more useful than generic tracking by helping users log in natural language, capture feelings before and after, establish personal baselines, and surface simple pattern-based insights.

## Success Criteria (MVP)

- Users can log workouts and meals in natural language.
- Users can log how they felt before and after each entry.
- Baselines are computed per user and per category (workout, meal, mood).
- Insights are derived from personal trends, not population averages.
- Insights are short, explainable, and tied to observed patterns.

## Non-Goals (MVP)

- Coaching or medical advice.
- Predictive body composition.
- Social features.
- Wearables integrations.
- Full nutrition database replacement.

## Architecture Overview

MVP will be a single, deployable web app with a simple backend and a small set of core services:

- **Frontend**: Web app for logging and insights.
- **API**: RESTful API for entries, feelings, baselines, and insights.
- **Data**: Relational database for structured logs and derived metrics.
- **Insights Engine**: Deterministic rules over user history and baseline deltas.
- **NLP Parsing**: Light-weight intent and entity extraction to structure natural language logs.

## Tech Stack (Proposed)

- **Frontend**: React + TypeScript.
- **Backend**: Node.js + TypeScript (Express or Fastify).
- **Database**: PostgreSQL.
- **NLP Parsing**: Rule-based extraction with optional LLM fallback (off by default for MVP).
- **Hosting**: Docker containers; deploy on Render, Fly.io, or similar.

## Core Domain Model

### Entities

- **User**
  - `id`, `email`, `created_at`

- **LogEntry**
  - `id`, `user_id`, `type` (workout | meal)
  - `raw_text` (original natural language)
  - `occurred_at`
  - `created_at`

- **FeelingEntry**
  - `id`, `log_entry_id`
  - `when` (pre | post)
  - `valence` (1-5)
  - `energy` (1-5)
  - `stress` (1-5)
  - `notes`

- **ParsedEntry**
  - `id`, `log_entry_id`
  - `activity_type` (e.g., run, strength)
  - `duration_min`
  - `intensity` (low | medium | high)
  - `meal_type` (breakfast | lunch | dinner | snack)
  - `food_tags` (array)

- **BaselineMetric**
  - `id`, `user_id`, `scope` (workout | meal | mood)
  - `metric` (e.g., energy_post)
  - `value`
  - `window_days`
  - `updated_at`

- **Insight**
  - `id`, `user_id`, `type`
  - `summary`, `supporting_stats`
  - `created_at`

## Data Flow

1. User submits a natural language workout or meal entry.
2. Entry is stored as `LogEntry` with raw text.
3. Optional: NLP parses the entry into `ParsedEntry`.
4. User adds pre/post feelings.
5. Baseline engine updates rolling metrics.
6. Insights engine evaluates rules and produces insights.

## Insights Engine (MVP)

Insights are deterministic, explainable patterns using per-user baselines.

Example rules:

- **Energy uplift after strength**
  - If average post-workout energy after strength sessions is +1.0 higher than baseline for at least 5 entries, generate insight.

- **Low energy after late meals**
  - If meals logged after 9pm correlate with lower next-morning energy than baseline, generate insight.

- **Mood stability on routine days**
  - If days with both workout and meal logs show reduced stress variance compared to baseline, generate insight.

## NLP Parsing (MVP)

Start with rule-based parsing to avoid overreach:

- Detect activity keywords (run, lift, yoga).
- Detect duration (e.g., "30 min").
- Detect intensity keywords (easy, hard).
- Detect meal type (breakfast, dinner).
- Extract food tags from a small seed list.

Store `raw_text` and parsed fields separately so parsing can improve without losing data.

## API Endpoints (MVP)

- `POST /entries` - Create workout or meal entry with `raw_text`.
- `POST /entries/:id/feelings` - Add pre/post feelings.
- `GET /insights` - List active insights.
- `GET /trends` - Baseline and trend data for UI.
- `GET /entries` - List history.

## Baseline Strategy

- Rolling windows: 14-day and 30-day baselines.
- Separate baselines by entry type and metric.
- Update on each new post-feeling entry.

## Risks and Mitigations

- **Sparse data**: Require minimum entries before insights (e.g., 5+).
- **Parsing errors**: Keep raw text and allow user corrections later.
- **Overfitting**: Use conservative thresholds and simple rules.

## Milestones

1. **Foundations**: Data model, logging flow, and feelings capture.
2. **Baselines**: Rolling metrics and trend visualization.
3. **Insights**: Rule-based insights with supporting stats.
4. **Polish**: UI improvements and error handling.

## Out of Scope (MVP)

- Coaching plans or calorie targets.
- Medical claims or diagnosis.
- Social feeds, challenges, or leaderboards.
- Wearables and external data sources.

## Next Steps

- Confirm stack preferences.
- Define the first 3-5 insights with thresholds.
- Create UI wireframes for logging and insights pages.
