'use client'

import { useState, useCallback, useMemo } from 'react'
import { Search, RotateCcw, ChevronRight, Play, Info } from 'lucide-react'
import {
  RetrievalStrategy,
  GraphEntity,
  RetrievalResult,
  SAMPLE_ENTITIES,
  SAMPLE_RELATIONS,
  SAMPLE_COMMUNITIES,
  GRAPHRAG_STEPS,
  GraphRAGStep,
  ENTITY_COLORS
} from './types'

interface Props {
  // Optional custom data
}

export function GraphRAGSimulator({}: Props) {
  const [query, setQuery] = useState('')
  const [strategy, setStrategy] = useState<RetrievalStrategy>('hybrid')
  const [steps, setSteps] = useState<GraphRAGStep[]>(GRAPHRAG_STEPS.map(s => ({ ...s })))
  const [currentStep, setCurrentStep] = useState(-1)
  const [results, setResults] = useState<RetrievalResult[]>([])
  const [selectedEntity, setSelectedEntity] = useState<GraphEntity | null>(null)
  const [generatedResponse, setGeneratedResponse] = useState('')
  const [showInfo, setShowInfo] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Simulate entity extraction from query
  const extractEntities = useCallback((queryText: string): string[] => {
    const keywords = queryText.toLowerCase()
    const found: string[] = []

    SAMPLE_ENTITIES.forEach(entity => {
      if (keywords.includes(entity.name.toLowerCase()) ||
          keywords.includes(entity.id.toLowerCase())) {
        found.push(entity.id)
      }
    })

    // Also check for keywords like "CEO", "AI", "LLM"
    if (keywords.includes('ceo') || keywords.includes('leader')) {
      found.push(...['satya', 'sam', 'dario', 'sundar'].filter(id => !found.includes(id)))
    }
    if (keywords.includes('ai') || keywords.includes('llm') || keywords.includes('language model')) {
      found.push(...['gpt4', 'claude', 'gemini'].filter(id => !found.includes(id)))
    }

    return found.slice(0, 5) // Limit to 5
  }, [])

  // Simulate vector search (mock semantic similarity)
  const vectorSearch = useCallback((queryText: string): RetrievalResult[] => {
    const keywords = queryText.toLowerCase()
    const scores: RetrievalResult[] = []

    SAMPLE_ENTITIES.forEach(entity => {
      let score = 0

      // Simple keyword matching as mock similarity
      if (keywords.includes(entity.name.toLowerCase())) score += 0.9
      if (keywords.includes(entity.type.toLowerCase())) score += 0.3
      Object.values(entity.properties).forEach(val => {
        if (keywords.includes(val.toLowerCase())) score += 0.2
      })

      // Add some randomness for demo
      score = Math.min(1, score + Math.random() * 0.1)

      if (score > 0.2) {
        scores.push({ entity, score, source: 'vector' })
      }
    })

    return scores.sort((a, b) => b.score - a.score).slice(0, 5)
  }, [])

  // Simulate graph traversal
  const graphTraversal = useCallback((entityIds: string[], depth = 2): RetrievalResult[] => {
    const visited = new Set<string>(entityIds)
    const results: RetrievalResult[] = []

    // BFS traversal
    let currentLevel = entityIds
    let currentDepth = 0

    while (currentDepth < depth && currentLevel.length > 0) {
      const nextLevel: string[] = []

      for (const entityId of currentLevel) {
        // Find connected entities
        SAMPLE_RELATIONS.forEach(rel => {
          let connected: string | null = null
          let path: string[] = []

          if (rel.source === entityId && !visited.has(rel.target)) {
            connected = rel.target
            path = [entityId, rel.type, rel.target]
          } else if (rel.target === entityId && !visited.has(rel.source)) {
            connected = rel.source
            path = [entityId, rel.type, rel.source]
          }

          if (connected) {
            visited.add(connected)
            nextLevel.push(connected)
            const entity = SAMPLE_ENTITIES.find(e => e.id === connected)
            if (entity) {
              results.push({
                entity,
                score: 0.7 - currentDepth * 0.2,
                source: 'graph',
                path
              })
            }
          }
        })
      }

      currentLevel = nextLevel
      currentDepth++
    }

    return results
  }, [])

  // Simulate community lookup
  const communityLookup = useCallback((entityIds: string[]): RetrievalResult[] => {
    const results: RetrievalResult[] = []
    const foundCommunities = new Set<number>()

    entityIds.forEach(entityId => {
      SAMPLE_COMMUNITIES.forEach(community => {
        if (community.entities.includes(entityId) && !foundCommunities.has(community.id)) {
          foundCommunities.add(community.id)

          // Add community summary as a special entity
          results.push({
            entity: {
              id: `community-${community.id}`,
              type: 'Event' as const, // Reusing Event type for styling
              name: community.name,
              properties: { summary: community.summary }
            },
            score: 0.8,
            source: 'community'
          })
        }
      })
    })

    return results
  }, [])

  // Generate mock response
  const generateResponse = useCallback((queryText: string, retrievedResults: RetrievalResult[]): string => {
    const entityNames = retrievedResults
      .filter(r => r.source !== 'community')
      .map(r => r.entity.name)
      .slice(0, 5)

    const communityInfo = retrievedResults
      .filter(r => r.source === 'community')
      .map(r => r.entity.properties.summary)
      .join(' ')

    if (entityNames.length === 0) {
      return '관련 정보를 찾을 수 없습니다. 다른 질문을 시도해보세요.'
    }

    // Generate contextual response based on query keywords
    const lowerQuery = queryText.toLowerCase()

    if (lowerQuery.includes('microsoft') && lowerQuery.includes('openai')) {
      return `Microsoft는 OpenAI에 $10B를 투자했으며, 이를 통해 GPT-4를 GitHub Copilot 등의 제품에 통합했습니다. ${communityInfo}`
    }

    if (lowerQuery.includes('google') && lowerQuery.includes('anthropic')) {
      return `Google은 Anthropic에 투자하여 AI 경쟁력을 강화하고 있습니다. Anthropic은 Claude를 개발했으며, Google은 자체 LLM인 Gemini를 출시했습니다. ${communityInfo}`
    }

    if (lowerQuery.includes('ceo') || lowerQuery.includes('leader')) {
      return `주요 AI 기업 CEO: Satya Nadella (Microsoft), Sam Altman (OpenAI), Dario Amodei (Anthropic), Sundar Pichai (Google). ${communityInfo}`
    }

    return `검색된 관련 엔티티: ${entityNames.join(', ')}. ${communityInfo || '추가 컨텍스트를 확인해주세요.'}`
  }, [])

  // Run GraphRAG pipeline
  const runPipeline = useCallback(async () => {
    if (!query.trim()) return

    setIsProcessing(true)
    setResults([])
    setGeneratedResponse('')
    setSteps(GRAPHRAG_STEPS.map(s => ({ ...s, status: 'pending' })))

    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

    // Step 1: Query Analysis
    setCurrentStep(0)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 0 ? 'active' : s.status })))
    await delay(500)
    const extractedIds = extractEntities(query)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 0 ? 'complete' : s.status })))

    // Step 2: Vector Search (if hybrid or local)
    setCurrentStep(1)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 1 ? 'active' : s.status })))
    await delay(600)
    let allResults: RetrievalResult[] = []
    if (strategy === 'local' || strategy === 'hybrid') {
      allResults = [...vectorSearch(query)]
    }
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 1 ? 'complete' : s.status })))

    // Step 3: Graph Traversal (if hybrid or global)
    setCurrentStep(2)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 2 ? 'active' : s.status })))
    await delay(700)
    if (strategy === 'global' || strategy === 'hybrid') {
      const graphResults = graphTraversal(extractedIds.length > 0 ? extractedIds : allResults.map(r => r.entity.id))
      allResults = [...allResults, ...graphResults]
    }
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 2 ? 'complete' : s.status })))

    // Step 4: Community Lookup (only for global/hybrid)
    setCurrentStep(3)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 3 ? 'active' : s.status })))
    await delay(500)
    if (strategy === 'global' || strategy === 'hybrid') {
      const communityResults = communityLookup([...extractedIds, ...allResults.map(r => r.entity.id)])
      allResults = [...allResults, ...communityResults]
    }
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 3 ? 'complete' : s.status })))

    // Step 5: Context Aggregation
    setCurrentStep(4)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 4 ? 'active' : s.status })))
    await delay(400)
    // Deduplicate and sort
    const uniqueResults = Array.from(
      new Map(allResults.map(r => [r.entity.id, r])).values()
    ).sort((a, b) => b.score - a.score).slice(0, 10)
    setResults(uniqueResults)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 4 ? 'complete' : s.status })))

    // Step 6: Response Generation
    setCurrentStep(5)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 5 ? 'active' : s.status })))
    await delay(800)
    const response = generateResponse(query, uniqueResults)
    setGeneratedResponse(response)
    setSteps(prev => prev.map((s, i) => ({ ...s, status: i === 5 ? 'complete' : s.status })))

    setCurrentStep(-1)
    setIsProcessing(false)
  }, [query, strategy, extractEntities, vectorSearch, graphTraversal, communityLookup, generateResponse])

  // Reset
  const handleReset = useCallback(() => {
    setQuery('')
    setResults([])
    setGeneratedResponse('')
    setSteps(GRAPHRAG_STEPS.map(s => ({ ...s, status: 'pending' })))
    setCurrentStep(-1)
    setSelectedEntity(null)
  }, [])

  // Render graph visualization
  const renderGraph = useMemo(() => {
    const width = 600
    const height = 350
    const centerX = width / 2
    const centerY = height / 2

    // Position entities in a circle
    const positions = new Map<string, { x: number; y: number }>()
    const numEntities = SAMPLE_ENTITIES.length
    const radius = Math.min(width, height) * 0.35

    SAMPLE_ENTITIES.forEach((entity, i) => {
      const angle = (i * 2 * Math.PI) / numEntities - Math.PI / 2
      positions.set(entity.id, {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      })
    })

    const resultIds = new Set(results.map(r => r.entity.id))

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="border rounded-lg bg-gray-50 dark:bg-gray-900">
        {/* Relations */}
        {SAMPLE_RELATIONS.map((rel, i) => {
          const sourcePos = positions.get(rel.source)
          const targetPos = positions.get(rel.target)
          if (!sourcePos || !targetPos) return null

          const isHighlighted = resultIds.has(rel.source) || resultIds.has(rel.target)

          return (
            <g key={i}>
              <line
                x1={sourcePos.x}
                y1={sourcePos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke={isHighlighted ? '#6366F1' : '#CBD5E1'}
                strokeWidth={isHighlighted ? 2 : 1}
                opacity={isHighlighted ? 0.8 : 0.4}
              />
            </g>
          )
        })}

        {/* Entities */}
        {SAMPLE_ENTITIES.map(entity => {
          const pos = positions.get(entity.id)
          if (!pos) return null

          const isResult = resultIds.has(entity.id)
          const result = results.find(r => r.entity.id === entity.id)
          const color = ENTITY_COLORS[entity.type] || '#6366F1'

          return (
            <g
              key={entity.id}
              onClick={() => setSelectedEntity(entity)}
              className="cursor-pointer"
            >
              <circle
                cx={pos.x}
                cy={pos.y}
                r={isResult ? 18 : 12}
                fill={color}
                opacity={isResult ? 1 : 0.5}
                stroke={isResult ? '#fff' : 'none'}
                strokeWidth={2}
                className="transition-all duration-300"
              />
              <text
                x={pos.x}
                y={pos.y + 28}
                textAnchor="middle"
                fontSize={9}
                fill="currentColor"
                className="text-gray-600 dark:text-gray-400"
              >
                {entity.name.length > 10 ? entity.name.slice(0, 10) + '...' : entity.name}
              </text>
              {isResult && result && (
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fontSize={8}
                  fill="#fff"
                  fontWeight="bold"
                >
                  {result.source === 'vector' ? 'V' : result.source === 'graph' ? 'G' : 'C'}
                </text>
              )}
            </g>
          )
        })}

        {/* Legend */}
        <g transform="translate(10, 10)">
          {Object.entries(ENTITY_COLORS).map(([type, color], idx) => (
            <g key={type} transform={`translate(0, ${idx * 18})`}>
              <circle cx={6} cy={6} r={5} fill={color} />
              <text x={16} y={10} fontSize={10} fill="currentColor">{type}</text>
            </g>
          ))}
        </g>

        {/* Source Legend */}
        <g transform={`translate(${width - 80}, 10)`}>
          <text fontSize={9} fill="currentColor" fontWeight="bold">검색 소스:</text>
          <g transform="translate(0, 14)">
            <circle cx={6} cy={0} r={5} fill="#6366F1" />
            <text x={14} y={4} fontSize={9} fill="currentColor">V: Vector</text>
          </g>
          <g transform="translate(0, 28)">
            <circle cx={6} cy={0} r={5} fill="#10B981" />
            <text x={14} y={4} fontSize={9} fill="currentColor">G: Graph</text>
          </g>
          <g transform="translate(0, 42)">
            <circle cx={6} cy={0} r={5} fill="#F59E0B" />
            <text x={14} y={4} fontSize={9} fill="currentColor">C: Community</text>
          </g>
        </g>
      </svg>
    )
  }, [results])

  return (
    <div className="space-y-6">
      {/* Pipeline Steps */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
        <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-3">GraphRAG Pipeline</h3>
        <div className="flex items-center justify-between flex-wrap gap-2">
          {steps.map((step, idx) => (
            <div key={step.name} className="flex items-center">
              <div
                className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                  step.status === 'complete'
                    ? 'bg-green-600 text-white'
                    : step.status === 'active'
                    ? 'bg-indigo-600 text-white animate-pulse'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <span className="text-lg">{step.icon}</span>
                <span className="text-[10px] mt-1 whitespace-nowrap">{step.name}</span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight className={`w-4 h-4 mx-1 ${step.status === 'complete' ? 'text-green-600' : 'text-gray-400'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Selection */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">검색 전략:</span>
          {(['local', 'global', 'hybrid'] as RetrievalStrategy[]).map(s => (
            <button
              key={s}
              onClick={() => setStrategy(s)}
              className={`px-3 py-1.5 rounded-lg text-sm transition ${
                strategy === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {s === 'local' ? 'Local (Vector)' : s === 'global' ? 'Global (Graph)' : 'Hybrid'}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Info Panel */}
      {showInfo && (
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm">
          <h4 className="font-semibold mb-2">검색 전략 설명</h4>
          <ul className="space-y-1 text-gray-700 dark:text-gray-300">
            <li><strong>Local:</strong> 벡터 시맨틱 검색만 사용. 빠르지만 관계 정보 부족.</li>
            <li><strong>Global:</strong> 그래프 순회 + 커뮤니티 요약. 전체적 맥락 파악에 유리.</li>
            <li><strong>Hybrid:</strong> Local + Global 결합. 가장 풍부한 컨텍스트 제공.</li>
          </ul>
        </div>
      )}

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isProcessing && runPipeline()}
            placeholder="질문을 입력하세요 (예: Microsoft와 OpenAI의 관계, AI CEO는 누구?)"
            className="w-full px-4 py-3 pr-12 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
            disabled={isProcessing}
          />
          <button
            onClick={runPipeline}
            disabled={isProcessing || !query.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
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
        {/* Graph Visualization */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <h3 className="font-semibold mb-3">Knowledge Graph</h3>
            {renderGraph}
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Retrieved Entities */}
          {results.length > 0 && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-3">검색 결과 ({results.length}개)</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {results.map(result => (
                  <div
                    key={result.entity.id}
                    className="p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => setSelectedEntity(result.entity)}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="px-2 py-0.5 rounded text-xs text-white"
                        style={{ backgroundColor: ENTITY_COLORS[result.entity.type] }}
                      >
                        {result.entity.type}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {result.source === 'vector' ? '📊' : result.source === 'graph' ? '🕸️' : '👥'}
                        </span>
                        <span className="font-bold text-indigo-600">
                          {(result.score * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                    <div className="font-medium mt-1">{result.entity.name}</div>
                    {result.path && (
                      <div className="text-xs text-gray-500 mt-1">
                        경로: {result.path.join(' → ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Entity */}
          {selectedEntity && (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
              <h3 className="font-semibold mb-2">{selectedEntity.name}</h3>
              <span
                className="px-2 py-0.5 rounded text-xs text-white"
                style={{ backgroundColor: ENTITY_COLORS[selectedEntity.type] }}
              >
                {selectedEntity.type}
              </span>
              <div className="mt-3 space-y-1 text-sm">
                {Object.entries(selectedEntity.properties).map(([key, value]) => (
                  <div key={key}>
                    <span className="text-gray-500">{key}:</span> {value}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-xs text-gray-500 mt-2"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Generated Response */}
      {generatedResponse && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
          <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">✨ Generated Response</h3>
          <p className="text-gray-800 dark:text-gray-200">{generatedResponse}</p>
        </div>
      )}

      {/* Sample Queries */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2">예시 질문</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Microsoft와 OpenAI의 관계는?',
            'AI 기업 CEO는 누구?',
            'GPT-4를 개발한 회사는?',
            'Google과 Anthropic',
          ].map(q => (
            <button
              key={q}
              onClick={() => setQuery(q)}
              className="px-3 py-1.5 bg-white dark:bg-gray-700 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
