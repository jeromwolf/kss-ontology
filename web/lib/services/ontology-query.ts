import { Pool } from 'pg'
import type { RDFTriple } from './triple-extractor'

/**
 * PostgreSQL 연결 풀 (Lazy initialization)
 */
let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  return pool
}

/**
 * SPARQL-like 쿼리 인터페이스
 * 실제 온톨로지 쿼리를 위한 추상화 레이어
 */

export interface TriplePattern {
  subject?: string // ? = 와일드카드
  predicate?: string
  object?: string
}

export interface QueryResult {
  bindings: Array<Record<string, string>>
  triples: RDFTriple[]
}

/**
 * SELECT 쿼리: Triple 패턴 매칭
 *
 * 예: queryTriples({ subject: 'kss:Company_Samsung', predicate: 'kss:supplies_to' })
 * → 삼성이 공급하는 모든 기업 찾기
 */
export async function queryTriples(
  pattern: TriplePattern,
  minConfidence: number = 0.7
): Promise<RDFTriple[]> {
  const conditions: string[] = ['confidence >= $1']
  const values: any[] = [minConfidence]
  let paramIndex = 2

  if (pattern.subject) {
    conditions.push(`subject = $${paramIndex}`)
    values.push(pattern.subject)
    paramIndex++
  }

  if (pattern.predicate) {
    conditions.push(`predicate = $${paramIndex}`)
    values.push(pattern.predicate)
    paramIndex++
  }

  if (pattern.object) {
    conditions.push(`object = $${paramIndex}`)
    values.push(pattern.object)
    paramIndex++
  }

  const query = `
    SELECT id, subject, predicate, object, confidence, source_url, extracted_date, validated_by
    FROM knowledge_triples
    WHERE ${conditions.join(' AND ')}
    ORDER BY confidence DESC, extracted_date DESC
  `

  const result = await getPool().query(query, values)

  return result.rows.map(row => ({
    id: row.id,
    subject: row.subject,
    predicate: row.predicate,
    object: row.object,
    confidence: row.confidence,
    source: row.source_url,
    extractedDate: row.extracted_date.toISOString(),
    validatedBy: row.validated_by,
  }))
}

/**
 * 기업의 모든 관계 찾기
 */
export async function getCompanyRelations(companyUri: string): Promise<{
  outgoing: RDFTriple[] // 이 기업이 주체인 관계
  incoming: RDFTriple[] // 이 기업이 대상인 관계
}> {
  const outgoing = await queryTriples({ subject: companyUri })
  const incoming = await queryTriples({ object: companyUri })

  return { outgoing, incoming }
}

/**
 * 특정 관계 유형의 모든 Triple 찾기
 */
export async function getRelationsByType(
  relationType: string,
  minConfidence: number = 0.7
): Promise<RDFTriple[]> {
  return queryTriples({ predicate: `kss:${relationType}` }, minConfidence)
}

/**
 * 공급망 추적: A → B → C 형태의 체인 찾기
 * 예: LG화학 → 테슬라 → ? (테슬라의 고객은?)
 */
export async function traceSupplyChain(
  startCompanyUri: string,
  depth: number = 2
): Promise<Array<{ path: string[]; confidence: number }>> {
  const paths: Array<{ path: string[]; confidence: number }> = []

  async function explore(currentUri: string, currentPath: string[], currentConfidence: number, remainingDepth: number) {
    if (remainingDepth === 0) {
      if (currentPath.length > 1) {
        paths.push({ path: currentPath, confidence: currentConfidence })
      }
      return
    }

    // supplies_to 관계를 따라 탐색
    const nextTriples = await queryTriples({
      subject: currentUri,
      predicate: 'kss:supplies_to'
    })

    for (const triple of nextTriples) {
      const newPath = [...currentPath, triple.object]
      const newConfidence = Math.min(currentConfidence, triple.confidence)
      await explore(triple.object, newPath, newConfidence, remainingDepth - 1)
    }
  }

  await explore(startCompanyUri, [startCompanyUri], 1.0, depth)
  return paths.sort((a, b) => b.confidence - a.confidence)
}

/**
 * 경쟁사 네트워크 분석
 */
export async function getCompetitorNetwork(companyUri: string): Promise<{
  directCompetitors: string[]
  indirectCompetitors: string[] // 경쟁사의 경쟁사
}> {
  // 직접 경쟁사
  const directTriples = await queryTriples({
    subject: companyUri,
    predicate: 'kss:competes_with'
  })

  const directCompetitors = directTriples.map(t => t.object)

  // 간접 경쟁사 (경쟁사의 경쟁사)
  const indirectCompetitors: string[] = []
  for (const competitorUri of directCompetitors) {
    const competitorTriples = await queryTriples({
      subject: competitorUri,
      predicate: 'kss:competes_with'
    })
    indirectCompetitors.push(...competitorTriples.map(t => t.object))
  }

  // 자기 자신과 직접 경쟁사 제외
  const filteredIndirect = Array.from(new Set(indirectCompetitors))
    .filter(uri => uri !== companyUri && !directCompetitors.includes(uri))

  return {
    directCompetitors,
    indirectCompetitors: filteredIndirect
  }
}

/**
 * 영향 관계 분석: A의 변화가 B에 미치는 영향
 */
