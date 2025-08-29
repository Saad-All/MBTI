#!/usr/bin/env ts-node

import { MBTICalculatorService } from '../lib/services/MBTICalculatorService'
import { SAISQuestionService } from '../lib/services/SAISQuestionService'
import { QuestionResponse } from '../lib/types'

// Test SAIS functionality
console.log('Testing SAIS Implementation')
console.log('==========================\n')

// Test 1: SAIS Question Service
console.log('Test 1: SAIS Question Service')
console.log('-----------------------------')

const saisService = SAISQuestionService.getInstance()
const enQuestions = saisService.getQuestions('en')
const arQuestions = saisService.getQuestions('ar')

console.log(`English questions loaded: ${enQuestions.questions.length}`)
console.log(`Arabic questions loaded: ${arQuestions.questions.length}`)

// Validate question coverage
const coverage = saisService.validateQuestionCoverage(enQuestions.questions)
console.log('\nQuestion coverage:')
console.log(`  E/I: ${coverage.coverage['E/I']} questions`)
console.log(`  S/N: ${coverage.coverage['S/N']} questions`)
console.log(`  T/F: ${coverage.coverage['T/F']} questions`)
console.log(`  J/P: ${coverage.coverage['J/P']} questions`)
console.log(`  Valid coverage: ${coverage.isValid}`)

// Test 2: SAIS Distribution Validation
console.log('\n\nTest 2: SAIS Distribution Validation')
console.log('------------------------------------')

const mbtiCalculator = MBTICalculatorService.getInstance()

const validDistributions = [
  [5, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5]
]

console.log('Testing valid distributions:')
validDistributions.forEach(([a, b]) => {
  const isValid = mbtiCalculator.validateSAISDistribution(a, b)
  console.log(`  ${a}-${b}: ${isValid ? '✓' : '✗'}`)
})

console.log('\nTesting invalid distributions:')
const invalidDistributions = [[3, 3], [6, 0], [2, 2]]
invalidDistributions.forEach(([a, b]) => {
  const isValid = mbtiCalculator.validateSAISDistribution(a, b)
  console.log(`  ${a}-${b}: ${isValid ? '✓' : '✗'}`)
})

// Test 3: SAIS Scoring Calculation
console.log('\n\nTest 3: SAIS Scoring Calculation')
console.log('--------------------------------')

// Create sample SAIS responses matching the example from SAIS_questions.md
const sampleResponses: QuestionResponse[] = [
  // E/I dimension (questions 1-3)
  {
    responseId: 'resp_1',
    sessionId: 'test-session',
    questionId: 'sais_1',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 4,
    distributionB: 1,
    mbtiDimension: 'E/I',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'I'
  },
  {
    responseId: 'resp_2',
    sessionId: 'test-session',
    questionId: 'sais_2',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 3,
    distributionB: 2,
    mbtiDimension: 'E/I',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'I'
  },
  {
    responseId: 'resp_3',
    sessionId: 'test-session',
    questionId: 'sais_3',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 5,
    distributionB: 0,
    mbtiDimension: 'E/I',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'I'
  },
  // S/N dimension (questions 4-6)
  {
    responseId: 'resp_4',
    sessionId: 'test-session',
    questionId: 'sais_4',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 4,
    distributionB: 1,
    mbtiDimension: 'S/N',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'N'
  },
  {
    responseId: 'resp_5',
    sessionId: 'test-session',
    questionId: 'sais_5',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 5,
    distributionB: 0,
    mbtiDimension: 'S/N',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'N'
  },
  {
    responseId: 'resp_6',
    sessionId: 'test-session',
    questionId: 'sais_6',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 4,
    distributionB: 1,
    mbtiDimension: 'S/N',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'N'
  },
  // T/F dimension (questions 7-9)
  {
    responseId: 'resp_7',
    sessionId: 'test-session',
    questionId: 'sais_7',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 2,
    distributionB: 3,
    mbtiDimension: 'T/F',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'B',
    tendency: 'F'
  },
  {
    responseId: 'resp_8',
    sessionId: 'test-session',
    questionId: 'sais_8',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 1,
    distributionB: 4,
    mbtiDimension: 'T/F',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'B',
    tendency: 'F'
  },
  {
    responseId: 'resp_9',
    sessionId: 'test-session',
    questionId: 'sais_9',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 0,
    distributionB: 5,
    mbtiDimension: 'T/F',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'B',
    tendency: 'F'
  },
  // J/P dimension (questions 10-12)
  {
    responseId: 'resp_10',
    sessionId: 'test-session',
    questionId: 'sais_10',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 4,
    distributionB: 1,
    mbtiDimension: 'J/P',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'J'
  },
  {
    responseId: 'resp_11',
    sessionId: 'test-session',
    questionId: 'sais_11',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 5,
    distributionB: 0,
    mbtiDimension: 'J/P',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'J'
  },
  {
    responseId: 'resp_12',
    sessionId: 'test-session',
    questionId: 'sais_12',
    questionType: 'extended',
    responseType: 'distribution',
    distributionA: 4,
    distributionB: 1,
    mbtiDimension: 'J/P',
    score: 0,
    timestamp: new Date(),
    selectedOption: 'A',
    tendency: 'J'
  }
]

// Test the scoring
mbtiCalculator.testSAISScoring(sampleResponses)

// Test 4: Dynamic Question Selection
console.log('\n\nTest 4: Dynamic Question Selection')
console.log('----------------------------------')

// Simulate interim results with varying confidence
const interimResponses: QuestionResponse[] = [
  // High confidence E/I (all E)
  {
    responseId: 'interim_1',
    sessionId: 'test-session',
    questionId: 'core_1',
    questionType: 'core',
    responseType: 'binary',
    selectedOption: 'A',
    mbtiDimension: 'E/I',
    score: 0,
    timestamp: new Date(),
    tendency: 'E'
  },
  // Low confidence S/N (mixed)
  {
    responseId: 'interim_2',
    sessionId: 'test-session',
    questionId: 'core_2',
    questionType: 'core',
    responseType: 'binary',
    selectedOption: 'A',
    mbtiDimension: 'S/N',
    score: 0,
    timestamp: new Date(),
    tendency: 'S'
  },
  // Moderate confidence T/F
  {
    responseId: 'interim_3',
    sessionId: 'test-session',
    questionId: 'core_3',
    questionType: 'core',
    responseType: 'binary',
    selectedOption: 'B',
    mbtiDimension: 'T/F',
    score: 0,
    timestamp: new Date(),
    tendency: 'F'
  },
  // No J/P responses yet
]

const dynamicQuestions = saisService.getDynamicQuestions('en', interimResponses, 12)
console.log(`Selected ${dynamicQuestions.length} dynamic questions based on interim results`)

const dynamicCoverage = saisService.validateQuestionCoverage(dynamicQuestions)
console.log('\nDynamic question coverage:')
console.log(`  E/I: ${dynamicCoverage.coverage['E/I']} questions`)
console.log(`  S/N: ${dynamicCoverage.coverage['S/N']} questions`)
console.log(`  T/F: ${dynamicCoverage.coverage['T/F']} questions`)
console.log(`  J/P: ${dynamicCoverage.coverage['J/P']} questions`)

console.log('\n✅ All SAIS tests completed successfully!')