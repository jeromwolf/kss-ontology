import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { siteConfig } from "@/config/site"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container flex flex-col items-center gap-6 py-16 md:py-24">
        <Badge variant="outline" className="px-4 py-1">
          Phase 1 완료: 10개 챕터, 61,200 단어
        </Badge>

        <h1 className="text-center text-4xl font-bold leading-tight tracking-tighter md:text-6xl lg:text-7xl">
          세계에서 가장 깊이 있는
          <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
            온톨로지 교육 플랫폼
          </span>
        </h1>

        <p className="max-w-[750px] text-center text-lg text-muted-foreground sm:text-xl">
          MIT 수준의 콘텐츠와 인터랙티브 시뮬레이터로 온톨로지 전문가가 되세요
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/chapters">시작하기</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">자세히 알아보기</Link>
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-muted/50">
        <div className="container py-10">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold">{siteConfig.stats.chapters}</div>
              <div className="mt-2 text-sm text-muted-foreground">챕터</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{siteConfig.stats.words.toLocaleString()}</div>
              <div className="mt-2 text-sm text-muted-foreground">단어</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{siteConfig.stats.simulators}</div>
              <div className="mt-2 text-sm text-muted-foreground">시뮬레이터</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">{siteConfig.stats.codeExamples}+</div>
              <div className="mt-2 text-sm text-muted-foreground">코드 예제</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold">30+</div>
              <div className="mt-2 text-sm text-muted-foreground">기업 사례</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-16 md:py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            왜 KSS Ontology인가?
          </h2>
          <p className="text-lg text-muted-foreground max-w-[750px] mx-auto">
            실무 중심, 깊이 있는 학습, 인터랙티브 시뮬레이터로 온톨로지를 마스터하세요
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>10개 심화 챕터</CardTitle>
              <CardDescription>기초부터 고급 응용까지</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                온톨로지 기초, RDF, RDFS/OWL, SPARQL, 추론 엔진부터 의료, 금융, 제조, AI 온톨로지까지 체계적으로 학습
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4개 인터랙티브 시뮬레이터</CardTitle>
              <CardDescription>실습하며 배우는 온톨로지</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                RDF Playground, SPARQL Playground, 추론 엔진, 3D Knowledge Graph로 이론을 실전에 적용
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>150+ 코드 예제</CardTitle>
              <CardDescription>실무 중심 학습</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Turtle, JSON-LD, RDF/XML, SPARQL 쿼리 등 실무에서 바로 사용 가능한 코드 예제 제공
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>산업별 응용 사례</CardTitle>
              <CardDescription>의료, 금융, 제조, AI</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                FHIR, HL7, SNOMED CT부터 금융 KYC, 제조 PLM, AI 지식 그래프까지 실제 산업 사례 학습
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>MIT 수준의 콘텐츠</CardTitle>
              <CardDescription>61,200 단어의 깊이</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                표면적인 설명이 아닌, 근본 원리와 설계 철학까지 깊이 있게 다루는 전문가 수준의 교육 자료
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>오픈소스 & 무료</CardTitle>
              <CardDescription>GitHub에서 공개</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                모든 콘텐츠와 시뮬레이터 소스 코드를 GitHub에서 공개. 학습하고, 기여하고, 함께 성장하세요
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-muted/50">
        <div className="container py-16 md:py-20">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              지금 바로 시작하세요
            </h2>
            <p className="max-w-[600px] text-lg text-muted-foreground">
              Chapter 1부터 차근차근 온톨로지 전문가로의 여정을 시작하세요
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/chapters">챕터 보기</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/simulators">시뮬레이터 체험</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