export async function analyzeInfluenceChain(companyUri: string): Promise<{
  influences: string[] // 이 기업이 영향을 주는 기업들
  influencedBy: string[] // 이 기업에 영향을 주는 기업들
  impactScore: number // 전체 영향력 점수
}> {
  // 직접 영향 관계
  const influencesTriples = await queryTriples({
    subject: companyUri,
    predicate: 'kss:influences'
  })

  const influencedByTriples = await queryTriples({
    object: companyUri,
    predicate: 'kss:influences'
  })

  // 공급망 관계도 간접적 영향으로 포함
  const supplyTriples = await queryTriples({
    subject: companyUri,
    predicate: 'kss:supplies_to'
  })

  const influences = [
    ...influencesTriples.map(t => t.object),
    ...supplyTriples.map(t => t.object)
  ]

  const influencedBy = influencedByTriples.map(t => t.subject)

  // 영향력 점수 = 영향을 주는 기업 수 + 신뢰도 가중치
  const impactScore = influences.length * 0.6 +
    influencesTriples.reduce((sum, t) => sum + t.confidence, 0) * 0.4

  return {
    influences: Array.from(new Set(influences)),
    influencedBy: Array.from(new Set(influencedBy)),
    impactScore
  }
}

/**
 * Triple 저장 (배치 인서트)
 */
export async function saveTriples(triples: RDFTriple[]): Promise<number> {
  if (triples.length === 0) return 0

  const client = await getPool().connect()
  try {
    await client.query('BEGIN')

    let insertedCount = 0

    for (const triple of triples) {
      // 중복 체크 (같은 subject-predicate-object가 있으면 업데이트)
      const existing = await client.query(
        'SELECT id, confidence FROM knowledge_triples WHERE subject = $1 AND predicate = $2 AND object = $3',
        [triple.subject, triple.predicate, triple.object]
      )

      if (existing.rows.length > 0) {
        // 기존 Triple의 신뢰도보다 높으면 업데이트
        if (triple.confidence > existing.rows[0].confidence) {
          await client.query(
            `UPDATE knowledge_triples
             SET confidence = $1, source_url = $2, extracted_date = $3, validated_by = $4, updated_at = NOW()
             WHERE id = $5`,
            [triple.confidence, triple.source, triple.extractedDate, triple.validatedBy, existing.rows[0].id]
          )
          insertedCount++
        }
      } else {
        // 새로운 Triple 삽입
        await client.query(
          `INSERT INTO knowledge_triples (subject, predicate, object, confidence, source_url, extracted_date, validated_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [triple.subject, triple.predicate, triple.object, triple.confidence, triple.source, triple.extractedDate, triple.validatedBy]
        )
        insertedCount++
      }
    }

    await client.query('COMMIT')
    return insertedCount
  } catch (error) {
    await client.query('ROLLBACK')
    console.error('Failed to save triples:', error)
    throw error
  } finally {
    client.release()
  }
}

/**
 * 사용자 피드백 저장
 */
export async function saveTripleFeedback(
  tripleId: number,
  feedback: 'correct' | 'incorrect' | 'uncertain',
  comment?: string
): Promise<void> {
  const client = await getPool().connect()
  try {
    // 피드백 저장
    await client.query(
      'INSERT INTO relation_feedback (triple_id, feedback, comment) VALUES ($1, $2, $3)',
      [tripleId, feedback, comment]
    )

    // Triple의 user_feedback 카운터 업데이트
    const delta = feedback === 'correct' ? 1 : feedback === 'incorrect' ? -1 : 0
    await client.query(
      'UPDATE knowledge_triples SET user_feedback = user_feedback + $1 WHERE id = $2',
      [delta, tripleId]
    )

    // 피드백이 많이 부정적이면 신뢰도 낮추기
    const triple = await client.query(
      'SELECT user_feedback, confidence FROM knowledge_triples WHERE id = $1',
      [tripleId]
    )

    if (triple.rows[0].user_feedback < -3) {
      // 3회 이상 부정적 피드백 → 신뢰도 0.5로 하향
      await client.query(
        'UPDATE knowledge_triples SET confidence = LEAST(confidence, 0.5) WHERE id = $1',
        [tripleId]
      )
    }
  } finally {
    client.release()
  }
}

/**
 * 통계 조회 (확장)
 */
export async function getOntologyStats(): Promise<{
  totalTriples: number
  highConfidenceTriples: number
  userValidatedTriples: number
  companiesWithRelations: number
  avgConfidence: number
  companiesCount: number
  newsCount: number
  feedbackCount: number
}> {
  // Triple 통계
  const tripleResult = await getPool().query(`
    SELECT
      COUNT(*) as total_triples,
      COUNT(*) FILTER (WHERE confidence >= 0.8) as high_confidence,
      COUNT(*) FILTER (WHERE validated_by = 'user') as user_validated,
      COUNT(DISTINCT subject) as companies,
      AVG(confidence) as avg_confidence
    FROM knowledge_triples
  `)

  // 커버 기업 수
  const companiesResult = await getPool().query(`
    SELECT COUNT(*) as count
    FROM covered_companies
    WHERE is_active = true
  `)

  // 뉴스 기사 수
  const newsResult = await getPool().query(`
    SELECT COUNT(*) as count
    FROM news_articles
  `)

  // 피드백 이력 수
  const feedbackResult = await getPool().query(`
    SELECT COUNT(*) as count
    FROM triple_feedback
  `)

  const triple = tripleResult.rows[0]

  return {
    totalTriples: parseInt(triple.total_triples),
    highConfidenceTriples: parseInt(triple.high_confidence),
    userValidatedTriples: parseInt(triple.user_validated || '0'),
    companiesWithRelations: parseInt(triple.companies),
    avgConfidence: parseFloat(triple.avg_confidence) || 0,
    companiesCount: parseInt(companiesResult.rows[0]?.count || '0'),
    newsCount: parseInt(newsResult.rows[0]?.count || '0'),
    feedbackCount: parseInt(feedbackResult.rows[0]?.count || '0'),
  }
}
