import { cookies } from 'next/headers'
import { db } from './db'
import { users } from './db/schema'
import { eq } from 'drizzle-orm'

const SESSION_COOKIE_NAME = 'kss_session'
const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000 // 30일

export interface Session {
  userId: number
  email: string
  name?: string
}

// 세션 생성
export async function createSession(userId: number): Promise<string> {
  const sessionToken = generateSessionToken()
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/',
  })

  return sessionToken
}

// 현재 세션 가져오기
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionToken) {
    return null
  }

  // 간단한 세션 토큰에서 userId 추출 (실제 프로덕션에서는 Redis 등 사용)
  try {
    const userId = parseInt(sessionToken.value.split(':')[0])
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    })

    if (!user) {
      return null
    }

    return {
      userId: user.id,
      email: user.email,
      name: user.name || undefined,
    }
  } catch (error) {
    return null
  }
}

// 세션 삭제 (로그아웃)
export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

// 사용자 생성 또는 가져오기
export async function findOrCreateUser(email: string, name?: string) {
  let user = await db.query.users.findFirst({
    where: eq(users.email, email),
  })

  if (!user) {
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        name,
      })
      .returning()

    user = newUser
  }

  return user
}

// 세션 토큰 생성 (간단한 버전)
function generateSessionToken(): string {
  return `${Date.now()}:${Math.random().toString(36).substring(2)}`
}

// 인증 필요 여부 체크
export async function requireAuth(): Promise<Session> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}
