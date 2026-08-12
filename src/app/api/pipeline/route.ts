import { NextRequest, NextResponse } from 'next/server'
import { runFullPipeline, runBreakingCheck } from '@/lib/pipeline/orchestrator'

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await runFullPipeline()
    return NextResponse.json({ 
      success: true, 
      timestamp: new Date().toISOString(),
      results: results.map(r => ({
        source: r.sourceName,
        fetched: r.fetched,
        saved: r.saved,
        enriched: r.enriched,
        errors: r.errors.length,
        durationMs: r.durationMs,
      })),
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : '파이프라인 실행 실패' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const breaking = await runBreakingCheck()
    return NextResponse.json({ 
      breaking: breaking.map(a => ({
        id: a.id,
        title: a.title,
        category: a.categorySlug,
        importance: a.aiImportance,
        publishedAt: a.publishedAt,
      })),
    })
  } catch (error) {
    return NextResponse.json({ 
      breaking: [], 
      error: error instanceof Error ? error.message : '브레이킹 체크 실패' 
    }, { status: 500 })
  }
}