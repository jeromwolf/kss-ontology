import { NextRequest, NextResponse } from 'next/server'
import {
  analyzeSupplyChainNetwork,
  getCompanyRecommendations,
  analyzeNetworkHealth,
} from '@/lib/services/ai-insights'
import { withCache, createCacheKey, CacheTTL } from '@/lib/services/cache'

// Force dynamic rendering to avoid build-time DB connection
export const dynamic = 'force-dynamic'

/**
 * GET /api/insights
 * AI 기반 공급망 네트워크 인사이트 생성
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const company = searchParams.get('company')
    const type = searchParams.get('type') || 'network' // network | health

    if (type === 'health') {
      // 네트워크 건강도 분석
      const cacheKey = createCacheKey('insights', 'health')
      const health = await withCache(
        cacheKey,
        async () => {
          return await analyzeNetworkHealth()
        },
        CacheTTL.LONG // 30분
      )

      return NextResponse.json({
        success: true,
        data: {
          type: 'health',
          health,
        },
      })
    }

    // 네트워크 분석 및 추천
    const cacheKey = company
      ? createCacheKey('insights', 'company', company)
      : createCacheKey('insights', 'network')

    const insights = await withCache(
      cacheKey,
      async () => {
        if (company) {
          return await getCompanyRecommendations(company)
        } else {
          return await analyzeSupplyChainNetwork()
        }
      },
      CacheTTL.VERY_LONG // 1시간 (AI 분석은 비용이 높음)
    )

    return NextResponse.json({
      success: true,
      data: {
        type: company ? 'company' : 'network',
        company,
        insights,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Insights API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
