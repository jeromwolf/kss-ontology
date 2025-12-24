'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { ArrowLeft, Play, HelpCircle } from 'lucide-react'
import {
  GraphStats,
  GraphControls,
  GraphLegend,
  NodeDetails,
  useGraphData,
  ViewMode,
} from '@/components/knowledge-graph'

// Dynamic imports for graph components (no SSR)
const ForceGraph2D = dynamic(
  () => import('@/components/knowledge-graph/ForceGraph2D').then(mod => ({ default: mod.ForceGraph2D })),
  { ssr: false, loading: () => <GraphLoading /> }
)

const ForceGraph3D = dynamic(
  () => import('@/components/knowledge-graph/ForceGraph3D').then(mod => ({ default: mod.ForceGraph3D })),
  { ssr: false, loading: () => <GraphLoading /> }
)

function GraphLoading() {
  return (
    <div className="flex items-center justify-center h-96 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-sm text-gray-600 dark:text-gray-400">그래프 로딩 중...</p>
      </div>
    </div>
  )
}

export default function KnowledgeGraphPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('2d')
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showHelp, setShowHelp] = useState(false)

  const {
    filteredTriples,
    stats,
    predicateTypes,
    loading,
    error,
    dataSource,
    filters,
    setFilters,
    fetchFromDatabase,
    resetToSample,
  } = useGraphData()

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/simulators"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            시뮬레이터 목록으로
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <Link
              href="/simulators/rdf-editor"
              className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center gap-2 text-sm"
            >
              <Play className="w-4 h-4" />
              RDF Editor
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* 타이틀 */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Knowledge Graph Visualizer
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              RDF 트리플을 인터랙티브 그래프로 시각화합니다 (2D/3D 전환 가능)
            </p>
          </div>

          {/* 도움말 */}
          {showHelp && (
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-300">
                사용 방법
              </h2>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
                <li>• <strong>2D Graph</strong>: vis-network 기반, 노드 드래그 및 줌 가능</li>
                <li>• <strong>3D Graph</strong>: Three.js 기반, 360도 회전 및 공간 탐색</li>
                <li>• <strong>DB에서 로드</strong>: PostgreSQL Triple Store에서 실시간 데이터 로드</li>
                <li>• <strong>필터</strong>: 신뢰도, 관계 유형, 검색어로 데이터 필터링</li>
                <li>• <strong>노드 클릭</strong>: 해당 엔티티의 관계 정보 상세 보기</li>
              </ul>
            </div>
          )}

          {/* 에러 표시 */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* 통계 카드 */}
          <GraphStats stats={stats} />

          {/* 컨트롤 */}
          <GraphControls
            filters={filters}
            onFiltersChange={setFilters}
            predicateTypes={predicateTypes}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            dataSource={dataSource}
            onLoadFromDB={fetchFromDatabase}
            onReset={resetToSample}
            loading={loading}
          />

          {/* 그래프 영역 */}
          <div className="min-h-[500px]">
            {viewMode === '2d' ? (
              <ForceGraph2D
                triples={filteredTriples}
                height="600px"
                onNodeSelect={setSelectedNode}
              />
            ) : (
              <ForceGraph3D
                triples={filteredTriples}
                height="600px"
                onNodeSelect={setSelectedNode}
              />
            )}
          </div>

          {/* 선택된 노드 상세 정보 */}
          {selectedNode && (
            <NodeDetails
              nodeId={selectedNode}
              triples={filteredTriples}
              onClose={() => setSelectedNode(null)}
            />
          )}

          {/* 범례 */}
          <GraphLegend />
        </div>
      </div>
    </div>
  )
}
