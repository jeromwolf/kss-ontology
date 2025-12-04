import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { withCache, createCacheKey, CacheTTL } from '@/lib/services/cache'

// Force dynamic rendering to avoid build-time DB connection
export const dynamic = 'force-dynamic'

// Lazy initialization to avoid build-time errors
let pool: Pool | null = null

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || '',
    })
  }
  return pool
}

/**
 * GET /api/analytics
 * 전체 시스템 통계 및 분석 데이터
 * Redis 캐싱 적용 (5분 TTL)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const period = searchParams.get('period') || '7d' // 7d, 30d, 90d, all

    // 캐시 키 생성
    const cacheKey = createCacheKey('analytics', period)

    // withCache로 감싸서 캐싱 적용
    const data = await withCache(
      cacheKey,
      async () => {
        return await fetchAnalyticsData(period)
      },
      CacheTTL.MEDIUM // 5분
    )

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * Analytics 데이터 조회 함수 (캐시용)
 */
async function fetchAnalyticsData(period: string) {
    const datePeriod = getPeriodDays(period)

    // 1. Triple 통계
    const tripleStats = await getPool().query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE confidence >= 0.9) as very_high_confidence,
        COUNT(*) FILTER (WHERE confidence >= 0.8 AND confidence < 0.9) as high_confidence,
        COUNT(*) FILTER (WHERE confidence >= 0.7 AND confidence < 0.8) as medium_confidence,
        COUNT(*) FILTER (WHERE confidence < 0.7) as low_confidence,
        COUNT(*) FILTER (WHERE validated_by = 'baseline') as baseline_validated,
        COUNT(*) FILTER (WHERE validated_by = 'gpt') as gpt_validated,
        COUNT(*) FILTER (WHERE validated_by = 'user') as user_validated,
        AVG(confidence) as avg_confidence,
        MIN(confidence) as min_confidence,
        MAX(confidence) as max_confidence
      FROM knowledge_triples
    `)

    // 2. 일별 Triple 추출 추이
    const triplesTrend = await getPool().query(
      `
      SELECT
        DATE(created_at) as date,
        COUNT(*) as count,
        AVG(confidence) as avg_confidence
      FROM knowledge_triples
      WHERE created_at >= NOW() - INTERVAL '${datePeriod} days'
      GROUP BY DATE(created_at)
      ORDER BY date DESC
      LIMIT 30
    `
    )

    // 3. 관계 타입별 분포
    const relationTypes = await getPool().query(`
      SELECT
        predicate,
        COUNT(*) as count,
        AVG(confidence) as avg_confidence
      FROM knowledge_triples
      GROUP BY predicate
      ORDER BY count DESC
      LIMIT 10
    `)

    // 4. 기업별 Triple 수
    const companiesStats = await getPool().query(`
      SELECT
        SUBSTRING(subject FROM 'Company_(.*)') as company,
        COUNT(*) as triple_count,
        AVG(confidence) as avg_confidence
      FROM knowledge_triples
      WHERE subject LIKE 'kss:Company_%'
      GROUP BY company
      ORDER BY triple_count DESC
      LIMIT 10
    `)

    // 5. 피드백 통계
    const feedbackStats = await getPool().query(`
      SELECT
        action,
        COUNT(*) as count,
        AVG(confidence) as avg_confidence
      FROM triple_feedback
      GROUP BY action
    `)

    // 6. 뉴스 수집 통계
    const newsStats = await getPool().query(`
      SELECT
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE processed = true) as processed,
        COUNT(*) FILTER (WHERE processed = false) as unprocessed,
        COUNT(DISTINCT company) as companies_covered
      FROM news_articles
    `)

    // 7. 최근 활동 (Triple 추가, 피드백 등)
    const recentActivity = await getPool().query(`
      SELECT
        'triple' as type,
        id,
        subject,
        predicate,
        object,
        confidence,
        created_at as timestamp
      FROM knowledge_triples
      ORDER BY created_at DESC
      LIMIT 5
    `)

    // 8. 시스템 헬스
    const systemHealth = {
      database: 'healthy',
      totalRecords: parseInt(tripleStats.rows[0].total),
      avgConfidence: parseFloat(tripleStats.rows[0].avg_confidence).toFixed(3),
      lastUpdate: new Date().toISOString(),
    }

    return {
        triples: {
          total: parseInt(tripleStats.rows[0].total),
          byConfidence: {
            veryHigh: parseInt(tripleStats.rows[0].very_high_confidence),
            high: parseInt(tripleStats.rows[0].high_confidence),
            medium: parseInt(tripleStats.rows[0].medium_confidence),
            low: parseInt(tripleStats.rows[0].low_confidence),
          },
          byValidation: {
            baseline: parseInt(tripleStats.rows[0].baseline_validated),
            gpt: parseInt(tripleStats.rows[0].gpt_validated),
            user: parseInt(tripleStats.rows[0].user_validated),
          },
          confidence: {
            avg: parseFloat(tripleStats.rows[0].avg_confidence),
            min: parseFloat(tripleStats.rows[0].min_confidence),
            max: parseFloat(tripleStats.rows[0].max_confidence),
          },
        },
        trends: {
          daily: triplesTrend.rows.map((row) => ({
            date: row.date,
            count: parseInt(row.count),
            avgConfidence: parseFloat(row.avg_confidence),
          })),
        },
        relationTypes: relationTypes.rows.map((row) => ({
          type: row.predicate,
          count: parseInt(row.count),
          avgConfidence: parseFloat(row.avg_confidence),
        })),
        companies: companiesStats.rows.map((row) => ({
          name: row.company,
          tripleCount: parseInt(row.triple_count),
          avgConfidence: parseFloat(row.avg_confidence),
        })),
        feedback: {
          total: feedbackStats.rows.reduce(
            (sum, row) => sum + parseInt(row.count),
            0
          ),
          byAction: feedbackStats.rows.map((row) => ({
            action: row.action,
            count: parseInt(row.count),
            avgConfidence: parseFloat(row.avg_confidence || 0),
          })),
        },
        news: {
          total: parseInt(newsStats.rows[0]?.total || 0),
          processed: parseInt(newsStats.rows[0]?.processed || 0),
          unprocessed: parseInt(newsStats.rows[0]?.unprocessed || 0),
          companiesCovered: parseInt(newsStats.rows[0]?.companies_covered || 0),
        },
        recentActivity: recentActivity.rows,
        systemHealth,
    }
}

/**
 * 기간을 일수로 변환
 */
function getPeriodDays(period: string): number {
  const periods: Record<string, number> = {
    '7d': 7,
    '30d': 30,
    '90d': 90,
    all: 365,
  }
  return periods[period] || 7
}
