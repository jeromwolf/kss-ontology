#!/usr/bin/env npx tsx

/**
 * 베이스라인 온톨로지 데이터를 Triple Store에 저장
 *
 * 실행: npx tsx scripts/seed-baseline-triples.ts
 */

import { Pool } from 'pg'
import { KOREAN_COMPANIES } from '../lib/ontology/company-ontology'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://blockmeta@localhost:5432/kss_ontology',
})

async function seedBaselineTriples() {
  console.log('🌱 베이스라인 온톨로지 Triple 저장 시작...\n')

  const client = await pool.connect()
  let totalTriples = 0

  try {
    await client.query('BEGIN')

    for (const company of KOREAN_COMPANIES) {
      console.log(`📊 ${company.name} (${company.uri})`)

      // 1. 경쟁 관계 (competes_with)
      for (const competitorUri of company.competitors) {
        const competitor = KOREAN_COMPANIES.find(c => c.uri === competitorUri)
        if (competitor) {
          await client.query(
            `INSERT INTO knowledge_triples (subject, predicate, object, confidence, source_url, validated_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            [company.uri, 'kss:competes_with', competitorUri, 1.0, 'baseline:hardcoded', 'baseline']
          )
          totalTriples++
          console.log(`  ✓ competes_with ${competitor.name}`)
        }
      }

      // 2. 공급 관계 (supplies_to)
      for (const customerUri of company.customers) {
        const customer = KOREAN_COMPANIES.find(c => c.uri === customerUri)
        if (customer) {
          await client.query(
            `INSERT INTO knowledge_triples (subject, predicate, object, confidence, source_url, validated_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            [company.uri, 'kss:supplies_to', customerUri, 1.0, 'baseline:hardcoded', 'baseline']
          )
          totalTriples++
          console.log(`  ✓ supplies_to ${customer.name}`)
        }
      }

      // 3. 자회사 관계 (subsidiary_of)
      for (const subUri of company.subsidiaries) {
        const subsidiary = KOREAN_COMPANIES.find(c => c.uri === subUri)
        if (subsidiary) {
          await client.query(
            `INSERT INTO knowledge_triples (subject, predicate, object, confidence, source_url, validated_by)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT DO NOTHING`,
            [subUri, 'kss:subsidiary_of', company.uri, 1.0, 'baseline:hardcoded', 'baseline']
          )
          totalTriples++
          console.log(`  ✓ ${subsidiary.name} subsidiary_of ${company.name}`)
        }
      }

      console.log()
    }

    await client.query('COMMIT')
    console.log(`✅ 총 ${totalTriples}개 Triple 저장 완료!\n`)

    // 통계 출력
    const stats = await client.query(`
      SELECT
        COUNT(*) as total_triples,
        COUNT(DISTINCT subject) as unique_subjects,
        COUNT(DISTINCT predicate) as unique_predicates,
        COUNT(DISTINCT object) as unique_objects,
        AVG(confidence) as avg_confidence
      FROM knowledge_triples
    `)

    console.log('📈 온톨로지 통계:')
    console.log(`  - 총 Triple 수: ${stats.rows[0].total_triples}`)
    console.log(`  - 고유 주체 (Subject): ${stats.rows[0].unique_subjects}`)
    console.log(`  - 고유 관계 (Predicate): ${stats.rows[0].unique_predicates}`)
    console.log(`  - 고유 대상 (Object): ${stats.rows[0].unique_objects}`)
    console.log(`  - 평균 신뢰도: ${parseFloat(stats.rows[0].avg_confidence).toFixed(3)}`)

    // 관계 유형별 통계
    const predicateStats = await client.query(`
      SELECT predicate, COUNT(*) as count
      FROM knowledge_triples
      GROUP BY predicate
      ORDER BY count DESC
    `)

    console.log('\n📊 관계 유형별 분포:')
    predicateStats.rows.forEach(row => {
      console.log(`  - ${row.predicate}: ${row.count}개`)
    })

  } catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ 오류 발생:', error)
    throw error
  } finally {
    client.release()
    await pool.end()
  }
}

// 실행
seedBaselineTriples()
  .then(() => {
    console.log('\n✨ 베이스라인 온톨로지 구축 완료!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💥 실패:', error)
    process.exit(1)
  })
