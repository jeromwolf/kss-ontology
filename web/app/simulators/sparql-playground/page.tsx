'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const SparqlPlayground = dynamic(
  () => import('@/components/sparql-playground/SparqlPlayground').then(mod => ({ default: mod.SparqlPlayground })),
  { ssr: false }
)

export default function SparqlPlaygroundPage() {
  return (
    <div className="h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-12">
        <div className="mb-8">
          <Link
            href="/simulators"
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            시뮬레이터 목록으로
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            SPARQL Playground
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            SPARQL 쿼리 언어를 직접 실습해보세요. RDF 트리플 데이터에 대해 패턴 매칭 쿼리를 실행하고 결과를 확인할 수 있습니다.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-blue-900 dark:text-blue-300">
              사용 방법
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>1. 샘플 데이터를 확인하거나 RDF Editor에서 가져온 데이터 사용</li>
              <li>2. SPARQL 쿼리 에디터에 쿼리 작성</li>
              <li>3. 실행 버튼 또는 Ctrl+Enter로 쿼리 실행</li>
              <li>4. 결과 테이블에서 매칭된 데이터 확인</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                SELECT 쿼리
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                변수를 선언하고 결과 조회
              </p>
              <code className="text-xs mt-2 block text-green-700 dark:text-green-400">SELECT ?s ?p ?o</code>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                WHERE 절
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                패턴 매칭 조건 지정
              </p>
              <code className="text-xs mt-2 block text-blue-700 dark:text-blue-400">{"WHERE { ?s ?p ?o . }"}</code>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                트리플 패턴
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Subject-Predicate-Object 구조
              </p>
              <code className="text-xs mt-2 block text-purple-700 dark:text-purple-400">:Person :hasName "철수"</code>
            </div>
          </div>

          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
            <SparqlPlayground />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                SPARQL의 특징
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                SPARQL은 W3C 표준 쿼리 언어로, RDF 그래프 데이터베이스를 쿼리하는 데 사용됩니다.
                SQL과 유사하지만 그래프 패턴 매칭에 최적화되어 있습니다.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                실제 활용 사례
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Wikidata, DBpedia 등 대규모 지식 그래프에서 SPARQL을 사용해 데이터를 조회합니다.
                Google Knowledge Graph, 시맨틱 웹 애플리케이션의 핵심 기술입니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
