import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { Pool } from 'pg'

// Force dynamic rendering to avoid build-time DB connection
export const dynamic = 'force-dynamic'

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null
let pool: Pool | null = null

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }
  return openai
}

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || '',
    })
  }
  return pool
}

/**
 * POST /api/agent/chat
 * Agent Builder 채팅 API
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { config, messages } = body

    if (!config || !messages) {
      return NextResponse.json(
        { success: false, error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // 도구 실행 결과 준비
    const toolResults: Record<string, any> = {}

    // 선택된 도구들 실행
    if (config.tools.includes('ontology_query')) {
      toolResults.ontology = await executeOntologyQuery()
    }

    if (config.tools.includes('analytics')) {
      toolResults.analytics = await executeAnalytics()
    }

    if (config.tools.includes('insights')) {
      toolResults.insights = await executeInsights()
    }

    // 시스템 메시지 생성
    const systemMessage = {
      role: 'system' as const,
      content: `${config.instructions}

당신은 "${config.name}" 역할의 "${config.role}"입니다.

사용 가능한 도구:
${config.tools.map((t: string) => `- ${getToolDescription(t)}`).join('\n')}

${Object.keys(toolResults).length > 0 ? `\n현재 데이터베이스 정보:\n${JSON.stringify(toolResults, null, 2)}` : ''}

사용자의 질문에 데이터를 기반으로 정확하고 유용한 답변을 제공하세요.`,
    }

    // OpenAI 호출
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4',
      messages: [
        systemMessage,
        ...messages.slice(-5).map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: config.temperature,
      max_tokens: config.maxTokens,
    })

    const response = completion.choices[0]?.message?.content

    if (!response) {
      return NextResponse.json(
        { success: false, error: 'AI 응답을 생성하지 못했습니다.' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      response,
      toolsUsed: Object.keys(toolResults),
    })
  } catch (error: any) {
    console.error('Agent chat error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || '채팅 처리 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

/**
 * 온톨로지 쿼리 도구 실행
 */
async function executeOntologyQuery() {
  const result = await getPool().query(`
    SELECT
      COUNT(*) as total_triples,
      COUNT(DISTINCT subject) as unique_entities,
      AVG(confidence) as avg_confidence
    FROM knowledge_triples
    WHERE confidence >= 0.7
  `)

  const topRelations = await getPool().query(`
    SELECT
      predicate,
      COUNT(*) as count
    FROM knowledge_triples
    WHERE confidence >= 0.7
    GROUP BY predicate
    ORDER BY count DESC
    LIMIT 5
  `)

  return {
    totalTriples: parseInt(result.rows[0].total_triples),
    uniqueEntities: parseInt(result.rows[0].unique_entities),
    avgConfidence: parseFloat(result.rows[0].avg_confidence),
    topRelations: topRelations.rows.map((row) => ({
      type: row.predicate.replace('kss:', ''),
      count: parseInt(row.count),
    })),
  }
}

/**
 * 통계 분석 도구 실행
 */
async function executeAnalytics() {
  const stats = await getPool().query(`
    SELECT
      COUNT(*) FILTER (WHERE confidence >= 0.9) as very_high,
      COUNT(*) FILTER (WHERE confidence >= 0.8 AND confidence < 0.9) as high,
      COUNT(*) FILTER (WHERE confidence >= 0.7 AND confidence < 0.8) as medium,
      COUNT(*) FILTER (WHERE confidence < 0.7) as low
    FROM knowledge_triples
  `)

  const validationStats = await getPool().query(`
    SELECT
      validated_by,
      COUNT(*) as count
    FROM knowledge_triples
    GROUP BY validated_by
  `)

  return {
    confidenceDistribution: {
      veryHigh: parseInt(stats.rows[0].very_high),
      high: parseInt(stats.rows[0].high),
      medium: parseInt(stats.rows[0].medium),
      low: parseInt(stats.rows[0].low),
    },
    validationMethods: validationStats.rows.map((row) => ({
      method: row.validated_by,
      count: parseInt(row.count),
    })),
  }
}

/**
 * AI 인사이트 도구 실행
 */
async function executeInsights() {
  // 최근 고신뢰도 Triple 조회
  const recentTriples = await getPool().query(`
    SELECT subject, predicate, object, confidence
    FROM knowledge_triples
    WHERE confidence >= 0.8
    ORDER BY created_at DESC
    LIMIT 10
  `)

  return {
    recentHighConfidenceTriples: recentTriples.rows.map((row) => ({
      subject: row.subject.replace('kss:', '').replace('Company_', ''),
      predicate: row.predicate.replace('kss:', ''),
      object: row.object.replace('kss:', '').replace('Company_', ''),
      confidence: row.confidence,
    })),
    summary: `최근 ${recentTriples.rows.length}개의 고신뢰도 관계가 식별되었습니다.`,
  }
}

/**
 * 도구 설명 반환
 */
function getToolDescription(toolId: string): string {
  const descriptions: Record<string, string> = {
    ontology_query: '온톨로지 쿼리 - 지식 그래프에서 관계 검색 및 통계 제공',
    analytics: '통계 분석 - 공급망 데이터의 신뢰도 분포 및 검증 방법 분석',
    insights: 'AI 인사이트 - 최근 발견된 고신뢰도 관계 요약',
  }
  return descriptions[toolId] || toolId
}
