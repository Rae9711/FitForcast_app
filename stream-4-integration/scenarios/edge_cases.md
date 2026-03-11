## Edge Cases

### 1. New User (Sparse Data)

**Scenario**
- Day 1, user logs 3 entries (mixed workouts/meals) with minimal feelings.  

**Expected Backend Behavior**
- Baselines can be computed but are marked as **low confidence** (few data points).  
- No insight rules fire yet; each rule enforces a minimum data-point threshold (e.g., ≥5).  

**Expected Frontend Behavior**
- Trends view shows limited or placeholder baselines.  
- Insights pane shows helper text such as:  
  - "More logs needed before we can generate insights (3/5)."  

---

### 2. Conflicting Signals (Low Energy, High Mood)

**Scenario**
- Log: `"30 min strength workout after work"`  
- Feelings (post): Energy 2/5, Valence 4/5, Stress 1/5.  

**Expected Backend Behavior**
- Store all three dimensions as given (no conflict resolution in backend).  
- Baseline metrics that rely on energy vs. mood treat them separately.  

**Expected Analytics Behavior**
- No "energy uplift" insight should fire from this entry alone.  
- Rules consuming both energy and valence must be tested with this scenario to avoid false positives.  

**Expected Frontend Behavior**
- UI shows both low energy and high mood without trying to "correct" the user.  

---

### 3. Very Long, Multi-Activity Log Text

**Scenario**
- Log:  
  `"Did 45 min HIIT, then a 20 min cool-down walk, then made a smoothie with protein powder and berries. Felt wiped but happy."`  

**Expected Parser Behavior**
- Extract:  
  - Activity type: "workout" (or more specific, e.g., "HIIT")  
  - Duration: at least 45 min (optionally 65 if counting cool-down)  
  - Intensity: "high"  
  - Food tags: ["protein", "fruit"] if modeled  
- Flag internally or via tag as **multi-activity**.  

**Expected UI Behavior**
- History view may display a "multi-activity" badge or similar indicator.  

---

### 4. Typos & Abbreviations

**Scenario Examples**
- `"30min HIIT + wghts"`  
- `"chkn w/ rice n broc"`  

**Expected Parser Behavior**
- Recognize common exercise/nutrition abbreviations and map to canonical terms:  
  - `HIIT`, `wghts` → strength/high-intensity workout  
  - `chkn`, `broc` → "chicken", "broccoli" (protein + vegetables)  
- Maintain high confidence for these patterns in evaluation.  

**Expected Analytics Behavior**
- Parsed entries from these logs are usable for baseline metrics and rules (not filtered out).  

---

### 5. Duplicate Logging

**Scenario**
- User logs essentially the same workout twice within a short window:  
  - `"60 min strength workout, heavy squats and bench"`  
  - Immediately followed by: `"Strength session today: 1 hr, same as usual"`  

**Expected Backend Behavior**
- Both entries are stored; optional deduplication can be a later enhancement.  
- Baselines and rules must tolerate occasional duplicates without exploding counts.  

**Expected Frontend Behavior**
- History view may show both entries; UI does not attempt to auto-merge.  

**Expected Test Usage**
- Use these scenarios to ensure rules and metrics remain robust when duplicates exist.  

