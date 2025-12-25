'use client'

import { useState, useCallback, useMemo } from 'react'
import { Play, RotateCcw, Copy, Check, BookOpen, AlertCircle, Lightbulb } from 'lucide-react'
import {
  ExamplePair,
  ConversionResult,
  SAMPLE_SCHEMA,
  FEW_SHOT_EXAMPLES,
  QUERY_PATTERNS,
} from './types'

interface Props {
  // Optional custom schema
}

export function Text2CypherSimulator({}: Props) {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState<ConversionResult | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showExamples, setShowExamples] = useState(false)
  const [customExamples, setCustomExamples] = useState<ExamplePair[]>(FEW_SHOT_EXAMPLES)
  const [selectedExamples, setSelectedExamples] = useState<Set<number>>(new Set([0, 1, 2]))

  // Simulate Text2Cypher conversion
  const convertToCypher = useCallback((naturalQuery: string): ConversionResult => {
    const lowerQuery = naturalQuery.toLowerCase()
    let cypher = ''
    let confidence = 0
    const usedExamples: ExamplePair[] = []
    const warnings: string[] = []

    // Find matching patterns
    const matchedPatterns = QUERY_PATTERNS.filter(p => p.pattern.test(lowerQuery))

    // Find similar examples
    const selectedExamplesList = Array.from(selectedExamples).map(i => customExamples[i])
    const similarExamples = selectedExamplesList.filter(ex => {
      const exLower = ex.question.toLowerCase()
      // Simple word overlap similarity
      const exWords = exLower.split(/\s+/)
      const queryWords = lowerQuery.split(/\s+/)
      const overlap = exWords.filter(w => queryWords.includes(w)).length
      return overlap >= 2
    })

    usedExamples.push(...similarExamples.slice(0, 3))

    // Generate Cypher based on patterns
    if (lowerQuery.includes('tom hanks')) {
      if (matchedPatterns.some(p => p.type === 'acted')) {
        cypher = 'MATCH (p:Person {name: "Tom Hanks"})-[:ACTED_IN]->(m:Movie)\nRETURN m.title AS title'
        confidence = 0.92
      } else if (matchedPatterns.some(p => p.type === 'coactor')) {
        cypher = 'MATCH (tom:Person {name: "Tom Hanks"})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(co:Person)\nWHERE tom <> co\nRETURN DISTINCT co.name AS coActor'
        confidence = 0.88
      } else if (matchedPatterns.some(p => p.type === 'directed')) {
        cypher = 'MATCH (p:Person {name: "Tom Hanks"})-[:DIRECTED]->(m:Movie)\nRETURN m.title AS title'
        confidence = 0.85
      } else {
        cypher = 'MATCH (p:Person {name: "Tom Hanks"})\nRETURN p'
        confidence = 0.78
      }
    } else if (lowerQuery.includes('matrix')) {
      if (matchedPatterns.some(p => p.type === 'directed')) {
        cypher = 'MATCH (p:Person)-[:DIRECTED]->(m:Movie)\nWHERE m.title CONTAINS "Matrix"\nRETURN p.name AS director'
        confidence = 0.90
      } else if (matchedPatterns.some(p => p.type === 'acted')) {
        cypher = 'MATCH (p:Person)-[:ACTED_IN]->(m:Movie)\nWHERE m.title CONTAINS "Matrix"\nRETURN p.name AS actor'
        confidence = 0.88
      } else {
        cypher = 'MATCH (m:Movie)\nWHERE m.title CONTAINS "Matrix"\nRETURN m'
        confidence = 0.82
      }
    } else if (matchedPatterns.some(p => p.type === 'list')) {
      if (lowerQuery.includes('영화') || lowerQuery.includes('movie')) {
        cypher = 'MATCH (m:Movie)\nRETURN m.title AS title, m.released AS year\nORDER BY m.released DESC\nLIMIT 20'
        confidence = 0.90
      } else if (lowerQuery.includes('배우') || lowerQuery.includes('person')) {
        cypher = 'MATCH (p:Person)-[:ACTED_IN]->()\nRETURN DISTINCT p.name AS actor\nLIMIT 20'
        confidence = 0.88
      } else {
        cypher = 'MATCH (n)\nRETURN labels(n) AS type, count(*) AS count'
        confidence = 0.70
        warnings.push('구체적인 노드 타입을 지정하면 더 정확한 쿼리가 가능합니다.')
      }
    } else if (matchedPatterns.some(p => p.type === 'count')) {
      cypher = 'MATCH (m:Movie)\nRETURN count(m) AS totalMovies'
      confidence = 0.85

      if (matchedPatterns.some(p => p.type === 'year_filter')) {
        cypher = 'MATCH (m:Movie)\nWHERE m.released >= 2000\nRETURN count(m) AS count'
        confidence = 0.88
      }
    } else if (matchedPatterns.some(p => p.type === 'ranking')) {
      if (lowerQuery.includes('출연') || lowerQuery.includes('배우')) {
        cypher = 'MATCH (p:Person)-[:ACTED_IN]->(m:Movie)\nRETURN p.name AS actor, count(m) AS movieCount\nORDER BY movieCount DESC\nLIMIT 10'
        confidence = 0.90
      } else if (matchedPatterns.some(p => p.type === 'revenue')) {
        cypher = 'MATCH (m:Movie)\nWHERE m.revenue IS NOT NULL\nRETURN m.title, m.revenue\nORDER BY m.revenue DESC\nLIMIT 10'
        confidence = 0.88
      } else {
        cypher = 'MATCH (m:Movie)\nRETURN m.title, m.released\nORDER BY m.released DESC\nLIMIT 10'
        confidence = 0.75
      }
    } else if (matchedPatterns.some(p => p.type === 'genre')) {
      if (lowerQuery.includes('액션') || lowerQuery.includes('action')) {
        cypher = 'MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre {name: "Action"})\nRETURN m.title AS movie'
        confidence = 0.92
      } else {
        cypher = 'MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre)\nRETURN g.name AS genre, count(m) AS movieCount\nORDER BY movieCount DESC'
        confidence = 0.85
      }
    } else {
      // Fallback
      cypher = '// 질문을 이해하기 어렵습니다.\n// 더 구체적인 질문을 시도해주세요.\n\nMATCH (n)\nRETURN labels(n) AS type, count(*) AS count'
      confidence = 0.40
      warnings.push('질문이 모호합니다. 더 구체적인 표현을 사용해주세요.')
      warnings.push('예: "Tom Hanks가 출연한 영화는?", "2020년 이후 영화 목록"')
    }

    // Add confidence penalty if no examples matched
    if (usedExamples.length === 0) {
      confidence *= 0.85
      warnings.push('유사한 Few-shot 예제를 찾지 못했습니다. 예제를 추가하면 정확도가 향상됩니다.')
    }

    return { query: naturalQuery, cypher, confidence, usedExamples, warnings }
  }, [selectedExamples, customExamples])

  // Run conversion
  const handleConvert = useCallback(async () => {
    if (!query.trim()) return

    setIsProcessing(true)
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800))

    const converted = convertToCypher(query)
    setResult(converted)
    setIsProcessing(false)
  }, [query, convertToCypher])

  // Copy to clipboard
  const handleCopy = useCallback(() => {
    if (!result?.cypher) return
    navigator.clipboard.writeText(result.cypher)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [result?.cypher])

  // Reset
  const handleReset = useCallback(() => {
    setQuery('')
    setResult(null)
  }, [])

  // Toggle example selection
  const toggleExample = useCallback((index: number) => {
    setSelectedExamples(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }, [])

  // Confidence color
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return 'text-green-600 bg-green-50'
    if (confidence >= 0.70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="space-y-6">
      {/* Schema Info */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="font-semibold mb-3">Graph Schema (Movie Database)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="text-gray-500 mb-1">Node Labels</h4>
            <div className="flex flex-wrap gap-1">
              {SAMPLE_SCHEMA.nodeLabels.map(label => (
                <span key={label} className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded">
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-gray-500 mb-1">Relationship Types</h4>
            <div className="flex flex-wrap gap-1">
              {SAMPLE_SCHEMA.relationshipTypes.map(rel => (
                <span key={rel} className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                  {rel}
                </span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-gray-500 mb-1">Key Properties</h4>
            <div className="text-gray-600 dark:text-gray-400">
              Person: name, born | Movie: title, released, revenue
            </div>
          </div>
        </div>
      </div>

      {/* Few-shot Examples Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h3 className="font-semibold">Few-shot Examples</h3>
            <span className="text-sm text-gray-500">({selectedExamples.size}개 선택됨)</span>
          </div>
          <button
            onClick={() => setShowExamples(!showExamples)}
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            {showExamples ? '접기' : '펼치기'}
          </button>
        </div>

        {showExamples && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {customExamples.map((ex, idx) => (
              <div
                key={idx}
                onClick={() => toggleExample(idx)}
                className={`p-3 rounded-lg cursor-pointer transition border ${
                  selectedExamples.has(idx)
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300'
                    : 'bg-gray-50 dark:bg-gray-700 border-transparent hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="text-sm font-medium">Q: {ex.question}</div>
                    <code className="text-xs text-gray-600 dark:text-gray-400 mt-1 block">
                      {ex.cypher.length > 60 ? ex.cypher.slice(0, 60) + '...' : ex.cypher}
                    </code>
                  </div>
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedExamples.has(idx) ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                  }`}>
                    {selectedExamples.has(idx) && <Check className="w-3 h-3 text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !isProcessing && handleConvert()}
            placeholder="자연어 질문을 입력하세요 (예: Tom Hanks가 출연한 영화는?)"
            className="w-full px-4 py-3 pr-12 border rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500"
            disabled={isProcessing}
          />
          <button
            onClick={handleConvert}
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

      {/* Result */}
      {result && (
        <div className="space-y-4">
          {/* Generated Cypher */}
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Generated Cypher</span>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-sm font-medium ${getConfidenceColor(result.confidence)}`}>
                  신뢰도: {(result.confidence * 100).toFixed(0)}%
                </span>
                <button
                  onClick={handleCopy}
                  className="p-1.5 text-gray-400 hover:text-white rounded transition"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{result.cypher}</code>
            </pre>
          </div>

          {/* Warnings */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 dark:text-yellow-300">주의사항</h4>
                  <ul className="mt-1 text-sm text-yellow-700 dark:text-yellow-400 space-y-1">
                    {result.warnings.map((w, i) => (
                      <li key={i}>• {w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Used Examples */}
          {result.usedExamples.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">참조된 Few-shot 예제</h4>
                  <div className="mt-2 space-y-2">
                    {result.usedExamples.map((ex, i) => (
                      <div key={i} className="text-sm bg-white dark:bg-gray-800 p-2 rounded">
                        <div className="text-gray-700 dark:text-gray-300">Q: {ex.question}</div>
                        <code className="text-xs text-gray-500">{ex.cypher}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sample Queries */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="text-sm font-semibold mb-2">예시 질문</h4>
        <div className="flex flex-wrap gap-2">
          {[
            'Tom Hanks가 출연한 영화는?',
            'Matrix 영화의 감독',
            '모든 영화 목록',
            '2000년 이후 영화 수',
            '가장 많이 출연한 배우 5명',
            '액션 장르 영화들',
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

      {/* Tips */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg p-4">
        <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">💡 Text2Cypher 팁</h4>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• <strong>Few-shot 예제</strong>를 많이 선택할수록 정확도가 향상됩니다</li>
          <li>• 노드 라벨과 관계 유형을 명시하면 더 정확한 쿼리가 생성됩니다</li>
          <li>• 모호한 질문은 신뢰도가 낮아집니다</li>
          <li>• 실제 LLM 기반 Text2Cypher는 GPT-4, Claude 등을 사용합니다</li>
        </ul>
      </div>
    </div>
  )
}
