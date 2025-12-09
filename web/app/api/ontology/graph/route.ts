import { NextResponse } from 'next/server'
import { queryTriples } from '@/lib/services/ontology-query'

// Force dynamic rendering to avoid build-time DB connection
export const dynamic = 'force-dynamic'

// DB 연결 실패 시 사용할 샘플 데이터
const SAMPLE_TRIPLES = [
  { subject: 'kss:Company_Samsung', predicate: 'kss:competes_with', object: 'kss:Company_SKHynix', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Samsung', predicate: 'kss:competes_with', object: 'kss:Company_Apple', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Samsung', predicate: 'kss:supplies_to', object: 'kss:Company_Apple', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Samsung', predicate: 'kss:competes_with', object: 'kss:Company_TSMC', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_SKHynix', predicate: 'kss:supplies_to', object: 'kss:Company_NVIDIA', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_SKHynix', predicate: 'kss:competes_with', object: 'kss:Company_Micron', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Hyundai', predicate: 'kss:competes_with', object: 'kss:Company_Tesla', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Hyundai', predicate: 'kss:competes_with', object: 'kss:Company_BYD', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_LGChem', predicate: 'kss:supplies_to', object: 'kss:Company_Tesla', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_LGChem', predicate: 'kss:supplies_to', object: 'kss:Company_GM', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_TSMC', predicate: 'kss:supplies_to', object: 'kss:Company_Apple', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_TSMC', predicate: 'kss:supplies_to', object: 'kss:Company_NVIDIA', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_NVIDIA', predicate: 'kss:competes_with', object: 'kss:Company_AMD', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_NVIDIA', predicate: 'kss:competes_with', object: 'kss:Company_Intel', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Naver', predicate: 'kss:competes_with', object: 'kss:Company_Kakao', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Naver', predicate: 'kss:competes_with', object: 'kss:Company_Google', confidence: 0.9, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Kakao', predicate: 'kss:competes_with', object: 'kss:Company_Naver', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Celltrion', predicate: 'kss:competes_with', object: 'kss:Company_Samsung', confidence: 0.8, validatedBy: 'gpt' as const },
  { subject: 'kss:Company_POSCO', predicate: 'kss:supplies_to', object: 'kss:Company_Hyundai', confidence: 1.0, validatedBy: 'baseline' as const },
  { subject: 'kss:Company_Intel', predicate: 'kss:competes_with', object: 'kss:Company_AMD', confidence: 1.0, validatedBy: 'baseline' as const },
]

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
  const { searchParams } = new URL(request.url)
  const minConfidence = parseFloat(searchParams.get('minConfidence') || '0.7')
  const limit = parseInt(searchParams.get('limit') || '100')

  try {
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
    console.error('[Graph API] DB connection failed, using sample data:', error.message)

    // DB 연결 실패 시 샘플 데이터 반환
    const filteredSamples = SAMPLE_TRIPLES.filter(t => t.confidence >= minConfidence)
    const limitedSamples = filteredSamples.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: {
        triples: limitedSamples,
        total: limitedSamples.length,
        minConfidence,
        isDemo: true, // 샘플 데이터임을 표시
      },
    })
  }
}
