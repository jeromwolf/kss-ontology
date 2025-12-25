'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const EmbeddingVisualizer = dynamic(
  () => import('@/components/embedding-visualizer').then(mod => ({ default: mod.EmbeddingVisualizer })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Embedding Visualizer 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function EmbeddingVisualizerPage() {
  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        {/* 네비게이션 */}
        <div className="mb-8">
          <Link
            href="/simulators"
            className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            시뮬레이터 목록으로
          </Link>
        </div>

        {/* 소개 배너 */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">FDE Phase 3</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs font-medium">Week 5</span>
              </div>
              <h1 className="text-2xl font-bold mb-2">Embedding Visualizer</h1>
              <p className="text-emerald-100">
                텍스트가 벡터로 변환되는 과정을 시각화하고, RAG 파이프라인의 핵심 개념을 이해해보세요.
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                href="/simulators/knowledge-graph"
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm transition"
              >
                Knowledge Graph →
              </Link>
            </div>
          </div>
        </div>

        {/* 학습 포인트 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">✂️</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Chunking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              문서를 작은 청크로 분할
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🔢</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Embedding</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              텍스트를 벡터로 변환
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Indexing</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              벡터 인덱스에 저장
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🔍</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Retrieval</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              유사한 청크 검색
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">✨</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">Generation</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              LLM으로 응답 생성
            </p>
          </div>
        </div>

        {/* 메인 시뮬레이터 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <EmbeddingVisualizer />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 Cosine Similarity
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              벡터 간 유사도는 코사인 유사도로 측정됩니다. 값이 1에 가까울수록 유사하고,
              0에 가까울수록 관련이 없습니다. RAG 시스템에서 가장 관련성 높은 문서를 찾는 핵심 원리입니다.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              이 시뮬레이터는 FDE Academy Phase 3 Week 5 "RAG 기초" 과정의
              실습 도구입니다. 벡터 임베딩과 시맨틱 검색의 원리를 시각적으로 이해하세요.
            </p>
          </div>
        </div>

        {/* 다음 단계 */}
        <div className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">다음 학습</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/simulators/graph-algorithms"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Graph Algorithms
            </Link>
            <Link
              href="/simulators/cypher-playground"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition"
            >
              Cypher Playground
            </Link>
            <Link
              href="/simulators"
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition"
            >
              전체 시뮬레이터 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
