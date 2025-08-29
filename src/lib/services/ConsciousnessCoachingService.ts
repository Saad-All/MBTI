import { MBTIType, ConsciousnessProfile, Language } from '@/lib/types'
import { ConsciousnessInsightsService } from './ConsciousnessInsightsService'

export interface CoachingOption {
  id: string
  title: string
  description: string
  focus: string[]
  sessionType: 'individual' | 'group' | 'online'
  duration: string
  arabicTitle?: string
  arabicDescription?: string
}

export interface ConsciousnessCoachingRecommendation {
  primaryFocus: string
  coachingOptions: CoachingOption[]
  developmentPath: string[]
  practiceRecommendations: string[]
}

export class ConsciousnessCoachingService {
  private static instance: ConsciousnessCoachingService

  private constructor() {}

  public static getInstance(): ConsciousnessCoachingService {
    if (!ConsciousnessCoachingService.instance) {
      ConsciousnessCoachingService.instance = new ConsciousnessCoachingService()
    }
    return ConsciousnessCoachingService.instance
  }

  /**
   * Get consciousness-focused coaching recommendations for SAIS users
   */
  public getConsciousnessCoachingRecommendations(
    mbtiType: MBTIType,
    consciousnessProfile: ConsciousnessProfile,
    language: Language = 'ar'
  ): ConsciousnessCoachingRecommendation {
    const insightsService = ConsciousnessInsightsService.getInstance()
    const insights = insightsService.getConsciousnessInsights(mbtiType, language)
    
    if (!insights) {
      console.warn(`No consciousness insights available for ${mbtiType}, using fallback recommendations`)
      
      // Fallback recommendations when insights are not available
      return {
        primaryFocus: `التركيز على تطوير الوعي الذاتي لنمط ${mbtiType}`,
        coachingOptions: this.getFallbackCoachingOptions(),
        developmentPath: this.getFallbackDevelopmentPath(),
        practiceRecommendations: this.getFallbackPracticeRecommendations(),
      }
    }

    // Determine primary coaching focus based on consciousness profile
    const primaryFocus = this.determinePrimaryCoachingFocus(consciousnessProfile)
    
    // Get coaching options based on MBTI type and consciousness patterns
    const coachingOptions = this.getTypeSpecificCoachingOptions(mbtiType, consciousnessProfile)
    
    // Create development path from consciousness insights
    const developmentPath = insights.innerGrowthRecommendations
    
    // Get practice recommendations
    const practiceRecommendations = insights.consciousnessExpansion

    return {
      primaryFocus,
      coachingOptions,
      developmentPath,
      practiceRecommendations,
    }
  }

  /**
   * Determine primary coaching focus based on consciousness percentages
   */
  private determinePrimaryCoachingFocus(profile: ConsciousnessProfile): string {
    const dimensions = [
      { name: 'مصدر الطاقة', percentage: profile.energySourcePattern.percentage },
      { name: 'أسلوب الإدراك', percentage: profile.awarenessStyle.percentage },
      { name: 'مركز القرار', percentage: profile.decisionMakingCenter.percentage },
      { name: 'تنظيم الحياة', percentage: profile.lifeStructurePreference.percentage },
    ]

    // Find the strongest preference for primary focus
    const strongest = dimensions.reduce((prev, current) => 
      current.percentage > prev.percentage ? current : prev
    )

    // Find the weakest for development opportunity
    const weakest = dimensions.reduce((prev, current) => 
      current.percentage < prev.percentage ? current : prev
    )

    return `التركيز الأساسي على تطوير ${weakest.name} (${weakest.percentage}%) بالاستفادة من قوة ${strongest.name} (${strongest.percentage}%)`
  }

  /**
   * Get type-specific coaching options with consciousness focus
   */
  private getTypeSpecificCoachingOptions(
    mbtiType: MBTIType, 
    profile: ConsciousnessProfile
  ): CoachingOption[] {
    const baseOptions: CoachingOption[] = [
      {
        id: 'consciousness-development',
        title: 'Consciousness Development Coaching',
        arabicTitle: 'التدريب على تطوير الوعي',
        description: 'Deep psychological coaching focused on expanding consciousness and inner awareness',
        arabicDescription: 'تدريب نفسي عميق يركز على توسيع الوعي والإدراك الداخلي',
        focus: ['تطوير الوعي', 'النمو النفسي', 'التأمل العملي', 'فهم الذات'],
        sessionType: 'individual',
        duration: '60-90 دقيقة',
      },
      {
        id: 'psychological-integration',
        title: 'Psychological Integration Coaching',  
        arabicTitle: 'التدريب على التكامل النفسي',
        description: 'Integration of personality patterns with spiritual and psychological growth',
        arabicDescription: 'دمج أنماط الشخصية مع النمو الروحي والنفسي',
        focus: ['التكامل النفسي', 'التطوير الروحي', 'التوازن الداخلي', 'الأصالة الشخصية'],
        sessionType: 'individual',
        duration: '90 دقيقة',
      },
      {
        id: 'inner-work-guidance',
        title: 'Inner Work Guidance',
        arabicTitle: 'إرشاد العمل الداخلي',
        description: 'Guidance for deep inner work and authentic self-expression practices',
        arabicDescription: 'توجيه للعمل الداخلي العميق وممارسات التعبير الأصيل عن الذات',
        focus: ['العمل الداخلي', 'التعبير الأصيل', 'الشفاء النفسي', 'التحول الشخصي'],
        sessionType: 'individual',
        duration: '75 دقيقة',
      },
    ]

    // Add type-specific options based on MBTI preferences
    if (mbtiType.includes('N')) {
      baseOptions.push({
        id: 'intuitive-development',
        title: 'Intuitive Development Coaching',
        arabicTitle: 'تطوير البصيرة الحدسية',
        description: 'Developing intuitive abilities and visionary thinking',
        arabicDescription: 'تطوير القدرات الحدسية والتفكير الرؤيوي',
        focus: ['تطوير الحدس', 'الرؤية المستقبلية', 'الإبداع', 'البصيرة الروحية'],
        sessionType: 'individual',
        duration: '60 دقيقة',
      })
    }

    if (mbtiType.includes('F')) {
      baseOptions.push({
        id: 'heart-centered-coaching',
        title: 'Heart-Centered Coaching',
        arabicTitle: 'التدريب المركز على القلب',
        description: 'Developing emotional intelligence and value-based decision making',
        arabicDescription: 'تطوير الذكاء العاطفي واتخاذ القرارات القيمية',
        focus: ['الذكاء العاطفي', 'بوصلة القيم', 'التعاطف', 'القيادة القلبية'],
        sessionType: 'individual',
        duration: '75 دقيقة',
      })
    }

    return baseOptions
  }

