import type { Metadata } from 'next'
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Database, Lightbulb, Network } from "lucide-react"

export const metadata: Metadata = {
  title: '시뮬레이터',
  description: 'RDF 에디터, SPARQL 플레이그라운드, 추론 엔진, 3D 지식 그래프 등 인터랙티브 온톨로지 학습 도구',
  openGraph: {
    title: '시뮬레이터 | KSS Ontology',
    description: '인터랙티브 온톨로지 학습 도구 모음',
  },
}

const simulators = [
  {
    id: "rdf-editor",
    title: "RDF Triple Editor",
    description: "RDF 트리플을 직접 작성하고 시각화하는 인터랙티브 에디터",
    icon: Code,
    chapter: "Chapter 2: RDF",
    features: [
      "트리플 입력 및 편집",
      "실시간 그래프 시각화",
      "추론 엔진 통합",
      "내보내기/가져오기",
    ],
    status: "available",
  },
  {
    id: "sparql-playground",
    title: "SPARQL Playground",
    description: "SPARQL 쿼리를 작성하고 실행하는 실습 환경",
    icon: Database,
    chapter: "Chapter 4: SPARQL",
    features: [
      "DBpedia/Wikidata 연동",
      "쿼리 결과 시각화",
      "FILTER, OPTIONAL, UNION 지원",
      "Property Paths 실습",
    ],
    status: "available",
  },
  {
    id: "reasoning-engine",
    title: "Inference Engine",
    description: "RDFS/OWL 추론을 시뮬레이션하는 추론 엔진",
    icon: Lightbulb,
    chapter: "Chapter 5: 추론",
    features: [
      "대칭/전이/역관계 추론",
      "타입 추론 (Domain/Range)",
      "추론 과정 단계별 시각화",
      "신뢰도 점수 표시",
    ],
    status: "available",
  },
  {
    id: "knowledge-graph",
    title: "Knowledge Graph Visualizer",
    description: "RDF 트리플을 인터랙티브 그래프로 시각화하는 도구",
    icon: Network,
    chapter: "Chapter 6: 지식 그래프",
    features: [
      "vis-network 기반 렌더링",
      "RDF Editor 연동",
      "신뢰도 필터링",
      "관계 유형별 색상 구분",
    ],
    status: "available",
  },
]

export default function SimulatorsPage() {
  return (
    <div className="container py-12 max-w-6xl pb-12 h-full overflow-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">인터랙티브 시뮬레이터</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          온톨로지를 직접 실습하며 배울 수 있는 4가지 인터랙티브 도구
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {simulators.map((simulator) => {
          const Icon = simulator.icon
          const isAvailable = simulator.status === "available"
          const href = simulator.href || `/simulators/${simulator.id}`

          return (
            <Card key={simulator.id} className={`relative overflow-hidden ${isAvailable ? 'border-primary/50' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isAvailable ? 'bg-primary/20' : 'bg-primary/10'}`}>
                    <Icon className={`h-6 w-6 ${isAvailable ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  {isAvailable ? (
                    <Badge className="bg-green-500">사용 가능</Badge>
                  ) : (
                    <Badge variant="outline">Coming Soon</Badge>
                  )}
                </div>
                <CardTitle>{simulator.title}</CardTitle>
                <CardDescription>{simulator.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold mb-2">관련 챕터</p>
                  <Badge variant="secondary">{simulator.chapter}</Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold mb-2">주요 기능</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {simulator.features.map((feature, index) => (
                      <li key={index}>• {feature}</li>
                    ))}
                  </ul>
                </div>

                {isAvailable ? (
                  <Button asChild className="w-full">
                    <Link href={href}>
                      시뮬레이터 시작하기 →
                    </Link>
                  </Button>
                ) : (
                  <Button className="w-full" disabled>
                    준비 중 (v4.0)
                  </Button>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 안내 메시지 */}
      <Card className="bg-muted">
        <CardHeader>
          <CardTitle>시뮬레이터 현황</CardTitle>
          <CardDescription>
            4개 시뮬레이터 모두 사용 가능
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">사용 가능한 시뮬레이터</h4>
            <p className="text-sm text-muted-foreground">
              RDF Triple Editor, SPARQL Playground, Inference Engine, Knowledge Graph가 모두 사용 가능합니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">미리 학습하기</h4>
            <p className="text-sm text-muted-foreground mb-3">
              시뮬레이터를 최대한 활용하기 위해 관련 챕터를 먼저 학습해보세요:
            </p>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href="/chapters/02-rdf">Chapter 2: RDF →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/chapters/04-sparql">Chapter 4: SPARQL →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/chapters/05-reasoning">Chapter 5: 추론 →</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/chapters/06-knowledge-graph">Chapter 6: 지식 그래프 →</Link>
              </Button>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">투자 인사이트 대시보드</h4>
            <p className="text-sm text-muted-foreground mb-3">
              실제 온톨로지 기술을 활용한 투자 인사이트 서비스도 체험해보세요:
            </p>
            <Button asChild variant="default" size="sm">
              <Link href="/dashboard">대시보드 바로가기 →</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
