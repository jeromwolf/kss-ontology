'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const InferenceEngine = dynamic(
  () => import('@/components/rdf-editor/components/InferenceEngine').then(mod => ({ default: mod.InferenceEngine })),
  { ssr: false }
)

export default function InferenceEngineSimulator() {
  // Sample triples for demonstration
  const sampleTriples = [
    { subject: ':John', predicate: ':knows', object: ':Mary' },
    { subject: ':Mary', predicate: ':knows', object: ':Bob' },
    { subject: ':Alice', predicate: ':marriedTo', object: ':John' },
    { subject: ':Bob', predicate: ':type', object: ':Person' },
    { subject: ':Mary', predicate: ':type', object: ':Person' },
    { subject: ':John', predicate: ':type', object: ':Person' },
    { subject: ':Korea', predicate: ':locatedIn', object: ':Asia' },
    { subject: ':Seoul', predicate: ':locatedIn', object: ':Korea' },
    { subject: ':Samsung', predicate: ':locatedIn', object: ':Seoul' },
    { subject: ':Prof_Kim', predicate: ':teaches', object: ':AI_Course' },
    { subject: ':Student_Lee', predicate: ':enrolledIn', object: ':AI_Course' },
  ]

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
            Inference Engine (추론 엔진)
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            온톨로지 추론 과정을 실시간으로 시각화하고 체험해보세요. 다양한 추론 규칙이 어떻게 새로운 지식을 생성하는지 관찰할 수 있습니다.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4 text-purple-900 dark:text-purple-300">
              사용 방법
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li>• <strong>샘플 데이터:</strong> 미리 준비된 11개 트리플로 추론 체험</li>
              <li>• <strong>실시간 추론:</strong> 트리플을 바탕으로 자동 추론 실행</li>
              <li>• <strong>추론 규칙:</strong> 대칭, 전이, 타입 추론, 역관계 규칙 적용</li>
              <li>• <strong>신뢰도 점수:</strong> 각 추론의 정확도를 확인</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-green-900 dark:text-green-300 mb-2">
                대칭 관계 (Symmetric)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                A가 B를 안다면, B도 A를 안다
              </p>
              <code className="text-xs mt-2 block text-green-700">knows, marriedTo</code>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                전이 관계 (Transitive)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                A→B, B→C이면 A→C
              </p>
              <code className="text-xs mt-2 block text-blue-700">locatedIn, partOf</code>
            </div>

            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-orange-900 dark:text-orange-300 mb-2">
                타입 추론 (Domain/Range)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                속성에서 타입 자동 분류
              </p>
              <code className="text-xs mt-2 block text-orange-700">teaches, enrolledIn</code>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-2">
                역관계 (Inverse)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                관계의 역방향 추론
              </p>
              <code className="text-xs mt-2 block text-purple-700">hasParent↔hasChild</code>
            </div>
          </div>

          {/* 입력 트리플 표시 */}
          <div className="mb-8">
            <h3 className="font-semibold mb-4 text-gray-900 dark:text-white">입력 트리플 (11개)</h3>
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="grid gap-2 text-sm font-mono">
                {sampleTriples.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <span className="text-blue-600">{t.subject}</span>
                    <span className="text-green-600">{t.predicate}</span>
                    <span className="text-blue-600">{t.object}</span>
                    <span className="text-gray-400">.</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-2 border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden p-6">
            <InferenceEngine triples={sampleTriples} />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-2">
                추론 엔진의 원리
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                온톨로지 추론 엔진은 기존 사실(트리플)에서 새로운 지식을 자동으로
                도출하는 AI 시스템입니다. RDFS/OWL 논리 규칙을 바탕으로 숨겨진 관계를 발견합니다.
              </p>
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-6">
              <h3 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">
                실제 활용 사례
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                검색 엔진 (Google Knowledge Graph), 추천 시스템, 의료 진단,
                금융 분석 등에서 지식 그래프의 추론 기능이 핵심 역할을 담당합니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
