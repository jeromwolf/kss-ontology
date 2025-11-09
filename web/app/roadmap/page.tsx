import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Clock } from "lucide-react"

export default function RoadmapPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">개발 로드맵</h1>
          <p className="text-lg text-muted-foreground">
            KSS Ontology 프로젝트의 현재와 미래
          </p>
        </div>

        {/* 현재 버전 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>v3.0 FINAL</CardTitle>
                <CardDescription>현재 버전 (2025년 1월)</CardDescription>
              </div>
              <Badge className="bg-green-600">완료</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">10개 챕터 콘텐츠 완성</h4>
                  <p className="text-sm text-muted-foreground">
                    61,200 단어의 깊이 있는 온톨로지 교육 콘텐츠
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">웹 플랫폼 구축</h4>
                  <p className="text-sm text-muted-foreground">
                    Next.js 14 + React 19 기반 현대적 웹 애플리케이션
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">반응형 UI/UX</h4>
                  <p className="text-sm text-muted-foreground">
                    shadcn/ui + Tailwind CSS 4로 구현한 아름다운 디자인
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">다크모드 지원</h4>
                  <p className="text-sm text-muted-foreground">
                    시스템 설정 자동 감지 및 수동 전환 기능
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phase 5: 시뮬레이터 통합 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Phase 5: 인터랙티브 시뮬레이터</CardTitle>
                <CardDescription>2025년 2월 예정</CardDescription>
              </div>
              <Badge variant="outline" className="border-blue-600 text-blue-600">
                진행 예정
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">RDF Triple Editor</h4>
                  <p className="text-sm text-muted-foreground">
                    실시간 RDF 편집 및 검증 도구 (Monaco Editor 기반)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">SPARQL Playground</h4>
                  <p className="text-sm text-muted-foreground">
                    SPARQL 쿼리 실습 환경 (DBpedia/Wikidata 연동)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">Inference Engine</h4>
                  <p className="text-sm text-muted-foreground">
                    OWL 추론 시뮬레이터 (Pellet/HermiT 엔진)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold">3D Knowledge Graph</h4>
                  <p className="text-sm text-muted-foreground">
                    Three.js 기반 인터랙티브 지식 그래프 시각화
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* v4.0: 커뮤니티 기능 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>v4.0: 커뮤니티 & 협업</CardTitle>
                <CardDescription>2025년 3분기 예정</CardDescription>
              </div>
              <Badge variant="outline">계획 중</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">사용자 계정 시스템</h4>
                  <p className="text-sm text-muted-foreground">
                    학습 진도 저장 및 개인화된 학습 경로 제공
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">온톨로지 공유 플랫폼</h4>
                  <p className="text-sm text-muted-foreground">
                    사용자가 작성한 온톨로지를 공유하고 협업할 수 있는 공간
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">Q&A 포럼</h4>
                  <p className="text-sm text-muted-foreground">
                    학습자들 간의 질문과 답변을 통한 지식 공유
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">실전 프로젝트 갤러리</h4>
                  <p className="text-sm text-muted-foreground">
                    온톨로지를 활용한 실제 프로젝트 사례 공유
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* v5.0: AI 통합 */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>v5.0: AI 기반 학습 도우미</CardTitle>
                <CardDescription>2025년 4분기 예정</CardDescription>
              </div>
              <Badge variant="outline">계획 중</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">AI 튜터</h4>
                  <p className="text-sm text-muted-foreground">
                    LLM 기반 개인화된 학습 가이드 및 Q&A
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">자동 온톨로지 생성</h4>
                  <p className="text-sm text-muted-foreground">
                    자연어 설명으로부터 온톨로지 자동 생성 (LLM + 온톨로지)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">코드 리뷰 AI</h4>
                  <p className="text-sm text-muted-foreground">
                    작성한 RDF/SPARQL 코드에 대한 자동 피드백
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h4 className="font-semibold">RAG 기반 검색</h4>
                  <p className="text-sm text-muted-foreground">
                    온톨로지 + LLM을 결합한 차세대 콘텐츠 검색
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 장기 비전 */}
        <Card>
          <CardHeader>
            <CardTitle>장기 비전 (2026년 이후)</CardTitle>
            <CardDescription>세계 최고의 온톨로지 교육 플랫폼으로</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">다국어 지원</h4>
                <p className="text-sm text-muted-foreground">
                  영어, 일본어, 중국어 등 주요 언어로 콘텐츠 확장
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">산업별 특화 코스</h4>
                <p className="text-sm text-muted-foreground">
                  의료, 금융, 제조 등 산업별 온톨로지 전문 과정 개설
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">인증 프로그램</h4>
                <p className="text-sm text-muted-foreground">
                  공식 온톨로지 전문가 인증 제도 운영
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">기업 교육 프로그램</h4>
                <p className="text-sm text-muted-foreground">
                  기업 맞춤형 온톨로지 교육 및 컨설팅 서비스
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">오픈소스 기여</h4>
                <p className="text-sm text-muted-foreground">
                  온톨로지 도구 및 라이브러리 오픈소스 프로젝트 운영
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 참여 안내 */}
        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">함께 만들어갑니다</h3>
          <p className="text-sm text-muted-foreground mb-4">
            KSS Ontology는 커뮤니티와 함께 성장하는 프로젝트입니다.
            여러분의 피드백과 제안을 환영합니다.
          </p>
          <div className="flex gap-4">
            <a
              href="https://github.com/jeromwolf/kss-ontology"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              GitHub에서 기여하기 →
            </a>
            <a
              href="mailto:contact@kss-ontology.kr"
              className="text-sm text-primary hover:underline"
            >
              제안 보내기 →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
