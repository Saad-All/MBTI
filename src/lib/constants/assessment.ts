/**
 * Assessment constants for question counts and format configurations
 */

// Core assessment constants
export const CORE_QUESTIONS_COUNT = 4;

// Format-specific question counts
export const FORMAT_QUESTIONS = {
  scenarios: 12,
  traits: 16,
  sais: 12
} as const;

// Total questions per format (including core)
export const TOTAL_QUESTIONS = {
  scenarios: CORE_QUESTIONS_COUNT + FORMAT_QUESTIONS.scenarios, // 16
  traits: CORE_QUESTIONS_COUNT + FORMAT_QUESTIONS.traits, // 20
  sais: CORE_QUESTIONS_COUNT + FORMAT_QUESTIONS.sais // 16
} as const;

// Progress milestones
export const PROGRESS_MILESTONES = {
  coreComplete: 25, // After 4 core questions
  formatSelected: 40, // After format selection
  assessmentComplete: 100
} as const;

// Question pool identifiers
export const QUESTION_POOLS = {
  core: 'core-foundation',
  scenarios: 'life-scenarios',
  traits: 'personality-traits',
  sais: 'sais-methodology'
} as const;

export type AssessmentFormat = keyof typeof FORMAT_QUESTIONS;
export type QuestionPool = typeof QUESTION_POOLS[keyof typeof QUESTION_POOLS];