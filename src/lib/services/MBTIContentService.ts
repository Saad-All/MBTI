import { MBTIType, Language } from '@/lib/types'

export interface MBTIPersonalityContent {
  type: MBTIType
  arabicTitle: string
  arabicSubtitle: string
  coreDescription: string
  relationshipInsights: string
  workCharacteristics: string
  personalGrowth?: string
}

export class MBTIContentService {
  private static instance: MBTIContentService
  private personalityContent: Map<MBTIType, MBTIPersonalityContent> = new Map()
  private isInitialized = false

  private constructor() {}

  public static getInstance(): MBTIContentService {
    if (!MBTIContentService.instance) {
      MBTIContentService.instance = new MBTIContentService()
    }
    return MBTIContentService.instance
  }

  /**
   * Initialize the service by parsing MBTI content
   * This method is safe to call multiple times
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return
    }

    try {
      await this.parseMBTIContent()
      this.isInitialized = true
    } catch (error) {
      console.error('Failed to initialize MBTI content service:', error)
      // Use fallback content
      this.loadFallbackContent()
      this.isInitialized = true
    }
  }

  /**
   * Get comprehensive personality content for a specific MBTI type
   */
  public getPersonalityContent(mbtiType: MBTIType, language: Language = 'ar'): MBTIPersonalityContent | null {
    if (!this.isInitialized) {
      console.warn('MBTIContentService not initialized, loading fallback content')
      this.loadFallbackContent()
    }

    const content = this.personalityContent.get(mbtiType)
    if (!content) {
      console.error(`No content found for MBTI type: ${mbtiType}`)
      return null
    }

    return content
  }

  /**
   * Parse MBTI content from the JSON file
   */
  private async parseMBTIContent(): Promise<void> {
    try {
      // Import MBTI content from JSON
      const mbtiContent = await import('@/data/results/mbti-comprehensive-content.json')
      
      // Load all personality types from JSON
      for (const [type, content] of Object.entries(mbtiContent.default || mbtiContent)) {
        if (this.isValidMBTIType(type)) {
          this.personalityContent.set(type as MBTIType, content as MBTIPersonalityContent)
        }
      }
    } catch (error) {
      console.error('Failed to load MBTI content:', error)
      // Load fallback content if import fails
      this.loadFallbackContent()
    }
  }

  /**
   * Check if a string is a valid MBTI type
   */
  private isValidMBTIType(type: string): type is MBTIType {
    const validTypes: MBTIType[] = [
      'INTJ', 'INTP', 'ENTJ', 'ENTP',
      'INFJ', 'INFP', 'ENFJ', 'ENFP',
      'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
      'ISTP', 'ISFP', 'ESTP', 'ESFP'
    ]
    return validTypes.includes(type as MBTIType)
  }


  /**
   * Load fallback content for essential MBTI types
   */
  private loadFallbackContent(): void {
    // Fallback content for common types
    const fallbackData: Partial<Record<MBTIType, MBTIPersonalityContent>> = {
      'INFJ': {
        type: 'INFJ',
        arabicTitle: 'المستشار',
        arabicSubtitle: 'منغلق، حدسي، مشاعري، حازم',
        coreDescription: 'الشخص الذي لديه هذه التفضيلات (INFJ) يتميز بالعمق والبصيرة والحكمة. يسعى دائماً لفهم المعاني العميقة والروابط الخفية بين الأشياء.',
        relationshipInsights: 'يقدر العلاقات الوثيقة. ودائرة صداقاته تكون صغيرة وعميقة ومستقرة طويلاً. يبحث عن المعنى والعمق في علاقاته.',
        workCharacteristics: 'يعتبر العمل مجالاً للإبداع وتنمية المهارات، فهو يميل للأعمال التي قد يخرج بها عن المألوف ويساهم في تحسين حياة الآخرين.',
        personalGrowth: 'يركز على المستقبل. تجد أن أفكاره مثالية وكثيراً ما يحتاج للوحدة والرغبة فيها للتأمل والتطور الذاتي.'
      },
      'INTJ': {
        type: 'INTJ',
        arabicTitle: 'القائد العام',
        arabicSubtitle: 'منغلق، حدسي، منطقي، حازم',
        coreDescription: 'الشخص الذي لديه هذه التفضيلات (INTJ) من أكثر الأشخاص ثقة في نفسه وقدراته وقوته الذاتية. حياته مليئة بالتأملات التحليلية.',
        relationshipInsights: 'علاقاته يشترط أن تكون واضحة وتخدم غرضاً ما إيجابياً. يستمتع بالعلاقات مع الآخرين الذين يشاركونه نمط تفكيره.',
        workCharacteristics: 'شخص قوي في شعوره بالحاجة إلى العمل المستقل والفردي. فهو ينشد طرقاً حديثة وزوايا جديدة في النظر إلى الأشياء.',
        personalGrowth: 'يسعى دائماً لتطوير رؤيته الاستراتيجية وفهمه العميق للأنظمة المعقدة.'
      }
    }

    // Add fallback content to the map
    for (const [type, content] of Object.entries(fallbackData)) {
      this.personalityContent.set(type as MBTIType, content)
    }
  }

  /**
   * Get specific section content
   */
  public getRelationshipInsights(mbtiType: MBTIType): string {
    const content = this.getPersonalityContent(mbtiType)
    return content?.relationshipInsights || ''
  }

  public getWorkCharacteristics(mbtiType: MBTIType): string {
    const content = this.getPersonalityContent(mbtiType)
    return content?.workCharacteristics || ''
  }

  public getPersonalGrowth(mbtiType: MBTIType): string {
    const content = this.getPersonalityContent(mbtiType)
    return content?.personalGrowth || ''
  }
}