  /**
   * Generate consciousness-focused chatbot prompts
   */
  public getConsciousnessChatPrompts(mbtiType: MBTIType): string[] {
    const basePrompts = [
      'كيف يمكنني تعميق اتصالي بذاتي الحقيقية؟',
      'ما هي ممارسات التأمل المناسبة لنمط شخصيتي؟',
      'كيف أطور وعيي في العلاقات الشخصية؟',
      'ما هي علامات النمو الروحي في حياتي؟',
    ]

    // Add type-specific prompts
    if (mbtiType.includes('I')) {
      basePrompts.push('كيف أوازن بين عالمي الداخلي والتواصل مع الآخرين؟')
    } else {
      basePrompts.push('كيف أجد الهدوء والسكينة وسط النشاط الاجتماعي؟')
    }

    if (mbtiType.includes('N')) {
      basePrompts.push('كيف أترجم رؤيتي الروحية إلى واقع ملموس؟')
    } else {
      basePrompts.push('كيف أتصل بالحكمة الروحية من خلال التجربة العملية؟')
    }

    if (mbtiType.includes('F')) {
      basePrompts.push('كيف أستخدم قلبي كدليل للقرارات الصعبة؟')
    } else {
      basePrompts.push('كيف أدمج العقل والقلب في اتخاذ القرارات الحكيمة؟')
    }

    return basePrompts
  }

  /**
   * Get psychological development questions for post-assessment exploration
   */
  public getPsychologicalDevelopmentQuestions(
    mbtiType: MBTIType,
    consciousnessProfile: ConsciousnessProfile
  ): string[] {
    const questions = [
      'ما هي أكبر التحديات في رحلة نموي النفسي؟',
      'كيف يمكنني استخدام نقاط قوتي لخدمة نموي الروحي؟',
      'ما هي المخاوف التي تحد من تعبيري الأصيل؟',
      'كيف يمكنني تطوير علاقة أعمق مع حدسي الداخلي؟',
    ]

    // Add dimension-specific questions based on low percentages (development opportunities)
    const dimensions = [
      { key: 'energy', percentage: consciousnessProfile.energySourcePattern.percentage },
      { key: 'awareness', percentage: consciousnessProfile.awarenessStyle.percentage },
      { key: 'decision', percentage: consciousnessProfile.decisionMakingCenter.percentage },
      { key: 'structure', percentage: consciousnessProfile.lifeStructurePreference.percentage },
    ]

    // Find dimensions with lower percentages for targeted development
    const developmentOpportunities = dimensions.filter(d => d.percentage < 70)
    
    developmentOpportunities.forEach(opportunity => {
      switch (opportunity.key) {
        case 'energy':
          questions.push('كيف يمكنني تطوير مصادر طاقة جديدة في حياتي؟')
          break
        case 'awareness':
          questions.push('ما هي طرق توسيع إدراكي ووعيي بالعالم حولي؟')
          break
        case 'decision':
          questions.push('كيف أطور حكمة أكبر في اتخاذ القرارات المهمة؟')
          break
        case 'structure':
          questions.push('كيف أجد التوازن المثالي بين التنظيم والمرونة؟')
          break
      }
    })

    return questions
  }

  /**
   * Fallback coaching options when consciousness insights are not available
   */
  private getFallbackCoachingOptions(): CoachingOption[] {
    return [
      {
        id: 'general-consciousness-coaching',
        title: 'General Consciousness Coaching',
        arabicTitle: 'التدريب العام على تطوير الوعي',
        description: 'General psychological coaching focused on personal development',
        arabicDescription: 'تدريب نفسي عام يركز على التطوير الشخصي',
        focus: ['تطوير الذات', 'النمو الشخصي', 'فهم الشخصية', 'التواصل'],
        sessionType: 'individual',
        duration: '60 دقيقة',
      }
    ]
  }

  /**
   * Fallback development path when insights are not available
   */
  private getFallbackDevelopmentPath(): string[] {
    return [
      'فهم نقاط القوة في شخصيتك',
      'تطوير مهارات التواصل والعلاقات',
      'تعلم إدارة التحديات والضغوط',
      'ممارسة التأمل والنمو الشخصي'
    ]
  }

  /**
   * Fallback practice recommendations when insights are not available
   */
  private getFallbackPracticeRecommendations(): string[] {
    return [
      'ممارسة التأمل اليومي لفهم الذات',
      'تطوير مهارات الاستماع والتعاطف',
      'استكشاف أنشطة تعزز النمو الشخصي',
      'تعلم تقنيات إدارة التوتر والضغط'
    ]
  }
}
