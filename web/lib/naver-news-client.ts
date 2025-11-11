/**
 * Naver News API Client (Production Ready)
 *
 * 실제 서비스에서 사용 가능한 안정적인 클라이언트
 * - Exponential backoff retry
 * - Rate limiting
 * - Error handling
 * - Logging
 */

import { naverNewsLimiter } from './rate-limiter'

export interface NaverNewsItem {
  title: string
  originallink: string
  link: string
  description: string
  pubDate: string
}

export interface NaverNewsResponse {
  lastBuildDate: string
  total: number
  start: number
  display: number
  items: NaverNewsItem[]
}

interface FetchOptions {
  query: string
  display?: number  // 10~100 (기본 10)
  start?: number    // 1~1000
  sort?: 'sim' | 'date'  // 정확도순 | 날짜순
}

class NaverNewsClient {
  private readonly clientId: string
  private readonly clientSecret: string
  private readonly baseUrl = 'https://openapi.naver.com/v1/search/news.json'
  private readonly maxRetries = 3

  constructor() {
    this.clientId = process.env.NAVER_CLIENT_ID || ''
    this.clientSecret = process.env.NAVER_CLIENT_SECRET || ''

    if (!this.clientId || !this.clientSecret) {
      console.error('[NaverNewsClient] Missing API credentials')
    }
  }

  /**
   * 뉴스 검색
   * Rate limiter를 통해 안전하게 요청
   */
  async search(options: FetchOptions): Promise<NaverNewsResponse> {
    const { query, display = 10, start = 1, sort = 'date' } = options

    if (!this.clientId || !this.clientSecret) {
      throw new Error('Naver API credentials not configured')
    }

    // Rate limiter를 통해 요청
    return naverNewsLimiter.add(
      () => this.fetchWithRetry({ query, display, start, sort }),
      1 // 사용자 요청은 높은 우선순위
    )
  }

  /**
   * Retry 로직이 포함된 fetch
   */
  private async fetchWithRetry(
    options: FetchOptions,
    attempt = 1
  ): Promise<NaverNewsResponse> {
    try {
      const url = this.buildUrl(options)

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'X-Naver-Client-Id': this.clientId,
          'X-Naver-Client-Secret': this.clientSecret,
        },
      })

      // 429 Too Many Requests
      if (response.status === 429) {
        const error: any = new Error('Rate limit exceeded')
        error.status = 429
        throw error
      }

      // 4xx, 5xx 에러
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()

      // 성공 로그
      console.log(`[NaverNewsClient] Success: "${options.query}" (${data.total} results)`)

      return data

    } catch (error: any) {
      console.error(`[NaverNewsClient] Attempt ${attempt}/${this.maxRetries} failed:`, error.message)

      // 429 에러는 rate limiter가 처리하도록 throw
      if (error.status === 429) {
        throw error
      }

      // 최대 재시도 횟수 도달
      if (attempt >= this.maxRetries) {
        throw new Error(`Failed after ${this.maxRetries} attempts: ${error.message}`)
      }

      // Exponential backoff: 1s, 2s, 4s
      const waitTime = Math.pow(2, attempt - 1) * 1000
      console.log(`[NaverNewsClient] Retrying in ${waitTime}ms...`)
      await this.sleep(waitTime)

      // 재시도
      return this.fetchWithRetry(options, attempt + 1)
    }
  }

  /**
   * URL 생성
   */
  private buildUrl(options: FetchOptions): string {
    const params = new URLSearchParams({
      query: options.query,
      display: options.display?.toString() || '10',
      start: options.start?.toString() || '1',
      sort: options.sort || 'date',
    })

    return `${this.baseUrl}?${params.toString()}`
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Rate limiter 상태 조회
   */
  getStatus() {
    return naverNewsLimiter.getStatus()
  }
}

// 싱글톤 인스턴스
export const naverNewsClient = new NaverNewsClient()
