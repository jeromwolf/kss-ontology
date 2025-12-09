import { NextResponse } from 'next/server'
import { getOntologyStats } from '@/lib/services/ontology-query'

// Force dynamic rendering to avoid build-time DB connection
export const dynamic = 'force-dynamic'

// DB 연결 실패 시 사용할 샘플 통계
const SAMPLE_STATS = {
  totalTriples: 20,
  highConfidenceTriples: 18,
  avgConfidence: 0.97,
  isDemo: true,
}

/**
 * GET /api/ontology/stats
 * 온톨로지 통계 조회
 */
export async function GET() {
  try {
    const stats = await getOntologyStats()

    return NextResponse.json({
      success: true,
      data: stats,
      message: '온톨로지 통계를 성공적으로 조회했습니다.'
    })
  } catch (error) {
    console.error('Failed to get ontology stats, using sample data:', error)

    // DB 연결 실패 시 샘플 통계 반환
    return NextResponse.json({
      success: true,
      data: SAMPLE_STATS,
      message: '데모 모드: 샘플 통계를 표시합니다.'
    })
  }
}
