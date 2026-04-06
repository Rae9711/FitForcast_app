# FitForecast End-to-End Guide

This document explains how to use FitForecast from first launch through daily usage, demo exploration, and prediction review.

It is written for two kinds of users:

- someone evaluating the seeded demo personas
- someone using the app with a fresh personal account

## What You Need Running

Before using the app in a browser, make sure:

- backend is running at `http://localhost:3000`
- frontend is running at `http://localhost:5174`
- database migrations are applied
- seed data is loaded if you want the demo personas

## URLs

### Frontend

- login: `http://localhost:5174/login`
- signup: `http://localhost:5174/signup`
- dashboard: `http://localhost:5174/`
- log entry: `http://localhost:5174/log`
- history: `http://localhost:5174/history`
- trends: `http://localhost:5174/trends`

### Backend

- health: `http://localhost:3000/health`
- API docs: `http://localhost:3000/docs`

## Demo Personas

All demo users use the password `password123`.

| Persona | Email | Best for |
| --- | --- | --- |
| Athena | athena@example.com | Stable, improving patterns |
| Boris | boris@example.com | Inconsistent and higher-stress patterns |
| Cora | cora@example.com | Strong routine and optimized performance |

## First-Time Evaluation Flow

If you are reviewing the product for the first time, use this sequence.

### 1. Login

Open the login page and sign in with one of the demo users.

What should happen:

- the app authenticates successfully
- you are redirected to the dashboard
- protected navigation becomes available
- your user name appears in the top navigation

### 2. Review the Dashboard

The dashboard is the fastest way to understand the product.

Look for:

- recent entries
- insight cards
- prediction panel
- quick pattern summaries

What the dashboard should tell you:

- what the user has been doing recently
- whether the user is trending up or down
- what the system believes is currently helping or hurting
- what the next likely best session looks like

### 3. Inspect the Prediction Panel

The prediction panel is the clearest expression of the personalized learning system.

Review these sections:

- heuristics
- default forecast scenario
- scenario comparisons
- narrative guidance

Interpretation guide:

- heuristics describe learned user-specific signals like timing, consistency, mood, or fueling
- the default scenario estimates the most likely next-session outcome
- scenario comparisons show how the result changes when inputs change
- narrative guidance summarizes the structured forecast in plain language

### 4. Open History

Go to the history page to inspect what the model is learning from.

Look for:

- workout and meal entries
- pre and post feelings
- repeated timing patterns
- consistency gaps

Use this page to sanity-check whether the dashboard and prediction output match the actual log history.

### 5. Open Trends

The trends page is where you verify that the model outputs are grounded in observable patterns.

Look for:

- trend charts over time
- baseline changes
- prediction panel repeated in an analysis context
- differences between recent behavior and historical averages

### 6. Log a New Entry

Use the log page to simulate ongoing usage.

Suggested test entry:

```text
Workout: 45 minute morning strength session with squats, rows, and a short cooldown walk.
```

Then add:

- pre-workout feelings
- post-workout feelings

What should happen:

- the entry is stored
- it appears in history
- dashboard refresh reflects the new activity
- predictions and trends can incorporate the new data once recalculated by the backend flow

## Real User Flow

If you are using the app with a new account instead of a demo persona, use this sequence.

### 1. Create Account

Open signup and provide:

- email
- password
- optional display name

What should happen:

- your account is created
- you are authenticated
- you enter the app immediately

### 2. Log Your First Workout or Meal

The product gets better as you create more entries, but the first step is simple.

Examples:

```text
Workout: easy 30 minute run before work
```

```text
Meal: chicken rice bowl with vegetables after lifting
```

### 3. Add Pre and Post Feelings

For each entry, record:

- valence
- energy
- stress
- optional notes

These ratings are important because they form the personal feedback loop the model learns from.

### 4. Repeat for Several Days

FitForecast becomes more useful when the user logs repeatedly over time.

The most useful signals come from:

- consistent timestamps
- clear workout or meal descriptions
- both pre and post feeling ratings
- enough variation in timing and routine to compare outcomes

### 5. Review Early Trends

After enough entries accumulate, the app begins to surface:

- initial baselines
- deterministic insights
- early heuristics
- forecast confidence that improves with additional history

## How to Read Insights

Each insight is meant to be explainable.

An insight generally contains:

- a category
- a priority level
- a plain-language summary
- supporting statistics from the user’s own data

How to use them:

- treat them as pattern observations, not medical advice
- compare them against recent history to see if they feel credible
- use them to run small experiments like changing timing or meal composition

## How to Read Predictions

Predictions are structured, then optionally rewritten into polished copy.

Core prediction outputs include:

- expected post-workout energy
- expected post-workout stress
- good-session likelihood
- next-day recovery quality

How to use them:

- compare the default scenario against alternative scenarios
- identify whether timing or fueling is the bigger lever for the user
- watch confidence improve as more logs are added

## Suggested Demo Script for Stakeholders

Use this short script when showing the product live.

### Athena Demo

- login as Athena
- show the dashboard and recent entries
- highlight consistent morning behavior
- open predictions and point out that the product has learned stable, positive timing signals

### Boris Demo

- login as Boris
- show that history is less consistent
- highlight higher stress and weaker routine signals
- show how the prediction panel reflects lower certainty or less favorable patterns

### Cora Demo

- login as Cora
- show strong routine quality and optimized performance
- use trends to demonstrate that FitForecast can identify high-quality, stable patterns as well as recovery-sensitive ones

## Common User Questions

### Why are some insights deterministic instead of AI-generated?

Because the system uses deterministic rules as the source of truth. AI, when enabled, is used to improve wording, not to invent the signal.

### Why are predictions more useful after more logging?

Because the personalized stages rely on repeated observations of the same user’s timing, stress, energy, meals, and recovery responses.

### What if Jac is offline?

The app still works. Narrative text falls back to deterministic summaries.

### What should a user log to improve the model fastest?

The best inputs are:

- consistent workout descriptions
- consistent meal descriptions
- both pre and post feelings
- honest energy and stress ratings
- repeated use over time

## Troubleshooting User Flows

### Cannot log in

Check:

- backend is running
- correct password is used
- seeded users exist if using demo accounts

### Dashboard loads but no data appears

Check:

- the user actually has entries
- seed was run successfully
- API requests are reaching the backend

### Predictions are missing or sparse

Check:

- user has enough historical entries
- backend `/predictions` route is mounted and responding
- auth token is valid

### AI wording is not changing

Check:

- `INSIGHTS_LLM_PROVIDER` value
- Jac or other provider connectivity
- upstream model credentials

## Best Practices for Ongoing Use

- log soon after the workout or meal happened
- keep descriptions concrete and simple
- record both pre and post feelings when possible
- review trends weekly, not after every single log
- use predictions to test routine changes, not as absolute truth

## Summary

FitForecast works best as a repeatable self-observation tool.

The simplest successful loop is:

1. log the activity
2. log how you felt before and after
3. review the dashboard and trends
4. compare predicted outcomes against actual outcomes
5. repeat until stronger personal patterns emerge