import { MBTIType, ConsciousnessProfile, Language } from '@/lib/types'

// Import with try-catch and fallback
let consciousnessInsights: any = {}
try {
  consciousnessInsights = require('@/data/results/sais-consciousness-insights.json')
} catch (error) {
  console.error('Failed to load consciousness insights JSON:', error)
  // Fallback - we'll generate basic insights dynamically
}

export interface ConsciousnessInsight {
  arabicTitle: string
  arabicSubtitle: string
  consciousnessSignature: string
  energySourcePattern: {
    domain: string
    preference: string
    description: string
    consciousnessExample: string
  }
  awarenessStyle: {
    domain: string
    preference: string
    description: string
    consciousnessExample: string
  }
  decisionMakingCenter: {
    domain: string
    preference: string
    description: string
    consciousnessExample: string
  }
  lifeStructurePreference: {
    domain: string
    preference: string
    description: string
    consciousnessExample: string
  }
  innerGrowthRecommendations: string[]
  consciousnessExpansion: string[]
}

export class ConsciousnessInsightsService {
  private static instance: ConsciousnessInsightsService

  private constructor() {}

  public static getInstance(): ConsciousnessInsightsService {
    if (!ConsciousnessInsightsService.instance) {
      ConsciousnessInsightsService.instance = new ConsciousnessInsightsService()
    }
    return ConsciousnessInsightsService.instance
  }

  /**
   * Get consciousness-enhanced insights for a specific MBTI type
   * @param mbtiType The 4-letter MBTI type
   * @param language Currently supports Arabic ('ar')
   * @returns Consciousness insights tailored for SAIS methodology users
   */
  public getConsciousnessInsights(
    mbtiType: MBTIType, 
    language: Language = 'ar'
  ): ConsciousnessInsight | null {
    // For now, we only support Arabic consciousness insights
    if (language !== 'ar') {
      console.warn(`Consciousness insights not yet available for language: ${language}`)
      return null
    }

    try {
      // Check if consciousnessInsights is properly loaded
      if (!consciousnessInsights || typeof consciousnessInsights !== 'object') {
        console.error('Consciousness insights data not properly loaded, using fallback')
        return this.getFallbackInsights(mbtiType)
      }

      const insights = consciousnessInsights[mbtiType] as ConsciousnessInsight
      if (!insights) {
        console.error(`No consciousness insights found for MBTI type: ${mbtiType}`)
        console.log('Available types:', Object.keys(consciousnessInsights))
        return this.getFallbackInsights(mbtiType)
      }

      // Validate that the insights object has required fields
      if (!insights.arabicTitle || !insights.energySourcePattern || !insights.innerGrowthRecommendations) {
        console.error(`Incomplete consciousness insights for MBTI type: ${mbtiType}`)
        return this.getFallbackInsights(mbtiType)
      }

      return insights
    } catch (error) {
      console.error(`Error retrieving consciousness insights for ${mbtiType}:`, error)
      return this.getFallbackInsights(mbtiType)
    }
  }

  /**
   * Get consciousness domain descriptions organized by the four domains
   * @param consciousnessProfile The consciousness profile from SAIS calculation
   * @returns Organized consciousness insights by domain
   */
  public getConsciousnessDomainInsights(consciousnessProfile: ConsciousnessProfile): {
    energySource: string
    awarenessStyle: string  
    decisionMaking: string
    lifeStructure: string
  } {
    const mbtiType = this.buildMBTITypeFromProfile(consciousnessProfile)
    const insights = this.getConsciousnessInsights(mbtiType)
    
    if (!insights) {
      throw new Error('Unable to generate consciousness domain insights')
    }

    return {
      energySource: insights.energySourcePattern.description,
      awarenessStyle: insights.awarenessStyle.description,
      decisionMaking: insights.decisionMakingCenter.description,
      lifeStructure: insights.lifeStructurePreference.description,
    }
  }

  /**
   * Get inner growth recommendations for consciousness development
   * @param mbtiType The MBTI type
   * @returns Array of consciousness development recommendations
   */
  public getInnerGrowthRecommendations(mbtiType: MBTIType): string[] {
    const insights = this.getConsciousnessInsights(mbtiType)
    return insights?.innerGrowthRecommendations || []
  }

  /**
   * Get consciousness expansion practices
   * @param mbtiType The MBTI type  
   * @returns Array of consciousness expansion practices
   */
  public getConsciousnessExpansionPractices(mbtiType: MBTIType): string[] {
    const insights = this.getConsciousnessInsights(mbtiType)
    return insights?.consciousnessExpansion || []
  }

  /**
   * Build MBTI type string from consciousness profile
   * @param profile Consciousness profile with dimensions
   * @returns 4-letter MBTI type string
   */
  private buildMBTITypeFromProfile(profile: ConsciousnessProfile): MBTIType {
    const typeString = [
      profile.energySourcePattern.preference,
      profile.awarenessStyle.preference,
      profile.decisionMakingCenter.preference, 
      profile.lifeStructurePreference.preference
    ].join('')
    
    return typeString as MBTIType
  }

  /**
   * Get consciousness signature for display
   * @param mbtiType The MBTI type
   * @returns Arabic consciousness signature
   */
  public getConsciousnessSignature(mbtiType: MBTIType): string {
    const insights = this.getConsciousnessInsights(mbtiType)
    return insights?.consciousnessSignature || ''
  }

