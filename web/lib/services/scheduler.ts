/**
 * Job Scheduler Service
 *
 * 배치 작업 스케줄링 및 관리
 * - 일일 뉴스 수집 및 Triple 추출
 * - 주간 데이터 재평가
 * - 월간 아카이빙
 */

import cron, { ScheduledTask } from 'node-cron'
import { runDailyBatch } from '../../scripts/daily-batch-job'
import { sendNotification } from './notification'

interface ScheduledJob {
  name: string
  schedule: string
  task: ScheduledTask
  enabled: boolean
  lastRun?: Date
  nextRun?: Date
}

class JobScheduler {
  private jobs: Map<string, ScheduledJob> = new Map()
  private isInitialized: boolean = false

  /**
   * 스케줄러 초기화
   */
  initialize() {
    if (this.isInitialized) {
      console.log('⚠️  스케줄러가 이미 초기화되어 있습니다.')
      return
    }

    console.log('🚀 Job Scheduler 초기화 중...')

    // 1. 일일 배치 작업 (매일 오전 9시)
    this.addJob({
      name: 'daily-batch',
      schedule: '0 9 * * *',
      handler: this.runDailyBatchJob.bind(this),
      enabled: process.env.ENABLE_DAILY_BATCH === 'true',
    })

    // 2. 주간 Triple 재평가 (매주 일요일 오전 3시)
    this.addJob({
      name: 'weekly-reevaluation',
      schedule: '0 3 * * 0',
      handler: this.runWeeklyReevaluation.bind(this),
      enabled: process.env.ENABLE_WEEKLY_REEVALUATION === 'true',
    })

    // 3. 월간 데이터 아카이빙 (매월 1일 오전 2시)
    this.addJob({
      name: 'monthly-archiving',
      schedule: '0 2 1 * *',
      handler: this.runMonthlyArchiving.bind(this),
      enabled: process.env.ENABLE_MONTHLY_ARCHIVING === 'true',
    })

    // 4. 헬스 체크 (5분마다)
    this.addJob({
      name: 'health-check',
      schedule: '*/5 * * * *',
      handler: this.runHealthCheck.bind(this),
      enabled: process.env.ENABLE_HEALTH_CHECK === 'true',
    })

    this.isInitialized = true
    console.log(`✅ 스케줄러 초기화 완료 (${this.jobs.size}개 작업 등록)`)
    this.printSchedule()
  }

