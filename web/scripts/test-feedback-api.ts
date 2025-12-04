#!/usr/bin/env tsx

/**
 * 피드백 API 테스트 스크립트
 */

async function testFeedbackAPI() {
  console.log('🧪 피드백 API 테스트 시작\n')

  const baseUrl = 'http://localhost:3000'

  // 테스트 1: Approve (승인)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 1: Triple 승인 (Approve)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/ontology/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripleId: 50,
        feedback: {
          action: 'approve',
          notes: 'Test approval from script'
        }
      })
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ 승인 성공!')
      console.log('   ID:', data.triple.id)
      console.log('   Subject:', data.triple.subject)
      console.log('   Predicate:', data.triple.predicate)
      console.log('   Object:', data.triple.object)
      console.log('   신뢰도:', `${(data.triple.confidence * 100).toFixed(0)}%`)
      console.log('   검증자:', data.triple.validatedBy)
    } else {
      console.log('❌ 승인 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 2: Adjust (신뢰도 조정)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 2: 신뢰도 조정 (Adjust)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/ontology/feedback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tripleId: 51,
        feedback: {
          action: 'adjust',
          confidence: 0.95,
          notes: 'Adjusted confidence to 95%'
        }
      })
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ 조정 성공!')
      console.log('   ID:', data.triple.id)
      console.log('   신뢰도:', `${(data.triple.confidence * 100).toFixed(0)}%`)
      console.log('   검증자:', data.triple.validatedBy)
    } else {
      console.log('❌ 조정 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  // 테스트 3: 피드백 이력 조회
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('테스트 3: 피드백 이력 조회 (GET)')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  try {
    const response = await fetch(`${baseUrl}/api/ontology/feedback?tripleId=50`)
    const data = await response.json()

    if (response.ok) {
      console.log('✅ 조회 성공!')
      console.log(`   총 피드백 수: ${data.feedback.length}개`)
      data.feedback.forEach((fb: any, i: number) => {
        console.log(`   ${i + 1}. ${fb.action} (신뢰도: ${fb.confidence || 'N/A'}) - ${new Date(fb.created_at).toLocaleString()}`)
      })
    } else {
      console.log('❌ 조회 실패:', data.error)
    }
  } catch (error: any) {
    console.log('❌ 테스트 실패:', error.message)
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅ 모든 테스트 완료!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

// 스크립트 실행
if (require.main === module) {
  testFeedbackAPI()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('테스트 실행 중 오류:', error)
      process.exit(1)
    })
}

export { testFeedbackAPI }
