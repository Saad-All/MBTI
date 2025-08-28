import { MBTICalculatorService } from '@/lib/services/MBTICalculatorService'
import { ValidationService } from '@/lib/services/ValidationService'
import testData from '@/data/test-cases/mbti-validation.json'
import { QuestionResponse, MethodologyType } from '@/lib/types'

interface TestResult {
  testId: string
  description: string
  passed: boolean
  expectedType?: string
  actualType?: string
  error?: string
  details?: any
}

export class TestValidator {
  private calculatorService: MBTICalculatorService
  private validationService: ValidationService

  constructor() {
    this.calculatorService = MBTICalculatorService.getInstance()
    this.validationService = ValidationService.getInstance()
  }

  public runAllTests(): TestResult[] {
    const results: TestResult[] = []

    // Run regular test cases
    for (const testCase of testData.testCases) {
      const result = this.runSingleTest(testCase)
      results.push(result)
    }

    // Run edge cases
    for (const edgeCase of testData.edgeCases) {
      const result = this.runEdgeCase(edgeCase)
      results.push(result)
    }

    return results
  }

  private runSingleTest(testCase: any): TestResult {
    try {
      const responses = testCase.responses as QuestionResponse[]
      
      // Validate responses
      const validation = this.validationService.validateResponses(
        responses,
        testCase.methodology as MethodologyType
      )

      if (!validation.isValid) {
        return {
          testId: testCase.id,
          description: testCase.description,
          passed: false,
          expectedType: testCase.expectedType,
          error: 'Validation failed',
          details: validation.errors,
        }
      }

      // Calculate MBTI
      const result = this.calculatorService.calculateMBTI({
        sessionId: testCase.id,
        responses,
        methodology: testCase.methodology as MethodologyType,
        isInterim: testCase.isInterim || false,
      })

      // Compare results
      const passed = result.mbtiType === testCase.expectedType

      return {
        testId: testCase.id,
        description: testCase.description,
        passed,
        expectedType: testCase.expectedType,
        actualType: result.mbtiType,
        details: {
          dimensionScores: result.dimensionScores,
          confidence: result.overallConfidence,
        },
      }
    } catch (error) {
      return {
        testId: testCase.id,
        description: testCase.description,
        passed: false,
        expectedType: testCase.expectedType,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  private runEdgeCase(edgeCase: any): TestResult {
    try {
      const responses = edgeCase.responses as QuestionResponse[]
      
      // Validate responses
      const validation = this.validationService.validateResponses(
        responses,
        edgeCase.methodology as MethodologyType
      )

      // Edge cases should fail validation
      if (edgeCase.expectError && !validation.isValid) {
        return {
          testId: edgeCase.id,
          description: edgeCase.description,
          passed: true,
          error: 'Expected error occurred',
          details: validation.errors,
        }
      }

      // If we expected an error but didn't get one
      if (edgeCase.expectError && validation.isValid) {
        return {
          testId: edgeCase.id,
          description: edgeCase.description,
          passed: false,
          error: 'Expected error did not occur',
        }
      }

      return {
        testId: edgeCase.id,
        description: edgeCase.description,
        passed: !edgeCase.expectError && validation.isValid,
        details: validation.errors,
      }
    } catch (error) {
      return {
        testId: edgeCase.id,
        description: edgeCase.description,
        passed: edgeCase.expectError,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  public printResults(results: TestResult[]): void {
    console.log('\n=== MBTI Algorithm Test Results ===\n')

    let passedCount = 0
    let failedCount = 0

    for (const result of results) {
      const status = result.passed ? '✓' : '✗'
      const color = result.passed ? '\x1b[32m' : '\x1b[31m'
      const reset = '\x1b[0m'

      console.log(`${color}${status} ${result.testId}: ${result.description}${reset}`)
      
      if (!result.passed && result.expectedType) {
        console.log(`  Expected: ${result.expectedType}, Got: ${result.actualType}`)
      }
      
      if (result.error) {
        console.log(`  Error: ${result.error}`)
      }

      if (result.passed) {
        passedCount++
      } else {
        failedCount++
      }
    }

    const resetColor = '\x1b[0m'
    console.log(`\n${resetColor}Total: ${results.length} tests`)
    console.log(`\x1b[32mPassed: ${passedCount}${resetColor}`)
    console.log(`\x1b[31mFailed: ${failedCount}${resetColor}`)
    console.log()
  }
}