'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Search, RotateCcw, Plus, ChevronRight } from 'lucide-react'
import {
  TextDocument,
  EmbeddingPoint,
  SAMPLE_DOCUMENTS,
  CATEGORY_COLORS,
  RAG_STEPS,
  ChunkingStrategy
} from './types'
import {
  processDocuments,
  searchSimilar,
  generateEmbedding,
  projectTo2D,
  chunkText,
  getEmbeddingStats
} from './embedding'

interface Props {
  initialDocuments?: TextDocument[]
}

export function EmbeddingVisualizer({ initialDocuments }: Props) {
  const [documents, setDocuments] = useState<TextDocument[]>(initialDocuments || SAMPLE_DOCUMENTS)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Array<{ document: TextDocument; similarity: number }>>([])
  const [selectedPoint, setSelectedPoint] = useState<EmbeddingPoint | null>(null)
  const [queryPoint, setQueryPoint] = useState<EmbeddingPoint | null>(null)
  const [showLabels, setShowLabels] = useState(true)
  const [activeStep, setActiveStep] = useState(0)
  const [chunkingStrategy, setChunkingStrategy] = useState<ChunkingStrategy>('sentence')
  const [customText, setCustomText] = useState('')
  const [showChunkDemo, setShowChunkDemo] = useState(false)
  const [chunks, setChunks] = useState<string[]>([])

  // Process documents to get embedding points
  const points = useMemo(() => processDocuments(documents), [documents])

  // Stats
  const stats = useMemo(() => getEmbeddingStats(points), [points])

  // Handle search
  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setQueryPoint(null)
      return
    }

    const results = searchSimilar(searchQuery, documents, 5)
    setSearchResults(results)

    // Create query point for visualization
    const embedding = generateEmbedding(searchQuery)
    const { x, y } = projectTo2D(embedding)
    setQueryPoint({
      id: 'query',
      text: searchQuery,
      x,
      y,
      category: 'Query'
    })

    // Animate through RAG steps
    setActiveStep(0)
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev >= RAG_STEPS.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 800)
  }, [searchQuery, documents])

  // Handle chunking demo
  const handleChunk = useCallback(() => {
    const text = customText || 'Natural language processing is a field of AI. It enables computers to understand human language. This technology powers chatbots and translation services. Machine learning algorithms learn from large text datasets.'
    const result = chunkText(text, chunkingStrategy, { chunkSize: 50, overlap: 10 })
    setChunks(result)
    setShowChunkDemo(true)
  }, [customText, chunkingStrategy])

  // Add custom document
  const handleAddDocument = useCallback(() => {
    if (!customText.trim()) return

    const newDoc: TextDocument = {
      id: `custom-${Date.now()}`,
      text: customText,
      category: 'Custom'
    }

    setDocuments(prev => [...prev, newDoc])
    setCustomText('')
  }, [customText])

  // Reset
  const handleReset = useCallback(() => {
    setDocuments(SAMPLE_DOCUMENTS)
    setSearchQuery('')
    setSearchResults([])
    setQueryPoint(null)
    setSelectedPoint(null)
    setActiveStep(0)
    setChunks([])
    setShowChunkDemo(false)
  }, [])

  // Render visualization
  const renderVisualization = useMemo(() => {
    const width = 600
    const height = 400

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="border rounded-lg bg-gray-50 dark:bg-gray-900">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#grid)" />

        {/* Lines from query to results */}
        {queryPoint && searchResults.map((result, idx) => {
          const point = points.find(p => p.id === result.document.id)
          if (!point) return null

          return (
            <line
              key={`line-${idx}`}
              x1={queryPoint.x}
              y1={queryPoint.y}
              x2={point.x}
              y2={point.y}
              stroke={CATEGORY_COLORS['Query']}
              strokeWidth={2 * result.similarity}
              strokeDasharray="5,5"
              opacity={0.5}
            />
          )
        })}

        {/* Document points */}
        {points.map(point => {
          const isResult = searchResults.some(r => r.document.id === point.id)
          const result = searchResults.find(r => r.document.id === point.id)
          const color = CATEGORY_COLORS[point.category || 'Tech'] || '#6366F1'

          return (
            <g
              key={point.id}
              onClick={() => setSelectedPoint(point)}
              className="cursor-pointer"
            >
              <circle
                cx={point.x}
                cy={point.y}
                r={isResult ? 12 + (result?.similarity || 0) * 10 : 8}
                fill={color}
                opacity={isResult ? 1 : 0.6}
                stroke={isResult ? '#000' : 'none'}
                strokeWidth={2}
                className="transition-all duration-300"
              />
              {showLabels && (
                <text
                  x={point.x}
                  y={point.y + 20}
                  textAnchor="middle"
                  fontSize={9}
                  fill="currentColor"
                  className="text-gray-600 dark:text-gray-400"
                >
                  {point.text.slice(0, 15)}...
                </text>
              )}
              {isResult && result && (
                <text
                  x={point.x}
                  y={point.y - 15}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight="bold"
                  fill={color}
                >
                  {(result.similarity * 100).toFixed(0)}%
                </text>
              )}
            </g>
          )
        })}

        {/* Query point */}
        {queryPoint && (
          <g>
            <circle
              cx={queryPoint.x}
              cy={queryPoint.y}
              r={15}
              fill={CATEGORY_COLORS['Query']}
              stroke="#fff"
              strokeWidth={3}
            />
            <text
              x={queryPoint.x}
              y={queryPoint.y + 4}
              textAnchor="middle"
              fontSize={10}
              fill="#fff"
              fontWeight="bold"
            >
              Q
            </text>
          </g>
        )}

        {/* Legend */}
        <g transform="translate(20, 20)">
          {Object.entries(CATEGORY_COLORS).map(([cat, color], idx) => (
            <g key={cat} transform={`translate(0, ${idx * 20})`}>
              <circle cx={8} cy={8} r={6} fill={color} />
              <text x={20} y={12} fontSize={11} fill="currentColor">{cat}</text>
            </g>
          ))}
        </g>
      </svg>
    )
  }, [points, queryPoint, searchResults, showLabels])

  return (
    <div className="space-y-6">
      {/* RAG Pipeline Steps */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
        <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3">RAG Pipeline</h3>
        <div className="flex items-center justify-between flex-wrap gap-2">
          {RAG_STEPS.map((step, idx) => (
            <div key={step.name} className="flex items-center">
              <div
                className={`flex flex-col items-center p-3 rounded-lg transition-all ${
                  idx <= activeStep
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-xl">{step.icon}</span>
                <span className="text-xs mt-1">{step.name}</span>
              </div>
              {idx < RAG_STEPS.length - 1 && (
                <ChevronRight className={`w-5 h-5 mx-1 ${idx < activeStep ? 'text-indigo-600' : 'text-gray-400'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="검색어를 입력하세요 (예: machine learning, stock market)"
            className="w-full px-4 py-3 pr-12 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 flex items-center gap-2"
        >
          <RotateCcw className="w-4 h-4" />
          초기화
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Embedding Space (2D Projection)</h3>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={e => setShowLabels(e.target.checked)}
                  className="rounded"
                />
                레이블 표시
              </label>
            </div>
            {renderVisualization}
            <p className="text-xs text-gray-500 mt-2">
              * 원 크기는 검색 유사도를 나타냅니다. 노드를 클릭하면 상세 정보가 표시됩니다.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-3">통계</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <div className="text-gray-500">문서 수</div>
                <div className="font-bold text-lg">{stats.totalDocuments}</div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                <div className="text-gray-500">카테고리</div>
                <div className="font-bold text-lg">{stats.categories}</div>
              </div>
            </div>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-3">검색 결과 (Top 5)</h3>
              <div className="space-y-2">
                {searchResults.map((result, idx) => (
                  <div
                    key={result.document.id}
                    className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="px-2 py-0.5 rounded text-xs text-white"
                        style={{ backgroundColor: CATEGORY_COLORS[result.document.category || 'Tech'] }}
                      >
                        {result.document.category}
                      </span>
                      <span className="font-bold text-indigo-600">
                        {(result.similarity * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-xs">
                      {result.document.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Point Info */}
          {selectedPoint && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-2">선택된 문서</h3>
              <span
                className="px-2 py-0.5 rounded text-xs text-white"
                style={{ backgroundColor: CATEGORY_COLORS[selectedPoint.category || 'Tech'] }}
              >
                {selectedPoint.category}
              </span>
              <p className="text-sm mt-2">{selectedPoint.text}</p>
              <button
                onClick={() => setSelectedPoint(null)}
                className="text-xs text-gray-500 mt-2"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chunking Demo */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Chunking 전략 실험</h3>
        <div className="flex flex-wrap gap-4 mb-4">
          <select
            value={chunkingStrategy}
            onChange={e => setChunkingStrategy(e.target.value as ChunkingStrategy)}
            className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
          >
            <option value="fixed">Fixed Size (고정 길이)</option>
            <option value="sentence">Sentence (문장 단위)</option>
            <option value="paragraph">Paragraph (문단 단위)</option>
            <option value="semantic">Semantic (의미 단위)</option>
          </select>
          <button
            onClick={handleChunk}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            청킹 실행
          </button>
        </div>

        <textarea
          value={customText}
          onChange={e => setCustomText(e.target.value)}
          placeholder="청킹할 텍스트를 입력하거나 비워두면 샘플 텍스트가 사용됩니다..."
          className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 h-24"
        />

        {showChunkDemo && chunks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">청킹 결과 ({chunks.length}개)</h4>
            <div className="flex flex-wrap gap-2">
              {chunks.map((chunk, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 bg-white dark:bg-gray-700 rounded-lg border text-sm"
                >
                  <span className="text-indigo-600 font-bold mr-2">#{idx + 1}</span>
                  {chunk.trim()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Custom Document */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-3">문서 추가</h3>
        <div className="flex gap-4">
          <input
            type="text"
            value={customText}
            onChange={e => setCustomText(e.target.value)}
            placeholder="새 문서 텍스트 입력..."
            className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-700"
          />
          <button
            onClick={handleAddDocument}
            disabled={!customText.trim()}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            추가
          </button>
        </div>
      </div>
    </div>
  )
}
