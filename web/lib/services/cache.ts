/**
 * Redis Caching Service
 *
 * Redis 기반 캐싱 시스템:
 * - API 응답 캐싱
 * - 데이터베이스 쿼리 결과 캐싱
 * - TTL(Time To Live) 기반 자동 만료
 * - 캐시 무효화(invalidation) 지원
 */

import Redis from 'ioredis'

// Redis 클라이언트 싱글톤
let redisClient: Redis | null = null

/**
 * Redis 클라이언트 초기화
 */
export function getRedisClient(): Redis | null {
  // Redis가 비활성화된 경우
  if (process.env.ENABLE_REDIS !== 'true') {
    return null
  }

  // 이미 초기화된 경우
  if (redisClient) {
    return redisClient
  }

  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 3,
      retryStrategy(times) {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
      lazyConnect: true,
    })

    // 연결 이벤트 핸들러
    redisClient.on('connect', () => {
      console.log('✅ Redis 연결 성공')
    })

    redisClient.on('error', (err) => {
      console.error('❌ Redis 오류:', err.message)
    })

    redisClient.on('close', () => {
      console.log('⚠️  Redis 연결 종료')
    })

    // 초기 연결
    redisClient.connect().catch((err) => {
      console.error('❌ Redis 초기 연결 실패:', err.message)
      redisClient = null
    })

    return redisClient
  } catch (error) {
    console.error('❌ Redis 클라이언트 초기화 실패:', error)
    return null
  }
}

/**
 * 캐시에서 데이터 조회
 */
export async function getCache<T>(key: string): Promise<T | null> {
  const client = getRedisClient()
  if (!client) return null

  try {
    const data = await client.get(key)
    if (!data) return null

    return JSON.parse(data) as T
  } catch (error) {
    console.error(`❌ 캐시 조회 실패 (${key}):`, error)
    return null
  }
}

/**
 * 캐시에 데이터 저장
 */
export async function setCache(
  key: string,
  value: any,
  ttlSeconds: number = 300
): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    const serialized = JSON.stringify(value)
    await client.set(key, serialized, 'EX', ttlSeconds)
    return true
  } catch (error) {
    console.error(`❌ 캐시 저장 실패 (${key}):`, error)
    return false
  }
}

/**
 * 캐시 삭제
 */
export async function deleteCache(key: string): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.del(key)
    return true
  } catch (error) {
    console.error(`❌ 캐시 삭제 실패 (${key}):`, error)
    return false
  }
}

/**
 * 패턴 매칭으로 여러 캐시 삭제
 * 예: invalidateCachePattern('analytics:*')
 */
export async function invalidateCachePattern(pattern: string): Promise<number> {
  const client = getRedisClient()
  if (!client) return 0

  try {
    const keys = await client.keys(pattern)
    if (keys.length === 0) return 0

    await client.del(...keys)
    console.log(`✅ ${keys.length}개 캐시 무효화 완료 (${pattern})`)
    return keys.length
  } catch (error) {
    console.error(`❌ 캐시 무효화 실패 (${pattern}):`, error)
    return 0
  }
}

/**
 * 모든 캐시 삭제
 */
export async function flushAllCache(): Promise<boolean> {
  const client = getRedisClient()
  if (!client) return false

  try {
    await client.flushdb()
    console.log('✅ 모든 캐시 삭제 완료')
    return true
  } catch (error) {
    console.error('❌ 캐시 전체 삭제 실패:', error)
    return false
  }
}

/**
 * 캐시 통계 조회
 */
export async function getCacheStats(): Promise<{
  connected: boolean
  totalKeys: number
  memoryUsage: string
  uptime: number
} | null> {
  const client = getRedisClient()
  if (!client) {
    return {
      connected: false,
      totalKeys: 0,
      memoryUsage: '0B',
      uptime: 0,
    }
  }

  try {
    const dbSize = await client.dbsize()
    const info = await client.info('memory')
    const serverInfo = await client.info('server')

    // 메모리 사용량 파싱
    const memoryMatch = info.match(/used_memory_human:(.*?)\r/)
    const memoryUsage = memoryMatch ? memoryMatch[1] : '0B'

    // 업타임 파싱
    const uptimeMatch = serverInfo.match(/uptime_in_seconds:(\d+)/)
    const uptime = uptimeMatch ? parseInt(uptimeMatch[1]) : 0

    return {
      connected: true,
      totalKeys: dbSize,
      memoryUsage,
      uptime,
    }
  } catch (error) {
    console.error('❌ 캐시 통계 조회 실패:', error)
    return null
  }
}

/**
 * 캐시 래퍼 함수: 캐시가 있으면 반환, 없으면 함수 실행 후 캐싱
 */
export async function withCache<T>(
  key: string,
  fn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  // 캐시 조회
  const cached = await getCache<T>(key)
  if (cached !== null) {
    console.log(`✅ 캐시 히트: ${key}`)
    return cached
  }

  // 캐시 미스: 함수 실행
  console.log(`⚠️  캐시 미스: ${key} (함수 실행)`)
  const result = await fn()

  // 결과 캐싱
  await setCache(key, result, ttlSeconds)

  return result
}

/**
 * TTL 프리셋
 */
export const CacheTTL = {
  SHORT: 60, // 1분
  MEDIUM: 300, // 5분
  LONG: 1800, // 30분
  VERY_LONG: 3600, // 1시간
  DAY: 86400, // 24시간
} as const

/**
 * 캐시 키 생성 헬퍼
 */
export function createCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`
}

// Redis 클라이언트 초기화 (앱 시작 시 자동 실행)
if (process.env.ENABLE_REDIS === 'true') {
  getRedisClient()
}
