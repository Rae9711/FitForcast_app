# Stream 3: Insights Engine & Analytics

**Owner:** Data Scientist / Analytics Engineer  
**Status:** Depends on Stream 1 schema, collaborates with all streams  
**Priority:** HIGH (validates product hypothesis)

## Overview

The Analytics stream owns the core personalization logic: baseline metric definitions, insight rule implementations, validation notebooks, and scenario testing. This stream ensures that insights are truly personal, deterministic, and robust enough to fire correctly even with sparse user data.

## Scope (MVP)

- **Baseline Metrics:** Define which metrics to compute (post-workout energy, meal frequency, mood variance, etc.).
- **Insight Rules:** Implement 3–5 deterministic rules that detect personal patterns.
- **Validation Notebooks:** Jupyter notebooks to test rule thresholds against synthetic and real scenarios.
- **Scenario Testing:** Validate rules against edge cases (sparse data, new users, noisy data).
- **Rule Documentation:** Explain rule logic, thresholds, and assumptions.

## Core Deliverables

### 1. Baseline Metrics Library

Define metrics as reusable, composable functions. Each metric specifies:
- **Scope:** workout, meal, or mood
- **Event type:** what triggers the calculation
- **Window:** 14-day or 30-day rolling window
- **Aggregation:** average, count, variance, etc.
- **Data points threshold:** minimum entries required

**Example metrics:**
- `post_strength_energy`: Average energy after strength workouts
- `late_meal_post_energy`: Average energy after meals after 9pm
- `routine_mood_variance`: Stress variance on days with both workout + meal

### 2. Insight Rules Engine

Insight rules are deterministic functions that compare recent activity against baselines.

**Example MVP Rules:**
1. **Energy Uplift After Strength** (post-strength energy > baseline + 1.0, min. 5 entries)
2. **Late Meals Correlate with Lower Morning Energy** (post 9pm meals → next-morning energy delta)
3. **Routine Days Stabilize Mood** (days with both workout + meal → lower stress variance)
4. (2-3 more rules per MVP goals)

Each rule includes:
- Name and description
- Threshold value and minimum data points
- Evaluation function
- Supporting stats structure

### 3. Validation Notebooks

Create Jupyter notebooks to:
- **Threshold Testing:** Run mock user histories; verify rules fire at intended thresholds
- **Edge Cases:** Test sparse data (2–3 entries), new users (day 1), noisy data
- **Sensitivity Analysis:** Plot rule precision/recall vs. thresholds
- **Scenario Validation:** Test against sample logs from Stream 4

## Tech Stack

- **Language:** Python (for analysis) or TypeScript (for rules)
- **Notebooks:** Jupyter + pandas, numpy, matplotlib
- **Testing:** pytest (Python) or Jest (TypeScript)
- **Version Control:** Git + notebooks (tracked)

## File Structure

```
stream-3-analytics/
├── README.md
├── src/
│   ├── metrics/
│   │   ├── __init__.py
│   │   ├── baseline.py
│   │   └── aggregations.py
│   ├── rules/
│   │   ├── __init__.ts or .py
│   │   ├── index.ts
│   │   └── evaluators.ts
│   └── utils/
│       └── helpers.py
├── notebooks/
│   ├── 01_baseline_definitions.ipynb
│   ├── 02_insight_rule_validation.ipynb
│   ├── 03_edge_case_testing.ipynb
│   └── 04_scenario_validation.ipynb
├── test_data/
│   ├── sample_users.json
│   └── edge_cases.json
├── tests/
│   ├── metrics_test.py
│   └── rules_test.py
├── requirements.txt
├── package.json
└── tsconfig.json (if TypeScript)
```

## Success Criteria

- [ ] 3–5 insight rules defined and documented
- [ ] Each rule includes plain-English description, threshold, min data points
- [ ] Validation notebooks show rules fire correctly on sample scenarios
- [ ] Rules deterministic (same input → same output)
- [ ] No false positives on sparse data (≥min_data_points before firing)
- [ ] Thresholds documented with rationale

## Integration Points

- **Stream 1 (Backend):** Provides BaselineMetric schema; implements rule evaluation
- **Stream 2 (Frontend):** Displays insights + supporting stats from backend
- **Stream 4 (Integration):** Tests rules against scenario data; validates end-to-end

See [../docs/INTEGRATION_CONTRACT.md](../docs/INTEGRATION_CONTRACT.md) for sync timeline.

## Next Steps

1. Align on 3–5 MVP rules with team
2. Define baseline metrics with min data points
3. Create sample data for testing
4. Validate thresholds in Jupyter notebooks
5. Document rule logic and assumptions
6. Share rule config with Stream 1 for backend implementation
