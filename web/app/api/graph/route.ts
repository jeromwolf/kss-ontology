import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'
import { withCache, createCacheKey, CacheTTL } from '@/lib/services/cache'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

/**
 * GET /api/graph
 * 네트워크 그래프 데이터 조회
 * Triple을 노드-링크 형식으로 변환
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '100')
    const minConfidence = parseFloat(searchParams.get('minConfidence') || '0.7')

    // 캐시 키 생성
    const cacheKey = createCacheKey('graph', limit, minConfidence)

    // withCache로 감싸서 캐싱 적용
    const graphData = await withCache(
      cacheKey,
      async () => {
        return await fetchGraphData(limit, minConfidence)
      },
      CacheTTL.LONG // 30분
    )

    return NextResponse.json({
      success: true,
      data: graphData,
    })
  } catch (error: any) {
    console.error('Graph API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * 그래프 데이터 조회 함수
 */
async function fetchGraphData(limit: number, minConfidence: number) {
  // Triple 데이터 조회
  const triples = await pool.query(
    `
    SELECT
      id,
      subject,
      predicate,
      object,
      confidence,
      validated_by
    FROM knowledge_triples
    WHERE confidence >= $1
    ORDER BY confidence DESC
    LIMIT $2
  `,
    [minConfidence, limit]
  )

  // 노드와 링크 생성
  const nodesMap = new Map<string, any>()
  const links: any[] = []

  triples.rows.forEach((triple) => {
    const { subject, predicate, object, confidence, validated_by } = triple

    // Subject 노드 추가
    if (!nodesMap.has(subject)) {
      nodesMap.set(subject, {
        id: subject,
        name: subject.replace('kss:', '').replace('Company_', ''),
        type: subject.startsWith('kss:Company_') ? 'company' : 'entity',
        group: validated_by,
      })
    }

    // Object 노드 추가
    if (!nodesMap.has(object)) {
      nodesMap.set(object, {
        id: object,
        name: object.replace('kss:', '').replace('Company_', ''),
        type: object.startsWith('kss:Company_') ? 'company' : 'entity',
        group: validated_by,
      })
    }

    // 링크 추가
    links.push({
      source: subject,
      target: object,
      relation: predicate.replace('kss:', ''),
      confidence,
      validated_by,
    })
  })

  // 노드 배열 변환
  const nodes = Array.from(nodesMap.values())

  // 노드별 연결 수 계산
  const nodeDegree = new Map<string, number>()
  links.forEach((link) => {
    nodeDegree.set(link.source, (nodeDegree.get(link.source) || 0) + 1)
    nodeDegree.set(link.target, (nodeDegree.get(link.target) || 0) + 1)
  })

  // 노드에 크기 정보 추가
  nodes.forEach((node) => {
    node.degree = nodeDegree.get(node.id) || 0
    node.val = Math.max(1, node.degree) // 시각화 크기
  })

  return {
    nodes,
    links,
    stats: {
      totalNodes: nodes.length,
      totalLinks: links.length,
      avgConfidence:
        links.reduce((sum, link) => sum + link.confidence, 0) / links.length,
    },
  }
}
