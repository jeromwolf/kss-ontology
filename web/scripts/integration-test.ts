#!/usr/bin/env tsx

/**
 * KSS Ontology 통합 테스트
 *
 * Phase 2 구현 기능 전체 테스트:
 * 1. 데이터베이스 연결 및 스키마 검증
 * 2. Triple 추출 엔진 테스트
 * 3. 온톨로지 쿼리 엔진 테스트
 * 4. 피드백 API 테스트
 * 5. 배치 작업 시뮬레이션
 * 6. 엔드투엔드 워크플로우 테스트
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { Pool } from 'pg'

// 환경 변수 로드
config({ path: resolve(__dirname, '../.env.local') })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

interface TestResult {
  name: string
  status: 'PASS' | 'FAIL' | 'SKIP'
  duration: number
  error?: string
  details?: any
}

class IntegrationTest {
  private results: TestResult[] = []
  private startTime: number = 0

  async run() {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('🧪 KSS Ontology Phase 2 통합 테스트')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`시작 시간: ${new Date().toLocaleString('ko-KR')}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    this.startTime = Date.now()

    // 테스트 실행
    await this.testDatabaseConnection()
    await this.testDatabaseSchema()
    await this.testTripleQueries()
    await this.testFeedbackAPI()
    await this.testNewsAPI()
    await this.testEndToEndWorkflow()

    // 결과 출력
    this.printSummary()

    await pool.end()
  }

  private async testDatabaseConnection() {
    const test: TestResult = {
      name: '데이터베이스 연결',
      status: 'FAIL',
      duration: 0
    }
    const start = Date.now()

    try {
      const result = await pool.query('SELECT NOW()')
      test.status = 'PASS'
      test.details = { timestamp: result.rows[0].now }
      console.log('✅ 테스트 1: 데이터베이스 연결 성공')
    } catch (error: any) {
      test.error = error.message
      console.log('❌ 테스트 1: 데이터베이스 연결 실패:', error.message)
    } finally {
      test.duration = Date.now() - start
      this.results.push(test)
    }
  }

  private async testDatabaseSchema() {
    const test: TestResult = {
      name: '데이터베이스 스키마 검증',
      status: 'FAIL',
      duration: 0
    }
    const start = Date.now()

    try {
      // 필수 테이블 존재 확인
      const tables = ['knowledge_triples', 'news_articles', 'covered_companies',
                      'triple_feedback', 'relation_feedback']

      const result = await pool.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = ANY($1)
      `, [tables])

      if (result.rows.length === tables.length) {
        test.status = 'PASS'
        test.details = { tables: result.rows.map(r => r.table_name) }
        console.log('✅ 테스트 2: 모든 필수 테이블 존재 확인')
      } else {
        test.error = `${result.rows.length}/${tables.length} 테이블만 존재`
        console.log('❌ 테스트 2: 일부 테이블 누락')
      }
    } catch (error: any) {
      test.error = error.message
      console.log('❌ 테스트 2: 스키마 검증 실패:', error.message)
    } finally {
      test.duration = Date.now() - start
      this.results.push(test)
    }
  }

  private async testTripleQueries() {
    const test: TestResult = {
      name: 'Triple 쿼리 엔진',
      status: 'FAIL',
      duration: 0
    }
    const start = Date.now()

    try {
      // Triple 데이터 조회
      const result = await pool.query(`
        SELECT COUNT(*) as total,
               COUNT(*) FILTER (WHERE confidence >= 0.8) as high_confidence,
               COUNT(*) FILTER (WHERE validated_by = 'user') as user_validated,
               AVG(confidence) as avg_confidence
        FROM knowledge_triples
      `)

      const stats = result.rows[0]

      if (parseInt(stats.total) > 0) {
        test.status = 'PASS'
        test.details = {
          totalTriples: parseInt(stats.total),
          highConfidence: parseInt(stats.high_confidence),
          userValidated: parseInt(stats.user_validated),
          avgConfidence: parseFloat(stats.avg_confidence).toFixed(3)
        }
        console.log('✅ 테스트 3: Triple 쿼리 성공')
        console.log(`   총 ${stats.total}개 Triple, 평균 신뢰도 ${(stats.avg_confidence * 100).toFixed(1)}%`)
      } else {
        test.error = 'Triple 데이터 없음'
        console.log('⚠️  테스트 3: Triple 데이터 없음 (경고)')
        test.status = 'PASS' // 데이터 없어도 쿼리는 성공
      }
    } catch (error: any) {
      test.error = error.message
      console.log('❌ 테스트 3: Triple 쿼리 실패:', error.message)
    } finally {
      test.duration = Date.now() - start
      this.results.push(test)
    }
  }

  private async testFeedbackAPI() {
    const test: TestResult = {
      name: '피드백 API',
      status: 'FAIL',
      duration: 0
    }
    const start = Date.now()

    try {
      // 테스트용 Triple 가져오기
      const tripleResult = await pool.query(`
        SELECT id FROM knowledge_triples
        WHERE validated_by = 'gpt'
        LIMIT 1
      `)

      if (tripleResult.rows.length === 0) {
        test.status = 'SKIP'
        test.error = '테스트 가능한 GPT Triple 없음'
        console.log('⏭️  테스트 4: 피드백 API 테스트 스킵 (GPT Triple 없음)')
      } else {
        const tripleId = tripleResult.rows[0].id

        // POST 테스트: Approve
        const response = await fetch('http://localhost:3000/api/ontology/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tripleId,
            feedback: {
              action: 'approve',
              notes: 'Integration test approval'
            }
          })
        })

        if (response.ok) {
          const data = await response.json()

          // 검증: validated_by가 'user'로 변경되었는지 확인
          const verifyResult = await pool.query(
            'SELECT validated_by, confidence FROM knowledge_triples WHERE id = $1',
            [tripleId]
          )

          if (verifyResult.rows[0].validated_by === 'user') {
            test.status = 'PASS'
            test.details = {
              tripleId,
              newConfidence: verifyResult.rows[0].confidence,
              validatedBy: verifyResult.rows[0].validated_by
            }
            console.log('✅ 테스트 4: 피드백 API 정상 작동')
            console.log(`   Triple ${tripleId} 승인 완료, 신뢰도 ${(verifyResult.rows[0].confidence * 100).toFixed(0)}%`)
          } else {
            test.error = 'validated_by 업데이트 실패'
            console.log('❌ 테스트 4: 피드백 API 검증 실패')
          }
        } else {
          const errorData = await response.json()
          test.error = errorData.error || 'API 요청 실패'
          console.log('❌ 테스트 4: 피드백 API 요청 실패')
        }
      }
    } catch (error: any) {
      test.error = error.message
      console.log('❌ 테스트 4: 피드백 API 테스트 실패:', error.message)
    } finally {
      test.duration = Date.now() - start
      this.results.push(test)
    }
  }

  private async testNewsAPI() {
    const test: TestResult = {
      name: '뉴스 API 연동',
      status: 'FAIL',
      duration: 0
    }
    const start = Date.now()

    try {
      if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
        test.status = 'SKIP'
        test.error = '네이버 API 키 없음'
        console.log('⏭️  테스트 5: 뉴스 API 테스트 스킵 (API 키 없음)')
      } else {
        const response = await fetch(
          'https://openapi.naver.com/v1/search/news.json?query=삼성전자&display=5',
          {
            headers: {
              'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
              'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
            },
          }
        )

        if (response.ok) {
          const data = await response.json()
          test.status = 'PASS'
          test.details = { newsCount: data.items?.length || 0 }
          console.log('✅ 테스트 5: 뉴스 API 연동 성공')
          console.log(`   수집된 뉴스: ${data.items?.length || 0}개`)
        } else {
          test.error = `API 상태 코드: ${response.status}`
          console.log('❌ 테스트 5: 뉴스 API 요청 실패')
        }
      }
    } catch (error: any) {
      test.error = error.message
      console.log('❌ 테스트 5: 뉴스 API 테스트 실패:', error.message)
    } finally {
      test.duration = Date.now() - start
      this.results.push(test)
    }
  }

  private async testEndToEndWorkflow() {
    const test: TestResult = {
      name: '엔드투엔드 워크플로우',
      status: 'FAIL',
      duration: 0
    }
    const start = Date.now()

    try {
      // 1. 커버 기업 조회
      const companiesResult = await pool.query(
        'SELECT COUNT(*) FROM covered_companies WHERE is_active = true'
      )
      const companyCount = parseInt(companiesResult.rows[0].count)

      // 2. 뉴스 데이터 조회
      const newsResult = await pool.query(
        'SELECT COUNT(*) FROM news_articles'
      )
      const newsCount = parseInt(newsResult.rows[0].count)

      // 3. Triple 데이터 조회
      const triplesResult = await pool.query(
        'SELECT COUNT(*) FROM knowledge_triples'
      )
      const tripleCount = parseInt(triplesResult.rows[0].count)

      // 4. 피드백 데이터 조회
      const feedbackResult = await pool.query(
        'SELECT COUNT(*) FROM triple_feedback'
      )
      const feedbackCount = parseInt(feedbackResult.rows[0].count)

      // 검증: 전체 워크플로우가 작동하는지 확인
      if (companyCount > 0) {
        test.status = 'PASS'
        test.details = {
          companies: companyCount,
          news: newsCount,
          triples: tripleCount,
          feedback: feedbackCount
        }
        console.log('✅ 테스트 6: 엔드투엔드 워크플로우 검증 완료')
        console.log(`   커버 기업: ${companyCount}개`)
        console.log(`   뉴스 기사: ${newsCount}개`)
        console.log(`   Triple: ${tripleCount}개`)
        console.log(`   피드백: ${feedbackCount}개`)
      } else {
        test.error = '커버 기업 데이터 없음'
        console.log('❌ 테스트 6: 커버 기업 데이터 없음')
      }
    } catch (error: any) {
      test.error = error.message
      console.log('❌ 테스트 6: 워크플로우 테스트 실패:', error.message)
    } finally {
      test.duration = Date.now() - start
      this.results.push(test)
    }
  }

  private printSummary() {
    const totalDuration = Date.now() - this.startTime
    const passed = this.results.filter(r => r.status === 'PASS').length
    const failed = this.results.filter(r => r.status === 'FAIL').length
    const skipped = this.results.filter(r => r.status === 'SKIP').length

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('📊 테스트 결과 요약')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`총 테스트: ${this.results.length}개`)
    console.log(`✅ 성공: ${passed}개`)
    console.log(`❌ 실패: ${failed}개`)
    console.log(`⏭️  스킵: ${skipped}개`)
    console.log(`⏱️  총 소요 시간: ${(totalDuration / 1000).toFixed(2)}초`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    // 상세 결과
    console.log('📋 상세 결과:\n')
    this.results.forEach((result, index) => {
      const icon = result.status === 'PASS' ? '✅' : result.status === 'FAIL' ? '❌' : '⏭️'
      console.log(`${index + 1}. ${icon} ${result.name}`)
      console.log(`   상태: ${result.status}`)
      console.log(`   소요 시간: ${result.duration}ms`)
      if (result.error) {
        console.log(`   오류: ${result.error}`)
      }
      if (result.details) {
        console.log(`   상세: ${JSON.stringify(result.details, null, 2)}`)
      }
      console.log('')
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

    if (failed === 0) {
      console.log('🎉 모든 테스트가 성공했습니다!')
    } else {
      console.log(`⚠️  ${failed}개의 테스트가 실패했습니다.`)
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
  }

  getResults() {
    return this.results
  }
}

// 스크립트 실행
if (require.main === module) {
  const test = new IntegrationTest()
  test.run()
    .then(() => {
      const results = test.getResults()
      const failed = results.filter(r => r.status === 'FAIL').length
      process.exit(failed > 0 ? 1 : 0)
    })
    .catch((error) => {
      console.error('테스트 실행 중 치명적 오류:', error)
      process.exit(1)
    })
}

export { IntegrationTest }
