import {
  QuestionResponse,
  MBTIType,
  MBTIDimension,
  ScoringInput,
  ScoringResult,
  DimensionScore,
  MethodologyType,
} from '@/lib/types'

export class MBTICalculatorService {
  private static instance: MBTICalculatorService

  private constructor() {}

  public static getInstance(): MBTICalculatorService {
    if (!MBTICalculatorService.instance) {
      MBTICalculatorService.instance = new MBTICalculatorService()
    }
    return MBTICalculatorService.instance
  }

  public calculateMBTI(input: ScoringInput): ScoringResult {
    const { sessionId, responses, methodology, isInterim = false } = input

    const dimensionScores = this.calculateDimensionScores(responses, methodology)
    const mbtiType = this.determineMBTIType(dimensionScores)
    const overallConfidence = this.calculateOverallConfidence(dimensionScores)

    return {
      sessionId,
      mbtiType,
      dimensionScores,
      overallConfidence,
      methodology,
      isInterim,
      totalResponses: responses.length,
    }
  }

  private calculateDimensionScores(
    responses: QuestionResponse[],
    methodology: MethodologyType
  ): DimensionScore[] {
    const dimensions: MBTIDimension[] = ['E/I', 'S/N', 'T/F', 'J/P']
    const scores: DimensionScore[] = []

    for (const dimension of dimensions) {
      const dimensionResponses = responses.filter(r => r.mbtiDimension === dimension)
      
      let rawScoreA = 0
      let rawScoreB = 0

      for (const response of dimensionResponses) {
        if (methodology === 'sais' && response.responseType === 'distribution') {
          rawScoreA += response.distributionA || 0
          rawScoreB += response.distributionB || 0
        } else if (response.responseType === 'binary') {
          if (response.selectedOption === 'A') {
            rawScoreA += 1
          } else if (response.selectedOption === 'B') {
            rawScoreB += 1
          }
        }
      }

      const preference = this.determinePreference(dimension, rawScoreA, rawScoreB)
      const confidence = this.calculateConfidence(rawScoreA, rawScoreB)

      scores.push({
        dimension,
        rawScoreA,
        rawScoreB,
        preference,
        confidence,
      })
    }

    return scores
  }

  private determinePreference(
    dimension: MBTIDimension,
    scoreA: number,
    scoreB: number
  ): string {
    const dimensionMap: Record<MBTIDimension, { A: string; B: string }> = {
      'E/I': { A: 'E', B: 'I' },
      'S/N': { A: 'S', B: 'N' },
      'T/F': { A: 'T', B: 'F' },
      'J/P': { A: 'J', B: 'P' },
    }

    return scoreA > scoreB ? dimensionMap[dimension].A : dimensionMap[dimension].B
  }

  private calculateConfidence(scoreA: number, scoreB: number): number {
    const total = scoreA + scoreB
    if (total === 0) return 50

    const higher = Math.max(scoreA, scoreB)
    const confidence = (higher / total) * 100
    
    return Math.round(confidence)
  }

  private determineMBTIType(dimensionScores: DimensionScore[]): MBTIType {
    const typeString = dimensionScores
      .map(score => score.preference)
      .join('')
    
    return typeString as MBTIType
  }

  private calculateOverallConfidence(dimensionScores: DimensionScore[]): number {
    const totalConfidence = dimensionScores.reduce(
      (sum, score) => sum + score.confidence,
      0
    )
    
    return Math.round(totalConfidence / dimensionScores.length)
  }

  public calculateInterimResults(responses: QuestionResponse[]): ScoringResult {
    const dimensionOrder: MBTIDimension[] = ['E/I', 'S/N', 'T/F', 'J/P']
    const interimResponses: QuestionResponse[] = []

    for (let i = 0; i < Math.min(4, responses.length); i++) {
      const response = responses[i]
      if (!response.mbtiDimension && i < dimensionOrder.length) {
        response.mbtiDimension = dimensionOrder[i]
      }
      interimResponses.push(response)
    }

    return this.calculateMBTI({
      sessionId: responses[0]?.sessionId || '',
      responses: interimResponses,
      methodology: 'scenarios',
      isInterim: true,
    })
  }

  public isSAISScoreValid(distributionA: number, distributionB: number): boolean {
    const validCombinations = [
      [5, 0], [4, 1], [3, 2], [2, 3], [1, 4], [0, 5]
    ]
    
    return validCombinations.some(
      ([a, b]) => distributionA === a && distributionB === b
    )
  }
}