  /**
   * 작업 추가
   */
  private addJob(config: {
    name: string
    schedule: string
    handler: () => Promise<void>
    enabled: boolean
  }) {
    const { name, schedule, handler, enabled } = config

    // Cron 유효성 검증
    if (!cron.validate(schedule)) {
      console.error(`❌ 잘못된 cron 표현식: ${schedule} (작업: ${name})`)
      return
    }

    const task = cron.schedule(
      schedule,
      async () => {
        const job = this.jobs.get(name)
        if (!job || !job.enabled) return

        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
        console.log(`🔄 [${name}] 작업 시작: ${new Date().toISOString()}`)
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`)

        const startTime = Date.now()

        try {
          await handler()

          const duration = ((Date.now() - startTime) / 1000).toFixed(2)
          console.log(`\n✅ [${name}] 작업 완료 (소요 시간: ${duration}초)`)

          // 작업 완료 알림
          await sendNotification({
            type: 'job_success',
            title: `[${name}] 작업 완료`,
            message: `소요 시간: ${duration}초`,
            timestamp: new Date(),
          })

          // 마지막 실행 시간 업데이트
          if (job) {
            job.lastRun = new Date()
          }
        } catch (error: any) {
          const duration = ((Date.now() - startTime) / 1000).toFixed(2)
          console.error(`\n❌ [${name}] 작업 실패 (소요 시간: ${duration}초)`)
          console.error('오류:', error.message)

          // 작업 실패 알림
          await sendNotification({
            type: 'job_failure',
            title: `[${name}] 작업 실패`,
            message: error.message,
            timestamp: new Date(),
            error: error.stack,
          })
        }
      },
      {
        timezone: 'Asia/Seoul',
      }
    )

    this.jobs.set(name, {
      name,
      schedule,
      task,
      enabled,
      lastRun: undefined,
      nextRun: this.getNextRunTime(schedule),
    })

    if (enabled) {
      task.start()
      console.log(`  ✓ [${name}] 스케줄 등록: ${schedule}`)
    } else {
      console.log(`  ○ [${name}] 비활성화됨: ${schedule}`)
    }
  }

  /**
   * 일일 배치 작업 실행
   */
  private async runDailyBatchJob() {
    console.log('📰 일일 뉴스 수집 및 Triple 추출 시작...')
    await runDailyBatch()
  }

  /**
   * 주간 Triple 재평가
   */
  private async runWeeklyReevaluation() {
    console.log('🔄 주간 Triple 재평가 시작...')
    // TODO: 구현 예정
    // - 저신뢰도 Triple 재검증
    // - 오래된 Triple 신뢰도 감소
    // - 중복 Triple 병합
  }

  /**
   * 월간 데이터 아카이빙
   */
  private async runMonthlyArchiving() {
    console.log('📦 월간 데이터 아카이빙 시작...')
    // TODO: 구현 예정
    // - 90일 이상 된 뉴스 아카이빙
    // - 삭제된 Triple 로그 정리
    // - 데이터베이스 최적화
  }

  /**
   * 헬스 체크
   */
  private async runHealthCheck() {
    // 헬스 체크는 조용히 실행
    const { Pool } = await import('pg')
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    try {
      await pool.query('SELECT 1')
      // DB 연결 정상
    } catch (error: any) {
      console.error('❌ 헬스 체크 실패:', error.message)
      await sendNotification({
        type: 'system_error',
        title: '시스템 헬스 체크 실패',
        message: 'Database 연결 오류',
        timestamp: new Date(),
        error: error.message,
      })
    } finally {
      await pool.end()
    }
  }

  /**
   * 작업 수동 실행
   */
  async runJobManually(jobName: string) {
    const job = this.jobs.get(jobName)
    if (!job) {
      throw new Error(`작업을 찾을 수 없습니다: ${jobName}`)
    }

    console.log(`\n🔧 [${jobName}] 수동 실행 시작...`)
    const startTime = Date.now()

    try {
      // 작업 핸들러 직접 실행
      const handlers: Record<string, () => Promise<void>> = {
        'daily-batch': this.runDailyBatchJob.bind(this),
        'weekly-reevaluation': this.runWeeklyReevaluation.bind(this),
        'monthly-archiving': this.runMonthlyArchiving.bind(this),
        'health-check': this.runHealthCheck.bind(this),
      }

      const handler = handlers[jobName]
      if (handler) {
        await handler()
      }

      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      console.log(`✅ [${jobName}] 수동 실행 완료 (소요 시간: ${duration}초)`)
    } catch (error: any) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2)
      console.error(`❌ [${jobName}] 수동 실행 실패 (소요 시간: ${duration}초)`)
      console.error('오류:', error.message)
      throw error
    }
  }

  /**
   * 작업 활성화/비활성화
   */
  toggleJob(jobName: string, enabled: boolean) {
    const job = this.jobs.get(jobName)
    if (!job) {
      throw new Error(`작업을 찾을 수 없습니다: ${jobName}`)
    }

    if (enabled && !job.enabled) {
      job.task.start()
      job.enabled = true
      console.log(`✅ [${jobName}] 활성화됨`)
    } else if (!enabled && job.enabled) {
      job.task.stop()
      job.enabled = false
      console.log(`⏸️  [${jobName}] 비활성화됨`)
    }
  }

  /**
   * 모든 작업 중지
   */
  stopAll() {
    console.log('🛑 모든 스케줄 작업 중지 중...')
    this.jobs.forEach((job) => {
      if (job.enabled) {
        job.task.stop()
        job.enabled = false
      }
    })
    console.log('✅ 모든 작업이 중지되었습니다.')
  }

  /**
   * 스케줄 출력
   */
  printSchedule() {
    console.log('\n📅 등록된 스케줄 작업:\n')
    this.jobs.forEach((job) => {
      const status = job.enabled ? '✓ 활성' : '○ 비활성'
      const lastRun = job.lastRun
        ? job.lastRun.toLocaleString('ko-KR')
        : '없음'
      const nextRun = job.nextRun
        ? job.nextRun.toLocaleString('ko-KR')
        : '없음'

      console.log(`  ${status} [${job.name}]`)
      console.log(`     스케줄: ${job.schedule}`)
      console.log(`     마지막 실행: ${lastRun}`)
      console.log(`     다음 실행: ${nextRun}`)
      console.log()
    })
  }

  /**
   * 작업 상태 조회
   */
  getJobStatus(jobName?: string) {
    if (jobName) {
      const job = this.jobs.get(jobName)
      if (!job) return null

      return {
        name: job.name,
        schedule: job.schedule,
        enabled: job.enabled,
        lastRun: job.lastRun,
        nextRun: job.nextRun,
      }
    }

    // 모든 작업 상태 반환
    return Array.from(this.jobs.values()).map((job) => ({
      name: job.name,
      schedule: job.schedule,
      enabled: job.enabled,
      lastRun: job.lastRun,
      nextRun: job.nextRun,
    }))
  }

  /**
   * 다음 실행 시간 계산 (간단한 추정)
   */
  private getNextRunTime(schedule: string): Date {
    // TODO: 정확한 다음 실행 시간 계산 로직 구현
    // 현재는 대략적인 시간만 반환
    const now = new Date()

    // Cron 표현식 파싱 (간단한 버전)
    const [minute, hour, dayOfMonth, month, dayOfWeek] = schedule.split(' ')

    if (schedule === '0 9 * * *') {
      // 매일 오전 9시
      const next = new Date(now)
      next.setHours(9, 0, 0, 0)
      if (next <= now) {
        next.setDate(next.getDate() + 1)
      }
      return next
    }

    // 기본: 1시간 후
    const next = new Date(now)
    next.setHours(next.getHours() + 1)
    return next
  }
}

// 싱글톤 인스턴스
export const scheduler = new JobScheduler()

// 서버 시작 시 스케줄러 초기화
if (process.env.NODE_ENV !== 'test') {
  // 환경 변수 기본값 설정
  process.env.ENABLE_DAILY_BATCH = process.env.ENABLE_DAILY_BATCH || 'false'
  process.env.ENABLE_WEEKLY_REEVALUATION = process.env.ENABLE_WEEKLY_REEVALUATION || 'false'
  process.env.ENABLE_MONTHLY_ARCHIVING = process.env.ENABLE_MONTHLY_ARCHIVING || 'false'
  process.env.ENABLE_HEALTH_CHECK = process.env.ENABLE_HEALTH_CHECK || 'false'
}
