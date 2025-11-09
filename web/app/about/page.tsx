import type { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: '프로젝트 소개',
  description: '세계 최초 한글 온톨로지 교육 플랫폼 KSS Ontology. 시맨틱 웹, 지식 그래프, AI의 미래를 함께 탐험하세요.',
  openGraph: {
    title: '프로젝트 소개 | KSS Ontology',
    description: '세계 최초 한글 온톨로지 교육 플랫폼',
  },
}

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">프로젝트 소개</h1>
          <p className="text-lg text-muted-foreground">
            세계 최초 한글 온톨로지 교육 플랫폼
          </p>
        </div>

        <div className="space-y-8">
          {/* 프로젝트 개요 */}
          <Card>
            <CardHeader>
              <CardTitle>KSS Ontology란?</CardTitle>
              <CardDescription>
                Korean Semantic Space - 한국어 기반 온톨로지 교육 프로젝트
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                KSS Ontology는 <strong>세계 최초의 한글 온톨로지 교육 플랫폼</strong>으로,
                온톨로지의 기초부터 최신 AI 통합까지 체계적으로 학습할 수 있는 종합 교육 과정입니다.
              </p>
              <p>
                10개 챕터, 61,200 단어의 깊이 있는 콘텐츠와 4개의 인터랙티브 시뮬레이터를 통해
                이론과 실습을 동시에 경험할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          {/* 핵심 특징 */}
          <Card>
            <CardHeader>
              <CardTitle>핵심 특징</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">1</Badge>
                    한글 기반 교육
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    세계 최초 한글로 작성된 온톨로지 전문 교육 과정으로,
                    한국어 사용자를 위한 최적화된 학습 경험을 제공합니다.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">2</Badge>
                    인터랙티브 시뮬레이터
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    RDF Triple Editor, SPARQL Playground, Inference Engine,
                    3D Knowledge Graph 등 4개의 실습 도구를 제공합니다.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">3</Badge>
                    체계적인 커리큘럼
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    기초(Part 1) → 실전(Part 2) → 미래(Part 3)로 이어지는
                    단계별 학습 경로를 통해 전문가로 성장할 수 있습니다.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge variant="outline">4</Badge>
                    최신 기술 통합
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    LLM과 온톨로지의 결합, Solid 프로토콜, 지식 추출 등
                    최신 트렌드를 반영한 실무 중심 내용을 다룹니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 학습 내용 */}
          <Card>
            <CardHeader>
              <CardTitle>학습 내용</CardTitle>
              <CardDescription>3개 파트, 10개 챕터로 구성</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Part 1: 기초 다지기</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 온톨로지의 철학적 기원과 현대적 정의</li>
                  <li>• RDF Triple 구조와 직렬화 포맷</li>
                  <li>• RDFS와 OWL로 의미 계층 구축</li>
                  <li>• SPARQL 쿼리 언어 마스터</li>
                  <li>• 추론 엔진과 지식 확장</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Part 2: 실전 응용</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 3D 지식 그래프 시각화</li>
                  <li>• Solid 프로토콜과 탈중앙화 웹</li>
                  <li>• NLP 기반 지식 추출</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Part 3: 미래 전망</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• LLM과 온톨로지의 결합</li>
                  <li>• 온톨로지의 미래 트렌드</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* 제작 정보 */}
          <Card>
            <CardHeader>
              <CardTitle>제작 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">제작</h3>
                <p className="text-sm text-muted-foreground">
                  데이터공작소 TFT (jeromwolf)
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">기술 스택</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Next.js 14</Badge>
                  <Badge variant="secondary">React 19</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Tailwind CSS 4</Badge>
                  <Badge variant="secondary">MDX</Badge>
                  <Badge variant="secondary">shadcn/ui</Badge>
                  <Badge variant="secondary">Three.js</Badge>
                  <Badge variant="secondary">Monaco Editor</Badge>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">라이선스</h3>
                <p className="text-sm text-muted-foreground">
                  교육 목적으로 자유롭게 사용 가능합니다.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">버전</h3>
                <p className="text-sm text-muted-foreground">
                  v3.0 FINAL (2025년 1월)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* 연락처 */}
          <Card>
            <CardHeader>
              <CardTitle>문의 및 기여</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                프로젝트에 대한 문의사항이나 개선 제안이 있으시면 언제든 연락 주세요.
              </p>
              <div className="space-y-2">
                <p className="text-sm">
                  <strong>GitHub:</strong>{" "}
                  <a
                    href="https://github.com/jeromwolf/kss-ontology"
                    className="text-primary hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/jeromwolf/kss-ontology
                  </a>
                </p>
                <p className="text-sm">
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:contact@kss-ontology.kr"
                    className="text-primary hover:underline"
                  >
                    contact@kss-ontology.kr
                  </a>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
