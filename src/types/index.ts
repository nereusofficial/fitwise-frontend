export type Gender = 'male' | 'female'

export type ActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very_active'

export type Goal = 'lose_weight' | 'maintain' | 'build_muscle'

export type MealPlanningFrequency = 'daily' | 'few_times_week' | 'weekly' | 'rarely'

export interface UserProfile {
  id: string
  name: string
  age: number
  heightCm: number
  weightKg: number
  gender: Gender
  activityLevel: ActivityLevel
  goal: Goal
  goals: string[]
  habits: string[]
  mealPlanningFrequency: MealPlanningFrequency
  wantsMealPlans: boolean
  about: string
  createdAt: string
  updatedAt: string
}

export interface ProfileRow {
  id: string
  name: string
  age: number
  height_cm: number
  weight_kg: number
  gender: Gender
  activity_level: ActivityLevel
  goal: Goal
  goals: string[]
  habits: string[]
  meal_planning_frequency: MealPlanningFrequency
  wants_meal_plans: boolean
  about: string
  created_at: string
  updated_at: string
}

export interface Measurement {
  id: string
  userId: string
  weightKg: number
  measuredAt: string
  createdAt: string
}

export interface MeasurementRow {
  id: string
  user_id: string
  weight_kg: number
  measured_at: string
  created_at: string
}

export interface Exercise {
  name: string
  sets: number
  reps: number
}

export interface WorkoutDay {
  day: string
  focus: string
  exercises: Exercise[]
}

export interface Macros {
  proteinG: number
  carbsG: number
  fatG: number
}

export interface Recommendation {
  summary: string
  dailyCalories: number
  macros: Macros
  workoutPlan: WorkoutDay[]
  nutritionTips: string[]
  notes: string[]
}

export interface RecommendationRecord {
  id: string
  userId: string
  inputStats: RecommendationInput
  result: Recommendation
  createdAt: string
}

export interface RecommendationRow {
  id: string
  user_id: string
  input_stats: RecommendationInput
  result: Recommendation
  created_at: string
}

export interface RecommendationInput {
  age: number
  heightCm: number
  weightKg: number
  gender: Gender
  activityLevel: ActivityLevel
  goal: Goal
  goals: string[]
  habits: string[]
  mealPlanningFrequency: MealPlanningFrequency
  wantsMealPlans: boolean
  about: string
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface OnboardingData {
  name: string
  goals: string[]
  habits: string[]
  mealPlanningFrequency: MealPlanningFrequency | ''
  wantsMealPlans: boolean | null
  activityLevel: ActivityLevel | ''
  goal: Goal | ''
  about: string
  age: string
  heightCm: string
  weightKg: string
  gender: Gender | ''
}
