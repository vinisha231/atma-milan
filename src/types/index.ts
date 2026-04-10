export interface PersonInfo {
  name: string
  birthdate?: string
  age?: string
  gender?: 'male' | 'female' | 'other' | ''
}

export type MetricLevel = 'excellent' | 'good' | 'average' | 'poor'

export interface CompatibilityMetric {
  id: string
  name: string
  sanskritName: string
  icon: string
  score: number
  maxScore: number
  description: string
  detail: string
  level: MetricLevel
}

export interface CompatibilityResult {
  person1: PersonInfo
  person2: PersonInfo
  totalScore: number
  maxScore: number
  percentage: number
  metrics: CompatibilityMetric[]
  verdict: string
  verdictDetail: string
  accentColor: string
  emoji: string
}
