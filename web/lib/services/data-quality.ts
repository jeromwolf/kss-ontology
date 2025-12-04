/**
 * Data Quality Management Service
 *
 * 데이터 품질 관리:
 * - 중복 Triple 감지 및 병합
 * - 모순 관계 감지
 * - 저신뢰도 Triple 자동 처리
 * - 오래된 데이터 관리
 */

import { Pool } from 'pg'
import { notifyDataQualityIssue } from './notification'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export interface QualityIssue {
  type: 'duplicate' | 'contradiction' | 'low_confidence' | 'outdated'
  severity: 'high' | 'medium' | 'low'
  description: string
  tripleIds: number[]
  details: any
}

export interface QualityReport {
  timestamp: Date
  totalIssues: number
  issuesByType: Record<string, number>
  issues: QualityIssue[]
  recommendations: string[]
}

/**
 * 전체 데이터 품질 검사 실행
 */
export async function runQualityCheck(): Promise<QualityReport> {
  console.log('🔍 데이터 품질 검사 시작...')

  const issues: QualityIssue[] = []

  // 1. 중복 Triple 감지
  const duplicates = await findDuplicateTriples()
  issues.push(...duplicates)

  // 2. 모순 관계 감지
  const contradictions = await findContradictions()
  issues.push(...contradictions)

  // 3. 저신뢰도 Triple 감지
  const lowConfidence = await findLowConfidenceTriples()
  issues.push(...lowConfidence)

  // 4. 오래된 데이터 감지
  const outdated = await findOutdatedTriples()
  issues.push(...outdated)

  // 이슈 타입별 집계
  const issuesByType: Record<string, number> = {}
  issues.forEach((issue) => {
    issuesByType[issue.type] = (issuesByType[issue.type] || 0) + 1
  })

  // 권장사항 생성
  const recommendations = generateRecommendations(issues)

  const report: QualityReport = {
    timestamp: new Date(),
    totalIssues: issues.length,
    issuesByType,
    issues,
    recommendations,
  }

  console.log(`✅ 품질 검사 완료: ${issues.length}개 이슈 발견`)

  // 심각한 이슈가 있으면 알림 발송
  const highSeverityIssues = issues.filter((i) => i.severity === 'high')
  if (highSeverityIssues.length > 0) {
    await notifyDataQualityIssue(
      `${highSeverityIssues.length}개의 심각한 데이터 품질 이슈 발견`,
      { highSeverityIssues: highSeverityIssues.length }
    )
  }

  return report
}

/**
 * 중복 Triple 감지
 * 같은 subject, predicate, object를 가진 Triple
 */
async function findDuplicateTriples(): Promise<QualityIssue[]> {
  const result = await pool.query(`
    SELECT subject, predicate, object, ARRAY_AGG(id) as ids, COUNT(*) as count
    FROM knowledge_triples
    GROUP BY subject, predicate, object
    HAVING COUNT(*) > 1
  `)

  return result.rows.map((row) => ({
    type: 'duplicate' as const,
    severity: 'medium' as const,
    description: `중복 Triple: ${row.subject} ${row.predicate} ${row.object}`,
    tripleIds: row.ids,
    details: {
      subject: row.subject,
      predicate: row.predicate,
      object: row.object,
      count: parseInt(row.count),
    },
  }))
}

/**
 * 모순 관계 감지
 * 예: A supplies_to B와 B supplies_to A가 동시에 존재
 */
async function findContradictions(): Promise<QualityIssue[]> {
  const result = await pool.query(`
    WITH reverse_relations AS (
      SELECT
        t1.id as id1,
        t1.subject as subj1,
        t1.predicate as pred1,
        t1.object as obj1,
        t2.id as id2,
        t2.subject as subj2,
        t2.predicate as pred2,
        t2.object as obj2
      FROM knowledge_triples t1
      JOIN knowledge_triples t2
        ON t1.subject = t2.object
        AND t1.object = t2.subject
        AND t1.predicate = t2.predicate
        AND t1.id < t2.id
    )
    SELECT * FROM reverse_relations
  `)

  return result.rows.map((row) => ({
    type: 'contradiction' as const,
    severity: 'high' as const,
    description: `모순 관계: ${row.subj1} ↔ ${row.obj1}`,
    tripleIds: [row.id1, row.id2],
    details: {
      triple1: {
        subject: row.subj1,
        predicate: row.pred1,
        object: row.obj1,
      },
      triple2: {
        subject: row.subj2,
        predicate: row.pred2,
        object: row.obj2,
      },
    },
  }))
}

/**
 * 저신뢰도 Triple 감지
 * confidence < 0.5인 Triple
 */
async function findLowConfidenceTriples(): Promise<QualityIssue[]> {
  const result = await pool.query(`
    SELECT id, subject, predicate, object, confidence
    FROM knowledge_triples
    WHERE confidence < 0.5
    ORDER BY confidence ASC
    LIMIT 10
  `)

  return result.rows.map((row) => ({
    type: 'low_confidence' as const,
    severity: 'low' as const,
    description: `저신뢰도 Triple: ${row.subject} ${row.predicate} ${row.object} (${(row.confidence * 100).toFixed(0)}%)`,
    tripleIds: [row.id],
    details: {
      subject: row.subject,
      predicate: row.predicate,
      object: row.object,
      confidence: parseFloat(row.confidence),
    },
  }))
}

