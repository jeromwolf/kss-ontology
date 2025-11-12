import { NextRequest, NextResponse } from 'next/server'
import { findOrCreateUser, createSession } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: '유효한 이메일을 입력해주세요' }, { status: 400 })
    }

    // 사용자 생성 또는 가져오기
    const user = await findOrCreateUser(email, name)

    // 세션 생성 (세션 토큰을 userId 기반으로 생성)
    const sessionToken = `${user.id}:${Math.random().toString(36).substring(2)}`

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    })

    // 쿠키 설정
    response.cookies.set('kss_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30일
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: '로그인에 실패했습니다' }, { status: 500 })
  }
}
