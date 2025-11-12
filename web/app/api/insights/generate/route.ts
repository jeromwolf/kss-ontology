import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { watchlist } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { generateDailyInsight, fetchNewsForCompanies } from '@/lib/services/insight-generator'

export async function POST() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    // 1. 사용자의 관심 기업 목록 가져오기
    const userWatchlist = await db.query.watchlist.findMany({
      where: eq(watchlist.userId, session.userId),
      orderBy: (watchlist, { desc }) => [desc(watchlist.priority)],
    })

    if (userWatchlist.length === 0) {
      return NextResponse.json(
        { error: '관심 기업을 먼저 등록해주세요' },
        { status: 400 }
      )
    }

    // 2. 각 기업에 대한 뉴스 검색
    const companies = userWatchlist.map((item) => item.companyName)
    const newsMap = await fetchNewsForCompanies(companies)

    // 3. 모든 뉴스를 하나의 배열로 합치기
    const allNews = Array.from(newsMap.values()).flat()

    if (allNews.length === 0) {
      return NextResponse.json(
        { error: '관련 뉴스를 찾을 수 없습니다' },
        { status: 404 }
      )
    }

    // 4. 인사이트 생성
    const insight = await generateDailyInsight(companies, allNews)

    return NextResponse.json({ insight })
  } catch (error) {
    console.error('Insight generation error:', error)
    return NextResponse.json(
      { error: '인사이트 생성에 실패했습니다' },
      { status: 500 }
    )
  }
}
