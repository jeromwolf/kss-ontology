import { NextRequest, NextResponse } from 'next/server'
import { queryTriples } from '@/lib/services/ontology-query'

/**
 * GET /api/ontology/query?subject=kss:Company_Samsung
 * SPARQL-like 쿼리 실행
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const subject = searchParams.get('subject') || undefined
    const predicate = searchParams.get('predicate') || undefined
    const object = searchParams.get('object') || undefined
    const minConfidence = parseFloat(searchParams.get('minConfidence') || '0.7')

    const triples = await queryTriples(
      {
        subject,
        predicate,
        object
      },
      minConfidence
    )

    return NextResponse.json({
      success: true,
      data: {
        triples,
        count: triples.length,
        query: { subject, predicate, object, minConfidence }
      }
    })
  } catch (error) {
    console.error('Failed to query triples:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Triple 쿼리 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
