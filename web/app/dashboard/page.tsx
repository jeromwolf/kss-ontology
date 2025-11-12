'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface WatchlistItem {
  id: number
  companyName: string
  ticker?: string
  priority: number
  notes?: string
  addedAt: string
}

interface NewsArticle {
  title: string
  description: string
  link: string
  pubDate: string
}

interface CompanyRelation {
  subject: string
  predicate: string
  object: string
  strength: number
  description: string
}

interface OntologyInsight {
  relations: CompanyRelation[]
  industryImpact: {
    industry: string
    relatedCompanies: Array<{
      name: string
      relationship: string
      impactLevel: number
    }>
  } | null
  knowledgeGraph: {
    nodes: Array<{ id: string; label: string; type: string }>
    edges: Array<{ source: string; target: string; label: string }>
  }
}

interface DailyInsight {
  date: string
  companies: Array<{
    companyName: string
    sentiment: 'positive' | 'negative' | 'neutral'
    importance: number
    summary: string
    keyPoints: string[]
    relevantNews: NewsArticle[]
    ontologyInsight?: OntologyInsight
  }>
  urgentItems: Array<{
    company: string
    reason: string
    news: NewsArticle
  }>
  opportunities: Array<{
    company: string
    reason: string
    news: NewsArticle
  }>
  marketOverview: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: '', ticker: '', priority: 5, notes: '' })
  const [error, setError] = useState('')
  const [insight, setInsight] = useState<DailyInsight | null>(null)
  const [insightLoading, setInsightLoading] = useState(false)
  const [insightError, setInsightError] = useState('')

  useEffect(() => {
    fetchWatchlist()
  }, [])

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist')

      if (res.status === 401) {
        router.push('/login')
        return
      }

      const data = await res.json()
      setWatchlist(data.items || [])
    } catch (err) {
      console.error('Failed to fetch watchlist:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddCompany = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!newCompany.name.trim()) {
      setError('기업명을 입력해주세요')
      return
    }

    try {
      console.log('Adding company:', newCompany)

      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyName: newCompany.name.trim(),
          ticker: newCompany.ticker?.trim() || undefined,
          priority: newCompany.priority,
          notes: newCompany.notes?.trim() || undefined,
        }),
      })

      const data = await res.json()
      console.log('Response:', { status: res.status, data })

      if (!res.ok) {
        throw new Error(data.error || '추가에 실패했습니다')
      }

      // 목록 새로고침
      await fetchWatchlist()
      setNewCompany({ name: '', ticker: '', priority: 5, notes: '' })
      setShowAddForm(false)
    } catch (err: any) {
      console.error('Add company error:', err)
      setError(err.message || '알 수 없는 오류가 발생했습니다')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    try {
      const res = await fetch(`/api/watchlist?id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('삭제에 실패했습니다')
      }

      setWatchlist(watchlist.filter((item) => item.id !== id))
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleGenerateInsight = async () => {
    setInsightLoading(true)
    setInsightError('')

    try {
      const res = await fetch('/api/insights/generate', {
        method: 'POST',
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '인사이트 생성에 실패했습니다')
      }

      setInsight(data.insight)
    } catch (err: any) {
      setInsightError(err.message)
    } finally {
      setInsightLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
      case 'negative':
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
    }
  }

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '긍정'
      case 'negative':
        return '부정'
      default:
        return '중립'
    }
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
    if (confidence >= 0.9) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    if (confidence >= 0.8) return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
    if (confidence >= 0.7) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
  }

  const getValidationBadge = (validatedBy?: 'baseline' | 'gpt' | 'user') => {
    switch (validatedBy) {
      case 'baseline':
        return { label: '검증됨', color: 'bg-green-600 text-white' }
      case 'gpt':
        return { label: 'GPT 추정', color: 'bg-purple-600 text-white' }
      case 'user':
        return { label: '사용자 확인', color: 'bg-blue-600 text-white' }
      default:
        return { label: '베이스라인', color: 'bg-gray-600 text-white' }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600 dark:text-gray-400">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">KSS Ontology</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">투자자를 위한 아침 브리핑</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard/graph')}
                className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <span>🔗</span>
                Knowledge Graph
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Watchlist Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                관심 기업 ({watchlist.length}/10)
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                최대 10개 기업을 등록하여 맞춤형 인사이트를 받아보세요
              </p>
            </div>
            {watchlist.length < 10 && (
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                + 기업 추가
              </button>
            )}
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleAddCompany} className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    기업명 *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="예: 삼성전자"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    티커 (선택)
                  </label>
                  <input
                    type="text"
                    value={newCompany.ticker}
                    onChange={(e) => setNewCompany({ ...newCompany, ticker: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="예: 005930"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    우선순위 (1-10)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={newCompany.priority}
                    onChange={(e) => setNewCompany({ ...newCompany, priority: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    메모 (선택)
                  </label>
                  <input
                    type="text"
                    value={newCompany.notes}
                    onChange={(e) => setNewCompany({ ...newCompany, notes: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    placeholder="개인 메모"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                  <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                </div>
              )}

              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  추가
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setError('')
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                >
                  취소
                </button>
              </div>
            </form>
          )}

          {/* Watchlist Items */}
          {watchlist.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">아직 등록된 기업이 없습니다</p>
              <p className="text-sm">관심 기업을 추가하여 맞춤형 투자 인사이트를 받아보세요</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {watchlist.map((item) => (
                <div
                  key={item.id}
                  className="p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{item.companyName}</h3>
                      {item.ticker && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.ticker}</p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded">
                      우선순위: {item.priority}
                    </span>
                  </div>
                  {item.notes && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{item.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Insights Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              일일 투자 인사이트
            </h2>
            <button
              onClick={handleGenerateInsight}
              disabled={insightLoading || watchlist.length === 0}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
            >
              {insightLoading ? '분석 중...' : '인사이트 생성'}
            </button>
          </div>

          {insightError && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400">{insightError}</p>
            </div>
          )}

          {!insight && !insightLoading && (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg mb-2">오늘의 인사이트를 확인하세요</p>
              <p className="text-sm">관심 기업을 등록하고 인사이트 생성 버튼을 클릭하세요</p>
            </div>
          )}

          {insightLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">AI가 뉴스를 분석하고 있습니다...</p>
            </div>
          )}

          {insight && (
            <div className="space-y-6">
              {/* Market Overview */}
              <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">시장 오버뷰</h3>
                <p className="text-gray-700 dark:text-gray-300">{insight.marketOverview}</p>
              </div>

              {/* Urgent Items */}
              {insight.urgentItems.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-red-600 dark:text-red-400">🚨</span>
                    긴급 확인 필요
                  </h3>
                  <div className="space-y-2">
                    {insight.urgentItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                      >
                        <div className="font-medium text-red-900 dark:text-red-300">{item.company}</div>
                        <div className="text-sm text-red-700 dark:text-red-400 mt-1">{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Opportunities */}
              {insight.opportunities.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400">💡</span>
                    투자 기회
                  </h3>
                  <div className="space-y-2">
                    {insight.opportunities.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="font-medium text-green-900 dark:text-green-300">{item.company}</div>
                        <div className="text-sm text-green-700 dark:text-green-400 mt-1">{item.reason}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Details */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">기업별 상세 분석</h3>
                <div className="space-y-6">
                  {insight.companies.map((company, idx) => (
                    <div
                      key={idx}
                      className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700"
                    >
                      {/* Company Header */}
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{company.companyName}</h4>
                        <span className={`px-2 py-1 rounded text-xs ${getSentimentColor(company.sentiment)}`}>
                          {getSentimentLabel(company.sentiment)}
                        </span>
                      </div>

                      {/* Importance */}
                      <div className="mb-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">중요도</div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${company.importance * 10}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* GPT Analysis Section */}
                      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🤖 AI 뉴스 분석</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">(GPT-4o-mini)</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{company.summary}</p>
                        {company.keyPoints.length > 0 && (
                          <ul className="space-y-1">
                            {company.keyPoints.map((point, i) => (
                              <li key={i} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-2">
                                <span>•</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>

                      {/* Ontology Analysis Section */}
                      {company.ontologyInsight && (
                        <div className="mb-4 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border-2 border-blue-300 dark:border-blue-700">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-sm font-medium text-blue-900 dark:text-blue-300">🔗 온톨로지 기반 관계 분석</span>
                            <span className="text-xs px-2 py-0.5 bg-blue-600 text-white rounded">KSS 온톨로지</span>
                          </div>

                          {/* Company Relations */}
                          {company.ontologyInsight.relations.length > 0 && (
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">기업 관계</div>
                              <div className="space-y-2">
                                {company.ontologyInsight.relations.map((rel, i) => {
                                  const validationBadge = getValidationBadge(rel.validatedBy)
                                  return (
                                    <div key={i} className="text-xs bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700">
                                      <div className="flex items-center justify-between mb-1">
                                        <span className="font-medium text-gray-900 dark:text-gray-100">
                                          {rel.predicate.replace(/_/g, ' ')}
                                        </span>
                                        <div className="flex items-center gap-1">
                                          {rel.confidence !== undefined && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getConfidenceColor(rel.confidence)}`}>
                                              {(rel.confidence * 100).toFixed(0)}%
                                            </span>
                                          )}
                                          {rel.validatedBy && (
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${validationBadge.color}`}>
                                              {validationBadge.label}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                      <div className="text-gray-600 dark:text-gray-400">
                                        {rel.description}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Industry Impact */}
                          {company.ontologyInsight.industryImpact && (
                            <div className="mb-3">
                              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">
                                산업 영향도 ({company.ontologyInsight.industryImpact.industry})
                              </div>
                              <div className="space-y-1">
                                {company.ontologyInsight.industryImpact.relatedCompanies.map((rc, i) => (
                                  <div key={i} className="flex items-center justify-between text-xs bg-white dark:bg-gray-800 px-2 py-1 rounded">
                                    <span className="text-gray-700 dark:text-gray-300">
                                      {rc.name} ({rc.relationship})
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                        <div
                                          className="bg-purple-600 h-1.5 rounded-full"
                                          style={{ width: `${rc.impactLevel * 100}%` }}
                                        ></div>
                                      </div>
                                      <span className="text-gray-600 dark:text-gray-400 text-xs">
                                        {(rc.impactLevel * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Knowledge Graph Info */}
                          {company.ontologyInsight.knowledgeGraph && (
                            <div className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                              지식 그래프: {company.ontologyInsight.knowledgeGraph.nodes.length} 노드, {company.ontologyInsight.knowledgeGraph.edges.length} 관계
                            </div>
                          )}

                          {/* Confidence Legend */}
                          <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                            <div className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">신뢰도 범례</div>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400">90%+</span>
                                <span className="text-gray-600 dark:text-gray-400">매우 높음</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400">80-89%</span>
                                <span className="text-gray-600 dark:text-gray-400">높음</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400">70-79%</span>
                                <span className="text-gray-600 dark:text-gray-400">중간</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">&lt;70%</span>
                                <span className="text-gray-600 dark:text-gray-400">낮음</span>
                              </div>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2 text-xs">
                              <span className="px-2 py-0.5 rounded bg-green-600 text-white">검증됨</span>
                              <span className="text-gray-600 dark:text-gray-400">베이스라인 데이터</span>
                              <span className="px-2 py-0.5 rounded bg-purple-600 text-white">GPT 추정</span>
                              <span className="text-gray-600 dark:text-gray-400">뉴스에서 추출</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* News Sources */}
                      {company.relevantNews && company.relevantNews.length > 0 && (
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            📰 근거 뉴스 ({company.relevantNews.length}건)
                          </div>
                          <div className="space-y-2">
                            {company.relevantNews.slice(0, 3).map((news, i) => (
                              <a
                                key={i}
                                href={news.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block text-xs hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded transition-colors"
                              >
                                <div className="text-blue-600 dark:text-blue-400 hover:underline line-clamp-1">
                                  {news.title.replace(/<\/?[^>]+(>|$)/g, "")}
                                </div>
                                <div className="text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                  {news.description.replace(/<\/?[^>]+(>|$)/g, "")}
                                </div>
                                <div className="text-gray-400 dark:text-gray-500 mt-1">
                                  {new Date(news.pubDate).toLocaleString('ko-KR')}
                                </div>
                              </a>
                            ))}
                          </div>
                          {company.relevantNews.length > 3 && (
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                              +{company.relevantNews.length - 3}건 더보기
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
