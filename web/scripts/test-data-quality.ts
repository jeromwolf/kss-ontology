#!/usr/bin/env tsx

/**
 * 데이터 품질 관리 API 테스트 스크립트
 *
 * 실행 방법:
 * npx tsx scripts/test-data-quality.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'

// 환경 변수 로드
config({ path: resolve(__dirname, '../.env.local') })

async function testDataQuality() {
  console.log('🧪 데이터 품질 관리 API 테스트 시작\n')

  const baseUrl = 'http://localhost:3000'

  // 테스트 1: 품질 검사 실행
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 1: 데이터 품질 검사 실행')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/quality`)
    const data = await response.json()

    if (response.ok) {
      console.log('✅ 품질 검사 성공!')
      console.log(`   총 이슈: ${data.report.totalIssues}개`)
      console.log(`   검사 시간: ${new Date(data.report.timestamp).toLocaleString('ko-KR')}`)

      console.log('\n   이슈 타입별:')
      Object.entries(data.report.issuesByType).forEach(([type, count]) => {
        console.log(`      ${type}: ${count}개`)
      })

      if (data.report.issues.length > 0) {
        console.log('\n   상위 5개 이슈:')
        data.report.issues.slice(0, 5).forEach((issue: any, idx: number) => {
          console.log(`      ${idx + 1}. [${issue.severity}] ${issue.description}`)
        })
      }

      if (data.report.recommendations.length > 0) {
        console.log('\n   권장사항:')
        data.report.recommendations.forEach((rec: string) => {
          console.log(`      • ${rec}`)
        })
      }
    } else {
      console.log('❌ 품질 검사 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 2: 분석 API 호출 (비교)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 2: Analytics API 호출 (시스템 통계)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/analytics?period=7d`)
    const data = await response.json()

    if (response.ok) {
      console.log('✅ Analytics 조회 성공!')
      console.log(`   총 Triple 수: ${data.data.triples.total}개`)
      console.log(`   평균 신뢰도: ${(data.data.triples.confidence.avg * 100).toFixed(1)}%`)

      console.log('\n   신뢰도별 분포:')
      console.log(`      매우 높음 (≥0.9): ${data.data.triples.byConfidence.veryHigh}개`)
      console.log(`      높음 (0.8-0.9): ${data.data.triples.byConfidence.high}개`)
      console.log(`      중간 (0.7-0.8): ${data.data.triples.byConfidence.medium}개`)
      console.log(`      낮음 (<0.7): ${data.data.triples.byConfidence.low}개`)

      console.log('\n   검증 방법별:')
      console.log(`      Baseline: ${data.data.triples.byValidation.baseline}개`)
      console.log(`      GPT: ${data.data.triples.byValidation.gpt}개`)
      console.log(`      User: ${data.data.triples.byValidation.user}개`)

      if (data.data.relationTypes.length > 0) {
        console.log('\n   상위 관계 타입:')
        data.data.relationTypes.slice(0, 5).forEach((rel: any) => {
          console.log(`      ${rel.type}: ${rel.count}개 (평균 ${(rel.avgConfidence * 100).toFixed(0)}%)`)
        })
      }
    } else {
      console.log('❌ Analytics 조회 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 3: 품질 개선 작업 안내 (실제 실행 안함)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 3: 품질 개선 작업 (실행 안내)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('⏭️  실제 품질 개선 작업은 생략합니다.')
  console.log('   다음 명령어로 실행 가능합니다:\n')

  console.log('   1. 중복 Triple 병합:')
  console.log('   curl -X POST http://localhost:3000/api/quality \\')
  console.log('     -H "Content-Type: application/json" \\')
  console.log('     -d \'{"action":"merge-duplicates","tripleIds":[1,2,3]}\'\n')

  console.log('   2. 저신뢰도 Triple 삭제 (threshold: 0.3):')
  console.log('   curl -X POST http://localhost:3000/api/quality \\')
  console.log('     -H "Content-Type: application/json" \\')
  console.log('     -d \'{"action":"delete-low-confidence","threshold":0.3}\'\n')

  console.log('   3. 오래된 Triple 신뢰도 감소 (90일, 10%):')
  console.log('   curl -X POST http://localhost:3000/api/quality \\')
  console.log('     -H "Content-Type: application/json" \\')
  console.log('     -d \'{"action":"decay-outdated","daysThreshold":90,"decayRate":0.1}\'')

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ 모든 테스트 완료!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

// 스크립트 실행
if (require.main === module) {
  testDataQuality()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('테스트 실행 중 오류:', error)
      process.exit(1)
    })
}

export { testDataQuality }
