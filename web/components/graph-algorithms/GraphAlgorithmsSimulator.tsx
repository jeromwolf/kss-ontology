'use client'

import { useState, useCallback, useMemo } from 'react'
import { Play, RotateCcw, Info } from 'lucide-react'
import { AlgorithmType, ALGORITHM_CATEGORIES, SAMPLE_GRAPH, LARGE_SAMPLE_GRAPH, GraphData } from './types'
import { runAlgorithm } from './algorithms'

// Color palette for communities
const COMMUNITY_COLORS = [
  '#4F46E5', // Indigo
  '#10B981', // Emerald
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Violet
  '#06B6D4', // Cyan
  '#EC4899', // Pink
  '#84CC16', // Lime
]

// Get color based on score (0-1)
function getScoreColor(score: number): string {
  const r = Math.round(255 * (1 - score))
  const g = Math.round(255 * score * 0.8)
  const b = Math.round(100 + 100 * score)
  return `rgb(${r}, ${g}, ${b})`
}

interface Props {
  initialData?: GraphData
}

export function GraphAlgorithmsSimulator({ initialData }: Props) {
  const [graphData, setGraphData] = useState<GraphData>(initialData || SAMPLE_GRAPH)
  const [selectedCategory, setSelectedCategory] = useState<string>('centrality')
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('pagerank')
  const [sourceNode, setSourceNode] = useState<string>('')
  const [targetNode, setTargetNode] = useState<string>('')
  const [results, setResults] = useState<{
    nodeScores?: Map<string, number>
    path?: string[]
    distance?: number
    similarities?: Map<string, Map<string, number>>
  } | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const [useLargeGraph, setUseLargeGraph] = useState(false)

  const currentCategory = useMemo(
    () => ALGORITHM_CATEGORIES.find(c => c.id === selectedCategory),
    [selectedCategory]
  )

  const currentAlgorithm = useMemo(
    () => currentCategory?.algorithms.find(a => a.id === selectedAlgorithm),
    [currentCategory, selectedAlgorithm]
  )

  const needsSourceTarget = ['dijkstra', 'bfs', 'astar'].includes(selectedAlgorithm)

  const handleRun = useCallback(() => {
    const result = runAlgorithm(selectedAlgorithm, graphData, {
      sourceNode: sourceNode || graphData.nodes[0]?.id,
      targetNode: targetNode || graphData.nodes[graphData.nodes.length - 1]?.id,
    })
    setResults(result)
  }, [selectedAlgorithm, graphData, sourceNode, targetNode])

  const handleReset = useCallback(() => {
    setResults(null)
    setSourceNode('')
    setTargetNode('')
  }, [])

  const handleGraphToggle = useCallback(() => {
    setUseLargeGraph(!useLargeGraph)
    setGraphData(!useLargeGraph ? LARGE_SAMPLE_GRAPH : SAMPLE_GRAPH)
    setResults(null)
  }, [useLargeGraph])

  // Render graph visualization using SVG
  const renderGraph = useMemo(() => {
    const width = 600
    const height = 400
    const nodeRadius = 25

    // Simple force-directed layout simulation
    const positions = new Map<string, { x: number; y: number }>()
    const numNodes = graphData.nodes.length
    const angleStep = (2 * Math.PI) / numNodes

    graphData.nodes.forEach((node, i) => {
      const angle = i * angleStep
      const radius = Math.min(width, height) * 0.35
      positions.set(node.id, {
        x: width / 2 + radius * Math.cos(angle),
        y: height / 2 + radius * Math.sin(angle),
      })
    })

    const isCommunityAlgorithm = ['louvain', 'label-propagation'].includes(selectedAlgorithm)
    const isPathAlgorithm = ['dijkstra', 'bfs', 'astar'].includes(selectedAlgorithm)

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="border rounded-lg bg-gray-50 dark:bg-gray-900">
        {/* Edges */}
        {graphData.edges.map((edge, i) => {
          const sourcePos = positions.get(edge.source)
          const targetPos = positions.get(edge.target)
          if (!sourcePos || !targetPos) return null

          const isInPath = results?.path?.includes(edge.source) &&
            results?.path?.includes(edge.target) &&
            Math.abs(results.path.indexOf(edge.source) - results.path.indexOf(edge.target)) === 1

          return (
            <line
              key={i}
              x1={sourcePos.x}
              y1={sourcePos.y}
              x2={targetPos.x}
              y2={targetPos.y}
              stroke={isInPath ? '#10B981' : '#CBD5E1'}
              strokeWidth={isInPath ? 4 : 2}
              className="transition-all duration-300"
            />
          )
        })}

        {/* Nodes */}
        {graphData.nodes.map(node => {
          const pos = positions.get(node.id)
          if (!pos) return null

          let fillColor = '#6366F1'
          let label = node.label
          let score: number | undefined

          if (results?.nodeScores) {
            score = results.nodeScores.get(node.id)
            if (score !== undefined) {
              if (isCommunityAlgorithm) {
                fillColor = COMMUNITY_COLORS[Math.floor(score) % COMMUNITY_COLORS.length]
                label = `${node.label} (C${Math.floor(score)})`
              } else {
                fillColor = getScoreColor(score)
                label = `${node.label} (${(score * 100).toFixed(0)}%)`
              }
            }
          }

          if (isPathAlgorithm && results?.path) {
            if (results.path.includes(node.id)) {
              fillColor = '#10B981'
            }
            if (node.id === results.path[0]) {
              fillColor = '#4F46E5'
            }
            if (node.id === results.path[results.path.length - 1]) {
              fillColor = '#EF4444'
            }
          }

          return (
            <g key={node.id} className="cursor-pointer">
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={fillColor}
                stroke="white"
                strokeWidth={2}
                className="transition-all duration-300"
              />
              <text
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dy="0.35em"
                fill="white"
                fontSize={10}
                fontWeight="bold"
              >
                {node.id}
              </text>
              <text
                x={pos.x}
                y={pos.y + nodeRadius + 15}
                textAnchor="middle"
                fill="currentColor"
                fontSize={9}
                className="text-gray-600 dark:text-gray-400"
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    )
  }, [graphData, results, selectedAlgorithm])

  return (
    <div className="space-y-6">
      {/* Algorithm Selection */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {ALGORITHM_CATEGORIES.map(category => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id)
              setSelectedAlgorithm(category.algorithms[0].id)
              setResults(null)
            }}
            className={`p-4 rounded-lg border-2 transition-all text-left ${
              selectedCategory === category.id
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
            }`}
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.description}</p>
          </button>
        ))}
      </div>

      {/* Algorithm Picker */}
      {currentCategory && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <div className="flex flex-wrap gap-2">
            {currentCategory.algorithms.map(algo => (
              <button
                key={algo.id}
                onClick={() => {
                  setSelectedAlgorithm(algo.id)
                  setResults(null)
                }}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedAlgorithm === algo.id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                }`}
              >
                {algo.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Algorithm Info */}
      {currentAlgorithm && (
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-300">
                {currentAlgorithm.name}
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                {currentAlgorithm.description}
              </p>
              <div className="flex gap-4 mt-2 text-xs">
                <span className="text-gray-600 dark:text-gray-400">
                  복잡도: <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">{currentAlgorithm.complexity}</code>
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  활용: {currentAlgorithm.useCase}
                </span>
              </div>
            </div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              <Info className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4">
        {needsSourceTarget && (
          <>
            <select
              value={sourceNode}
              onChange={e => setSourceNode(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="">시작 노드 선택</option>
              {graphData.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
            <select
              value={targetNode}
              onChange={e => setTargetNode(e.target.value)}
              className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
            >
              <option value="">목표 노드 선택</option>
              {graphData.nodes.map(n => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </>
        )}

        <button
          onClick={handleRun}
          className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          <Play className="w-4 h-4" />
          실행
        </button>

        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          <RotateCcw className="w-4 h-4" />
          초기화
        </button>

        <button
          onClick={handleGraphToggle}
          className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 transition"
        >
          {useLargeGraph ? '작은 그래프' : '큰 그래프'}
        </button>
      </div>

      {/* Graph Visualization */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        {renderGraph}
      </div>

      {/* Results */}
      {results && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">결과</h3>

          {results.path && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                경로: {results.path.join(' → ')}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                거리: {results.distance}
              </p>
            </div>
          )}

          {results.nodeScores && !['louvain', 'label-propagation'].includes(selectedAlgorithm) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Array.from(results.nodeScores.entries())
                .sort((a, b) => b[1] - a[1])
                .map(([nodeId, score]) => {
                  const node = graphData.nodes.find(n => n.id === nodeId)
                  return (
                    <div
                      key={nodeId}
                      className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
                    >
                      <span className="text-sm font-medium">{node?.label || nodeId}</span>
                      <span
                        className="text-sm font-bold"
                        style={{ color: getScoreColor(score) }}
                      >
                        {(score * 100).toFixed(1)}%
                      </span>
                    </div>
                  )
                })}
            </div>
          )}

          {results.nodeScores && ['louvain', 'label-propagation'].includes(selectedAlgorithm) && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Array.from(results.nodeScores.entries()).map(([nodeId, community]) => {
                const node = graphData.nodes.find(n => n.id === nodeId)
                return (
                  <div
                    key={nodeId}
                    className="flex items-center justify-between p-2 bg-white dark:bg-gray-700 rounded"
                  >
                    <span className="text-sm font-medium">{node?.label || nodeId}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-bold text-white"
                      style={{ backgroundColor: COMMUNITY_COLORS[Math.floor(community) % COMMUNITY_COLORS.length] }}
                    >
                      Community {Math.floor(community)}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-sm">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">범례</h4>
        {needsSourceTarget ? (
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-indigo-600"></div>
              <span>시작 노드</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span>목표 노드</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500"></div>
              <span>경로상 노드</span>
            </div>
          </div>
        ) : ['louvain', 'label-propagation'].includes(selectedAlgorithm) ? (
          <div className="flex flex-wrap gap-4">
            {COMMUNITY_COLORS.slice(0, 4).map((color, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }}></div>
                <span>커뮤니티 {i}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getScoreColor(1) }}></div>
              <span>높은 점수</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getScoreColor(0.5) }}></div>
              <span>중간 점수</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: getScoreColor(0) }}></div>
              <span>낮은 점수</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
