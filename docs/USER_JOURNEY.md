# FitForecast User Journey

## Persona: Mara, the Busy Strength Athlete
- **Age:** 32
- **Lifestyle:** Balances a demanding product management job with early-morning strength sessions and weekend long runs.
- **Pain Point:** Struggles to understand how nutrition, training intensity, and emotional state interact. Wants concrete guidance rather than generic tips.

## Scenario Overview
Mara installs the FitForecast mobile client, which connects to the backend described in Stream 1. Over a typical week she records workouts and meals, logs her pre/post feelings, and reviews the insights generated from rolling baseline calculations. The steps below describe the full flow from her perspective and map to backend responsibilities.

## Day 1: Logging a Workout
1. **Capture:** After finishing a 45-minute barbell session, Mara opens the app and taps "Log Workout". She types "Heavy lower-body strength + accessory core" and sets the occurrence time to 6:15 AM.
2. **Backend Action:** The client sends `POST /entries` with `{ type: "workout", raw_text: "Heavy lower-body strength + accessory core", occurred_at: "2026-02-17T06:15:00Z" }`. The backend persists a `LogEntry`, returns the entry ID, and queues optional parsing.
3. **Feeling Check-ins:** The app prompts Mara for a quick pre/post mood check. She reports pre-workout energy 2/5 (still waking up) and post-workout energy 4/5 with a note "Felt powerful after deadlifts". The client calls `POST /entries/:id/feelings` twice. Baseline recomputation is triggered for the affected metrics.
4. **Immediate Feedback:** The dashboard updates to show the workout in the "Recent" list along with her feelings. No insight surfaces yet because enough data has not shifted.

## Day 3: Nutrition Tracking
1. **Capture:** Mara logs a late dinner: "Chicken shawarma bowl, lots of garlic sauce" at 9:30 PM after a long day.
2. **Backend Action:** `POST /entries` with `{ type: "meal", ... }` stores a meal `LogEntry`. Feelings show low energy post-meal because she ate quickly.
3. **Baseline Impact:** The backend’s rolling window records another late meal with low post-valence, nudging meal-related baselines downward.

## Day 5: Insight Generation
1. **Trend Request:** On Friday, Mara opens the Insights tab. The frontend requests `GET /trends?window_days=14` and `GET /insights?limit=5` for her user ID.
2. **Backend Response:**
   - `GET /trends` returns:
     - Baselines showing average post-workout energy of 3.6 over 14 days.
     - Recent entries list highlighting the Tuesday strength session and Thursday late meal with their feeling snapshots.
   - `GET /insights` includes an active insight: "You feel +1.1 more energized after morning strength workouts vs. your overall average" with supporting stats.
3. **User Outcome:** Mara interprets the insight as validation to prioritize morning lifting blocks. The frontend also flags a trend around late dinners correlating with low energy, prompting her to schedule meals earlier.

## Continuous Loop
- Each new `FeelingEntry` kicks off the baseline recompute service, ensuring insights remain fresh without blocking the user’s UI.
- Insights can be dismissed; when Mara taps "Dismiss", the frontend will eventually call an update endpoint (future work) to set `is_active = false`.
- The deterministic rules engine (Stream 3) feeds additional insight candidates via `upsertInsightFromRule`, so Mara sees both habit reinforcements and cautionary alerts.

## End-to-End Value
From Mara’s perspective, FitForecast feels like a personal coach:
1. **Input:** Natural-language workout/meal logs and quick 1-minute mood surveys.
2. **Processing:** Stream 1’s backend normalizes entries, maintains a historical baseline, and communicates with other streams for parsing and analytics.
3. **Output:** Actionable summaries such as "Strength workouts lift your energy +1 point" or "Late meals reduce next-morning energy by 0.8" presented with timestamps and sample data points.

This scenario illustrates how the technical components in Stream 1 directly support a real user’s daily workflow and reinforce the product’s promise of turning scattered logs into personalized guidance.
