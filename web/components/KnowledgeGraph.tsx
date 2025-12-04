'use client'

import { useEffect, useRef, useState } from 'react'
import { Network } from 'vis-network'
import type { Data, Options } from 'vis-network'

interface Triple {
  subject: string
  predicate: string
  object: string
  confidence: number
  validatedBy: 'baseline' | 'gpt' | 'user'
}

interface KnowledgeGraphProps {
  triples?: Triple[]
  height?: string
}

/**
 * Knowledge Graph Visualization Component
 *
 * RDF Triple을 시각화하여 기업 간 관계를 직관적으로 표현
 * - 노드: 기업 (kss:Company_*)
 * - 엣지: 관계 (competes_with, supplies_to, partners_with, influences)
 * - 색상: 관계 유형별 구분
 * - 두께: 신뢰도 표현
 */
export default function KnowledgeGraph({ triples = [], height = '600px' }: KnowledgeGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const networkRef = useRef<Network | null>(null)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    // Triple 데이터를 vis-network 형식으로 변환
    const nodes = new Set<string>()
    const edges: any[] = []

    triples.forEach((triple) => {
      nodes.add(triple.subject)
      nodes.add(triple.object)

      // 관계 유형별 색상 및 레이블
      const edgeStyle = getEdgeStyle(triple.predicate)
      const label = getPredicateLabel(triple.predicate)

      edges.push({
        from: triple.subject,
        to: triple.object,
        label: label,
        color: {
          color: edgeStyle.color,
          highlight: edgeStyle.highlightColor,
        },
        width: triple.confidence * 3, // 신뢰도를 선 두께로 표현
        arrows: {
          to: {
            enabled: true,
            scaleFactor: 0.5,
          },
        },
        font: {
          size: 10,
          color: '#666',
          strokeWidth: 0,
          align: 'top',
        },
        smooth: {
          type: 'curvedCW',
          roundness: 0.2,
        },
        title: `${label}<br/>신뢰도: ${(triple.confidence * 100).toFixed(0)}%<br/>검증: ${triple.validatedBy}`,
      })
    })

    // 노드 데이터 생성
    const nodeData = Array.from(nodes).map((nodeId) => {
      const companyName = getCompanyName(nodeId)
      const nodeConnections = triples.filter(
        (t) => t.subject === nodeId || t.object === nodeId
      ).length

      return {
        id: nodeId,
        label: companyName,
        title: `${companyName}<br/>연결: ${nodeConnections}개`,
        shape: 'box',
        color: {
          background: '#4F46E5',
          border: '#3730A3',
          highlight: {
            background: '#6366F1',
            border: '#4F46E5',
          },
        },
        font: {
          color: '#ffffff',
          size: 14,
          face: 'system-ui',
        },
        borderWidth: 2,
        borderWidthSelected: 3,
        margin: { top: 10, right: 10, bottom: 10, left: 10 },
      }
    })

    const data: Data = {
      nodes: nodeData,
      edges: edges,
    }

    const options: Options = {
      physics: {
        enabled: true,
        barnesHut: {
          gravitationalConstant: -8000,
          centralGravity: 0.3,
          springLength: 200,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0.1,
        },
        stabilization: {
          iterations: 150,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        navigationButtons: true,
        keyboard: true,
      },
      nodes: {
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.1)',
          size: 5,
          x: 2,
          y: 2,
        },
      },
      edges: {
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.05)',
          size: 3,
          x: 1,
          y: 1,
        },
      },
    }

    // Network 생성
    const network = new Network(containerRef.current, data, options)
    networkRef.current = network

    // 안정화 완료 후 로딩 해제
    network.on('stabilizationIterationsDone', () => {
      setLoading(false)
      network.setOptions({ physics: { enabled: false } })
    })

    // 노드 클릭 이벤트
    network.on('selectNode', (params) => {
      if (params.nodes.length > 0) {
        setSelectedNode(params.nodes[0])
      }
    })

    network.on('deselectNode', () => {
      setSelectedNode(null)
    })

    // Cleanup
    return () => {
      network.destroy()
      networkRef.current = null
    }
  }, [triples])

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">Knowledge Graph 생성 중...</p>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        style={{ height }}
        className="border border-gray-200 rounded-lg bg-white"
      />

      {/* 범례 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">관계 유형</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { type: 'competes_with', label: '경쟁', color: '#EF4444' },
            { type: 'supplies_to', label: '공급', color: '#10B981' },
            { type: 'partners_with', label: '협력', color: '#3B82F6' },
            { type: 'influences', label: '영향', color: '#F59E0B' },
          ].map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div
                className="w-8 h-1 rounded"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">
          선의 두께는 신뢰도를 나타냅니다 (굵을수록 높은 신뢰도)
        </p>
      </div>

      {/* 선택된 노드 정보 */}
      {selectedNode && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
          <h3 className="text-sm font-semibold text-indigo-900 mb-2">
            {getCompanyName(selectedNode)}
          </h3>
          <div className="text-xs text-indigo-700">
            <p>총 {triples.filter((t) => t.subject === selectedNode).length}개 관계 (주체)</p>
            <p>총 {triples.filter((t) => t.object === selectedNode).length}개 관계 (대상)</p>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * 관계 유형별 색상 및 스타일
 */
function getEdgeStyle(predicate: string): { color: string; highlightColor: string } {
  const predicateType = predicate.split(':')[1] || predicate

  switch (predicateType) {
    case 'competes_with':
      return { color: '#EF4444', highlightColor: '#DC2626' } // 빨강 (경쟁)
    case 'supplies_to':
      return { color: '#10B981', highlightColor: '#059669' } // 초록 (공급)
    case 'partners_with':
      return { color: '#3B82F6', highlightColor: '#2563EB' } // 파랑 (협력)
    case 'influences':
      return { color: '#F59E0B', highlightColor: '#D97706' } // 주황 (영향)
    default:
      return { color: '#6B7280', highlightColor: '#4B5563' } // 회색 (기타)
  }
}

/**
 * 관계 유형 레이블
 */
function getPredicateLabel(predicate: string): string {
  const predicateType = predicate.split(':')[1] || predicate

  switch (predicateType) {
    case 'competes_with':
      return '경쟁'
    case 'supplies_to':
      return '공급'
    case 'partners_with':
      return '협력'
    case 'influences':
      return '영향'
    case 'depends_on':
      return '의존'
    default:
      return predicateType
  }
}

/**
 * URI에서 회사명 추출
 */
function getCompanyName(uri: string): string {
  // kss:Company_Samsung → 삼성
  const match = uri.match(/Company_(.+)$/)
  if (!match) return uri

  const name = match[1]

  // 영어 회사명을 한글로 매핑 (필요시 확장)
  const nameMap: Record<string, string> = {
    Samsung: '삼성전자',
    SKHynix: 'SK하이닉스',
    TSMC: 'TSMC',
    Intel: '인텔',
    Qualcomm: '퀄컴',
    Apple: '애플',
    LGChem: 'LG화학',
    Tesla: '테슬라',
    Nvidia: '엔비디아',
    AMD: 'AMD',
    Micron: '마이크론',
  }

  return nameMap[name] || name
}
