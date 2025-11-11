/**
 * News Search API (Production)
 *
 * GET /api/news/search?q=삼성전자&display=20&sort=date
 *
 * Features:
 * - Rate limiting (server-side)
 * - In-memory caching (30분)
 * - Error handling
 * - CORS support
 */

import { NextRequest, NextResponse } from 'next/server'
import { naverNewsClient } from '@/lib/naver-news-client'

// In-memory cache (프로덕션에서는 Redis 권장)
const cache = new Map<string, { data: any; expires: number }>()

// 캐시 TTL: 30분
const CACHE_TTL = 30 * 60 * 1000

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const display = parseInt(searchParams.get('display') || '10')
    const start = parseInt(searchParams.get('start') || '1')
    const sort = (searchParams.get('sort') || 'date') as 'date' | 'sim'

    // 유효성 검사
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      )
    }

    if (display < 10 || display > 100) {
      return NextResponse.json(
        { error: 'Display must be between 10 and 100' },
        { status: 400 }
      )
    }

    if (start < 1 || start > 1000) {
      return NextResponse.json(
        { error: 'Start must be between 1 and 1000' },
        { status: 400 }
      )
    }

    // 캐시 키 생성
    const cacheKey = `${query}:${display}:${start}:${sort}`

    // 캐시 확인
    const cached = cache.get(cacheKey)
    if (cached && cached.expires > Date.now()) {
      console.log(`[API] Cache hit: ${cacheKey}`)
      return NextResponse.json({
        ...cached.data,
        cached: true,
      })
    }

    // API 호출
    console.log(`[API] Fetching: ${query}`)
    const data = await naverNewsClient.search({
      query,
      display,
      start,
      sort,
    })

    // 캐시 저장
    cache.set(cacheKey, {
      data,
      expires: Date.now() + CACHE_TTL,
    })

    // 주기적으로 만료된 캐시 정리 (간단한 구현)
    if (cache.size > 1000) {
      cleanCache()
    }

    return NextResponse.json({
      ...data,
      cached: false,
    })

  } catch (error: any) {
    console.error('[API] Error:', error)

    if (error.message.includes('credentials not configured')) {
      return NextResponse.json(
        {
          error: 'Server configuration error',
          details: 'Naver API credentials not configured'
        },
        { status: 500 }
      )
    }

    if (error.message.includes('Rate limit')) {
      return NextResponse.json(
        {
          error: 'Too many requests',
          details: 'Please try again later',
          retryAfter: 60
        },
        {
          status: 429,
          headers: {
            'Retry-After': '60'
          }
        }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// CORS 지원 (필요시)
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}

/**
 * 만료된 캐시 정리
 */
function cleanCache() {
  const now = Date.now()
  for (const [key, value] of cache.entries()) {
    if (value.expires < now) {
      cache.delete(key)
    }
  }
  console.log(`[Cache] Cleaned. Current size: ${cache.size}`)
}
