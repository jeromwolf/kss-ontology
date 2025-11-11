'use client'

import { useCallback, useMemo } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
} from 'reactflow'
import 'reactflow/dist/style.css'

interface Relationship {
  source: string
  target: string
  type: 'supplier' | 'customer' | 'competitor' | 'partner' | 'related'
  confidence: number
}

interface CompanyEntity {
  name: string
  mentions: number
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
}

interface OntologyGraphProps {
  companies: CompanyEntity[]
  relationships: Relationship[]
  impactScores: Record<string, number>
}

export default function OntologyGraph({ companies, relationships, impactScores }: OntologyGraphProps) {
  // Create nodes from companies
  const initialNodes: Node[] = useMemo(() => {
    const nodeMap = new Map<string, { x: number; y: number }>()

    // Calculate positions in a circular layout
    companies.forEach((company, idx) => {
      const angle = (idx * 2 * Math.PI) / companies.length
      const radius = 200
      const x = 400 + radius * Math.cos(angle)
      const y = 300 + radius * Math.sin(angle)
      nodeMap.set(company.name, { x, y })
    })

    return companies.map((company) => {
      const pos = nodeMap.get(company.name) || { x: 0, y: 0 }
      const impact = impactScores[company.name] || 0

      // Determine node color based on sentiment
      const sentimentColor =
        company.sentiment === 'positive'
          ? '#10b981' // green
          : company.sentiment === 'negative'
          ? '#ef4444' // red
          : '#6b7280' // gray

      return {
        id: company.name,
        position: pos,
        data: {
          label: (
            <div className="text-center">
              <div className="font-bold text-sm">{company.name}</div>
              <div className="text-xs text-gray-600">중요도: {impact}점</div>
              <div className="text-xs font-semibold" style={{ color: sentimentColor }}>
                감정: {company.sentiment === 'positive' ? '긍정' : company.sentiment === 'negative' ? '부정' : '중립'}
              </div>
              <div className="text-xs text-gray-500">({company.mentions}회 언급)</div>
            </div>
          )
        },
        style: {
          background: sentimentColor,
          color: 'white',
          border: `3px solid ${sentimentColor}`,
          borderRadius: '12px',
          padding: '12px',
          width: 140,
          fontSize: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        },
      }
    })
  }, [companies, impactScores])

  // Create edges from relationships
  const initialEdges: Edge[] = useMemo(() => {
    return relationships.map((rel, idx) => {
      // Determine edge color based on relationship type
      const edgeColor =
        rel.type === 'supplier'
          ? '#3b82f6' // blue
          : rel.type === 'customer'
          ? '#10b981' // green
          : rel.type === 'competitor'
          ? '#ef4444' // red
          : rel.type === 'partner'
          ? '#a855f7' // purple
          : '#6b7280' // gray

      const label =
        rel.type === 'supplier'
          ? '공급'
          : rel.type === 'customer'
          ? '고객'
          : rel.type === 'competitor'
          ? '경쟁'
          : rel.type === 'partner'
          ? '파트너'
          : '관련'

      return {
        id: `${rel.source}-${rel.target}-${idx}`,
        source: rel.source,
        target: rel.target,
        label: `${label} (${(rel.confidence * 100).toFixed(0)}%)`,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: edgeColor,
          strokeWidth: 2,
        },
        labelStyle: {
          fontSize: 10,
          fill: edgeColor,
          fontWeight: 600,
        },
        labelBgStyle: {
          fill: 'white',
          fillOpacity: 0.9,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
        },
      }
    })
  }, [relationships])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative">
      {/* Legend */}
      <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 border border-gray-200 dark:border-gray-700">
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">감정 분석</div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">긍정</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#6b7280]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">중립</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ef4444]"></div>
            <span className="text-xs text-gray-600 dark:text-gray-400">부정</span>
          </div>
        </div>
      </div>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            const company = companies.find(c => c.name === node.id)
            return company?.sentiment === 'positive'
              ? '#10b981'
              : company?.sentiment === 'negative'
              ? '#ef4444'
              : '#6b7280'
          }}
          maskColor="rgb(240, 240, 240, 0.6)"
        />
      </ReactFlow>
    </div>
  )
}
