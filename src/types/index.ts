export interface PersonInfo {
  name: string
  birthdate?: string   // YYYY-MM-DD
  birthTime?: string   // HH:MM  (local time at birth)
  utcOffset?: number   // UTC offset in hours, e.g. 5.5 for IST, -5 for EST
  age?: string
  gender?: 'male' | 'female' | 'other' | ''
}

/** Precision level of the compatibility calculation for one person. */
export type Precision = 'high' | 'medium' | 'low'

/** Computed astrology data for one person, attached to the result. */
export interface PersonAstro {
  nakshatra?: string   // e.g. "Rohini"
  moonRashi?: string   // e.g. "Vrishabha"
  precision: Precision // high = Nakshatra known, medium = date only, low = name only
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
  astro1: PersonAstro
  astro2: PersonAstro
  totalScore: number
  maxScore: number
  percentage: number
  metrics: CompatibilityMetric[]
  verdict: string
  verdictDetail: string
  accentColor: string
  emoji: string
}
