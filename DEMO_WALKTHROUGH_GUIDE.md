# 🚶‍♀️ Complete Demo Walkthrough - End-to-End Guide

**Last Updated**: March 16, 2026  
**Purpose**: Step-by-step guide to explore all three demo personas in FitForecast

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Demo 1: Athena - The Consistent Improver](#demo-1-athena---the-consistent-improver)
3. [Demo 2: Boris - The Stressed Inconsistent](#demo-2-boris---the-stressed-inconsistent)
4. [Demo 3: Cora - The Peak Performer](#demo-3-cora---the-peak-performer)
5. [Comparing All Three Personas](#comparing-all-three-personas)
6. [Key Takeaways](#key-takeaways)

---

## Getting Started

### Prerequisites
- ✅ Backend running on http://localhost:3000
- ✅ Frontend running on http://localhost:5174
- ✅ Database seeded with 95+ entries per user

### Demo Account Credentials
All three accounts use the same password: **password123**

| Name | Email | Password | Profile |
|------|-------|----------|---------|
| Athena | athena@example.com | password123 | Morning exerciser, improving |
| Boris | boris@example.com | password123 | Night owl, struggling |
| Cora | cora@example.com | password123 | Evening athlete, optimized |

---

## Demo 1: Athena - The Consistent Improver

### Character Background
**Who is Athena?**
- 32-year-old marketing manager
- Health-conscious professional
- Early riser who values routine
- Building sustainable fitness habits
- Goal: Maintain work-life balance through morning exercise

**Why use FitForecast?**
- Track consistency and see progress
- Understand what workout timing works best
- Learn how nutrition affects energy levels
- Stay motivated through data-driven insights

---

### Step 1: Login as Athena

1. **Open your browser** to http://localhost:5174
   
2. **You'll see the login page** with:
   - Email and password fields
   - Three demo user buttons (Athena, Boris, Cora)
   - Sign up link at the bottom

3. **Click the "Demo: Athena" button**
   - This automatically fills:
     - Email: `athena@example.com`
     - Password: `password123` (pre-filled)

4. **Click "Login"**
   - System authenticates with backend
   - JWT token generated and stored
   - Redirects to Dashboard

**What you should see:**
- ✅ Navigation bar appears with "FitForecast" logo
- ✅ Menu items: Home, Log, History, Trends
- ✅ User info shows: "Athena" in top-right corner
- ✅ Logout button visible

---

### Step 2: Explore Athena's Dashboard

**URL**: http://localhost:5174/ (Dashboard page)

#### What You'll See

**1. Welcome Section**
- Greeting: "Welcome back, Athena!"
- Quick stats summary
- Date/time of last activity

**2. Recent Entries Section** (Latest 5-10 entries)

Example entries you'll see:
```
🏃‍♀️ Workout - Today at 6:15 AM
"Morning run: 6am, 5 miles, easy pace"
├─ Pre-workout: Valence 3/5, Energy 3/5, Stress 2/5
└─ Post-workout: Valence 4/5, Energy 4/5, Stress 1/5

🍽️ Meal - Today at 8:30 AM
"Breakfast: oatmeal with berries and almonds"
├─ Pre-meal: Valence 3/5, Energy 3/5, Stress 2/5
└─ Post-meal: Valence 3/5, Energy 3/5, Stress 1/5

🏋️ Workout - Yesterday at 7:00 AM
"Strength training: upper body, 45 minutes"
├─ Pre-workout: Valence 3/5, Energy 3/5, Stress 2/5
└─ Post-workout: Valence 4/5, Energy 4/5, Stress 1/5
```

**3. Personalized Insights Section**

Expected insights based on Athena's data:

```
✨ INSIGHTS FOR YOU

🎯 High Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Your consistency is paying off!"
• Your energy levels have improved 33% over the past 3 months
• You've maintained an 85% activity consistency rate
• Keep up your morning routine - it's working!

🌅 Medium Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Morning workouts boost your day"
• 85% of your morning sessions lead to improved mood
• Post-workout energy averages 4/5 vs. baseline 3/5
• Your stress drops 1 point after each morning workout

🥗 Medium Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Protein timing supports recovery"
• Post-workout meals within 1 hour correlate with better next-day energy
• Your breakfast routine maintains stable energy through lunch
• Current meal composition is optimal for your goals
```

**Pattern Observations:**
- 📈 Clear upward trend in all metrics
- 🌅 Consistent morning workout timing (6-7 AM)
- 💪 Energy improves from 2-3/5 → 3-4/5 over time
- 😌 Stress decreases from 3/5 → 2/5 over 6 months
- 📊 85% consistency rate (logs almost daily)

---

### Step 3: Browse Athena's History

**Click "History" in navigation** → http://localhost:5174/history

#### What You'll See

**Filter Options** (top of page):
- [All] [Workouts] [Meals]
- Date range selector
- Sort by: newest/oldest

**Entry List** (95+ entries, paginated):

Scroll through to see consistent patterns:

**Week 1 (Most Recent)**:
```
Mon 3/15 - 6:10 AM | Workout: Morning run: 6am, 5 miles
                   Pre: V:3 E:3 S:2 → Post: V:4 E:4 S:1 ✅ Improved

Mon 3/15 - 8:25 AM | Meal: Breakfast: oatmeal with berries
                   Pre: V:3 E:3 S:2 → Post: V:3 E:3 S:1

Mon 3/15 - 12:10 PM| Meal: Lunch: grilled chicken, quinoa
                   Pre: V:3 E:3 S:2 → Post: V:3 E:3 S:1

Tue 3/14 - 7:00 AM | Workout: Strength training: upper body
                   Pre: V:3 E:3 S:2 → Post: V:4 E:4 S:1 ✅ Improved

Tue 3/14 - 8:30 AM | Meal: Post-workout: protein smoothie
                   Pre: V:3 E:3 S:2 → Post: V:3 E:3 S:1

Tue 3/14 - 6:00 PM | Meal: Dinner: baked salmon, sweet potato
                   Pre: V:3 E:3 S:2 → Post: V:3 E:3 S:1
```

**Patterns to Notice:**
- ✅ Very few gaps (maybe 1 rest day per week)
- ✅ Consistent morning timing (6-8 AM)
- ✅ Balanced mix of workouts and meals
- ✅ Progressive improvement in feelings scores
- ✅ Workouts: Running, cycling, swimming, strength, yoga
- ✅ Meals: Whole foods, balanced macros, regular timing

**Scroll to Older Entries** (3-6 months ago):
```
Oct 15 - 6:15 AM | Workout: Morning run: 5 miles
                Pre: V:2 E:2 S:3 → Post: V:3 E:3 S:2

Oct 15 - 8:30 AM | Meal: Breakfast: oatmeal with berries
                Pre: V:2 E:2 S:3 → Post: V:2 E:2 S:2
```

**Key Observation**: In older entries, scores start lower (V:2, E:2, S:3) and gradually improve to current levels (V:3-4, E:3-4, S:2-1).

---

### Step 4: Analyze Athena's Trends

**Click "Trends" in navigation** → http://localhost:5174/trends

#### What You'll See

**1. Chart: Energy Levels Over 6 Months**

```
Energy
  5 |                               ●─●─●
    |                          ●─●─●
  4 |                     ●─●─●
    |                ●─●─●
  3 |           ●─●─●
    |      ●─●─●
  2 | ●─●─●
    |
  1 |
    └──────────────────────────────────────────
      Sep   Oct   Nov   Dec   Jan   Feb   Mar

Legend: ● Pre-activity  ─ Post-activity
```

**Interpretation:**
- 📈 Clear upward trend from 2/5 to 4/5
- ✅ Post-activity scores consistently higher
- ✅ Gradual, sustainable improvement
- 💡 Morning workouts boost energy throughout the day

**2. Chart: Stress Levels Over 6 Months**

```
Stress
  5 |
    |
  4 |
    | ●─●
  3 | ●─●─●─●
    |         ●─●─●─●
  2 |                 ●─●─●─●─●─●─●
    |
  1 |                                   ●─●─●
    └──────────────────────────────────────────
      Sep   Oct   Nov   Dec   Jan   Feb   Mar

Legend: ● Pre-activity  ─ Post-activity
```

**Interpretation:**
- 📉 Stress decreasing from 3/5 to 1-2/5
- ✅ Exercise effectively reduces stress
- ✅ Baseline stress lowering over time
- 💡 Routine building capacity to handle stress

**3. Baseline Metrics Panel**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
YOUR BASELINES (30-day rolling average)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Valence (Mood)
├─ Current: 3.4/5  ↗️ +0.8 from 90 days ago
└─ Trend: Improving steadily

Energy
├─ Current: 3.3/5  ↗️ +1.0 from 90 days ago
└─ Trend: Strong improvement

Stress
├─ Current: 1.8/5  ↘️ -1.2 from 90 days ago
└─ Trend: Excellent reduction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ACTIVITY PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workout Consistency: 85% ✅ Excellent
├─ Average: 5-6 times per week
└─ Preferred time: 6-7 AM

Meal Consistency: 90% ✅ Excellent
├─ Average: 3-4 meals logged per day
└─ Regular timing: 8 AM, 12 PM, 6 PM

Post-Workout Effect: +1.2 energy ✅ Positive
Post-Meal Effect: Stable energy ✅ Balanced
```

**4. Correlation Insights**

```
🔍 WHAT WORKS FOR YOU

✅ Strongest Positive Correlations:
   1. Morning workouts → +25% better mood all day
   2. Post-workout protein → +20% better recovery
   3. Consistent sleep → +15% better workout performance

⚠️ Areas to Watch:
   1. Energy dips slightly on non-workout days
      → Consider light activity on rest days
```

---

### Step 5: Log a New Entry as Athena

**Click "Log" in navigation** → http://localhost:5174/log

#### What You'll See

**Entry Composer Form**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LOG NEW ACTIVITY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type: ○ Workout  ○ Meal

Activity Description:
┌─────────────────────────────────────┐
│ Morning run: 6am, 5 miles, felt    │
│ strong and energized                │
└─────────────────────────────────────┘

When did this occur?
[📅 Today at 6:00 AM ▼]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEELINGS CAPTURE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

How did you feel BEFORE?

Mood (Valence):     😐──●────😊  (3/5)
Energy Level:       🔋──●────⚡  (3/5)
Stress Level:       😌──●────😰  (2/5)

Notes: Ready to go, good night's sleep
       
How did you feel AFTER?

Mood (Valence):     😐────●──😊  (4/5)
Energy Level:       🔋────●──⚡  (4/5)
Stress Level:       😌●────────😰  (1/5)

Notes: Endorphins kicked in, stress melted away

[Log Entry] [Cancel]
```

**Try logging an entry:**
1. Select "Workout"
2. Type: "Morning yoga session: 30 minutes, flexibility focus"
3. Set time: Today at 6:30 AM
4. Pre-feelings: V:3, E:3, S:2
5. Post-feelings: V:4, E:4, S:1
6. Click "Log Entry"

**What happens:**
- ✅ Entry saved to database
- ✅ Confirmation message appears
- ✅ Redirects to Dashboard
- ✅ New entry appears at top of recent activities
- ✅ Baselines update (if significant difference)

---

### Step 6: Logout and Summary

**Click "Logout" button** in top-right corner

**What happens:**
- ✅ Token cleared from localStorage
- ✅ User state reset
- ✅ Redirects to login page
- ✅ Navigation disappears (public view)

### Athena's Story Summary

**What we learned:**
- ✅ Consistency leads to measurable improvement
- ✅ Morning workouts align with her lifestyle
- ✅ Proper nutrition timing supports goals
- ✅ Building sustainable habits over quick fixes
- ✅ Data confirms her routine is working

**Key Metrics:**
- Energy: 2/5 → 4/5 (+100% improvement)
- Stress: 3/5 → 2/5 (-33% reduction)
- Consistency: 85% (excellent)
- Trend: Steadily improving

**AI Insights Takeaway:**
FitForecast recognizes Athena's success pattern and reinforces it with positive feedback, helping her stay motivated and confident in her approach.

---

## Demo 2: Boris - The Stressed Inconsistent

### Character Background
**Who is Boris?**
- 29-year-old software engineer
- Startup founder working 70+ hour weeks
- Irregular sleep schedule (varies 11 PM - 2 AM)
- Exercises when stressed, but inconsistently
- Skips meals or eats convenience food
- Goal: Get in shape despite crazy schedule

**Why use FitForecast?**
- Needs accountability for inconsistent routine
- Wants to understand why he's not seeing progress
- Hopes data will reveal patterns he's missing
- Looking for realistic optimizations

---

### Step 1: Login as Boris

1. **Logout from Athena's account** (if still logged in)
   - Click "Logout" → Returns to login page

2. **Click the "Demo: Boris" button**
   - Email: `boris@example.com`
   - Password: `password123` (auto-filled)

3. **Click "Login"**
   - Authenticates and redirects to Dashboard
   - User info shows "Boris" in top-right

---

### Step 2: Explore Boris's Dashboard

**URL**: http://localhost:5174/

#### What You'll See (Very Different from Athena!)

**1. Recent Entries Section**

Notice the irregular pattern:

```
🏃 Workout - 3 days ago at 10:45 PM
"Stress relief run: 3 miles, hard pace"
├─ Pre-workout: Valence 2/5, Energy 2/5, Stress 5/5 ⚠️ Very stressed
└─ Post-workout: Valence 2/5, Energy 1/5, Stress 4/5 ⚠️ Still stressed, exhausted

🍽️ Meal - 3 days ago at 11:30 PM
"Late night snack: chips while coding"
├─ Pre-meal: Valence 2/5, Energy 2/5, Stress 4/5
└─ Post-meal: Valence 2/5, Energy 2/5, Stress 4/5 ⚠️ No improvement

[No entries for 2 days] ⚠️ Big gap

🏋️ Workout - 6 days ago at 9:15 PM
"Late night gym: chest and triceps, rushed"
├─ Pre-workout: Valence 2/5, Energy 1/5, Stress 4/5
└─ Post-workout: Valence 3/5, Energy 2/5, Stress 4/5 ⚠️ Stress unchanged

🍽️ Meal - 6 days ago at 2:00 PM
"Lunch: takeout burrito from food truck"
├─ Pre-meal: Valence 2/5, Energy 1/5, Stress 4/5
└─ Post-meal: Valence 2/5, Energy 2/5, Stress 4/5

[No entries for 1 day]

🍽️ Meal - 8 days ago at 9:30 AM
"Breakfast: coffee and granola bar on the go"
├─ Pre-meal: Valence 2/5, Energy 1/5, Stress 4/5
└─ Post-meal: Valence 2/5, Energy 2/5, Stress 4/5
```

**2. Personalized Insights Section**

Expected insights for Boris (intervention tone):

```
⚠️ INSIGHTS FOR YOU

🚨 High Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Late workouts may be disrupting your sleep"
• 80% of your evening workouts (after 9 PM) correlate with low next-day energy
• Your stress remains elevated even after late-night exercise
• Consider: Try morning or lunch break workouts instead
• Research shows: Evening intense exercise can interfere with sleep quality

⚠️ High Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Inconsistency is blocking your progress"
• You have 3-7 day gaps between activities (avg: 4.5 days)
• Optimal frequency: 2-3 days max for adaptation
• Your body isn't getting consistent signals to improve
• Try: Set a recurring calendar reminder for workout times

⚠️ Medium Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Stress not decreasing after exercise"
• Average stress reduction: Only -0.2 points (vs. healthy -1.5)
• Post-workout stress remains high (3.8/5 avg)
• Possible causes: Late timing, insufficient recovery, overtraining
• Consider: Lower intensity, earlier timing, or stress management techniques

💡 Medium Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Meal timing opportunity detected"
• You skip breakfast 60% of the time
• Days with breakfast show 25% better energy levels
• Try: Simple breakfast (10 min) - overnight oats, Greek yogurt, or smoothie
• Morning fuel supports sustained energy and decision-making

📉 Low Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Recovery deficit warning"
• Your energy levels are trending downward over 30 days
• Insufficient rest between intense sessions detected
• Recommend: Add 1-2 complete rest days per week
• Consider: Light activity (walking, stretching) instead of hard workouts
```

**Pattern Observations:**
- 📉 No improvement trend (metrics flat or declining)
- 🌙 Late-night activity timing (9 PM - 11 PM)
- ⚠️ High stress levels (4-5/5) that don't improve
- 😓 Low energy (1-3/5) most of the time
- ⚠️ Large gaps between activities (3-7 days)
- 🍕 Poor meal quality and timing

---

### Step 3: Browse Boris's History

**Click "History"** → http://localhost:5174/history

#### What You'll See

**Irregular Pattern with Gaps**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARCH 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mon 3/15 - 10:45 PM | Workout: Stress relief run: 3 miles
                    Pre: V:2 E:2 S:5 → Post: V:2 E:1 S:4 ❌ Worse energy

Mon 3/15 - 11:30 PM | Meal: Late night snack: chips while coding
                    Pre: V:2 E:2 S:4 → Post: V:2 E:2 S:4

━━ 2 days gap ━━ Stress accumulated

Thu 3/12 - 9:15 PM  | Workout: Late night gym: chest, triceps, rushed
                    Pre: V:2 E:1 S:4 → Post: V:3 E:2 S:4 ⚠️ Stress unchanged

Thu 3/12 - 2:00 PM  | Meal: Lunch: takeout burrito
                    Pre: V:2 E:1 S:4 → Post: V:2 E:2 S:4

━━ 1 day gap ━━

Tue 3/10 - 9:30 AM  | Meal: Breakfast: coffee and granola bar
                    Pre: V:2 E:1 S:4 → Post: V:2 E:2 S:4

━━ 3 days gap ━━ Long break

Sat 3/7 - 11:00 PM  | Workout: Home workout: bodyweight, 20 min
                    Pre: V:2 E:1 S:5 → Post: V:2 E:2 S:5 ❌ No stress reduction

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEBRUARY 2026
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Similar pattern: irregular timing, gaps, high stress]
```

**Filter by Workouts Only**:

```
Mar 15 - 10:45 PM | Stress relief run (hard pace)
━━ 3 day gap ━━
Mar 12 - 9:15 PM  | Late night gym (rushed)
━━ 2 day gap ━━
Mar 7  - 11:00 PM | Home workout (20 min)
━━ 4 day gap ━━
Mar 3  - 10:30 PM | Quick HIIT (15 min between meetings)
━━ 5 day gap ━━
Feb 26 - 9:00 PM  | Late night gym
```

**Filter by Meals Only**:

```
Mar 15 - 11:30 PM | Late night snack: chips
Mar 12 - 2:00 PM  | Lunch: takeout burrito
━━ breakfast skipped ━━
Mar 10 - 9:30 AM  | Breakfast: coffee + granola bar
━━ missed lunch, dinner ━━
Mar 7  - 9:00 PM  | Dinner: pizza delivery, working late
Mar 7  - 10:00 AM | Skipped breakfast, large coffee instead
```

**Key Observations:**
- ❌ Inconsistent gaps prevent adaptation
- ❌ Late timing interferes with sleep
- ❌ Rushed workouts lack proper warm-up
- ❌ Poor meal timing and quality
- ❌ High stress persists across all activities
- ❌ No rest days (always "all or nothing")

---

### Step 4: Analyze Boris's Trends

**Click "Trends"** → http://localhost:5174/trends

#### What You'll See

**1. Chart: Energy Levels Over 6 Months**

```
Energy
  5 |
    |
  4 |
    |
  3 |     ●     ●           ●
    | ●─●─●─●─●─●─●─●─●─●─●─●─●
  2 | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
    | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
  1 | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
    |
    └──────────────────────────────────────────
      Sep   Oct   Nov   Dec   Jan   Feb   Mar

Legend: ● Pre-activity  ─ Post-activity
```

**Interpretation:**
- 📉 Flat trend, no improvement
- ⚠️ High variability (1-3/5 range)
- ❌ Post-activity energy often LOWER than pre
- 💡 Late workouts causing next-day fatigue

**2. Chart: Stress Levels Over 6 Months**

```
Stress
  5 | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
    | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
  4 | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
    | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
  3 | ●─●─●─●─●─●─●─●
    |
  2 |
    |
  1 |
    └──────────────────────────────────────────
      Sep   Oct   Nov   Dec   Jan   Feb   Mar

Legend: ● Pre-activity  ─ Post-activity
```

**Interpretation:**
- ⚠️ Consistently high stress (3-5/5)
- ❌ Exercise NOT reducing stress effectively
- ❌ No downward trend over time
- 💡 Chronic stress needs different intervention

**3. Baseline Metrics Panel**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ YOUR BASELINES (30-day rolling average)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Valence (Mood)
├─ Current: 2.2/5  ↔️ No change from 90 days ago
└─ Trend: Stagnant

Energy
├─ Current: 1.8/5  ↘️ -0.3 from 90 days ago
└─ Trend: ⚠️ Declining

Stress
├─ Current: 4.1/5  ↗️ +0.4 from 90 days ago
└─ Trend: ⚠️ Increasing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ ACTIVITY PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workout Consistency: 45% ⚠️ Needs Improvement
├─ Average: 2-3 times per week (irregular)
└─ Preferred time: 9-11 PM ⚠️ Suboptimal

Meal Consistency: 40% ⚠️ Poor
├─ Average: 1-2 meals logged per day
└─ Timing: Irregular, many skipped meals

Post-Workout Effect: -0.3 energy ❌ Negative
Post-Meal Effect: +0.5 energy ⚠️ Below optimal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ RED FLAGS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Chronic high stress (4+ for 90 days)
2. Declining energy trend over 30 days
3. Late workout timing pattern (sleep disruption risk)
4. Insufficient recovery between sessions
5. Irregular meal timing affecting energy stability
```

**4. Recommendations Panel**

```
🎯 PRIORITY ACTIONS

1. Schedule Change (High Impact)
   • Move workouts to morning or lunch
   • Target: 7-8 AM or 12-1 PM
   • Expected benefit: +30% better energy, sleep quality

2. Consistency Over Intensity (High Impact)
   • Reduce gaps to max 2 days between activities
   • Lower intensity if needed to maintain frequency
   • Expected benefit: Body adapts, stress management improves

3. Morning Fuel (Medium Impact)
   • Add simple breakfast daily
   • Takes 10 min: yogurt, smoothie, or overnight oats
   • Expected benefit: +25% better energy, decision-making

4. Recovery Integration (Medium Impact)
   • Add 1-2 complete rest days per week
   • Consider: Walking, stretching instead of intense workouts
   • Expected benefit: Better adaptation, reduced burnout risk

5. Stress Management (High Impact)
   • Exercise alone isn't reducing your stress
   • Consider: Meditation, therapy, workload adjustment
   • Expected benefit: Address root cause, not just symptoms
```

---

### Step 5: Log a New Entry as Boris

**Click "Log"** → http://localhost:5174/log

**Try logging a BETTER pattern:**

```
Type: ● Workout

Activity Description:
┌─────────────────────────────────────┐
│ Lunch break walk: 20 minutes,      │
│ fresh air and sunlight              │
└─────────────────────────────────────┘

When did this occur?
[📅 Today at 12:30 PM ▼]  ← Earlier time!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEELINGS CAPTURE

Before:
Mood: 😐──●──────😊  (2/5)
Energy: 🔋●────────⚡  (1/5) ← Typical for Boris
Stress: 😌────────●─😰  (4/5)

Notes: Stressed from morning meetings, need break

After:
Mood: 😐────●────😊  (3/5) ← Improvement!
Energy: 🔋──●──────⚡  (2/5) ← Better!
Stress: 😌──●───────😰  (3/5) ← Reduced!

Notes: Fresh air helped clear head, sunlight felt good

[Log Entry]
```

**What this demonstrates:**
- ✅ Earlier timing = better results
- ✅ Lower intensity = sustainable
- ✅ Shorter duration = fits schedule
- ✅ Actual stress reduction achieved
- 💡 Small changes > heroic efforts when stressed

---

### Step 6: Logout and Summary

**Click "Logout"** → Returns to login page

### Boris's Story Summary

**What we learned:**
- ❌ Late timing sabotages recovery and sleep
- ❌ Inconsistency prevents body adaptation
- ❌ High-intensity workouts when stressed = counterproductive
- ❌ Poor nutrition timing compounds energy issues
- ⚠️ Chronic stress needs multi-faceted approach
- 💡 Small, consistent changes > sporadic heroic efforts

**Key Metrics:**
- Energy: 1.8/5 (declining) ⚠️
- Stress: 4.1/5 (increasing) ⚠️
- Consistency: 45% (poor)
- Trend: Stagnant or declining

**AI Insights Takeaway:**
FitForecast identifies Boris's problematic patterns and provides specific, actionable interventions. The app shows that his current approach isn't working and suggests concrete alternatives based on his data.

---

## Demo 3: Cora - The Peak Performer

### Character Background
**Who is Cora?**
- 26-year-old personal trainer and fitness coach
- Competes in local CrossFit competitions
- Highly structured daily routine
- Meal preps on Sundays for the week
- Tracks everything: macros, sleep, workouts
- Goal: Optimize performance and maintain peak fitness

**Why use FitForecast?**
- Wants to identify even small optimization opportunities
- Looking for patterns she might not see manually
- Interested in correlations between variables
- Uses data to periodize training

---

### Step 1: Login as Cora

1. **Logout from Boris's account**

2. **Click the "Demo: Cora" button**
   - Email: `cora@example.com`
   - Password: `password123`

3. **Click "Login"**
   - User info shows "Cora" in top-right

---

### Step 2: Explore Cora's Dashboard

**URL**: http://localhost:5174/

#### What You'll See (Peak Performance Pattern!)

**1. Recent Entries Section**

Notice the structure and optimization:

```
🏋️ Workout - Today at 5:30 PM
"Evening CrossFit: WOD with PRs, 60 minutes"
├─ Pre-workout: Valence 4/5, Energy 4/5, Stress 2/5 ✅ Starting strong
└─ Post-workout: Valence 4/5, Energy 4/5, Stress 1/5 ✅ Maintained high

🍽️ Meal - Today at 4:15 PM
"Pre-workout: banana and almond butter"
├─ Pre-meal: Valence 4/5, Energy 3/5, Stress 2/5
└─ Post-meal: Valence 4/5, Energy 4/5, Stress 2/5 ✅ Energy boost

🍽️ Meal - Today at 12:00 PM
"Meal prep: grilled chicken, brown rice, broccoli"
├─ Pre-meal: Valence 4/5, Energy 3/5, Stress 2/5
└─ Post-meal: Valence 4/5, Energy 3/5, Stress 2/5 ✅ Stable

🍽️ Meal - Today at 7:00 AM
"Breakfast: egg whites, avocado, whole grain toast"
├─ Pre-meal: Valence 3/5, Energy 3/5, Stress 2/5
└─ Post-meal: Valence 4/5, Energy 3/5, Stress 2/5

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏃 Workout - Yesterday at 6:00 PM
"After-work run: 8K tempo run, felt strong"
├─ Pre-workout: Valence 4/5, Energy 4/5, Stress 2/5
└─ Post-workout: Valence 4/5, Energy 4/5, Stress 1/5

🍽️ Meal - Yesterday at 7:15 PM
"Post-workout: protein shake with creatine"
├─ Pre-meal: Valence 4/5, Energy 3/5, Stress 1/5
└─ Post-meal: Valence 4/5, Energy 4/5, Stress 1/5 ✅ Optimal recovery
```

**2. Personalized Insights Section**

Expected insights for Cora (optimization tone):

```
✨ INSIGHTS FOR YOU

🎯 High Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"You've found your optimal routine!"
• Your metrics are consistently high (avg 3.7/5 energy, 3.8/5 mood)
• 90% workout consistency is excellent
• Evening timing aligns with your natural energy peaks
• Keep doing what you're doing - it's working!

💪 Medium Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Nutrition timing maximizes performance"
• Pre-workout fuel within 1 hour → +15% better workout energy
• Post-workout protein within 30 min → faster perceived recovery
• Your current meal timing is nearly optimal
• Continue strategic fueling around workouts

🔄 Medium Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Consider periodization for continued gains"
• You've maintained peak performance for 90+ days (impressive!)
• To prevent adaptation plateau: vary intensity or volume
• Suggestion: 4-week cycles with 1 deload week
• Your recovery yoga days show good stress management

📊 Low Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Evening workouts work well for you"
• 90% of 5-7 PM sessions result in positive feelings
• No sleep disruption detected (unlike late-night workouts)
• Your circadian rhythm supports this timing
• No change recommended

✅ Low Priority
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Recovery strategy is effective"
• Yoga/mobility on non-lift days prevents overtraining
• Your stress levels remain low and stable (1.6/5 avg)
• Active recovery days show better next-session energy
• Continue balanced approach
```

**Pattern Observations:**
- ✅ Consistently high scores (3-4/5 across all metrics)
- ✅ 90% consistency (almost never misses)
- ✅ Evening workout pattern (5-7 PM)
- ✅ Strategic meal timing around workouts
- ✅ Low stress, well-managed (1-2/5)
- ✅ Variety: CrossFit, running, lifting, boxing, yoga
- ✅ No improvement needed - maintaining peak

---

### Step 3: Browse Cora's History

**Click "History"** → http://localhost:5174/history

#### What You'll See

**Structured, Consistent Pattern**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MARCH 2026 - Week 1
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mon 3/15 - 7:00 AM  | Breakfast: egg whites, avocado, toast | V:3→4 E:3→3 S:2→2
Mon 3/15 - 12:00 PM | Meal prep: chicken, rice, broccoli    | V:4→4 E:3→3 S:2→2
Mon 3/15 - 4:15 PM  | Pre-workout: banana, almond butter    | V:4→4 E:3→4 S:2→2
Mon 3/15 - 5:30 PM  | CrossFit: WOD, 60 min, PRs            | V:4→4 E:4→4 S:2→1
Mon 3/15 - 7:15 PM  | Post-workout: protein shake           | V:4→4 E:3→4 S:1→1
Mon 3/15 - 8:00 PM  | Dinner: steak, quinoa, greens         | V:4→4 E:4→4 S:1→1

Tue 3/14 - 7:00 AM  | Breakfast: egg whites, avocado        | V:3→4 E:3→3 S:2→2
Tue 3/14 - 12:00 PM | Meal prep: chicken, rice              | V:4→4 E:3→3 S:2→2
Tue 3/14 - 6:00 PM  | Tempo run: 8K, strong                 | V:4→4 E:4→4 S:2→1
Tue 3/14 - 7:15 PM  | Post-workout: protein shake           | V:4→4 E:3→4 S:1→1

Wed 3/13 - 7:00 AM  | Breakfast: egg whites                 | V:3→4 E:3→3 S:2→2
Wed 3/13 - 12:00 PM | Meal prep: chicken, rice              | V:4→4 E:3→3 S:2→2
Wed 3/13 - 4:15 PM  | Pre-workout: banana, almond butter    | V:4→4 E:3→4 S:2→2
Wed 3/13 - 5:30 PM  | Power lifting: squats, deadlifts      | V:4→4 E:4→4 S:2→1
Wed 3/13 - 7:15 PM  | Post-workout: protein shake           | V:4→4 E:3→4 S:1→1

Thu 3/12 - 7:00 AM  | Breakfast: egg whites                 | V:3→4 E:3→3 S:2→2
Thu 3/12 - 12:00 PM | Meal prep: chicken, rice              | V:4→4 E:3→3 S:2→2
Thu 3/12 - 7:00 PM  | Recovery yoga: stretch, mobility      | V:4→4 E:3→4 S:2→1
                    ↑ Active recovery day - strategic!

Fri 3/11 - 7:00 AM  | Breakfast: egg whites                 | V:3→4 E:3→3 S:2→2
Fri 3/11 - 12:00 PM | Meal prep: chicken, rice              | V:4→4 E:3→3 S:2→2
Fri 3/11 - 6:00 PM  | Boxing class: 45 min, high intensity  | V:4→4 E:4→4 S:2→1
Fri 3/11 - 7:15 PM  | Post-workout: protein shake           | V:4→4 E:3→4 S:1→1
```

**Key Observations:**
- ✅ Almost NO gaps (consistent daily activity)
- ✅ Structured meal timing (7 AM, 12 PM, 4 PM, 7-8 PM)
- ✅ Pre-workout fuel before intense sessions
- ✅ Post-workout protein within 30-60 min
- ✅ Recovery days strategically placed (yoga after heavy lifts)
- ✅ Variety prevents adaptation: CrossFit, running, lifting, boxing, yoga
- ✅ Meal prep consistency (same lunch daily)
- ✅ All metrics stay in high range (3-4/5)

**Scroll to Older Entries** (3-6 months ago):

```
Oct 2025 - Similar pattern!
├─ Energy: 3-4/5 (same as now)
├─ Stress: 1-2/5 (same as now)
├─ Consistency: 90% (same as now)
└─ Conclusion: Already optimized, maintaining peak
```

---

### Step 4: Analyze Cora's Trends

**Click "Trends"** → http://localhost:5174/trends

#### What You'll See

**1. Chart: Energy Levels Over 6 Months**

```
Energy
  5 |
    |                 ●─●─●─●─●─●─●─●─●
  4 |         ●─●─●─●─●─●─●─●─●─●─●─●─●─●
    |     ●─●─●─●─●─●─●─●─●─●─●
  3 | ●─●─●─●─●─●─●
    |
  2 |
    |
  1 |
    └──────────────────────────────────────────
      Sep   Oct   Nov   Dec   Jan   Feb   Mar

Legend: ● Pre-activity  ─ Post-activity
```

**Interpretation:**
- ✅ Consistently high (3-4/5)
- ✅ Stable, no wild fluctuations
- ✅ Post-activity stays high
- 💡 Already at peak, maintaining well

**2. Chart: Stress Levels Over 6 Months**

```
Stress
  5 |
    |
  4 |
    |
  3 |
    |
  2 | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
    | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
  1 | ●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●─●
    |
    └──────────────────────────────────────────
      Sep   Oct   Nov   Dec   Jan   Feb   Mar

Legend: ● Pre-activity  ─ Post-activity
```

**Interpretation:**
- ✅ Consistently low stress (1-2/5)
- ✅ Well-managed throughout period
- ✅ Exercise effectively maintains low stress
- 💡 Optimal stress management

**3. Baseline Metrics Panel**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ YOUR BASELINES (30-day rolling average)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Valence (Mood)
├─ Current: 3.8/5  → Stable (±0.1 from 90 days ago)
└─ Trend: Peak performance maintained

Energy
├─ Current: 3.7/5  → Stable (±0.1 from 90 days ago)
└─ Trend: Consistent high performance

Stress
├─ Current: 1.6/5  → Stable (±0.2 from 90 days ago)
└─ Trend: Excellent management

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ ACTIVITY PATTERNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Workout Consistency: 90% ✅ Elite Level
├─ Average: 5-6 times per week
├─ Preferred time: 5-7 PM (optimal for you)
└─ Variety: CrossFit, running, lifting, boxing, yoga

Meal Consistency: 95% ✅ Exceptional
├─ Average: 4-5 meals logged per day
├─ Timing: 7 AM, 12 PM, 4 PM (pre-WO), 7-8 PM
└─ Strategic fueling around workouts

Post-Workout Effect: +0.8 energy ✅ Excellent
Post-Meal Effect: +0.9 energy ✅ Optimal

Recovery Strategy: ✅ Effective
├─ Yoga on non-lift days
├─ Active recovery vs complete rest
└─ Prevents overtraining while maintaining consistency

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ PEAK PERFORMANCE INDICATORS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Metrics consistently in top 20% of user base
✓ No burnout indicators detected
✓ Recovery adequate for training load
✓ Nutrition timing optimized
✓ Stress well-managed
✓ Sleep (inferred from data) appears adequate
✓ Training variety prevents adaptation plateau
```

**4. Optimization Suggestions**

```
🎯 FINE-TUNING OPPORTUNITIES

💡 Advanced Strategies (Optional)

1. Periodization for Breakthroughs
   • Your performance is stable - consider planned variation
   • 4 weeks hard → 1 week deload (reduce volume 40-50%)
   • Prevents neural adaptation, allows supercompensation
   • Expected: Break through current plateau to new peak

2. Macronutrient Cycling
   • Current: Consistent intake daily
   • Consider: Higher carbs on heavy lift days, lower on recovery
   • Supports performance without excess calories
   • Your meal prep structure makes this easy to implement

3. Heart Rate Variability Tracking
   • Add HRV data to detect overtraining earlier
   • You're close to optimal load - HRV prevents tipping over
   • Complements your current recovery strategy

4. Competition Preparation
   • Your consistency suggests competition readiness
   • 8-12 week focused block could optimize for event
   • Current routine maintains fitness well

🎉 What's Working (Don't Change!)

✓ Evening workout timing
✓ Pre/post workout nutrition
✓ Active recovery days
✓ Training variety
✓ Meal prep consistency
✓ Stress management
✓ Overall structure and discipline
```

---

### Step 5: Log a New Entry as Cora

**Click "Log"** → http://localhost:5174/log

**Example entry showing optimization:**

```
Type: ● Workout

Activity Description:
┌─────────────────────────────────────┐
│ Evening CrossFit: Today's WOD       │
│ • 21-15-9: Thrusters, Pull-ups      │
│ • Time: 8:43 (PR: 8:31)             │
│ • Felt strong, good form            │
└─────────────────────────────────────┘

When did this occur?
[📅 Today at 5:30 PM ▼]  ← Optimal timing

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FEELINGS CAPTURE

Before:
Mood: 😐──────●─😊  (4/5) ← Starting high
Energy: 🔋─────●──⚡  (4/5)
Stress: 😌──●─────😰  (2/5)

Notes: Pre-workout banana 30 min ago, feeling energized

After:
Mood: 😐──────●─😊  (4/5) ← Maintained
Energy: 🔋─────●──⚡  (4/5) ← No crash
Stress: 😌●───────😰  (1/5) ← Reduced

Notes: Good workout, maintained energy, slight time PR attempt

[Log Entry]
```

**What this demonstrates:**
- ✅ Detailed tracking (includes PR tracking)
- ✅ Already high baseline scores
- ✅ Optimal pre-workout timing noted
- ✅ Maintained energy post-workout (no crash)
- ✅ Stress reduced as expected
- 💡 At peak, focus is on maintaining and small optimizations

---

### Step 6: Logout and Summary

**Click "Logout"** → Returns to login page

### Cora's Story Summary

**What we learned:**
- ✅ Peak performance is sustainable with proper structure
- ✅ Evening workouts can work well (not just mornings)
- ✅ Meal prep and timing are crucial for consistency
- ✅ Recovery days are as important as training days
- ✅ Variety prevents adaptation while maintaining gains
- ✅ Low stress comes from good planning and boundaries
- 💡 When optimized, focus shifts from improvement to maintenance

**Key Metrics:**
- Energy: 3.7/5 (stable peak) ✅
- Stress: 1.6/5 (well-managed) ✅
- Consistency: 90% (elite)
- Trend: Maintaining peak performance

**AI Insights Takeaway:**
FitForecast recognizes when a user is already optimized and adapts recommendations accordingly. Instead of pushing for change, it validates what's working and suggests only advanced fine-tuning options like periodization.

---

## Comparing All Three Personas

### Side-by-Side Metrics

| Metric | Athena (Improver) | Boris (Struggling) | Cora (Peak) |
|--------|-------------------|-------------------|-------------|
| **Energy Avg** | 3.0 (↗️ improving) | 1.8 (↘️ declining) | 3.7 (→ stable) |
| **Stress Avg** | 2.3 (↘️ improving) | 4.1 (↗️ worsening) | 1.6 (→ low) |
| **Consistency** | 85% (excellent) | 45% (poor) | 90% (elite) |
| **Workout Time** | 6-7 AM (morning) | 9-11 PM (night) | 5-7 PM (evening) |
| **Meal Quality** | Balanced, healthy | Fast food, skipped | Optimized, prepped |
| **Entry Count** | 95 (6 months) | 95 (6 months) | 95 (6 months) |
| **Gaps Between** | 1-2 days | 3-7 days | 0-1 days |
| **Recovery** | Natural + yoga | Insufficient | Strategic active |
| **Trend Direction** | ✅ Improving | ❌ Stagnant/decline | ✅ Peak maintained |

### Key Differences in Dashboard Experience

**Athena:**
- ✨ **Insights Tone**: Positive reinforcement, encouragement
- 📈 **Charts**: Upward trends, measurable progress
- 🎯 **Recommendations**: "Keep going, it's working!"
- 💪 **Focus**: Building consistency into sustainable habits

**Boris:**
- ⚠️ **Insights Tone**: Intervention, concern, actionable warnings
- 📉 **Charts**: Flat or declining, high variability
- 🚨 **Recommendations**: "Change these specific things now"
- 🔧 **Focus**: Identifying and fixing problematic patterns

**Cora:**
- ✅ **Insights Tone**: Validation, advanced optimization
- 📊 **Charts**: Stable high performance, low variance
- 🎓 **Recommendations**: "Fine-tune for next level"
- 🏆 **Focus**: Maintaining peak, avoiding plateau

### How AI Adapts to Each User

**Pattern Recognition:**
1. **Athena**: Detects improvement trend → Reinforces successful behaviors
2. **Boris**: Detects decline → Intervenes with specific solutions
3. **Cora**: Detects optimization → Suggests advanced strategies

**Tone Adaptation:**
1. **Athena**: Encouraging, motivational
2. **Boris**: Concerned but constructive
3. **Cora**: Professional, peer-to-peer

**Recommendation Specificity:**
1. **Athena**: General principles (consistency, timing)
2. **Boris**: Very specific (move to morning, add breakfast)
3. **Cora**: Advanced concepts (periodization, HRV)

---

## Key Takeaways

### What This Demo System Demonstrates

**1. Data Quality Matters**
- 95+ entries per user provides robust pattern detection
- 6-month span shows trends, not just snapshots
- Pre/post feelings enable cause-effect analysis

**2. Personalization is Powerful**
- Same app, three completely different experiences
- AI adapts tone, urgency, and recommendations
- One size does NOT fit all in fitness

**3. Timing is Everything**
- Athena: Morning workouts = success
- Boris: Late workouts = problems
- Cora: Evening workouts = optimal
- → No universal "best time"

**4. Consistency Over Intensity**
- Athena: 85% consistency + moderate intensity = improvement
- Boris: 45% consistency + high intensity = decline
- Cora: 90% consistency + varied intensity = peak
- → Consistency enables adaptation

**5. Context is Critical**
- Boris's late workouts aren't "bad" universally
- They're bad FOR HIM given his stress and schedule
- AI must consider individual context, not just rules

### For Product Demonstrations

**Use Athena to show:**
- How consistency leads to measurable improvement
- Positive reinforcement and motivation features
- Trend visualization over time
- Success story archetype

**Use Boris to show:**
- How app identifies problematic patterns
- Intervention and course-correction features
- Specific, actionable recommendations
- Can help users who are struggling

**Use Cora to show:**
- How app adapts to advanced users
- Doesn't over-recommend when things work
- Sophisticated analysis for peak performers
- Long-term sustainability and optimization

### For Development and Testing

**Test Cases:**
1. **Improvement Detection**: Athena's data should trigger positive trend insights
2. **Intervention Logic**: Boris's data should trigger warning/change recommendations
3. **Maintenance Mode**: Cora's data should trigger validation and advanced options
4. **Timing Analysis**: Three different optimal times based on individual data
5. **Consistency Algorithms**: Correlate gaps with progress/decline
6. **Stress Management**: Differentiate effective vs ineffective stress reduction

---

## How to Explore This Yourself

### Full Walkthrough Process

**1. Test All Three Personas** (30 minutes total)
   - Login as each user (10 min each)
   - Visit all pages: Dashboard, Log, History, Trends
   - Read insights carefully
   - Compare charts between users

**2. Focus on Contrasts**
   - Notice different tone of insights
   - Compare chart shapes (improving vs flat vs stable)
   - See how recommendations differ
   - Observe entry patterns in History

**3. Try Logging New Entries**
   - As Athena: Log a morning workout → See positive effects
   - As Boris: Log a lunch break walk → See better results than usual
   - As Cora: Log a structured session → See maintained high scores

**4. Test Logout/Login Flow**
   - Logout from one user
   - Login as different user
   - Verify completely different data
   - Confirm data isolation works

### Questions to Answer During Exploration

**Data Patterns:**
- ✅ Can you see Athena's improvement trend?
- ✅ Can you identify Boris's problematic timing?
- ✅ Can you notice Cora's consistency pattern?

**AI Insights:**
- ✅ Do recommendations match each user's needs?
- ✅ Is the tone appropriate for each situation?
- ✅ Are suggestions specific and actionable?

**User Experience:**
- ✅ Does the dashboard make patterns clear?
- ✅ Are charts easy to interpret?
- ✅ Do you understand what to do next?

---

## Conclusion

This demo system showcases FitForecast's ability to:
- ✅ Adapt to different user types and fitness levels
- ✅ Provide personalized, context-aware insights
- ✅ Recognize what's working vs what needs change
- ✅ Support beginners, strugglers, and peak performers
- ✅ Make data actionable, not just informational

All three personas use the same app, but get completely different experiences based on their actual data patterns. This is the power of intelligent, adaptive fitness tracking.

---

**🚀 Ready to explore? Start here:**

http://localhost:5174/login

Try all three personas and see the differences firsthand!

**Login Credentials:**
- athena@example.com / password123 (Consistent Improver)
- boris@example.com / password123 (Stressed Inconsistent)
- cora@example.com / password123 (Peak Performer)

Each has 95+ entries of realistic, detailed data waiting for you to explore!
