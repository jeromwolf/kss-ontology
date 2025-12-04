import { NextRequest, NextResponse } from 'next/server'

/**
 * Next.js Middleware
 *
 * 전역 요청 인터셉터
 * - API 라우트 보호
 * - 인증 확인
 * - 로깅
 */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public 경로 (인증 불필요)
  const publicPaths = [
    '/api/health',
    '/login',
    '/api/auth/login',
    '/api/auth/logout',
    '/_next',
    '/favicon.ico',
  ]

  // Public 경로는 통과
  if (publicPaths.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // API 라우트 인증 확인 (선택적)
  if (pathname.startsWith('/api/')) {
    // API 키 또는 세션 확인
    const apiKey = req.headers.get('x-api-key')
    const authHeader = req.headers.get('authorization')

    // 인증이 필요한 API는 개별 라우트에서 처리
    // 여기서는 로깅만 수행
    console.log(`[API] ${req.method} ${pathname}`)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
