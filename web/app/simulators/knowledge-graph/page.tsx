'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { ArrowLeft, Play, Info, Database, Zap, RefreshCw } from 'lucide-react'
import dynamic from 'next/dynamic'

// vis-network을 dynamic import로 로드
const KnowledgeGraphVis = dynamic(
  () => import('@/components/KnowledgeGraph'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }
)

interface Triple {
  subject: string
  predicate: string
  object: string
  confidence: number
  validatedBy?: 'baseline' | 'gpt' | 'user'
}

// 샘플 트리플 데이터 (RDF Editor와 연동되지 않은 경우 사용)
const sampleTriples: Triple[] = [
  // 인물 관계
  { subject: ':John', predicate: ':knows', object: ':Mary', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Mary', predicate: ':knows', object: ':Bob', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Bob', predicate: ':knows', object: ':Alice', confidence: 0.9, validatedBy: 'gpt' },
  { subject: ':Alice', predicate: ':marriedTo', object: ':John', confidence: 1.0, validatedBy: 'baseline' },

  // 타입 정보
  { subject: ':John', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Mary', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Bob', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Alice', predicate: ':type', object: ':Person', confidence: 1.0, validatedBy: 'baseline' },

  // 지리 관계 (전이 관계 예시)
  { subject: ':Seoul', predicate: ':locatedIn', object: ':Korea', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Korea', predicate: ':locatedIn', object: ':Asia', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Samsung', predicate: ':locatedIn', object: ':Seoul', confidence: 1.0, validatedBy: 'baseline' },

  // 기업 관계
  { subject: ':Samsung', predicate: ':type', object: ':Company', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Samsung', predicate: ':competes_with', object: ':SKHynix', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':SKHynix', predicate: ':type', object: ':Company', confidence: 1.0, validatedBy: 'baseline' },

  // 교육 관계
  { subject: ':Prof_Kim', predicate: ':teaches', object: ':AI_Course', confidence: 1.0, validatedBy: 'baseline' },
  { subject: ':Student_Lee', predicate: ':enrolledIn', object: ':AI_Course', confidence: 0.95, validatedBy: 'gpt' },
  { subject: ':AI_Course', predicate: ':type', object: ':Course', confidence: 1.0, validatedBy: 'baseline' },
]

export default function KnowledgeGraphPage() {
  const [triples, setTriples] = useState<Triple[]>(sampleTriples)
  const [minConfidence, setMinConfidence] = useState(0.7)
  const [filteredTriples, setFilteredTriples] = useState<Triple[]>(sampleTriples)
  const [showImportNotification, setShowImportNotification] = useState(false)
  const [dataSource, setDataSource] = useState<'sample' | 'rdf-editor'>('sample')

  // RDF Editor에서 데이터 가져오기
  useEffect(() => {
    const savedData = localStorage.getItem('rdf-editor-triples-for-kg')
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData)
        localStorage.removeItem('rdf-editor-triples-for-kg')

        const timestamp = new Date(parsed.timestamp)
        const now = new Date()
        const diffMinutes = (now.getTime() - timestamp.getTime()) / (1000 * 60)

        if (diffMinutes < 5 && parsed.triples && Array.isArray(parsed.triples)) {
          // 트리플 형식 변환
          const convertedTriples: Triple[] = parsed.triples.map((t: any) => ({
            subject: t.subject,
            predicate: t.predicate,
            object: t.object,
            confidence: t.confidence || 1.0,
            validatedBy: t.validatedBy || 'user'
          }))
          setTriples(convertedTriples)
          setDataSource('rdf-editor')
          setShowImportNotification(true)
          setTimeout(() => setShowImportNotification(false), 5000)
        }
      } catch (error) {
        console.error('Error loading triples from RDF Editor:', error)
      }
    }
  }, [])

  // 신뢰도 필터링
  useEffect(() => {
    setFilteredTriples(triples.filter(t => t.confidence >= minConfidence))
  }, [triples, minConfidence])

  const resetToSample = () => {
    setTriples(sampleTriples)
    setDataSource('sample')
  }

  // 통계 계산
  const stats = {
    total: triples.length,
    filtered: filteredTriples.length,
    avgConfidence: triples.length > 0
      ? (triples.reduce((sum, t) => sum + t.confidence, 0) / triples.length)
      : 0,
    uniqueSubjects: new Set(triples.map(t => t.subject)).size,
    uniquePredicates: new Set(triples.map(t => t.predicate)).size,
  }

  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        {/* 헤더 */}
        <div className="mb-6">
          <Link
            href="/simulators"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            시뮬레이터 목록으로
          </Link>
        </div>

        {/* Import 알림 */}
        {showImportNotification && (
          <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              <span>RDF Editor에서 {triples.length}개의 트리플을 가져왔습니다!</span>
            </div>
            <button
              onClick={() => setShowImportNotification(false)}
              className="text-green-600 dark:text-green-400 hover:text-green-800"
            >
              ✕
            </button>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Knowledge Graph Visualizer
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                RDF 트리플을 인터랙티브 그래프로 시각화합니다
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm ${
                dataSource === 'rdf-editor'
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}>
                {dataSource === 'rdf-editor' ? 'RDF Editor 데이터' : '샘플 데이터'}
              </span>
              {dataSource === 'rdf-editor' && (
                <button
                  onClick={resetToSample}
                  className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  title="샘플 데이터로 초기화"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 사용 방법 */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-indigo-900 dark:text-indigo-300">
              사용 방법
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• <strong>노드</strong>: 엔티티(주어/목적어)를 나타냅니다</li>
              <li>• <strong>엣지</strong>: 관계(술어)를 나타냅니다. 두께는 신뢰도를 반영합니다</li>
              <li>• <strong>드래그</strong>: 노드를 드래그하여 위치를 조정할 수 있습니다</li>
              <li>• <strong>줌</strong>: 마우스 휠로 확대/축소할 수 있습니다</li>
              <li>• <strong>클릭</strong>: 노드를 클릭하면 상세 정보가 표시됩니다</li>
            </ul>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">총 트리플</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.filtered}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">표시 중</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {(stats.avgConfidence * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">평균 신뢰도</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.uniqueSubjects}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">고유 주어</div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.uniquePredicates}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">고유 술어</div>
            </div>
          </div>

          {/* 신뢰도 필터 */}
          <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  최소 신뢰도:
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={minConfidence}
                  onChange={(e) => setMinConfidence(parseFloat(e.target.value))}
                  className="w-48"
                />
                <span className="text-sm font-semibold text-gray-900 dark:text-white min-w-[50px]">
                  {(minConfidence * 100).toFixed(0)}%
                </span>
              </div>
              <Link
                href="/simulators/rdf-editor"
                onClick={() => {
                  // RDF Editor로 현재 데이터 전달
                  localStorage.setItem('kg-triples-for-rdf', JSON.stringify({
                    triples: triples,
                    timestamp: new Date().toISOString(),
                    source: 'knowledge-graph'
                  }))
                }}
                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/50 flex items-center gap-2 text-sm"
              >
                <Play className="w-4 h-4" />
                RDF Editor에서 편집
              </Link>
            </div>
          </div>

          {/* 그래프 영역 */}
          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            {filteredTriples.length > 0 ? (
              <KnowledgeGraphVis triples={filteredTriples} height="600px" />
            ) : (
              <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">표시할 데이터가 없습니다</p>
                  <p className="text-sm">최소 신뢰도를 낮추거나 RDF Editor에서 데이터를 추가하세요</p>
                </div>
              </div>
            )}
          </div>

          {/* 범례 */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                엣지 색상 (관계 유형)
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-1 bg-red-500 rounded"></span>
                  <span>경쟁 관계 (competes_with)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-1 bg-green-500 rounded"></span>
                  <span>공급 관계 (supplies_to)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-1 bg-blue-500 rounded"></span>
                  <span>협력 관계 (partners_with, knows)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-1 bg-purple-500 rounded"></span>
                  <span>포함 관계 (locatedIn, type)</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                <Info className="w-5 h-5" />
                Knowledge Graph란?
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Knowledge Graph는 엔티티(Entity)와 그들 간의 관계(Relationship)를
                그래프 구조로 표현한 것입니다. Google, Meta, Amazon 등 대형 IT 기업들이
                검색, 추천, 자연어 처리에 활용하고 있습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
