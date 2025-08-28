import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const ARABIC_SYSTEM_PROMPT = `أنت مدرب شخصي متخصص في تحليل الشخصية باستخدام مؤشر مايرز-بريجز (MBTI). مهمتك هي تقديم نصائح شخصية ومفيدة باللغة العربية.

السياق:
- المستخدم أكمل اختبار MBTI وحصل على نوع شخصيته
- تحدث بطريقة مهنية ومتعاطفة وداعمة
- قدم نصائح عملية وقابلة للتطبيق
- استخدم أمثلة من الثقافة العربية والإسلامية عند الاقتضاء
- اجعل إجاباتك موجزة ومفيدة (200-300 كلمة كحد أقصى)

إرشادات المحادثة:
- ابدأ بالترحيب والتقدير لإكمال الاختبار
- ركز على نقاط القوة والفرص للتطوير
- قدم نصائح للعلاقات والمهنة والنمو الشخصي
- تجنب الأحكام أو التعميمات المطلقة
- شجع على الاستكشاف والتطوير المستمر`

const ENGLISH_SYSTEM_PROMPT = `You are a professional MBTI personality coach specializing in Myers-Briggs Type Indicator analysis. Your role is to provide personalized, actionable coaching advice.

Context:
- The user has completed an MBTI assessment and received their personality type
- Speak in a professional, empathetic, and supportive manner
- Provide practical, actionable advice
- Keep responses concise and valuable (200-300 words maximum)

Conversation guidelines:
- Welcome the user and acknowledge their assessment completion
- Focus on strengths and development opportunities
- Provide advice on relationships, career, and personal growth
- Avoid judgmental language or absolute generalizations
- Encourage exploration and continuous development`

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, mbtiType, language = 'en', conversationHistory = [] } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    // Select system prompt based on language
    const systemPrompt = language === 'ar' ? ARABIC_SYSTEM_PROMPT : ENGLISH_SYSTEM_PROMPT

    // Build conversation messages
    const messages: any[] = [
      {
        role: 'system',
        content: systemPrompt + (mbtiType ? `\n\nنوع شخصية المستخدم: ${mbtiType}` : ''),
      },
    ]

    // Add conversation history
    conversationHistory.forEach((msg: any) => {
      messages.push({
        role: msg.role,
        content: msg.content,
      })
    })

    // Add current message
    messages.push({
      role: 'user',
      content: message,
    })

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: language === 'ar' ? 400 : 350,
      presence_penalty: 0.1,
      frequency_penalty: 0.1,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      throw new Error('No response generated')
    }

    return NextResponse.json({
      message: response,
      type: 'assistant',
      timestamp: new Date().toISOString(),
    })

  } catch (error: any) {
    console.error('Chat API error:', error)
    
    const isArabic = request.headers.get('accept-language')?.includes('ar')
    const errorMessage = isArabic 
      ? 'عذراً، حدث خطأ في معالجة رسالتك. يرجى المحاولة مرة أخرى.'
      : 'Sorry, there was an error processing your message. Please try again.'

    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}