  /**
   * Validate consciousness insights data integrity
   * @returns Validation result with any missing types
   */
  public validateInsightsData(): { isValid: boolean; missingTypes: string[] } {
    const allMBTITypes: MBTIType[] = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP', 
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]

    const missingTypes: string[] = []
    
    for (const type of allMBTITypes) {
      if (!consciousnessInsights[type]) {
        missingTypes.push(type)
      }
    }

    return {
      isValid: missingTypes.length === 0,
      missingTypes
    }
  }

  /**
   * Generate fallback insights when JSON data is not available
   */
  private getFallbackInsights(mbtiType: MBTIType): ConsciousnessInsight {
    // MBTI type titles in Arabic
    const arabicTitles: Record<MBTIType, string> = {
      'INTJ': 'القائد العام', 'INTP': 'الفيلسوف', 'ENTJ': 'المفكر', 'ENTP': 'المبتكر',
      'INFJ': 'الأديب', 'INFP': 'الباحث', 'ENFJ': 'المعلِّم', 'ENFP': 'البطل',
      'ISTJ': 'المفتش', 'ISFJ': 'الحامي', 'ESTJ': 'المشرف', 'ESFJ': 'الراعي',
      'ISTP': 'الحريف', 'ISFP': 'المرهف', 'ESTP': 'المسوِّق', 'ESFP': 'المرح'
    }

    // Generate basic consciousness insights based on MBTI dimensions
    const isIntrovert = mbtiType.includes('I')
    const isIntuitive = mbtiType.includes('N')
    const isFeeling = mbtiType.includes('F')
    const isJudging = mbtiType.includes('J')

    return {
      arabicTitle: arabicTitles[mbtiType] || mbtiType,
      arabicSubtitle: `${isIntrovert ? 'منغلق' : 'منفتح'}، ${isIntuitive ? 'حدسي' : 'حسي'}، ${isFeeling ? 'مشاعري' : 'منطقي'}، ${isJudging ? 'حازم' : 'تلقائي'}`,
      consciousnessSignature: `نمط الوعي ${mbtiType} - الشخصية المتوازنة`,
      energySourcePattern: {
        domain: 'مصدر حيويتك وتفاعلك',
        preference: isIntrovert ? 'الانغماس الداخلي' : 'التفاعل الخارجي',
        description: isIntrovert 
          ? 'تستمد طاقتك من التأمل والتفكير في عالمك الداخلي الغني'
          : 'تستمد طاقتك من التفاعل والتواصل مع الآخرين في البيئة الخارجية',
        consciousnessExample: isIntrovert
          ? 'تجد السكينة في لحظات الهدوء والتأمل الداخلي'
          : 'تشعر بالحيوية عندما تتفاعل مع الناس والأحداث من حولك'
      },
      awarenessStyle: {
        domain: 'طريقة استقبالك للمعلومات',
        preference: isIntuitive ? 'البصيرة الحدسية' : 'الواقع المادي',
        description: isIntuitive
          ? 'تستخدم حدسك لاستكشاف الاحتمالات والمعاني الخفية'
          : 'تعتمد على حواسك لفهم الواقع الملموس والحقائق المباشرة',
        consciousnessExample: isIntuitive
          ? 'ترى الأنماط والاحتمالات المستقبلية بوضوح'
          : 'تلاحظ التفاصيل والحقائق الملموسة بدقة'
      },
      decisionMakingCenter: {
        domain: 'مركز اتخاذ القرار',
        preference: isFeeling ? 'بوصلة القيم الداخلية' : 'التحليل المنطقي',
        description: isFeeling
          ? 'تتخذ قراراتك بناءً على قيمك ومشاعرك وتأثيرها على الآخرين'
          : 'تعتمد على التحليل المنطقي والحقائق الموضوعية في قراراتك',
        consciousnessExample: isFeeling
          ? 'تسأل: ما الذي يتماشى مع قيمي ويحقق الخير للجميع؟'
          : 'تحلل المعطيات وتختار الحل الأكثر منطقية وكفاءة'
      },
      lifeStructurePreference: {
        domain: 'تنظيم عالمك الخارجي',
        preference: isJudging ? 'الهيكل المنظم' : 'المرونة العفوية',
        description: isJudging
          ? 'تحتاج للنظام والوضوح في تنظيم حياتك وأعمالك'
          : 'تفضل المرونة والعفوية وإبقاء الخيارات مفتوحة',
        consciousnessExample: isJudging
          ? 'تضع خططاً واضحة وتلتزم بها لتحقيق أهدافك'
          : 'تحب أن تدع الحياة تتكشف طبيعياً وتتكيف مع الفرص'
      },
      innerGrowthRecommendations: [
        'تطوير فهم أعمق لنمط شخصيتك ونقاط قوتك',
        'ممارسة التأمل والتفكر لتعزيز الوعي الذاتي',
        'تطوير مهارات التواصل المتوافقة مع طبيعتك',
        'تعلم التوازن بين احتياجاتك والتفاعل مع الآخرين'
      ],
      consciousnessExpansion: [
        'استكشاف ممارسات التأمل المناسبة لنمط شخصيتك',
        'تطوير قدرتك على فهم وتقدير الأنماط المختلفة',
        'ممارسة الامتنان والوعي بالجوانب الإيجابية',
        'تعلم التعبير الأصيل عن ذاتك وقيمك'
      ]
    }
  }
}
