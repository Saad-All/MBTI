import { NextRequest, NextResponse } from 'next/server'
import { MBTICalculatorService } from '@/lib/services/MBTICalculatorService'
import { QuestionResponse, MBTIDimension } from '@/lib/types'

export async function POST(request: NextRequest) {
  const interimApiEnabled = process.env.NEXT_PUBLIC_INTERIM_API_ENABLED !== 'false'
  
  if (!interimApiEnabled) {
    return NextResponse.json({
      error: 'Interim results temporarily unavailable',
      fallback: true,
      redirect: '/api/assessment/calculate'
    }, { status: 503 })
  }

  try {
    const body = await request.json()
    const { sessionId, responses } = body

    if (!sessionId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Invalid request data. SessionId and responses array required.' },
        { status: 400 }
      )
    }

    // Filter only core responses and validate count
    const coreResponses = responses.filter(r => r.questionType === 'core')
    if (coreResponses.length !== 4) {
      console.error(`Interim API: Expected 4 core responses, got ${coreResponses.length}. Total responses: ${responses.length}`)
      return NextResponse.json(
        { 
          error: `Invalid core responses count. Expected 4, got ${coreResponses.length}`,
          debug: {
            totalResponses: responses.length,
            coreResponses: coreResponses.length,
            responseTypes: responses.map(r => r.questionType)
          }
        },
        { status: 400 }
      )
    }

    const calculator = MBTICalculatorService.getInstance()
    const interimResult = calculator.calculateInterimResults(coreResponses)

    const insights = generateInterimInsights(interimResult.mbtiType, interimResult.dimensionScores, body.language || 'en')

    return NextResponse.json({
      success: true,
      interimResult: {
        ...interimResult,
        confidence: Math.min(interimResult.overallConfidence, 65), // Cap confidence for interim results
        insights,
        disclaimer: getDisclaimer(body.language || 'en'),
      }
    })
  } catch (error) {
    console.error('Interim calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate interim results' },
      { status: 500 }
    )
  }
}

function generateInterimInsights(mbtiType: string, dimensionScores: any[], language: string): string[] {
  const insights: string[] = []
  const isArabic = language === 'ar'

  // Insight based on E/I dimension
  const eiScore = dimensionScores.find(d => d.dimension === 'E/I')
  if (eiScore) {
    if (eiScore.preference === 'E') {
      insights.push(
        isArabic 
          ? 'يبدو أنك تستمد طاقتك من التفاعل مع الآخرين والعالم الخارجي'
          : 'You appear to draw energy from interacting with others and the external world'
      )
    } else {
      insights.push(
        isArabic
          ? 'يبدو أنك تفضل التفكير الداخلي والتأمل للحصول على الطاقة'
          : 'You seem to prefer inner reflection and introspection for energy'
      )
    }
  }

  // Insight based on S/N dimension
  const snScore = dimensionScores.find(d => d.dimension === 'S/N')
  if (snScore) {
    if (snScore.preference === 'S') {
      insights.push(
        isArabic
          ? 'تميل إلى التركيز على التفاصيل الملموسة والحقائق الواقعية'
          : 'You tend to focus on concrete details and practical realities'
      )
    } else {
      insights.push(
        isArabic
          ? 'تميل إلى رؤية الصورة الكبيرة والاحتمالات المستقبلية'
          : 'You tend to see the big picture and future possibilities'
      )
    }
  }

  // Insight based on T/F dimension
  const tfScore = dimensionScores.find(d => d.dimension === 'T/F')
  if (tfScore) {
    if (tfScore.preference === 'T') {
      insights.push(
        isArabic
          ? 'تفضل اتخاذ القرارات بناءً على المنطق والتحليل الموضوعي'
          : 'You prefer making decisions based on logic and objective analysis'
      )
    } else {
      insights.push(
        isArabic
          ? 'تأخذ في الاعتبار القيم الشخصية وتأثير القرارات على الآخرين'
          : 'You consider personal values and the impact of decisions on others'
      )
    }
  }

  return insights.slice(0, 3) // Return maximum 3 insights
}

function getDisclaimer(language: string): string {
  return language === 'ar'
    ? 'هذه نتائج أولية بناءً على 4 أسئلة فقط. ستصبح النتائج أكثر دقة بعد إكمال الأسئلة الإضافية.'
    : 'These are preliminary results based on only 4 questions. Results will become more accurate after completing additional questions.'
}