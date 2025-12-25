import type { Metadata } from 'next'
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Code, Database, Lightbulb, Network, PlayCircle, GitBranch, Layers, Workflow, MessageSquare } from "lucide-react"

export const metadata: Metadata = {
  title: '시뮬레이터',
  description: 'RDF 에디터, SPARQL 플레이그라운드, 추론 엔진, 3D 지식 그래프 등 인터랙티브 온톨로지 학습 도구',
  openGraph: {
    title: '시뮬레이터 | KSS Ontology',
    description: '인터랙티브 온톨로지 학습 도구 모음',
  },
}

const simulators: Array<{
  id: string
  title: string
  description: string
  icon: typeof Code
  chapter: string
  features: string[]
  status: string
  href?: string
}> = [
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
  {
    id: "cypher-playground",
    title: "Cypher Query Playground",
    description: "Neo4j의 Cypher 쿼리 언어를 브라우저에서 직접 실습",
    icon: PlayCircle,
    chapter: "FDE Phase 3: Neo4j",
    features: [
      "Cypher 쿼리 실시간 실행",
      "Property Graph 시각화",
      "MATCH/CREATE/WHERE 지원",
      "샘플 데이터 및 예제 쿼리",
    ],
    status: "available",
  },
  {
    id: "graph-algorithms",
    title: "Graph Algorithms Simulator",
    description: "그래프 알고리즘을 시각적으로 이해하고 실습하는 도구",
    icon: GitBranch,
    chapter: "FDE Phase 3: Week 3",
    features: [
      "Centrality (PageRank, Degree, Betweenness)",
      "Community Detection (Louvain, Label Propagation)",
      "Similarity (Jaccard, Cosine)",
      "Pathfinding (Dijkstra, BFS, A*)",
    ],
    status: "available",
  },
  {
    id: "embedding-visualizer",
    title: "Embedding Visualizer",
    description: "텍스트 임베딩과 RAG 파이프라인을 시각화하는 도구",
    icon: Layers,
    chapter: "FDE Phase 3: Week 5",
    features: [
      "텍스트 → 벡터 변환 시각화",
      "코사인 유사도 기반 검색",
      "Chunking 전략 실험",
      "RAG 파이프라인 시뮬레이션",
    ],
    status: "available",
  },
  {
    id: "graphrag-pipeline",
    title: "GraphRAG Pipeline Simulator",
    description: "벡터 검색과 그래프 순회를 결합한 GraphRAG 시뮬레이터",
    icon: Workflow,
    chapter: "FDE Phase 3: Week 6",
    features: [
      "Local/Global/Hybrid 검색 전략",
      "그래프 순회 시각화",
      "커뮤니티 요약 조회",
      "컨텍스트 통합 시뮬레이션",
    ],
    status: "available",
  },
  {
    id: "text2cypher",
    title: "Text2Cypher Simulator",
    description: "자연어 질문을 Cypher 쿼리로 변환하는 시뮬레이터",
    icon: MessageSquare,
    chapter: "FDE Phase 3: Week 7",
    features: [
      "자연어 → Cypher 변환",
      "Few-shot 프롬프팅",
      "스키마 기반 쿼리 생성",
      "신뢰도 점수 및 에러 핸들링",
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
          온톨로지와 그래프 데이터베이스를 직접 실습하며 배울 수 있는 9가지 인터랙티브 도구
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
            9개 시뮬레이터 모두 사용 가능
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">사용 가능한 시뮬레이터</h4>
            <p className="text-sm text-muted-foreground">
              RDF Triple Editor, SPARQL Playground, Inference Engine, Knowledge Graph, Cypher Playground, Graph Algorithms, Embedding Visualizer, GraphRAG Pipeline, Text2Cypher가 모두 사용 가능합니다.
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
