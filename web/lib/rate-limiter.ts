/**
 * Rate Limiter for Naver News API
 *
 * 안전한 요청 간격: 300ms (3.3 req/s)
 * - 네이버 API는 10 req/s에서 429 에러 발생
 * - 보수적으로 3 req/s로 제한하여 안정성 확보
 */

interface QueuedRequest<T> {
  fn: () => Promise<T>
  resolve: (value: T) => void
  reject: (reason: any) => void
  priority: number
  timestamp: number
}

export class RateLimiter {
  private queue: QueuedRequest<any>[] = []
  private processing = false
  private lastRequestTime = 0
  private minInterval: number
  private errorCount = 0
  private currentInterval: number

  constructor(requestsPerSecond: number = 3) {
    this.minInterval = 1000 / requestsPerSecond
    this.currentInterval = this.minInterval
  }

  /**
   * Rate limiter를 통해 요청 추가
   * @param fn 실행할 비동기 함수
   * @param priority 우선순위 (1=highest, 10=lowest)
   */
  async add<T>(fn: () => Promise<T>, priority: number = 5): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        fn,
        resolve,
        reject,
        priority,
        timestamp: Date.now()
      })

      // 우선순위 정렬 (priority 낮을수록 먼저, 같으면 timestamp 빠른 것)
      this.queue.sort((a, b) => {
        if (a.priority !== b.priority) return a.priority - b.priority
        return a.timestamp - b.timestamp
      })

      this.process()
    })
  }

  private async process() {
    if (this.processing) return
    this.processing = true

    while (this.queue.length > 0) {
      const now = Date.now()
      const timeSinceLastRequest = now - this.lastRequestTime

      // 최소 간격 대기
      if (timeSinceLastRequest < this.currentInterval) {
        await this.sleep(this.currentInterval - timeSinceLastRequest)
      }

      const request = this.queue.shift()!

      try {
        const result = await request.fn()
        request.resolve(result)

        // 성공 시 점진적으로 간격 단축 (최소 minInterval까지)
        if (this.errorCount === 0 && this.currentInterval > this.minInterval) {
          this.currentInterval = Math.max(
            this.currentInterval - 10,
            this.minInterval
          )
        }
        this.errorCount = 0

      } catch (error: any) {
        // 429 에러 처리
        if (error?.status === 429 || error?.response?.status === 429) {
          console.warn('[RateLimiter] 429 Too Many Requests - backing off')

          // 간격을 2배로 늘림 (최대 2초)
          this.currentInterval = Math.min(this.currentInterval * 2, 2000)
          this.errorCount++

          // 3회 연속 에러 시 큐 처리 일시 중단
          if (this.errorCount >= 3) {
            console.error('[RateLimiter] Too many 429 errors, pausing for 60s')
            await this.sleep(60000) // 1분 대기
            this.errorCount = 0
            this.currentInterval = this.minInterval * 2 // 재시작 시 느리게
          }

          // 요청 다시 큐에 넣기
          this.queue.unshift(request)
        } else {
          request.reject(error)
        }
      }

      this.lastRequestTime = Date.now()
    }

    this.processing = false
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 현재 큐 상태 조회
   */
  getStatus() {
    return {
      queueLength: this.queue.length,
      processing: this.processing,
      currentInterval: this.currentInterval,
      errorCount: this.errorCount
    }
  }
}

// 전역 인스턴스 (싱글톤)
export const naverNewsLimiter = new RateLimiter(3) // 3 req/s
