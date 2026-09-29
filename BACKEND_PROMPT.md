# FitWise Backend — Change Prompt

> Copy everything below the line and give it to your AI coding assistant. It covers the Supabase schema, the `/api/recommend` contract, and the AI personalization logic.

---

I'm building the backend for **FitWise**, a fitness web app. The frontend has been redesigned around a rich onboarding flow, and the backend needs to match. I need you to make the following changes. Do NOT break the existing auth (Supabase JWT in the `Authorization: Bearer` header) or the existing error format (`{ error: string }` with statuses 400/401/429/502).

## 1. Supabase `profiles` table — add columns

The onboarding now collects more than just physical stats. Add these columns to the `profiles` table (all nullable, with sensible defaults). Keep RLS as-is (users only see their own row).

| Column | Type | Default | Notes |
|---|---|---|---|
| `name` | `text` | `''` | User's first name |
| `goals` | `jsonb` | `'[]'` | Array of goal strings, e.g. `["lose_weight","eat_healthier"]` |
| `habits` | `jsonb` | `'[]'` | Array of habit strings, e.g. `["sleep","hydration"]` |
| `meal_planning_frequency` | `text` | `'weekly'` | One of `daily`, `few_times_week`, `weekly`, `rarely` |
| `wants_meal_plans` | `boolean` | `false` | Whether the user wants weekly meal plans |
| `about` | `text` | `''` | Free-text context the user wrote about themselves |

The existing columns (`age`, `height_cm`, `weight_kg`, `gender`, `activity_level`, `goal`, `created_at`, `updated_at`) stay unchanged. The frontend upserts the full profile object, so make sure the upsert handles these new fields.

## 2. `POST /api/recommend` — accept the richer payload

The request body now includes the onboarding data in addition to the existing fields. New fields are **optional** (fall back to current behavior when absent) so older clients keep working.

**New request body:**
```json
{
  "age": 28,
  "heightCm": 175,
  "weightKg": 70,
  "gender": "male",
  "activityLevel": "moderate",
  "goal": "lose_weight",
  "goals": ["lose_weight", "eat_healthier"],
  "habits": ["sleep", "hydration", "meal_prep"],
  "mealPlanningFrequency": "weekly",
  "wantsMealPlans": true,
  "about": "I sit at a desk all day and love running on weekends."
}
```

- `goals`, `habits` — string arrays
- `mealPlanningFrequency` — `daily | few_times_week | weekly | rarely`
- `wantsMealPlans` — boolean
- `about` — string

Keep the existing validation ranges for `age` (13–100), `heightCm` (100–250), `weightKg` (30–300), and the existing enum checks. Return `400` with `{ error, details }` for invalid input as before.

## 3. Use the onboarding data to personalize the AI recommendation

This is the important part. The AI prompt you send to the model should now incorporate the onboarding answers so the plan feels tailored, not generic. Specifically:

- **`goals`** — drive the primary focus. If `lose_weight` is present, emphasize a calorie deficit and fat loss; if `build_muscle`, emphasize protein and progressive overload; if `eat_healthier`/`energy`, emphasize food quality and energy stability.
- **`habits`** — weave the selected habits into the `nutritionTips` and `notes`. E.g. if `sleep` is selected, add a tip about sleep and recovery; if `hydration`, add hydration guidance; if `stress`, add stress-management notes.
- **`about`** — use this free-text context to adapt the plan (injuries, schedule, preferences, constraints). Reference it naturally in the `summary`.
- **`wantsMealPlans`** — when `true`, add a `mealPlan` field to the response (a 7-day array of `{ day, meals: { breakfast, lunch, dinner, snack } }`) with simple, healthy meals that fit the calorie/macro targets. When `false`, omit it.
- **`mealPlanningFrequency`** — adjust the tone/tips. A user who plans daily gets different guidance than one who "wings it."

Keep the existing response shape (`summary`, `dailyCalories`, `macros`, `workoutPlan`, `nutritionTips`, `notes`) and just make the content smarter. Add `mealPlan` only when `wantsMealPlans` is true.

## 4. Google OAuth (Supabase dashboard — config, not code)

The frontend now uses **Google sign-in only** (`supabase.auth.signInWithOAuth({ provider: 'google' })`). This requires no backend code change, but you must:
- Enable the **Google** provider in the Supabase dashboard (Authentication → Providers).
- Add your Google OAuth client ID/secret.
- Add your frontend origin (e.g. `http://localhost:5173` and the production URL) to the Supabase **Redirect URLs** and to the Google OAuth consent screen's authorized redirect URIs (`<supabase-url>/auth/v1/callback`).

## Constraints
- Keep the service_role key server-side only. The frontend uses only the anon key.
- Don't store tokens in the database; keep using the Supabase JWT from the `Authorization` header.
- Keep the 429 rate limit (20/hour) and the 502 AI-failure handling.
- Return the same `Recommendation` shape so the frontend's existing `RecommendationView` keeps working.

---

**Summary of what to change:** (1) add 6 nullable columns to `profiles`, (2) accept 5 new optional fields in `/api/recommend`, (3) feed `goals`/`habits`/`about`/`wantsMealPlans`/`mealPlanningFrequency` into the AI prompt for personalization and optionally return a `mealPlan`, (4) enable Google OAuth in Supabase. Everything else stays the same.
