/**
 * AI 인사이트 서비스
 * OpenAI를 활용한 자동 분석 및 추천
 */

import OpenAI from 'openai'
import { Pool } from 'pg'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export interface Insight {
  type: 'network' | 'risk' | 'opportunity' | 'recommendation'
  title: string
  description: string
  confidence: number
  relatedEntities: string[]
  actionItems?: string[]
}

/**
 * 공급망 네트워크 분석
 */
export async function analyzeSupplyChainNetwork(
  companyName?: string
): Promise<Insight[]> {
  try {
    // 데이터 수집
    const query = companyName
      ? `
      SELECT subject, predicate, object, confidence
      FROM knowledge_triples
      WHERE (subject LIKE $1 OR object LIKE $1)
        AND confidence >= 0.7
      ORDER BY confidence DESC
      LIMIT 50
    `
      : `
      SELECT subject, predicate, object, confidence
      FROM knowledge_triples
      WHERE confidence >= 0.7
      ORDER BY confidence DESC
      LIMIT 100
    `

    const params = companyName ? [`%${companyName}%`] : []
    const result = await pool.query(query, params)

    if (result.rows.length === 0) {
      return [
        {
          type: 'recommendation',
          title: '데이터 부족',
          description: '분석할 충분한 데이터가 없습니다. 더 많은 뉴스를 수집하세요.',
          confidence: 1.0,
          relatedEntities: [],
          actionItems: ['뉴스 수집 배치 작업 실행', '수동으로 Triple 추가'],
        },
      ]
    }

    // Triple 데이터를 텍스트로 변환
    const tripleText = result.rows
      .map(
        (row: any) =>
          `${row.subject} ${row.predicate} ${row.object} (신뢰도: ${(row.confidence * 100).toFixed(0)}%)`
      )
      .join('\n')

    // OpenAI로 분석 요청
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `당신은 공급망 네트워크 분석 전문가입니다.
다음 지식 그래프 데이터를 분석하여 다음 카테고리별로 인사이트를 제공하세요:

1. **네트워크 구조 분석**: 중심 기업, 허브 역할, 의존도 등
2. **리스크 분석**: 단일 공급원 의존도, 지정학적 리스크 등
3. **기회 분석**: 새로운 파트너십 기회, 시장 확장 가능성 등
4. **실행 가능한 추천사항**: 구체적이고 즉시 실행 가능한 행동 항목

각 인사이트는 JSON 배열로 반환하세요:
[
  {
    "type": "network|risk|opportunity|recommendation",
    "title": "인사이트 제목",
    "description": "상세 설명 (2-3문장)",
    "confidence": 0.0-1.0,
    "relatedEntities": ["관련 기업1", "관련 기업2"],
    "actionItems": ["실행 항목1", "실행 항목2"]
  }
]

**중요**: 반드시 유효한 JSON만 반환하세요. 설명이나 마크다운 없이 순수 JSON 배열만 반환하세요.`,
        },
        {
          role: 'user',
          content: `다음 공급망 네트워크 데이터를 분석하세요:\n\n${tripleText}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('OpenAI 응답이 비어있습니다')
    }

    // JSON 파싱
    try {
      const insights: Insight[] = JSON.parse(content)
      return insights
    } catch (parseError) {
      console.error('JSON 파싱 실패:', content)
      // 폴백: 기본 분석 제공
      return generateBasicInsights(result.rows)
    }
  } catch (error: any) {
    console.error('AI 인사이트 생성 실패:', error)
    // OpenAI 오류 시 기본 분석 제공
    const result = await pool.query(
      `
      SELECT subject, predicate, object, confidence
      FROM knowledge_triples
      WHERE confidence >= 0.7
      ORDER BY confidence DESC
      LIMIT 50
    `
    )
    return generateBasicInsights(result.rows)
  }
}

/**
 * 기본 인사이트 생성 (OpenAI 없이)
 */
function generateBasicInsights(triples: any[]): Insight[] {
  const insights: Insight[] = []

  // 노드 연결 수 계산
  const nodeDegree = new Map<string, number>()
  triples.forEach((triple) => {
    nodeDegree.set(
      triple.subject,
      (nodeDegree.get(triple.subject) || 0) + 1
    )
    nodeDegree.set(triple.object, (nodeDegree.get(triple.object) || 0) + 1)
  })

  // 가장 연결이 많은 노드 찾기
  const sortedNodes = Array.from(nodeDegree.entries()).sort(
    (a, b) => b[1] - a[1]
  )
  const hubNode = sortedNodes[0]

  if (hubNode) {
    insights.push({
      type: 'network',
      title: '중심 기업 식별',
      description: `${hubNode[0].replace('kss:', '').replace('Company_', '')}가 네트워크에서 가장 많은 연결(${hubNode[1]}개)을 가진 중심 기업입니다. 이 기업의 변화가 공급망 전체에 큰 영향을 미칠 수 있습니다.`,
      confidence: 0.9,
      relatedEntities: [hubNode[0]],
      actionItems: [
        '중심 기업의 재무 상태 모니터링',
        '대체 공급원 확보 전략 수립',
      ],
    })
  }

  // 관계 타입 분석
  const relationTypes = new Map<string, number>()
  triples.forEach((triple) => {
    relationTypes.set(
      triple.predicate,
      (relationTypes.get(triple.predicate) || 0) + 1
    )
  })

  const dominantRelation = Array.from(relationTypes.entries()).sort(
    (a, b) => b[1] - a[1]
  )[0]

  if (dominantRelation) {
    const relationType = dominantRelation[0]
      .replace('kss:', '')
      .replace('_', ' ')

    insights.push({
      type: 'opportunity',
      title: '주요 관계 유형',
      description: `네트워크에서 가장 많은 관계는 "${relationType}"입니다. 이 관계 유형을 강화하면 공급망 효율성을 높일 수 있습니다.`,
      confidence: 0.85,
      relatedEntities: [],
      actionItems: [
        `${relationType} 관계 심화 전략 수립`,
        '파트너십 강화 프로그램 실행',
      ],
    })
  }

  // 저신뢰도 관계 감지
  const lowConfidenceTriples = triples.filter(
    (t) => t.confidence < 0.8 && t.confidence >= 0.7
  )
  if (lowConfidenceTriples.length > 0) {
    insights.push({
      type: 'risk',
      title: '검증 필요 데이터',
      description: `${lowConfidenceTriples.length}개의 Triple이 중간 신뢰도(70-80%)를 가지고 있습니다. 이 데이터를 검증하여 정확성을 높이는 것이 좋습니다.`,
      confidence: 0.75,
      relatedEntities: [],
      actionItems: [
        '저신뢰도 Triple 수동 검증',
        '추가 뉴스 소스로 교차 검증',
      ],
    })
  }

  return insights
}

/**
 * 기업별 맞춤 추천
 */
export async function getCompanyRecommendations(
  companyName: string
): Promise<Insight[]> {
  return analyzeSupplyChainNetwork(companyName)
}

/**
 * 전체 네트워크 건강도 분석
 */
export async function analyzeNetworkHealth(): Promise<{
  score: number
  issues: string[]
  strengths: string[]
}> {
  const stats = await pool.query(`
    SELECT
      COUNT(*) as total,
      AVG(confidence) as avg_confidence,
      COUNT(*) FILTER (WHERE confidence < 0.7) as low_confidence_count,
      COUNT(DISTINCT subject) as unique_entities
    FROM knowledge_triples
  `)

  const row = stats.rows[0]
  const total = parseInt(row.total)
  const avgConfidence = parseFloat(row.avg_confidence)
  const lowConfidenceCount = parseInt(row.low_confidence_count)
  const uniqueEntities = parseInt(row.unique_entities)

  const issues: string[] = []
  const strengths: string[] = []

  // 점수 계산 (0-100)
  let score = 70 // 기본 점수

  if (avgConfidence >= 0.9) {
    score += 15
    strengths.push('매우 높은 데이터 신뢰도')
  } else if (avgConfidence >= 0.8) {
    score += 10
    strengths.push('높은 데이터 신뢰도')
  } else if (avgConfidence < 0.7) {
    score -= 15
    issues.push('전반적으로 낮은 데이터 신뢰도')
  }

  if (lowConfidenceCount > total * 0.2) {
    score -= 10
    issues.push('20% 이상의 Triple이 낮은 신뢰도를 가짐')
  }

  if (total > 100) {
    score += 10
    strengths.push('풍부한 데이터량')
  } else if (total < 50) {
    score -= 10
    issues.push('데이터량 부족')
  }

  if (uniqueEntities > 20) {
    score += 5
    strengths.push('다양한 엔티티 커버리지')
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    issues,
    strengths,
  }
}
