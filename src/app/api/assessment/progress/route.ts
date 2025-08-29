import { NextRequest, NextResponse } from 'next/server'

// Session storage (in production, use Redis or database)
const sessions = new Map<string, SessionData>()

interface SessionData {
  sessionId: string
  sessionData: AssessmentSession
  timestamp: Date
  expiresAt: Date
}

interface AssessmentSession {
  sessionId: string
  language: 'en' | 'ar'
  currentStep: 'welcome' | 'format-selection' | 'questions' | 'results' | 'coaching'
  startTime: Date
  completionTime?: Date
  selectedFormat?: 'scenarios' | 'traits' | 'sais'
  coreResponses: QuestionResponse[]
  extendedResponses: QuestionResponse[]
  calculatedType?: string
  confidence?: number
  progress: number
  isComplete: boolean
}

interface QuestionResponse {
  questionId: string
  score: number
  tendency?: string
  timestamp: Date
  responseId: string
  sessionId: string
  questionType: 'core' | 'extended'
  responseType: 'binary' | 'distribution'
  selectedOption?: 'A' | 'B'
  distributionA?: number
  distributionB?: number
  mbtiDimension: 'E/I' | 'S/N' | 'T/F' | 'J/P'
}

interface ProgressBackupRequest {
  sessionId: string
  sessionData: AssessmentSession
  timestamp: Date
}

interface ProgressRecoveryResponse {
  sessionData: AssessmentSession | null
  lastSaved: Date | null
  isExpired: boolean
}

// Session expiration: 3 hours
const SESSION_TIMEOUT = 3 * 60 * 60 * 1000

// Cleanup expired sessions
function cleanupExpiredSessions() {
  const now = new Date()
  for (const [sessionId, data] of Array.from(sessions.entries())) {
    if (data.expiresAt < now) {
      sessions.delete(sessionId)
    }
  }
}

// POST /api/assessment/progress - Save session progress
export async function POST(request: NextRequest) {
  try {
    cleanupExpiredSessions()
    
    const body: ProgressBackupRequest = await request.json()
    
    if (!body.sessionId || !body.sessionData) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId or sessionData' },
        { status: 400 }
      )
    }

    // Validate session data structure
    const { sessionData } = body
    if (!sessionData.language || !sessionData.currentStep || typeof sessionData.progress !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid session data structure' },
        { status: 400 }
      )
    }

    const now = new Date()
    const expiresAt = new Date(now.getTime() + SESSION_TIMEOUT)

    const sessionBackup: SessionData = {
      sessionId: body.sessionId,
      sessionData: {
        ...sessionData,
        startTime: sessionData.startTime ? new Date(sessionData.startTime) : now,
        completionTime: sessionData.completionTime ? new Date(sessionData.completionTime) : undefined,
        coreResponses: sessionData.coreResponses || [],
        extendedResponses: sessionData.extendedResponses || []
      },
      timestamp: now,
      expiresAt
    }

    sessions.set(body.sessionId, sessionBackup)

    return NextResponse.json({
      success: true,
      data: {
        sessionId: body.sessionId,
        saved: true,
        expiresAt: expiresAt.toISOString()
      },
      timestamp: now.toISOString()
    })

  } catch (error) {
    console.error('Progress backup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET /api/assessment/progress/[sessionId] - Recover session progress
export async function GET(request: NextRequest) {
  try {
    cleanupExpiredSessions()
    
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId parameter' },
        { status: 400 }
      )
    }

    const sessionData = sessions.get(sessionId)
    const now = new Date()

    if (!sessionData) {
      const response: ProgressRecoveryResponse = {
        sessionData: null,
        lastSaved: null,
        isExpired: false
      }
      
      return NextResponse.json({
        success: true,
        data: response,
        timestamp: now.toISOString()
      })
    }

    const isExpired = sessionData.expiresAt < now
    
    if (isExpired) {
      sessions.delete(sessionId)
      
      const response: ProgressRecoveryResponse = {
        sessionData: null,
        lastSaved: sessionData.timestamp,
        isExpired: true
      }
      
      return NextResponse.json({
        success: true,
        data: response,
        timestamp: now.toISOString()
      })
    }

    const response: ProgressRecoveryResponse = {
      sessionData: sessionData.sessionData,
      lastSaved: sessionData.timestamp,
      isExpired: false
    }

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: now.toISOString()
    })

  } catch (error) {
    console.error('Progress recovery error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/assessment/progress/[sessionId] - Clean up session
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Missing sessionId parameter' },
        { status: 400 }
      )
    }

    const deleted = sessions.delete(sessionId)

    return NextResponse.json({
      success: true,
      data: { sessionId, deleted },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Session cleanup error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}