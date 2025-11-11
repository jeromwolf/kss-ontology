'use client'

import { useState } from 'react'
import { Search, Newspaper, Network, TrendingUp, Sparkles, ArrowRight, BookOpen, Zap, Target, Loader2, AlertCircle, Brain, GitBranch, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Dynamically import OntologyGraph to avoid SSR issues with ReactFlow
const OntologyGraph = dynamic(() => import('../../components/OntologyGraph'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
    </div>
  ),
})

interface NewsItem {
  title: string
  description: string
  link: string
  pubDate: string
}

interface CompanyEntity {
  name: string
  mentions: number
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
}

interface Relationship {
  source: string
  target: string
  type: 'supplier' | 'customer' | 'competitor' | 'partner' | 'related'
  confidence: number
}

interface RDFTriple {
  subject: string
  predicate: string
  object: string
}

interface OntologyAnalysisResult {
  companies: CompanyEntity[]
  relationships: Relationship[]
  rdfTriples: RDFTriple[]
  impactScores: Record<string, number>
  summary: string
}

export default function NewsOntologyPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [results, setResults] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchPerformed, setSearchPerformed] = useState(false)

  // Ontology analysis state
  const [analysisResult, setAnalysisResult] = useState<OntologyAnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisError, setAnalysisError] = useState('')

  // Selected news for analysis
  const [selectedNews, setSelectedNews] = useState<Set<number>>(new Set())

  // 트렌딩 토픽
  const trendingTopics = [
    { icon: '🔧', title: '반도체 수출 규제', count: 156 },
    { icon: '🤖', title: 'AI 투자 확대', count: 243 },
    { icon: '💰', title: '금리 인하 전망', count: 189 },
    { icon: '🔋', title: '전기차 배터리', count: 134 },
    { icon: '🧬', title: '바이오 신약 승인', count: 98 },
    { icon: '💄', title: 'K-뷰티 수출', count: 76 }
  ]

  // 최근 분석 사례
  const recentAnalyses = [
    {
      company: '삼성전자',
      news: 'AI 반도체 수주 확대',
      impact: '+45.2',
      relatedCompanies: ['SK하이닉스', 'TSMC', 'ASML'],
      timestamp: '2시간 전'
    },
    {
      company: 'LG에너지솔루션',
      news: 'GM 배터리 공급 계약',
      impact: '+38.7',
      relatedCompanies: ['삼성SDI', 'SK온', 'CATL'],
      timestamp: '5시간 전'
    },
    {
      company: '현대차',
      news: '전기차 판매 목표 상향',
      impact: '+26.3',
      relatedCompanies: ['기아', 'LG전자', 'SK이노베이션'],
      timestamp: '1일 전'
    }
  ]

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError('')
    setSearchPerformed(true)
    setAnalysisResult(null) // Reset previous analysis
    setSelectedNews(new Set()) // Reset selection

    try {
      const response = await fetch(
        `/api/news/search?q=${encodeURIComponent(searchQuery)}&display=20&sort=date`
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || '검색 중 오류가 발생했습니다')
      }

      const data = await response.json()
      setResults(data.items || [])

    } catch (err) {
      setError(err instanceof Error ? err.message : '검색 중 오류가 발생했습니다')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const toggleNewsSelection = (index: number) => {
    setSelectedNews(prev => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

  const toggleSelectAll = () => {
    if (selectedNews.size === results.length) {
      setSelectedNews(new Set())
    } else {
      setSelectedNews(new Set(results.map((_, idx) => idx)))
    }
  }

  const handleAnalyze = async () => {
    if (selectedNews.size === 0) {
      setAnalysisError('분석할 뉴스를 선택해주세요')
      return
    }

    setAnalyzing(true)
    setAnalysisError('')

    try {
      const selectedArticles = Array.from(selectedNews)
        .map(idx => results[idx])
        .map(item => ({
          title: item.title.replace(/<[^>]*>/g, ''), // Strip HTML tags
          description: item.description.replace(/<[^>]*>/g, ''),
          link: item.link,
          pubDate: item.pubDate,
        }))

      const response = await fetch('/api/ontology/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articles: selectedArticles,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || '분석 중 오류가 발생했습니다')
      }

      const analysis = await response.json()
      setAnalysisResult(analysis)

    } catch (err) {
      setAnalysisError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다')
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10"></div>
        <div className="container mx-auto px-4 py-16 relative">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-sm font-semibold text-indigo-900 dark:text-indigo-300">
                세계 최초 온톨로지 기반 뉴스 분석
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              뉴스 온톨로지 분석
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              AI가 뉴스에서 기업 관계를 자동으로 추출하고, <br className="hidden md:block" />
              공급망 전체의 영향도를 실시간으로 추론합니다
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative group">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="뉴스 키워드를 입력하세요 (예: 삼성전자, AI 반도체, 전기차 배터리)"
                  className="w-full px-6 py-5 pr-14 text-lg border-2 border-gray-200 dark:border-gray-700 rounded-2xl
                           bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm
                           focus:border-indigo-500 dark:focus:border-indigo-400 focus:outline-none
                           transition-all duration-300 group-hover:shadow-xl"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-3
                           bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl
                           hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">일일 뉴스 분석</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">기업 관계 추적</div>
              </div>
              <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">94.7%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">분석 정확도</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results Section - Show immediately after hero when search is performed */}
      {searchPerformed && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Search className="w-6 h-6 text-indigo-600" />
              검색 결과
              {results.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({results.length}건)
                </span>
              )}
            </h2>

            {loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  뉴스 분석 중...
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                    검색 오류
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && results.length === 0 && (
              <div className="text-center py-12">
                <Newspaper className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  "{searchQuery}"에 대한 검색 결과가 없습니다
                </p>
              </div>
            )}

            {!loading && results.length > 0 && (
              <>
                <div className="mb-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleSelectAll}
                      className="flex items-center gap-2 px-4 py-2 border-2 border-indigo-600 text-indigo-600 rounded-xl
                               hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                    >
                      {selectedNews.size === results.length ? '전체 해제' : '전체 선택'}
                    </button>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedNews.size}개 선택됨
                    </span>
                  </div>
                  <button
                    onClick={handleAnalyze}
                    disabled={analyzing || selectedNews.size === 0}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl
                             hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        온톨로지 분석 중...
                      </>
                    ) : (
                      <>
                        <Brain className="w-5 h-5" />
                        선택한 뉴스 분석 ({selectedNews.size})
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4">
                  {results.map((item, idx) => (
                    <div
                      key={idx}
                      className={`relative p-4 rounded-xl border transition-all ${
                        selectedNews.has(idx)
                          ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-600'
                          : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          checked={selectedNews.has(idx)}
                          onChange={() => toggleNewsSelection(idx)}
                          className="mt-1 w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500
                                   dark:border-gray-600 dark:bg-gray-700 cursor-pointer"
                        />
                        <div className="flex-1">
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group"
                          >
                            <h3
                              className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600
                                       dark:group-hover:text-indigo-400 transition-colors mb-2"
                              dangerouslySetInnerHTML={{ __html: item.title }}
                            />
                            <p
                              className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2"
                              dangerouslySetInnerHTML={{ __html: item.description }}
                            />
                            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                              <span>{new Date(item.pubDate).toLocaleDateString('ko-KR')}</span>
                              <span>•</span>
                              <span className="text-indigo-600 dark:text-indigo-400 group-hover:underline">
                                원문 보기 →
                              </span>
                            </div>
                          </a>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Ontology Analysis Results */}
      {analysisResult && (
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Sparkles className="w-7 h-7" />
                분석 요약
              </h2>
              <p className="text-indigo-100 text-lg leading-relaxed">
                {analysisResult.summary}
              </p>
            </div>

            {/* Relationship Graph */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Network className="w-7 h-7 text-indigo-600" />
                기업 관계 네트워크
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                드래그하여 노드를 이동하고, 스크롤하여 확대/축소할 수 있습니다.
              </p>
              <OntologyGraph
                companies={analysisResult.companies}
                relationships={analysisResult.relationships}
                impactScores={analysisResult.impactScores}
              />
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {/* Companies */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Network className="w-6 h-6 text-indigo-600" />
                  기업 엔티티 ({analysisResult.companies.length})
                </h3>
                <div className="space-y-3">
                  {analysisResult.companies.map((company, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">{company.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            언급 {company.mentions}회
                          </p>
                        </div>
                        <div className="text-right">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                              company.sentiment === 'positive'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                : company.sentiment === 'negative'
                                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {company.sentiment === 'positive' ? '긍정' : company.sentiment === 'negative' ? '부정' : '중립'}
                          </span>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {(company.sentimentScore * 100).toFixed(0)}점
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Impact Scores */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                  중요도 분석
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                  뉴스에서 얼마나 중요하게 다뤄지는지 측정 (감정과 무관)
                </p>
                <div className="space-y-3">
                  {Object.entries(analysisResult.impactScores)
                    .sort(([, a], [, b]) => b - a)
                    .map(([company, score], idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900 dark:text-white">{company}</span>
                          <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                            {score}점
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2.5 rounded-full transition-all"
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Relationships */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <GitBranch className="w-6 h-6 text-green-600" />
                  기업 관계 ({analysisResult.relationships.length})
                </h3>
                <div className="space-y-3">
                  {analysisResult.relationships.map((rel, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-gray-900 dark:text-white">{rel.source}</span>
                        <span className="text-gray-400">→</span>
                        <span className="font-bold text-gray-900 dark:text-white">{rel.target}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            rel.type === 'supplier'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                              : rel.type === 'customer'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : rel.type === 'competitor'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                              : rel.type === 'partner'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {rel.type === 'supplier'
                            ? '공급업체'
                            : rel.type === 'customer'
                            ? '고객사'
                            : rel.type === 'competitor'
                            ? '경쟁사'
                            : rel.type === 'partner'
                            ? '파트너'
                            : '관련'}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          신뢰도: {(rel.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* RDF Triples */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Target className="w-6 h-6 text-pink-600" />
                  RDF 트리플 ({analysisResult.rdfTriples.length})
                </h3>
                <div className="space-y-3">
                  {analysisResult.rdfTriples.map((triple, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-sm"
                    >
                      <div className="space-y-1">
                        <div>
                          <span className="text-indigo-600 dark:text-indigo-400">Subject:</span>{' '}
                          <span className="text-gray-900 dark:text-white">{triple.subject}</span>
                        </div>
                        <div>
                          <span className="text-purple-600 dark:text-purple-400">Predicate:</span>{' '}
                          <span className="text-gray-900 dark:text-white">{triple.predicate}</span>
                        </div>
                        <div>
                          <span className="text-pink-600 dark:text-pink-400">Object:</span>{' '}
                          <span className="text-gray-900 dark:text-white">{triple.object}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Error */}
      {analysisError && (
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-200 mb-1">
                  분석 오류
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {analysisError}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content - Hide features when search results are shown */}
      {!searchPerformed && (
        <div className="container mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Left: Trending Topics */}
            <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-green-600" />
                실시간 인기 검색어
              </h2>
              <div className="space-y-3">
                {trendingTopics.map((topic, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSearchQuery(topic.title)}
                    className="w-full flex items-center justify-between p-3 rounded-xl
                             bg-gray-50 dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                             border border-gray-200 dark:border-gray-700
                             hover:border-indigo-300 dark:hover:border-indigo-600
                             transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{topic.icon}</span>
                      <div className="text-left">
                        <div className="font-medium text-gray-900 dark:text-white text-sm">
                          {topic.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {topic.count}개 뉴스
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                  </button>
                ))}
              </div>

              {/* CTA to Learn */}
              <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl border border-indigo-200 dark:border-indigo-800">
                <div className="flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                      온톨로지 원리 배우기
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      이 서비스가 어떻게 작동하는지 알아보세요
                    </p>
                    <Link
                      href="/chapters/01-ontology-basics"
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                      Chapter 1 시작하기 →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Recent Analyses & Features */}
          <div className="lg:col-span-2 space-y-8">

            {/* Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Network className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  지능형 관계 추론
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  공급망, 경쟁사, 파트너사 관계를 자동으로 분석하여 간접 영향도를 계산합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs">
                    공급망 분석
                  </span>
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-xs">
                    경쟁사 비교
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  실시간 영향도 분석
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  뉴스 발생 즉시 RDF 트리플로 저장하고 추론 엔진이 영향도를 자동 계산합니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-xs">
                    직접 영향
                  </span>
                  <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded text-xs">
                    간접 영향
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  SPARQL 쿼리 지원
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  표준 SPARQL 쿼리로 복잡한 그래프 분석을 자유롭게 수행할 수 있습니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs">
                    W3C 표준
                  </span>
                  <span className="px-2 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 rounded text-xs">
                    API 제공
                  </span>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
                  설명 가능한 AI
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  모든 분석 결과는 온톨로지 그래프로 시각화되어 근거를 명확히 확인할 수 있습니다.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded text-xs">
                    투명성
                  </span>
                  <span className="px-2 py-1 bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded text-xs">
                    신뢰성
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Analyses */}
            {!searchPerformed && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Newspaper className="w-6 h-6 text-indigo-600" />
                  최근 분석 사례
                </h2>
              <div className="space-y-4">
                {recentAnalyses.map((analysis, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700
                             hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {analysis.company}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {analysis.news}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${
                          parseFloat(analysis.impact) > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {analysis.impact > '0' ? '+' : ''}{analysis.impact}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {analysis.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">관련:</span>
                      {analysis.relatedCompanies.map((company, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded text-xs"
                        >
                          {company}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              </div>
            )}

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
              <div className="max-w-2xl">
                <h2 className="text-3xl font-bold mb-4">
                  지금 바로 시작하세요
                </h2>
                <p className="text-indigo-100 mb-6">
                  무료로 하루 10회까지 뉴스 온톨로지 분석을 체험할 수 있습니다.
                  Pro 플랜으로 업그레이드하면 무제한 분석과 SPARQL API를 사용할 수 있습니다.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-white text-indigo-600 rounded-xl font-semibold
                             hover:bg-indigo-50 transition-all hover:scale-105 shadow-lg"
                  >
                    무료로 시작하기
                  </button>
                  <Link
                    href="/pricing"
                    className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold
                             hover:bg-indigo-400 transition-all border border-white/20"
                  >
                    가격 보기
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

    </div>
  )
}
