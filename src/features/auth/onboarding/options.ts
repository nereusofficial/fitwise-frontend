import type { ActivityLevel, Goal, MealPlanningFrequency } from '../../../types'

export interface Option {
  value: string
  label: string
  description?: string
  emoji?: string
}

export const GOAL_OPTIONS: Option[] = [
  { value: 'lose_weight', label: 'Lose weight', description: 'Burn fat and slim down' },
  { value: 'build_muscle', label: 'Build muscle', description: 'Get stronger and more defined' },
  { value: 'maintain', label: 'Maintain', description: 'Stay healthy and consistent' },
  { value: 'endurance', label: 'Improve endurance', description: 'Boost stamina and cardio' },
  { value: 'eat_healthier', label: 'Eat healthier', description: 'Build better nutrition habits' },
  { value: 'energy', label: 'Boost energy', description: 'Feel more energized daily' },
]

export const HABIT_OPTIONS: Option[] = [
  { value: 'sleep', label: 'Quality sleep', description: 'Consistent, restful rest' },
  { value: 'hydration', label: 'Staying hydrated', description: 'Drink enough water' },
  { value: 'meal_prep', label: 'Meal prepping', description: 'Plan and prep ahead' },
  { value: 'exercise', label: 'Consistent exercise', description: 'Move regularly' },
  { value: 'mindful_eating', label: 'Mindful eating', description: 'Eat with awareness' },
  { value: 'stress', label: 'Managing stress', description: 'Keep stress in check' },
]

export const MEAL_PLANNING_OPTIONS: Option[] = [
  { value: 'daily', label: 'Every day', description: 'I plan meals daily' },
  { value: 'few_times_week', label: 'A few times a week', description: 'I plan some days' },
  { value: 'weekly', label: 'Once a week', description: 'I do a weekly plan' },
  { value: 'rarely', label: 'Rarely or never', description: 'I wing it' },
]

export const ACTIVITY_OPTIONS: (Option & { value: ActivityLevel })[] = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise' },
  { value: 'light', label: 'Light', description: '1–3 days/week' },
  { value: 'moderate', label: 'Moderate', description: '3–5 days/week' },
  { value: 'active', label: 'Active', description: '6–7 days/week' },
  { value: 'very_active', label: 'Very active', description: 'Physical job + exercise' },
]

export const PRIMARY_GOAL_MAP: Record<string, Goal> = {
  lose_weight: 'lose_weight',
  build_muscle: 'build_muscle',
  maintain: 'maintain',
  endurance: 'maintain',
  eat_healthier: 'maintain',
  energy: 'maintain',
}

export const MEAL_PLANNING_VALUES = MEAL_PLANNING_OPTIONS.map((o) => o.value) as MealPlanningFrequency[]
