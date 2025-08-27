import { NextRequest, NextResponse } from 'next/server'

// Edge Runtime temporarily disabled due to Next.js 14.2+ build compatibility issue
// TODO: Re-enable when Next.js resolves edge runtime build issues
// export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const timestamp = new Date().toISOString()
    const deploymentInfo = {
      status: 'healthy',
      timestamp,
      environment: process.env.NEXT_PUBLIC_ENVIRONMENT || 'development',
      version: '1.0.0',
      runtime: 'edge',
    }

    return NextResponse.json(deploymentInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      { 
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}
