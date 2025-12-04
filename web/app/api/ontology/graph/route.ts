import { NextResponse } from 'next/server'
import { queryTriples } from '@/lib/services/ontology-query'

// Force dynamic rendering to avoid build-time DB connection
export const dynamic = 'force-dynamic'

/**
 * GET /api/ontology/graph
 *
 * Knowledge Graph 시각화를 위한 모든 Triple 조회
 *
 * Query params:
 * - minConfidence: 최소 신뢰도 (기본값: 0.7)
 * - limit: 최대 Triple 개수 (기본값: 100)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const minConfidence = parseFloat(searchParams.get('minConfidence') || '0.7')
    const limit = parseInt(searchParams.get('limit') || '100')

    // 모든 Triple 조회 (패턴 제한 없음)
    const triples = await queryTriples({}, minConfidence)

    // Limit 적용
    const limitedTriples = triples.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        triples: limitedTriples,
        total: limitedTriples.length,
        minConfidence,
      },
    })
  } catch (error: any) {
    console.error('[Graph API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch graph data',
      },
      { status: 500 }
    )
  }
}
