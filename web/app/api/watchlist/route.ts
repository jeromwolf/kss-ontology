import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { watchlist } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

// GET - 사용자의 관심 기업 목록 가져오기
export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const items = await db.query.watchlist.findMany({
      where: eq(watchlist.userId, session.userId),
      orderBy: (watchlist, { desc }) => [desc(watchlist.priority), desc(watchlist.addedAt)],
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error('Watchlist GET error:', error)
    return NextResponse.json({ error: '목록을 불러오는데 실패했습니다' }, { status: 500 })
  }
}

// POST - 관심 기업 추가
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { companyName, ticker, priority, notes } = await request.json()

    if (!companyName) {
      return NextResponse.json({ error: '기업명을 입력해주세요' }, { status: 400 })
    }

    // 이미 10개 이상 등록되어 있는지 확인
    const existingCount = await db.query.watchlist.findMany({
      where: eq(watchlist.userId, session.userId),
    })

    if (existingCount.length >= 10) {
      return NextResponse.json({ error: '최대 10개까지만 등록할 수 있습니다' }, { status: 400 })
    }

    // 중복 확인
    const existing = await db.query.watchlist.findFirst({
      where: and(
        eq(watchlist.userId, session.userId),
        eq(watchlist.companyName, companyName)
      ),
    })

    if (existing) {
      return NextResponse.json({ error: '이미 등록된 기업입니다' }, { status: 400 })
    }

    const [newItem] = await db
      .insert(watchlist)
      .values({
        userId: session.userId,
        companyName,
        ticker: ticker || null,
        priority: priority || 5,
        notes: notes || null,
      })
      .returning()

    return NextResponse.json({ item: newItem })
  } catch (error) {
    console.error('Watchlist POST error:', error)
    return NextResponse.json({ error: '추가하는데 실패했습니다' }, { status: 500 })
  }
}

// DELETE - 관심 기업 삭제
export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: '로그인이 필요합니다' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID가 필요합니다' }, { status: 400 })
    }

    await db
      .delete(watchlist)
      .where(and(eq(watchlist.id, parseInt(id)), eq(watchlist.userId, session.userId)))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Watchlist DELETE error:', error)
    return NextResponse.json({ error: '삭제하는데 실패했습니다' }, { status: 500 })
  }
}
