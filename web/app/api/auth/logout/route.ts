import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/auth'

export async function POST() {
  try {
    await deleteSession()

    const response = NextResponse.json({ success: true })
    response.cookies.delete('kss_session')

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ error: '로그아웃에 실패했습니다' }, { status: 500 })
  }
}
