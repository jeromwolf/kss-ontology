'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import KnowledgeGraph from '@/components/KnowledgeGraph'

interface Triple {
  subject: string
  predicate: string
  object: string
  confidence: number
  validatedBy: 'baseline' | 'gpt' | 'user'
}

export default function KnowledgeGraphPage() {
  const router = useRouter()
  const [triples, setTriples] = useState<Triple[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [minConfidence, setMinConfidence] = useState(0.7)
  const [stats, setStats] = useState<{
    total: number
    highConfidence: number
    avgConfidence: number
  } | null>(null)

  useEffect(() => {
    fetchGraphData()
    fetchStats()
  }, [minConfidence])

  const fetchGraphData = async () => {
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`/api/ontology/graph?minConfidence=${minConfidence}`)

      if (res.status === 401) {
        router.push('/login')
        return
      }

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch graph data')
      }

      setTriples(data.data.triples)
    } catch (err: any) {
      console.error('Failed to fetch graph:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/ontology/stats')
      const data = await res.json()

      if (res.ok && data.success) {
        setStats({
          total: data.data.totalTriples,
          highConfidence: data.data.highConfidenceTriples,
          avgConfidence: data.data.avgConfidence,
        })
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              >
                ← 대시보드
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Knowledge Graph</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">기업 관계 시각화</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">총 Triple 수</div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">고신뢰도 Triple</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.highConfidence}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">≥ 80% 신뢰도</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">평균 신뢰도</div>
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                {(stats.avgConfidence * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Controls */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4 mb-6">
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
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {(minConfidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              표시 중: {triples.length}개 관계
            </div>
          </div>
        </div>

        {/* Graph Container */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-sm text-gray-600">데이터 로딩 중...</p>
              </div>
            </div>
          ) : triples.length === 0 ? (
            <div className="flex items-center justify-center h-96 text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <p className="text-lg mb-2">표시할 데이터가 없습니다</p>
                <p className="text-sm">최소 신뢰도를 낮춰보세요</p>
              </div>
            </div>
          ) : (
            <KnowledgeGraph triples={triples} height="700px" />
          )}
        </div>

        {/* Info Section */}
        <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Knowledge Graph 사용 안내
          </h3>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>• <strong>노드</strong>: 기업을 나타냅니다 (클릭하면 상세 정보 표시)</li>
            <li>• <strong>엣지</strong>: 기업 간 관계를 나타냅니다 (색상은 관계 유형, 두께는 신뢰도)</li>
            <li>• <strong>드래그</strong>: 노드를 드래그하여 위치를 조정할 수 있습니다</li>
            <li>• <strong>줌</strong>: 마우스 휠로 확대/축소할 수 있습니다</li>
            <li>• <strong>네비게이션</strong>: 우측 하단 버튼으로 그래프를 조작할 수 있습니다</li>
          </ul>
          <div className="mt-4 p-3 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              <strong>데이터 출처:</strong> PostgreSQL Triple Store에서 실시간으로 조회됩니다.
              베이스라인 데이터(100% 신뢰도)와 GPT-4o-mini가 뉴스에서 추출한 데이터(≤85% 신뢰도)가 혼합되어 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
