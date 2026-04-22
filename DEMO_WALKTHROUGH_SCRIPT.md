# FitForecast Complete Demo Walkthrough Script

Use this as a read-aloud script during your final demo and video recording.

## Demo Length Options

- Full walkthrough: 8 to 10 minutes
- Submission-ready walkthrough: 4 to 6 minutes

## Pre-Demo Setup Checklist (before recording)

- Backend running on http://localhost:3000
- Frontend running on http://localhost:5174
- Use seeded demo accounts:
  - athena@example.com / password123
  - boris@example.com / password123
  - cora@example.com / password123
- Keep one browser tab on the app and one tab ready for API docs at http://localhost:3000/docs (optional)

## Script Start (0:00 - 0:45)

Say:

Hi everyone, this is FitForecast. The core problem we wanted to solve is that most fitness advice is generic, but people respond differently to workouts, meals, timing, and stress. We built a personalization-first app that helps users discover what works for their own body and routine. Today I will walk through the landing page, the full product flow, and show how insights change across different users.

## 1) Landing Page Walkthrough (0:45 - 1:30)

Do:

- Open http://localhost:5174/login
- Slowly scroll through the left panel and login card

Say:

This is our landing and login experience. The messaging explains the value clearly: users log workouts and meals in natural language, track how they feel before and after, and then get explainable insights based on their personal baseline. The primary call to action is to try with demo accounts or create a free account.

Point out:

- Value proposition headline
- Feature cards
- Demo account quick-access buttons
- Login form and clear path to signup

## 2) Login and Dashboard Overview (1:30 - 2:45)

Do:

- Click Athena demo button or enter credentials manually
- Click Login
- Wait for dashboard to load

Say:

I am logging in as Athena, who represents a consistent improver persona. The dashboard is designed to answer three questions quickly: what has the user been doing, what patterns are emerging, and what to do next.

Show and narrate:

- Recent entries area
- Insight cards
- Prediction panel
- Any trend or summary cards visible

Say:

The key part is that these insights are not generic. They are tied to this user’s history and baseline, so recommendations are explainable and personal.

## 3) Predictions and Explainability (2:45 - 3:45)

Do:

- Focus on prediction panel content
- Highlight any scenario or forecast language

Say:

This panel is our forward-looking layer. It estimates likely outcomes for the next session and compares possible scenarios. The purpose is to help users run small behavior experiments, like changing workout timing or meal timing, and see how that may affect energy, stress, and recovery.

If asked about AI:

Our rules and signals are deterministic and explainable. Optional AI is used for wording polish, not to invent core signals.

## 4) History Page: Data Grounding (3:45 - 4:45)

Do:

- Navigate to History
- Scroll through entries

Say:

History is the source of truth for what the model learns from. You can see workouts and meals, plus pre and post feelings. This is important because users can verify whether the insights actually match their real behavior.

Call out:

- Entry descriptions in natural language
- Time patterns
- Feeling values before and after sessions

## 5) Trends Page: Baselines and Change Over Time (4:45 - 5:45)

Do:

- Navigate to Trends
- Change metric and time window controls if available

Say:

Trends shows progression over time and compares recent performance to baseline. This makes it easier to see whether a pattern is stable, improving, or slipping.

Call out:

- Chart movement and windowing
- Baseline versus recent behavior
- Insight stack alignment with chart patterns

## 6) Log a New Entry Live (5:45 - 7:00)

Do:

- Navigate to Log
- Enter a sample workout
- Fill pre and post feelings
- Submit
- Go back to Dashboard or History

Suggested sample entry:

Workout: 45 minute morning strength session with squats, rows, and a short cooldown walk.

Say:

Now I will simulate real usage by logging a new session. This is the core user loop: log activity, log feelings, and review updated feedback over time. As users continue logging, predictions and confidence improve.

## 7) Persona Comparison to Show Personalization (7:00 - 8:30)

Do:

- Logout
- Login as Boris
- Open Dashboard and Trends quickly

Say:

Now I switched to Boris, a more inconsistent and higher-stress persona. The app should surface different guidance than Athena, because the behavior history is different. This demonstrates personalized adaptation rather than one-size-fits-all coaching.

Optional:

- Quickly switch to Cora and mention maintenance and optimization style recommendations

## 8) Architecture and Technical Credibility (8:30 - 9:20)

Say:

Under the hood, this is a multi-stream implementation. We have a TypeScript frontend, Node and Prisma backend, PostgreSQL data layer, analytics validation notebooks, and integration scenarios. Authentication is JWT-based with per-user data isolation. The product is designed so core insights remain reliable and explainable.

## 9) Reflection: Goal vs What We Built (9:20 - 10:00)

Say:

At the beginning of the semester, our goal was to help people connect daily habits with how they feel and perform. What we actually built is a full MVP with authentication, logging, personalized baselines, insights, trends, and forecasting, plus realistic demo personas for validation. The biggest learning was that users trust systems more when personalization is paired with clear explainability.

## Closing Line

Say:

FitForecast helps people move from generic advice and guesswork to personal, data-informed fitness decisions. Thank you.

---

## 4 to 6 Minute Submission Version

If you need a shorter recording, use this compressed order:

1. Problem and solution in 30 to 45 seconds
2. Landing page walkthrough in 45 seconds
3. Login as Athena and dashboard demo in 90 seconds
4. History and Trends in 60 to 90 seconds
5. Log one new entry in 45 to 60 seconds
6. Reflection in 30 to 45 seconds

This still satisfies required video content:

- Landing page walkthrough
- Application demo
