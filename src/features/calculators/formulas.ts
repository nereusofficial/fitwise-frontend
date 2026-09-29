import type { ActivityLevel, Gender, Goal } from '../../types'

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: 'Sedentary (little or no exercise)',
  light: 'Light (1–3 days/week)',
  moderate: 'Moderate (3–5 days/week)',
  active: 'Active (6–7 days/week)',
  very_active: 'Very active (physical job + exercise)',
}

export const GOAL_LABELS: Record<Goal, string> = {
  lose_weight: 'Lose weight',
  maintain: 'Maintain weight',
  build_muscle: 'Build muscle',
}

export function calcBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100
  return weightKg / (heightM * heightM)
}

export type BMICategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese'

export function bmiCategory(bmi: number): BMICategory {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

export function calcBMR(weightKg: number, heightCm: number, age: number, gender: Gender): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

export function calcTDEE(bmr: number, activityLevel: ActivityLevel): number {
  return bmr * ACTIVITY_MULTIPLIERS[activityLevel]
}

export function targetCalories(tdee: number, goal: Goal): number {
  if (goal === 'lose_weight') return tdee - 500
  if (goal === 'build_muscle') return tdee + 300
  return tdee
}

export interface MacroSplit {
  proteinPct: number
  carbsPct: number
  fatPct: number
}

const MACRO_SPLITS: Record<Goal, MacroSplit> = {
  lose_weight: { proteinPct: 0.4, carbsPct: 0.3, fatPct: 0.3 },
  maintain: { proteinPct: 0.3, carbsPct: 0.4, fatPct: 0.3 },
  build_muscle: { proteinPct: 0.35, carbsPct: 0.45, fatPct: 0.2 },
}

export interface MacroGrams {
  proteinG: number
  carbsG: number
  fatG: number
}

export function calcMacros(calories: number, goal: Goal): MacroGrams {
  const split = MACRO_SPLITS[goal]
  return {
    proteinG: Math.round((calories * split.proteinPct) / 4),
    carbsG: Math.round((calories * split.carbsPct) / 4),
    fatG: Math.round((calories * split.fatPct) / 9),
  }
}
