import {
  QuestionResponse,
  ValidationResult,
  ValidationError,
  SAISValidationResult,
  MethodologyType,
} from '@/lib/types'

export class ValidationService {
  private static instance: ValidationService

  private constructor() {}

  public static getInstance(): ValidationService {
    if (!ValidationService.instance) {
      ValidationService.instance = new ValidationService()
    }
    return ValidationService.instance
  }

  public validateResponses(
    responses: QuestionResponse[],
    methodology: MethodologyType
  ): ValidationResult {
    const errors: ValidationError[] = []

    if (!responses || responses.length === 0) {
      errors.push({
        field: 'responses',
        message: 'No responses provided',
        code: 'EMPTY_RESPONSES',
      })
      return { isValid: false, errors }
    }

    for (let i = 0; i < responses.length; i++) {
      const response = responses[i]
      const responseErrors = this.validateSingleResponse(response, methodology, i)
      errors.push(...responseErrors)
    }

    if (methodology === 'sais') {
      const saisErrors = this.validateSAISDistributions(responses)
      errors.push(...saisErrors)
    }

    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  private validateSingleResponse(
    response: QuestionResponse,
    methodology: MethodologyType,
    index: number
  ): ValidationError[] {
    const errors: ValidationError[] = []
    const fieldPrefix = `responses[${index}]`

    if (!response.questionId) {
      errors.push({
        field: `${fieldPrefix}.questionId`,
        message: 'Question ID is required',
        code: 'MISSING_QUESTION_ID',
      })
    }

    if (!response.sessionId) {
      errors.push({
        field: `${fieldPrefix}.sessionId`,
        message: 'Session ID is required',
        code: 'MISSING_SESSION_ID',
      })
    }

    if (!response.mbtiDimension) {
      errors.push({
        field: `${fieldPrefix}.mbtiDimension`,
        message: 'MBTI dimension is required',
        code: 'MISSING_DIMENSION',
      })
    } else if (!this.isValidDimension(response.mbtiDimension)) {
      errors.push({
        field: `${fieldPrefix}.mbtiDimension`,
        message: 'Invalid MBTI dimension',
        code: 'INVALID_DIMENSION',
      })
    }

    if (!response.responseType) {
      errors.push({
        field: `${fieldPrefix}.responseType`,
        message: 'Response type is required',
        code: 'MISSING_RESPONSE_TYPE',
      })
    }

    if (response.responseType === 'binary') {
      if (!response.selectedOption || !['A', 'B'].includes(response.selectedOption)) {
        errors.push({
          field: `${fieldPrefix}.selectedOption`,
          message: 'Binary response must have selectedOption as A or B',
          code: 'INVALID_BINARY_OPTION',
        })
      }
    } else if (response.responseType === 'distribution') {
      if (response.distributionA === undefined || response.distributionB === undefined) {
        errors.push({
          field: `${fieldPrefix}.distribution`,
          message: 'Distribution responses must have both distributionA and distributionB',
          code: 'MISSING_DISTRIBUTION',
        })
      }
    }

    return errors
  }

  private validateSAISDistributions(responses: QuestionResponse[]): ValidationError[] {
    const errors: ValidationError[] = []
    const distributionTotals: { [questionId: string]: number } = {}

    for (const response of responses) {
      if (response.responseType === 'distribution') {
        const total = (response.distributionA || 0) + (response.distributionB || 0)
        distributionTotals[response.questionId] = total

        if (total !== 5) {
          errors.push({
            field: `question-${response.questionId}`,
            message: `SAIS distribution must total exactly 5, got ${total}`,
            code: 'INVALID_SAIS_TOTAL',
          })
        }

        if (!this.isValidSAISCombination(response.distributionA || 0, response.distributionB || 0)) {
          errors.push({
            field: `question-${response.questionId}`,
            message: `Invalid SAIS distribution combination: ${response.distributionA}/${response.distributionB}`,
            code: 'INVALID_SAIS_COMBINATION',
          })
        }
      }
    }

    return errors
  }

  private isValidSAISCombination(distributionA: number, distributionB: number): boolean {
    const validCombinations = [
      [5, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5]
    ]
    
    return validCombinations.some(
      ([a, b]) => distributionA === a && distributionB === b
    )
  }

  private isValidDimension(dimension: string): boolean {
    const validDimensions = ['E/I', 'S/N', 'T/F', 'J/P']
    return validDimensions.includes(dimension)
  }

  public validateSAISResponses(responses: QuestionResponse[]): SAISValidationResult {
    const baseValidation = this.validateResponses(responses, 'sais')
    const distributionTotals: { [questionId: string]: number } = {}

    for (const response of responses) {
      if (response.responseType === 'distribution') {
        distributionTotals[response.questionId] = 
          (response.distributionA || 0) + (response.distributionB || 0)
      }
    }

    return {
      ...baseValidation,
      distributionTotals,
    }
  }

  public validateMethodology(methodology: string): boolean {
    const validMethodologies = ['scenarios', 'traits', 'sais']
    return validMethodologies.includes(methodology)
  }

  public sanitizeResponses(responses: QuestionResponse[]): QuestionResponse[] {
    return responses.map(response => ({
      ...response,
      questionId: response.questionId?.toString() || '',
      sessionId: response.sessionId?.toString() || '',
      responseId: response.responseId?.toString() || '',
      distributionA: typeof response.distributionA === 'number' 
        ? Math.max(0, Math.min(5, response.distributionA)) 
        : undefined,
      distributionB: typeof response.distributionB === 'number' 
        ? Math.max(0, Math.min(5, response.distributionB)) 
        : undefined,
    }))
  }
}