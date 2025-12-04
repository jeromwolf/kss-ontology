#!/usr/bin/env tsx

/**
 * Scheduler Daemon
 *
 * PM2와 함께 사용하는 독립 스케줄러 프로세스
 * Next.js 서버와 별도로 실행되어 배치 작업을 관리합니다.
 *
 * 사용법:
 *   npx tsx scripts/scheduler-daemon.ts
 *
 * 또는 PM2로 실행:
 *   pm2 start scripts/pm2.config.js --only kss-scheduler
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// 환경 변수 로드
config({ path: resolve(__dirname, '../.env.local') })

console.log('🚀 KSS Ontology Scheduler Daemon 시작...')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
console.log(`Timezone: Asia/Seoul`)
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

// 스케줄러 임포트 및 초기화
import { scheduler } from '../lib/services/scheduler'

// 스케줄러 초기화
scheduler.initialize()

// Graceful Shutdown
process.on('SIGINT', () => {
  console.log('\n\n🛑 SIGINT 신호 수신. 스케줄러 종료 중...')
  scheduler.stopAll()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n\n🛑 SIGTERM 신호 수신. 스케줄러 종료 중...')
  scheduler.stopAll()
  process.exit(0)
})

// Keep the process running
console.log('✅ 스케줄러가 백그라운드에서 실행 중입니다.')
console.log('   종료하려면 Ctrl+C를 누르세요.\n')