/**
 * 오래된 데이터 감지
 * 90일 이상 된 GPT 검증 Triple
 */
async function findOutdatedTriples(): Promise<QualityIssue[]> {
  const result = await pool.query(`
    SELECT id, subject, predicate, object, created_at, confidence
    FROM knowledge_triples
    WHERE validated_by = 'gpt'
      AND created_at < NOW() - INTERVAL '90 days'
    ORDER BY created_at ASC
    LIMIT 10
  `)

  return result.rows.map((row) => ({
    type: 'outdated' as const,
    severity: 'low' as const,
    description: `오래된 Triple: ${row.subject} ${row.predicate} ${row.object}`,
    tripleIds: [row.id],
    details: {
      subject: row.subject,
      predicate: row.predicate,
      object: row.object,
      createdAt: row.created_at,
      ageInDays: Math.floor(
        (Date.now() - new Date(row.created_at).getTime()) / (1000 * 60 * 60 * 24)
      ),
    },
  }))
}

/**
 * 권장사항 생성
 */
function generateRecommendations(issues: QualityIssue[]): string[] {
  const recommendations: string[] = []

  const duplicates = issues.filter((i) => i.type === 'duplicate')
  if (duplicates.length > 0) {
    recommendations.push(
      `${duplicates.length}개의 중복 Triple을 병합하세요. 가장 높은 신뢰도를 유지하고 나머지는 삭제합니다.`
    )
  }

  const contradictions = issues.filter((i) => i.type === 'contradiction')
  if (contradictions.length > 0) {
    recommendations.push(
      `${contradictions.length}개의 모순 관계를 검토하세요. 양방향 관계가 맞는지 확인하고, 잘못된 것은 삭제합니다.`
    )
  }

  const lowConfidence = issues.filter((i) => i.type === 'low_confidence')
  if (lowConfidence.length > 0) {
    recommendations.push(
      `${lowConfidence.length}개의 저신뢰도 Triple을 검토하세요. 신뢰도 < 0.5인 데이터는 삭제를 고려하세요.`
    )
  }

  const outdated = issues.filter((i) => i.type === 'outdated')
  if (outdated.length > 0) {
    recommendations.push(
      `${outdated.length}개의 오래된 Triple을 재검증하세요. 90일 이상 된 GPT 데이터는 신뢰도를 재평가합니다.`
    )
  }

  if (recommendations.length === 0) {
    recommendations.push('데이터 품질이 양호합니다. 추가 조치가 필요하지 않습니다.')
  }

  return recommendations
}

/**
 * 중복 Triple 자동 병합
 */
export async function mergeDuplicateTriples(
  tripleIds: number[]
): Promise<{ merged: number; deleted: number }> {
  if (tripleIds.length < 2) {
    throw new Error('최소 2개 이상의 Triple ID가 필요합니다.')
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    // 가장 높은 신뢰도를 가진 Triple 찾기
    const result = await client.query(
      `
      SELECT id, confidence
      FROM knowledge_triples
      WHERE id = ANY($1)
      ORDER BY confidence DESC, created_at DESC
      LIMIT 1
    `,
      [tripleIds]
    )

    if (result.rows.length === 0) {
      throw new Error('Triple을 찾을 수 없습니다.')
    }

    const keepId = result.rows[0].id
    const deleteIds = tripleIds.filter((id) => id !== keepId)

    // 나머지 삭제
    await client.query(
      `
      DELETE FROM knowledge_triples
      WHERE id = ANY($1)
    `,
      [deleteIds]
    )

    await client.query('COMMIT')

    console.log(`✅ ${deleteIds.length}개 중복 Triple 병합 완료 (유지: ${keepId})`)

    return {
      merged: keepId,
      deleted: deleteIds.length,
    }
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

/**
 * 저신뢰도 Triple 자동 삭제
 */
export async function deleteLowConfidenceTriples(threshold: number = 0.3): Promise<number> {
  const result = await pool.query(
    `
    DELETE FROM knowledge_triples
    WHERE confidence < $1
    RETURNING id
  `,
    [threshold]
  )

  const deletedCount = result.rowCount || 0
  console.log(`✅ ${deletedCount}개 저신뢰도 Triple 삭제 완료 (threshold: ${threshold})`)

  return deletedCount
}

/**
 * 오래된 Triple 신뢰도 감소
 */
export async function decayOutdatedTriples(
  daysThreshold: number = 90,
  decayRate: number = 0.1
): Promise<number> {
  const result = await pool.query(
    `
    UPDATE knowledge_triples
    SET confidence = GREATEST(0.1, confidence * (1 - $2))
    WHERE validated_by = 'gpt'
      AND created_at < NOW() - INTERVAL '${daysThreshold} days'
    RETURNING id
  `,
    [daysThreshold, decayRate]
  )

  const updatedCount = result.rowCount || 0
  console.log(
    `✅ ${updatedCount}개 오래된 Triple 신뢰도 감소 완료 (decay: ${decayRate * 100}%)`
  )

  return updatedCount
}
