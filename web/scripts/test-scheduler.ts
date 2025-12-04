#!/usr/bin/env tsx

/**
 * 스케줄러 테스트 스크립트
 *
 * 실행 방법:
 * npx tsx scripts/test-scheduler.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// 환경 변수 로드
config({ path: resolve(__dirname, '../.env.local') })

async function testScheduler() {
  console.log('🧪 스케줄러 테스트 시작\n')

  const baseUrl = 'http://localhost:3000'

  // 테스트 1: 스케줄러 초기화
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 1: 스케줄러 초기화')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/scheduler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'initialize' }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ 초기화 성공!')
      console.log('   메시지:', data.message)
    } else {
      console.log('❌ 초기화 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 2: 스케줄러 상태 조회
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 2: 스케줄러 상태 조회')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/scheduler`)
    const data = await response.json()

    if (response.ok) {
      console.log('✅ 조회 성공!')
      console.log(`   등록된 작업: ${data.jobs.length}개`)

      data.jobs.forEach((job: any) => {
        console.log(`\n   [${job.name}]`)
        console.log(`      상태: ${job.enabled ? '활성' : '비활성'}`)
        console.log(`      스케줄: ${job.schedule}`)
        console.log(
          `      마지막 실행: ${job.lastRun ? new Date(job.lastRun).toLocaleString('ko-KR') : '없음'}`
        )
        console.log(
          `      다음 실행: ${job.nextRun ? new Date(job.nextRun).toLocaleString('ko-KR') : '없음'}`
        )
      })
    } else {
      console.log('❌ 조회 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 3: 특정 작업 상태 조회
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 3: 특정 작업 상태 조회 (daily-batch)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/scheduler?job=daily-batch`)
    const data = await response.json()

    if (response.ok) {
      console.log('✅ 조회 성공!')
      const job = data.jobs
      if (job) {
        console.log(`   이름: ${job.name}`)
        console.log(`   상태: ${job.enabled ? '활성' : '비활성'}`)
        console.log(`   스케줄: ${job.schedule}`)
      } else {
        console.log('   ⚠️  작업을 찾을 수 없습니다.')
      }
    } else {
      console.log('❌ 조회 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 4: 작업 활성화
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 4: 작업 활성화 (health-check)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/scheduler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggle',
        jobName: 'health-check',
        enabled: true,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ 활성화 성공!')
      console.log('   메시지:', data.message)
    } else {
      console.log('❌ 활성화 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 5초 대기
  console.log('\n⏳ 5초 대기 중 (헬스 체크 실행 확인)...')
  await new Promise((resolve) => setTimeout(resolve, 5000))

  // 테스트 5: 작업 비활성화
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 5: 작업 비활성화 (health-check)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/scheduler`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'toggle',
        jobName: 'health-check',
        enabled: false,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ 비활성화 성공!')
      console.log('   메시지:', data.message)
    } else {
      console.log('❌ 비활성화 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 6: 수동 작업 실행 (주의: 실제 배치 작업 실행)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 6: 수동 작업 실행 (건너뛰기 - 실제 실행은 위험)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⏭️  실제 배치 작업 실행은 생략합니다.')
  console.log('   실행하려면 다음 명령어를 사용하세요:')
  console.log('   curl -X POST http://localhost:3000/api/scheduler \\')
  console.log('     -H "Content-Type: application/json" \\')
  console.log('     -d \'{"action":"run","jobName":"daily-batch"}\'')

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ 모든 테스트 완료!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

// 스크립트 실행
if (require.main === module) {
  testScheduler()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('테스트 실행 중 오류:', error)
      process.exit(1)
    })
}

export { testScheduler }
