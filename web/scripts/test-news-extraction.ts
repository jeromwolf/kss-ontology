#!/usr/bin/env npx tsx

/**
 * 실제 뉴스에서 Triple 추출 테스트
 *
 * 실행: npx tsx scripts/test-news-extraction.ts
 */

import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { naverNewsClient } from '../lib/naver-news-client'
import { batchExtractTriples } from '../lib/services/triple-extractor'
import { saveTriples, getOntologyStats } from '../lib/services/ontology-query'

async function testNewsExtraction() {
  console.log('📰 실제 뉴스에서 Triple 추출 테스트\n')

  // 1. 기존 통계 확인
  console.log('📊 [Before] 현재 온톨로지 통계:')
  const statsBefore = await getOntologyStats()
  console.log(`  - 총 Triple 수: ${statsBefore.totalTriples}`)
  console.log(`  - 고신뢰도 Triple: ${statsBefore.highConfidenceTriples}`)
  console.log(`  - 평균 신뢰도: ${statsBefore.avgConfidence.toFixed(3)}\n`)

  // 2. 테스트 회사 선택
  const testCompany = '삼성전자'
  console.log(`🔍 "${testCompany}" 관련 뉴스 검색 중...\n`)

  // 3. 뉴스 가져오기
  const newsResponse = await naverNewsClient.search({ query: testCompany, display: 5 })
  const news = newsResponse.items
  console.log(`✅ ${news.length}개 뉴스 기사 발견 (총 ${newsResponse.total}개)\n`)

  news.forEach((article, idx) => {
    console.log(`[${idx + 1}] ${article.title}`)
    console.log(`    ${article.description}`)
    console.log(`    ${article.link}\n`)
  })

  // 4. Triple 추출
  console.log('🤖 GPT-4o-mini로 Triple 추출 중...\n')
  const triples = await batchExtractTriples(
    news.map(article => ({
      title: article.title,
      description: article.description,
      link: article.link
    }))
  )

  console.log(`✅ ${triples.length}개 Triple 추출 완료!\n`)

  // 5. 추출된 Triple 출력
  if (triples.length > 0) {
    console.log('📋 추출된 Triple 목록:')
    triples.forEach((triple, idx) => {
      console.log(`\n[${idx + 1}] ${triple.subject} --[${triple.predicate}]--> ${triple.object}`)
      console.log(`    신뢰도: ${(triple.confidence * 100).toFixed(1)}%`)
      console.log(`    검증 상태: ${triple.validatedBy === 'baseline' ? '✅ 검증됨' : '🔄 GPT 추정'}`)
      console.log(`    출처: ${triple.source}`)
    })

    // 6. DB에 저장
    console.log('\n\n💾 Triple을 데이터베이스에 저장 중...')
    const savedCount = await saveTriples(triples)
    console.log(`✅ ${savedCount}개 Triple 저장 완료!\n`)

    // 7. 업데이트된 통계 확인
    console.log('📊 [After] 업데이트된 온톨로지 통계:')
    const statsAfter = await getOntologyStats()
    console.log(`  - 총 Triple 수: ${statsAfter.totalTriples} (+${statsAfter.totalTriples - statsBefore.totalTriples})`)
    console.log(`  - 고신뢰도 Triple: ${statsAfter.highConfidenceTriples}`)
    console.log(`  - 평균 신뢰도: ${statsAfter.avgConfidence.toFixed(3)}`)

    // 8. 신뢰도 분포 분석
    const baselineCount = triples.filter(t => t.validatedBy === 'baseline').length
    const gptCount = triples.filter(t => t.validatedBy === 'gpt').length

    console.log('\n📈 신뢰도 분포:')
    console.log(`  - Baseline (검증됨): ${baselineCount}개 (100% 신뢰도)`)
    console.log(`  - GPT 추정: ${gptCount}개 (≤85% 신뢰도)`)
  } else {
    console.log('⚠️  추출된 Triple이 없습니다.')
  }

  console.log('\n✨ 테스트 완료!')
}

// 실행
testNewsExtraction()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('💥 오류 발생:', error)
    process.exit(1)
  })
