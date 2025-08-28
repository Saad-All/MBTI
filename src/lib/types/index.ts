// Assessment Types
export type AssessmentFormat = 'scenarios' | 'traits' | 'sais'
export type AssessmentStep = 'welcome' | 'format-selection' | 'questions' | 'results' | 'coaching'
export type Language = 'en' | 'ar'
export type Direction = 'ltr' | 'rtl'
export type Theme = 'light' | 'dark'

// MBTI Types
export type MBTIType = 
  | 'INTJ' | 'INTP' | 'ENTJ' | 'ENTP'
  | 'INFJ' | 'INFP' | 'ENFJ' | 'ENFP'
  | 'ISTJ' | 'ISFJ' | 'ESTJ' | 'ESFJ'
  | 'ISTP' | 'ISFP' | 'ESTP' | 'ESFP'

export type MBTIDimension = 'E/I' | 'S/N' | 'T/F' | 'J/P'

// Question Types
export interface Question {
  id: string
  text: string
  dimension: MBTIDimension
  category: AssessmentFormat
  options?: QuestionOption[]
  type: 'scenario' | 'trait' | 'sais'
}

export interface QuestionOption {
  id: string
  text: string
  score: number
  tendency: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
}

export interface QuestionResponse {
  questionId: string
  score: number
  tendency?: string
  timestamp: Date
  // Extended for scoring algorithm
  responseId: string
  sessionId: string
  questionType: 'core' | 'extended'
  responseType: 'binary' | 'distribution'
  selectedOption?: 'A' | 'B'  // For binary responses
  distributionA?: number // 0-5 for SAIS
  distributionB?: number // 0-5 for SAIS
  mbtiDimension: MBTIDimension
}

// Assessment Results
export interface AssessmentResult {
  sessionId: string
  mbtiType: MBTIType
  scores: {
    EI: number // Extraversion/Introversion
    SN: number // Sensing/Intuition  
    TF: number // Thinking/Feeling
    JP: number // Judging/Perceiving
  }
  confidence: number
  completedAt: Date
  language: Language
  format: AssessmentFormat
}

// API Types
export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  timestamp: string
}

export interface HealthCheckResponse {
  status: 'healthy' | 'error'
  timestamp: string
  environment: string
  version: string
  uptime: number
  nodejs: string
}

// Component Props
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

export interface LocaleComponentProps extends BaseComponentProps {
  locale: Language
}

// Form Types
export interface FormFieldProps {
  name: string
  label: string
  error?: string
  required?: boolean
}

export interface FormValidationRules {
  required?: boolean | string
  min?: number | { value: number; message: string }
  max?: number | { value: number; message: string }
  pattern?: { value: RegExp; message: string }
}

// Scoring Types
export type MethodologyType = 'scenarios' | 'traits' | 'sais'

export interface ScoringInput {
  sessionId: string
  responses: QuestionResponse[]
  methodology: MethodologyType
  isInterim?: boolean // For 4-question preliminary results
}

export interface DimensionScore {
  dimension: MBTIDimension
  rawScoreA: number // E, S, T, J
  rawScoreB: number // I, N, F, P
  preference: string // The winning preference
  confidence: number // Confidence percentage
}

export interface ScoringResult {
  sessionId: string
  mbtiType: MBTIType
  dimensionScores: DimensionScore[]
  overallConfidence: number
  methodology: MethodologyType
  isInterim: boolean
  totalResponses: number
}

export interface CalculationOptions {
  enableCaching?: boolean
  validateResponses?: boolean
  includeDebugInfo?: boolean
}

// Validation Types
export interface ValidationResult {
  isValid: boolean
  errors: ValidationError[]
}

export interface ValidationError {
  field: string
  message: string
  code: string
}

// SAIS Specific Types
export interface SAISValidationResult extends ValidationResult {
  distributionTotals?: { [questionId: string]: number }
}

// MBTIResults for API response
export interface MBTIResults extends ScoringResult {
  calculatedAt: Date
  cacheHit?: boolean
}

