#!/usr/bin/env tsx

/**
 * 일일 배치 작업: 뉴스 수집 및 Triple 자동 추출
 *
 * 실행 방법:
 * npx tsx scripts/daily-batch-job.ts
 *
 * 작업 내용:
 * 1. 커버 기업 목록 조회 (covered_companies 테이블)
 * 2. 각 기업에 대한 최신 뉴스 검색 (네이버 뉴스 API)
 * 3. 뉴스에서 Triple 자동 추출 (GPT-4o-mini)
 * 4. 추출된 Triple DB 저장 (중복 체크 및 신뢰도 업데이트)
 * 5. 결과 로그 저장
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { Pool } from 'pg'
import { batchExtractTriples } from '../lib/services/triple-extractor'
import { saveTriples } from '../lib/services/ontology-query'

// 환경 변수 로드
config({ path: resolve(__dirname, '../.env.local') })

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

interface CoveredCompany {
  company_uri: string
  company_name: string
  priority: number
}

interface NewsArticle {
  title: string
  description: string
  link: string
  pubDate: string
}

interface BatchResult {
  date: string
  totalCompanies: number
  totalNewsArticles: number
  totalTriplesExtracted: number
  totalTriplesSaved: number
  companiesProcessed: Array<{
    company: string
    newsCount: number
    triplesExtracted: number
    triplesSaved: number
  }>
  errors: Array<{
    company?: string
    error: string
  }>
}

/**
 * 커버 기업 목록 가져오기 (우선순위 순)
 */
async function getCoveredCompanies(): Promise<CoveredCompany[]> {
  const result = await pool.query(`
    SELECT company_uri, company_name, priority
    FROM covered_companies
    WHERE is_active = true
    ORDER BY priority DESC, added_at DESC
  `)
  return result.rows
}

/**
 * 네이버 뉴스 API로 뉴스 검색
 */
async function fetchNewsForCompany(
  companyName: string,
  display: number = 10
): Promise<NewsArticle[]> {
  try {
    const response = await fetch(
      `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(companyName)}&display=${display}&sort=date`,
      {
        headers: {
          'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
          'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error(`Failed to fetch news for ${companyName}:`, error)
    return []
  }
}

/**
 * 뉴스 DB 저장 (중복 체크)
 */
async function saveNewsArticles(
  articles: NewsArticle[],
  companyName: string
): Promise<number> {
  let savedCount = 0

  for (const article of articles) {
    try {
      // 중복 체크 (같은 link가 있으면 스킹)
      const existing = await pool.query(
        'SELECT id FROM news_articles WHERE link = $1',
        [article.link]
      )

      if (existing.rows.length === 0) {
        await pool.query(
          `INSERT INTO news_articles (title, description, link, pub_date, company, processed)
           VALUES ($1, $2, $3, $4, $5, false)`,
          [
            article.title,
            article.description,
            article.link,
            article.pubDate ? new Date(article.pubDate) : new Date(),
            companyName,
          ]
        )
        savedCount++
      }
    } catch (error) {
      console.error(`Failed to save news article ${article.link}:`, error)
    }
  }

  return savedCount
}

/**
 * 메인 배치 작업
 */
async function runDailyBatch(): Promise<BatchResult> {
  const startTime = Date.now()
  console.log('🚀 일일 배치 작업 시작:', new Date().toISOString())

  const result: BatchResult = {
    date: new Date().toISOString(),
    totalCompanies: 0,
    totalNewsArticles: 0,
    totalTriplesExtracted: 0,
    totalTriplesSaved: 0,
    companiesProcessed: [],
    errors: [],
  }

  try {
    // 1. 커버 기업 목록 가져오기
    const companies = await getCoveredCompanies()
    result.totalCompanies = companies.length
    console.log(`\n📋 처리 대상 기업: ${companies.length}개`)

    for (const company of companies) {
      console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
      console.log(`📰 [${company.company_name}] 뉴스 수집 시작...`)

      try {
        // 2. 뉴스 검색
        const newsArticles = await fetchNewsForCompany(company.company_name, 10)
        console.log(`   ✓ 수집된 뉴스: ${newsArticles.length}개`)

        if (newsArticles.length === 0) {
          console.log(`   ⚠️  뉴스가 없습니다. 다음 기업으로 이동합니다.`)
          continue
        }

        result.totalNewsArticles += newsArticles.length

        // 3. 뉴스 DB 저장
        const savedNews = await saveNewsArticles(newsArticles, company.company_name)
        console.log(`   ✓ 새로운 뉴스 저장: ${savedNews}개`)

        // 4. Triple 추출
        console.log(`   🤖 Triple 추출 중...`)
        const triples = await batchExtractTriples(
          newsArticles.map((article) => ({
            title: article.title,
            description: article.description,
            link: article.link,
          }))
        )
        console.log(`   ✓ 추출된 Triple: ${triples.length}개`)
        result.totalTriplesExtracted += triples.length

        // 5. Triple DB 저장
        if (triples.length > 0) {
          const savedTriples = await saveTriples(triples)
          console.log(`   ✓ 저장된 Triple: ${savedTriples}개 (신규/업데이트)`)
          result.totalTriplesSaved += savedTriples

          // 상세 정보 출력
          triples.forEach((triple, i) => {
            console.log(
              `      ${i + 1}. ${triple.subject} → ${triple.predicate} → ${triple.object} (신뢰도: ${(triple.confidence * 100).toFixed(0)}%)`
            )
          })
        }

        // 기업별 결과 저장
        result.companiesProcessed.push({
          company: company.company_name,
          newsCount: newsArticles.length,
          triplesExtracted: triples.length,
          triplesSaved: triples.length,
        })

        // API Rate Limiting 대응: 1초 대기
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error: any) {
        console.error(`   ❌ [${company.company_name}] 오류 발생:`, error.message)
        result.errors.push({
          company: company.company_name,
          error: error.message,
        })
      }
    }
  } catch (error: any) {
    console.error('❌ 배치 작업 중 치명적 오류 발생:', error)
    result.errors.push({
      error: error.message,
    })
  } finally {
    await pool.end()
  }

  const endTime = Date.now()
  const duration = ((endTime - startTime) / 1000).toFixed(2)

  console.log('\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 일일 배치 작업 완료')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`⏱️  소요 시간: ${duration}초`)
  console.log(`📋 처리 기업: ${result.totalCompanies}개`)
  console.log(`📰 수집 뉴스: ${result.totalNewsArticles}개`)
  console.log(`🔗 추출 Triple: ${result.totalTriplesExtracted}개`)
  console.log(`💾 저장 Triple: ${result.totalTriplesSaved}개`)
  console.log(`❌ 오류 발생: ${result.errors.length}개`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  return result
}

// 스크립트 실행
if (require.main === module) {
  runDailyBatch()
    .then((result) => {
      if (result.errors.length > 0) {
        console.error('⚠️  일부 오류가 발생했습니다:')
        result.errors.forEach((err, i) => {
          console.error(`  ${i + 1}. ${err.company || 'General'}: ${err.error}`)
        })
        process.exit(1)
      }
      console.log('✅ 배치 작업이 성공적으로 완료되었습니다!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('❌ 배치 작업 실행 실패:', error)
      process.exit(1)
    })
}

export { runDailyBatch }
