import {
  QuestionResponse,
  MBTIType,
  MBTIDimension,
  ScoringInput,
  ScoringResult,
  DimensionScore,
  MethodologyType,
  ConsciousnessProfile,
  ConsciousnessDimension,
} from '@/lib/types'

export class MBTICalculatorService {
  private static instance: MBTICalculatorService

  // SAIS Consciousness Domain Mapping (Arabic)
  private readonly consciousnessDomains = {
    'E/I': {
      name: 'مصدر حيويتك وتفاعلك',
      E: { name: 'التفاعل الخارجي', description: 'استمداد الحيوية من التفاعل مع الطيف الواسع من النشاطات والأشخاص' },
      I: { name: 'الانغماس الداخلي', description: 'الانغماس في عالمك الداخلي الغني والاتصال بمركز جذري عميق وهادئ' }
    },
    'S/N': {
      name: 'طريقة استقبالك للمعلومات',
      S: { name: 'الواقع المادي', description: 'التفاعل مع الواقع المادي الملموس واستخدام الحواس الخمس' },
      N: { name: 'البصيرة الحدسية', description: 'الغوص في بحر الاحتمالات والمعاني الخفية باستخدام العين الثالثة' }
    },
    'T/F': {
      name: 'مركز اتخاذ القرار',
      T: { name: 'التحليل المنطقي', description: 'تحليل منطقي وموضوعي للحقائق وبناء هيكل عقلي متماسك' },
      F: { name: 'بوصلة القيم الداخلية', description: 'الاتصال بمركز القلب والانسجام مع مشاعر الآخرين وقيمك الداخلية' }
    },
    'J/P': {
      name: 'تنظيم عالمك الخارجي',
      J: { name: 'الهيكل المنظم', description: 'وضع هيكل زمني ونظام واضح للسيطرة والتنبؤ بالأحداث' },
      P: { name: 'المرونة العفوية', description: 'ترك مساحة للمرونة والعفوية وإبقاء الخيارات مفتوحة' }
    }
  }

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

    // Generate consciousness profile for SAIS methodology
    let consciousnessProfile: ConsciousnessProfile | undefined = undefined
    if (methodology === 'sais') {
      consciousnessProfile = this.generateConsciousnessProfile(dimensionScores)
    }

    return {
      sessionId,
      mbtiType,
      dimensionScores,
      overallConfidence,
      methodology,
      isInterim,
      totalResponses: responses.length,
      consciousnessProfile,
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

      // SAIS consciousness enhancements
      let consciousnessPercentage: number | undefined = undefined
      let consciousnessDomain: string | undefined = undefined
      let totalPossiblePoints: number | undefined = undefined

      if (methodology === 'sais') {
        totalPossiblePoints = 15 // 3 questions × 5 points per question
        
        // For SAIS, rawScoreA and rawScoreB already contain the actual distribution points
        // The preference was determined based on which score is higher
        const winningScore = preference === dimension.split('/')[0] ? rawScoreA : rawScoreB
        
        consciousnessPercentage = Math.round((winningScore / totalPossiblePoints) * 100)
        consciousnessDomain = this.consciousnessDomains[dimension].name
      }

      scores.push({
        dimension,
        rawScoreA,
        rawScoreB,
        preference,
        confidence,
        consciousnessPercentage,
        consciousnessDomain,
        totalPossiblePoints,
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

  // SAIS Consciousness Profile Generation
  private generateConsciousnessProfile(dimensionScores: DimensionScore[]): ConsciousnessProfile {
    const getConsciousnessDimension = (dimension: MBTIDimension): ConsciousnessDimension => {
      const score = dimensionScores.find(s => s.dimension === dimension)!
      const domainData = this.consciousnessDomains[dimension]
      
      // Safely access preference data with type checking
      const preferenceKey = score.preference as 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P'
      const preferenceData = (domainData as any)[preferenceKey] as { name: string; description: string }
      
      if (!preferenceData) {
        console.warn(`No preference data found for ${dimension}:${score.preference}`)
        return {
          dimension,
          preference: score.preference,
          percentage: score.consciousnessPercentage || 0,
          arabicDomainName: score.preference,
          consciousnessDescription: 'وصف غير متاح',
        }
      }

      return {
        dimension,
        preference: score.preference,
        percentage: score.consciousnessPercentage || 0,
        arabicDomainName: preferenceData.name,
        consciousnessDescription: preferenceData.description,
      }
    }

    return {
      energySourcePattern: getConsciousnessDimension('E/I'),
      awarenessStyle: getConsciousnessDimension('S/N'), 
      decisionMakingCenter: getConsciousnessDimension('T/F'),
      lifeStructurePreference: getConsciousnessDimension('J/P'),
    }
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
      if (score.consciousnessPercentage) {
        console.log(`  Consciousness: ${score.consciousnessPercentage}% - ${score.consciousnessDomain}`)
      }
    })

    // Display consciousness profile
    if (result.consciousnessProfile) {
      console.log('\nConsciousness Profile:')
      console.log('Energy Source:', result.consciousnessProfile.energySourcePattern.arabicDomainName, 
                  `(${result.consciousnessProfile.energySourcePattern.percentage}%)`)
      console.log('Awareness Style:', result.consciousnessProfile.awarenessStyle.arabicDomainName,
                  `(${result.consciousnessProfile.awarenessStyle.percentage}%)`)
      console.log('Decision Center:', result.consciousnessProfile.decisionMakingCenter.arabicDomainName,
                  `(${result.consciousnessProfile.decisionMakingCenter.percentage}%)`)
      console.log('Life Structure:', result.consciousnessProfile.lifeStructurePreference.arabicDomainName,
                  `(${result.consciousnessProfile.lifeStructurePreference.percentage}%)`)
    }
  }
}