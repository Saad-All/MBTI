import { QuestionResponse, MBTIDimension } from '@/lib/types'
import saisArQuestions from '@/data/questions/sais-ar.json'
import saisEnQuestions from '@/data/questions/sais-en.json'

export interface SAISQuestion {
  id: string
  dimension: MBTIDimension
  statement: string
  optionA: string
  optionB: string
  optionATendency: string
  optionBTendency: string
}

export interface SAISQuestionSet {
  intro: {
    title: string
    description: string
  }
  instructions: {
    title: string
    examples: string[]
  }
  questions: SAISQuestion[]
}

export class SAISQuestionService {
  private static instance: SAISQuestionService

  private constructor() {}

  public static getInstance(): SAISQuestionService {
    if (!SAISQuestionService.instance) {
      SAISQuestionService.instance = new SAISQuestionService()
    }
    return SAISQuestionService.instance
  }

  /**
   * Get SAIS questions for the specified language
   */
  public getQuestions(language: 'ar' | 'en'): SAISQuestionSet {
    const questionData = language === 'ar' ? saisArQuestions : saisEnQuestions
    
    return {
      intro: questionData.assessment.sais.intro,
      instructions: questionData.assessment.sais.instructions,
      questions: questionData.assessment.sais.questions.map(q => ({
        ...q,
        dimension: q.dimension as MBTIDimension
      }))
    }
  }

  /**
   * Get dynamically selected SAIS questions based on interim results
   * This ensures we focus on dimensions that need more clarity
   */
  public getDynamicQuestions(
    language: 'ar' | 'en',
    interimResults: QuestionResponse[],
    targetQuestionCount: number = 12
  ): SAISQuestion[] {
    const allQuestions = this.getQuestions(language).questions
    
    // Calculate which dimensions need more questions based on confidence
    const dimensionConfidence = this.calculateDimensionConfidence(interimResults)
    
    // Sort dimensions by confidence (lowest first - need more questions)
    const dimensionPriority = Object.entries(dimensionConfidence)
      .sort((a, b) => a[1] - b[1])
      .map(([dimension]) => dimension as MBTIDimension)
    
    // Select questions prioritizing dimensions with lower confidence
    const selectedQuestions: SAISQuestion[] = []
    const questionsPerDimension: Record<MBTIDimension, number> = {
      'E/I': 0,
      'S/N': 0,
      'T/F': 0,
      'J/P': 0
    }
    
    // First pass: ensure at least 2 questions per dimension
    for (const dimension of dimensionPriority) {
      const dimensionQuestions = allQuestions.filter(
        q => q.dimension === dimension && !selectedQuestions.includes(q)
      )
      
      const toAdd = Math.min(2, dimensionQuestions.length)
      selectedQuestions.push(...dimensionQuestions.slice(0, toAdd))
      questionsPerDimension[dimension] += toAdd
    }
    
    // Second pass: add more questions to low-confidence dimensions
    while (selectedQuestions.length < targetQuestionCount) {
      for (const dimension of dimensionPriority) {
        if (selectedQuestions.length >= targetQuestionCount) break
        
        const dimensionQuestions = allQuestions.filter(
          q => q.dimension === dimension && !selectedQuestions.includes(q)
        )
        
        if (dimensionQuestions.length > 0) {
          selectedQuestions.push(dimensionQuestions[0])
          questionsPerDimension[dimension]++
        }
      }
      
      // Break if we can't add more questions
      if (selectedQuestions.length === allQuestions.length) break
    }
    
    return selectedQuestions.slice(0, targetQuestionCount)
  }

  /**
   * Calculate confidence for each dimension from interim results
   */
  private calculateDimensionConfidence(responses: QuestionResponse[]): Record<MBTIDimension, number> {
    const confidence: Record<MBTIDimension, number> = {
      'E/I': 100,
      'S/N': 100,
      'T/F': 100,
      'J/P': 100
    }
    
    // Group responses by dimension
    const dimensionResponses: Record<MBTIDimension, QuestionResponse[]> = {
      'E/I': [],
      'S/N': [],
      'T/F': [],
      'J/P': []
    }
    
    for (const response of responses) {
      if (response.mbtiDimension) {
        dimensionResponses[response.mbtiDimension].push(response)
      }
    }
    
    // Calculate confidence for each dimension
    for (const [dimension, responses] of Object.entries(dimensionResponses)) {
      if (responses.length === 0) {
        confidence[dimension as MBTIDimension] = 0
        continue
      }
      
      // Count tendencies
      const tendencyCounts: Record<string, number> = {}
      for (const response of responses) {
        if (response.tendency) {
          tendencyCounts[response.tendency] = (tendencyCounts[response.tendency] || 0) + 1
        }
      }
      
      // Calculate confidence based on consistency
      const counts = Object.values(tendencyCounts)
      if (counts.length > 0) {
        const total = counts.reduce((sum, count) => sum + count, 0)
        const maxCount = Math.max(...counts)
        confidence[dimension as MBTIDimension] = Math.round((maxCount / total) * 100)
      }
    }
    
    return confidence
  }

  /**
   * Validate that a set of SAIS questions covers all dimensions appropriately
   */
  public validateQuestionCoverage(questions: SAISQuestion[]): {
    isValid: boolean
    coverage: Record<MBTIDimension, number>
    missing: MBTIDimension[]
  } {
    const coverage: Record<MBTIDimension, number> = {
      'E/I': 0,
      'S/N': 0,
      'T/F': 0,
      'J/P': 0
    }
    
    for (const question of questions) {
      coverage[question.dimension]++
    }
    
    const missing: MBTIDimension[] = []
    for (const [dimension, count] of Object.entries(coverage)) {
      if (count === 0) {
        missing.push(dimension as MBTIDimension)
      }
    }
    
    return {
      isValid: missing.length === 0,
      coverage,
      missing
    }
  }
}