import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Database, Lightbulb, Network } from "lucide-react"

const simulators = [
  {
    id: "rdf-editor",
    title: "RDF Triple Editor",
    description: "RDF 트리플을 직접 작성하고 검증하는 인터랙티브 에디터",
    icon: Code,
    chapter: "Chapter 2: RDF",
    features: [
      "Monaco Editor 기반 코드 편집",
      "실시간 문법 검증",
      "Turtle, N-Triples, JSON-LD 포맷 지원",
      "예제 템플릿 제공",
    ],
    status: "coming-soon",
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
    status: "coming-soon",
  },
  {
    id: "reasoning-engine",
    title: "Inference Engine",
    description: "OWL 추론을 시뮬레이션하는 추론 엔진",
    icon: Lightbulb,
    chapter: "Chapter 5: 추론",
    features: [
      "RDFS 11 규칙 시뮬레이션",
      "OWL 2 추론 지원",
      "추론 과정 단계별 시각화",
      "Pellet/HermiT 엔진",
    ],
    status: "coming-soon",
  },
  {
    id: "knowledge-graph",
    title: "3D Knowledge Graph",
    description: "3D 공간에서 지식 그래프를 탐색하는 시각화 도구",
    icon: Network,
    chapter: "Chapter 6: 지식 그래프",
    features: [
      "Three.js 기반 3D 렌더링",
      "인터랙티브 노드 탐색",
      "계층 구조 시각화",
      "실시간 필터링 & 검색",
    ],
    status: "coming-soon",
  },
]

export default function SimulatorsPage() {
  return (
    <div className="container py-12 max-w-6xl">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">인터랙티브 시뮬레이터</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          온톨로지를 직접 실습하며 배울 수 있는 4가지 인터랙티브 도구
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-12">
        {simulators.map((simulator) => {
          const Icon = simulator.icon
          return (
            <Card key={simulator.id} className="relative overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  {simulator.status === "coming-soon" && (
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

                {simulator.status === "coming-soon" ? (
                  <Button className="w-full" disabled>
                    준비 중 (v4.0)
                  </Button>
                ) : (
                  <Button asChild className="w-full">
                    <Link href={`/simulators/${simulator.id}`}>
                      시뮬레이터 시작하기 →
                    </Link>
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
          <CardTitle>시뮬레이터 개발 로드맵</CardTitle>
          <CardDescription>
            v4.0 업데이트에서 4가지 시뮬레이터가 추가될 예정입니다
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">개발 예정 (2025년 2월)</h4>
            <p className="text-sm text-muted-foreground">
              현재 모든 시뮬레이터의 UI/UX 디자인과 기능 명세가 완료되었으며,
              개발 팀이 구현 작업을 진행 중입니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">미리 준비하기</h4>
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
            <h4 className="font-semibold mb-2">업데이트 알림</h4>
            <p className="text-sm text-muted-foreground">
              시뮬레이터가 출시되면{" "}
              <Link href="/roadmap" className="text-primary hover:underline">
                로드맵 페이지
              </Link>
              에서 공지해드립니다.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
