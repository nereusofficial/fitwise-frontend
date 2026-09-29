import type {
  Measurement,
  MeasurementRow,
  ProfileRow,
  RecommendationInput,
  RecommendationRecord,
  RecommendationRow,
  UserProfile,
} from '../types'

export function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    name: row.name ?? '',
    age: row.age,
    heightCm: row.height_cm,
    weightKg: row.weight_kg,
    gender: row.gender,
    activityLevel: row.activity_level,
    goal: row.goal,
    goals: row.goals ?? [],
    habits: row.habits ?? [],
    mealPlanningFrequency: row.meal_planning_frequency ?? 'weekly',
    wantsMealPlans: row.wants_meal_plans ?? false,
    about: row.about ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function mapMeasurement(row: MeasurementRow): Measurement {
  return {
    id: row.id,
    userId: row.user_id,
    weightKg: row.weight_kg,
    measuredAt: row.measured_at,
    createdAt: row.created_at,
  }
}

export function mapRecommendation(row: RecommendationRow): RecommendationRecord {
  return {
    id: row.id,
    userId: row.user_id,
    inputStats: row.input_stats as RecommendationInput,
    result: row.result,
    createdAt: row.created_at,
  }
}
