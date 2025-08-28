import { NextRequest, NextResponse } from 'next/server'
import { MBTICalculatorService } from '@/lib/services/MBTICalculatorService'
import { ValidationService } from '@/lib/services/ValidationService'
import {
  ScoringInput,
  MBTIResults,
  APIResponse,
  QuestionResponse,
  MethodologyType,
} from '@/lib/types'

// Simple in-memory cache for demonstration
const responseCache = new Map<string, CacheEntry>()
const CACHE_TTL = 1000 * 60 * 5 // 5 minutes

interface CacheEntry {
  result: MBTIResults
  timestamp: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, responses, methodology, isInterim } = body

    // Validate request body
    if (!sessionId) {
      return NextResponse.json<APIResponse>({
        success: false,
        error: 'Session ID is required',
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    if (!responses || !Array.isArray(responses)) {
      return NextResponse.json<APIResponse>({
        success: false,
        error: 'Responses array is required',
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    if (!methodology) {
      return NextResponse.json<APIResponse>({
        success: false,
        error: 'Methodology is required',
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    // Validate methodology
    const validationService = ValidationService.getInstance()
    if (!validationService.validateMethodology(methodology)) {
      return NextResponse.json<APIResponse>({
        success: false,
        error: 'Invalid methodology. Must be one of: scenarios, traits, sais',
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    // Generate cache key
    const cacheKey = `${sessionId}-${methodology}-${responses.length}-${JSON.stringify(responses)}`
    
    // Check cache
    const cached = responseCache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      const cachedResult: MBTIResults = {
        ...cached.result,
        cacheHit: true,
      }
      
      return NextResponse.json<APIResponse<MBTIResults>>({
        success: true,
        data: cachedResult,
        timestamp: new Date().toISOString(),
      })
    }

    // Sanitize and validate responses
    const sanitizedResponses = validationService.sanitizeResponses(responses as QuestionResponse[])
    const validationResult = validationService.validateResponses(
      sanitizedResponses,
      methodology as MethodologyType
    )

    if (!validationResult.isValid) {
      return NextResponse.json<APIResponse>({
        success: false,
        error: 'Invalid responses',
        data: { errors: validationResult.errors },
        timestamp: new Date().toISOString(),
      }, { status: 400 })
    }

    // Calculate MBTI
    const calculatorService = MBTICalculatorService.getInstance()
    const scoringInput: ScoringInput = {
      sessionId,
      responses: sanitizedResponses,
      methodology: methodology as MethodologyType,
      isInterim: isInterim || false,
    }

    const scoringResult = calculatorService.calculateMBTI(scoringInput)
    
    // Create MBTIResults
    const result: MBTIResults = {
      ...scoringResult,
      calculatedAt: new Date(),
      cacheHit: false,
    }

    // Store in cache
    responseCache.set(cacheKey, {
      result,
      timestamp: Date.now(),
    })

    // Clean up old cache entries
    const entriesToDelete: string[] = []
    responseCache.forEach((entry, key) => {
      if (Date.now() - entry.timestamp > CACHE_TTL) {
        entriesToDelete.push(key)
      }
    })
    
    for (const key of entriesToDelete) {
      responseCache.delete(key)
    }

    return NextResponse.json<APIResponse<MBTIResults>>({
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    })

  } catch (error) {
    console.error('MBTI calculation error:', error)
    
    return NextResponse.json<APIResponse>({
      success: false,
      error: 'Internal server error during MBTI calculation',
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}