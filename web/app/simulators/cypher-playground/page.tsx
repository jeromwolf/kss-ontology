'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const CypherPlayground = dynamic(
  () => import('@/components/cypher-playground').then(mod => ({ default: mod.CypherPlayground })),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Cypher Playground 로딩 중...</p>
        </div>
      </div>
    )
  }
)

export default function CypherPlaygroundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
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
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-2">Cypher Query Playground</h1>
              <p className="text-indigo-100">
                Neo4j의 Cypher 쿼리 언어를 브라우저에서 직접 실습해보세요.
                실제 Neo4j 없이도 Property Graph의 핵심 개념을 배울 수 있습니다.
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">📝</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">MATCH 패턴</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ASCII Art 스타일의 직관적인 패턴 매칭
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">🔗</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">관계 탐색</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              방향성, 타입, 가변 길이 관계 쿼리
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">➕</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">CREATE</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              노드와 관계를 동적으로 생성
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
            <div className="text-2xl mb-2">📊</div>
            <h3 className="font-semibold text-gray-900 dark:text-white">시각화</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              실시간 그래프 시각화로 결과 확인
            </p>
          </div>
        </div>

        {/* 메인 Playground */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <CypherPlayground showGraph={true} showHistory={true} />
        </div>

        {/* 추가 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
              💡 Cypher vs SQL
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              SQL에서 복잡한 JOIN이 필요한 관계 쿼리가 Cypher에서는 직관적인 패턴으로 표현됩니다.
              <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded mx-1">
                (a)-[:KNOWS]-&gt;(b)
              </code>
              처럼 화살표로 관계를 표현하세요.
            </p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
            <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
              🎯 FDE 커리큘럼 연계
            </h3>
            <p className="text-gray-700 dark:text-gray-300 text-sm">
              이 시뮬레이터는 FDE Academy Phase 3 "그래프 이론 & Neo4j" 과정의
              실습 도구로 활용됩니다. Cypher CRUD와 패턴 매칭을 마스터하세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
