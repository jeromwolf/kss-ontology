import { NextResponse } from 'next/server'
import { getOntologyStats } from '@/lib/services/ontology-query'

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
    console.error('Failed to get ontology stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: '온톨로지 통계 조회 중 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
