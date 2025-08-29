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
          // For SAIS, we need to consider the tendency mapping
          // The distribution points represent strength of preference
          const pointsA = response.distributionA || 0
          const pointsB = response.distributionB || 0
          
          rawScoreA += pointsA
          rawScoreB += pointsB
        } else if (response.responseType === 'binary') {
          if (response.selectedOption === 'A') {
            rawScoreA += 1
          } else if (response.selectedOption === 'B') {
            rawScoreB += 1
          }
        }
      }

      const preference = this.determinePreference(dimension, rawScoreA, rawScoreB, dimensionResponses)
      const confidence = this.calculateConfidence(rawScoreA, rawScoreB, methodology)

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
    scoreB: number,
    dimensionResponses?: QuestionResponse[]
  ): string {
    // For SAIS, we need to check the tendency mapping from the responses
    if (dimensionResponses && dimensionResponses.length > 0) {
      const saisResponse = dimensionResponses.find(r => r.responseType === 'distribution')
      if (saisResponse && saisResponse.tendency) {
        // If we have SAIS responses, use the tendency directly from the response
        // which was determined based on the question's optionATendency/optionBTendency
        const tendencyCounts: Record<string, number> = {}
        
        for (const response of dimensionResponses) {
          if (response.tendency) {
            if (!tendencyCounts[response.tendency]) {
              tendencyCounts[response.tendency] = 0
            }
            // Weight by distribution points for SAIS
            if (response.responseType === 'distribution') {
              const weight = response.selectedOption === 'A' 
                ? response.distributionA || 0 
                : response.distributionB || 0
              tendencyCounts[response.tendency] += weight
            } else {
              tendencyCounts[response.tendency] += 1
            }
          }
        }
        
        // Return the tendency with the highest count
        const preferences = Object.entries(tendencyCounts)
        if (preferences.length > 0) {
          preferences.sort((a, b) => b[1] - a[1])
          return preferences[0][0]
        }
      }
    }
    
    // Fallback to standard mapping for non-SAIS or if tendencies not found
    const dimensionMap: Record<MBTIDimension, { A: string; B: string }> = {
      'E/I': { A: 'E', B: 'I' },
      'S/N': { A: 'S', B: 'N' },
      'T/F': { A: 'T', B: 'F' },
      'J/P': { A: 'J', B: 'P' },
    }

    return scoreA > scoreB ? dimensionMap[dimension].A : dimensionMap[dimension].B
  }

  private calculateConfidence(scoreA: number, scoreB: number, methodology?: MethodologyType): number {
    const total = scoreA + scoreB
    if (total === 0) return 50

    const higher = Math.max(scoreA, scoreB)
    let confidence = (higher / total) * 100
    
    // For SAIS methodology, apply a different confidence scale
    // since the 5-point distribution allows for more nuanced responses
    if (methodology === 'sais') {
      // SAIS confidence scale:
      // 5-0 distribution = 100% confidence
      // 4-1 distribution = 80% confidence  
      // 3-2 distribution = 60% confidence
      const difference = Math.abs(scoreA - scoreB)
      const maxPossibleDifference = total
      
      if (maxPossibleDifference > 0) {
        // Scale confidence based on the strength of the preference
        confidence = 50 + (difference / maxPossibleDifference) * 50
      }
    }
    
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

  public validateSAISDistribution(pointA: number, pointB: number): boolean {
    return (
      pointA >= 0 && pointA <= 5 &&
      pointB >= 0 && pointB <= 5 &&
      pointA + pointB === 5 &&
      Number.isInteger(pointA) &&
      Number.isInteger(pointB)
    )
  }

  // Test method for SAIS scoring verification
  public testSAISScoring(responses: QuestionResponse[]): void {
    console.log('SAIS Scoring Test:')
    console.log('==================')
    
    const result = this.calculateMBTI({
      sessionId: 'test-session',
      responses,
      methodology: 'sais',
      isInterim: false,
    })
    
    console.log('MBTI Type:', result.mbtiType)
    console.log('Overall Confidence:', result.overallConfidence + '%')
    console.log('\nDimension Breakdown:')
    
    result.dimensionScores.forEach(score => {
      console.log(`${score.dimension}: ${score.preference} (${score.confidence}% confidence)`)
      console.log(`  Raw scores: A=${score.rawScoreA}, B=${score.rawScoreB}`)
    })
  }
}