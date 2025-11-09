import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, ArrowLeft, Rocket } from "lucide-react"

export default function RDFEditorPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
            <Code className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl">RDF Triple Editor</CardTitle>
          <CardDescription>
            Monaco Editor 기반 인터랙티브 RDF 편집 도구
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted rounded-lg text-center">
            <Rocket className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">곧 만나보실 수 있습니다</h3>
            <p className="text-sm text-muted-foreground">
              v4.0 업데이트 (2025년 2월)에 RDF Triple Editor가 추가됩니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">예정된 기능</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Monaco Editor 기반 고급 코드 편집 (VS Code와 동일한 경험)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>실시간 문법 검증 및 자동완성</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Turtle, N-Triples, JSON-LD 포맷 상호 변환</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>예제 템플릿 및 스니펫 제공</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>RDF 그래프 시각화 (트리플 구조)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>다크모드 지원</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">미리 학습하기</h4>
            <p className="text-sm text-muted-foreground mb-3">
              RDF Triple Editor를 최대한 활용하기 위해 Chapter 2를 먼저 학습해보세요:
            </p>
            <Button asChild className="w-full">
              <Link href="/chapters/02-rdf">
                Chapter 2: RDF - 온톨로지의 언어 →
              </Link>
            </Button>
          </div>

          <div className="pt-4 border-t">
            <div className="flex gap-3">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/simulators">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  시뮬레이터 목록
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <Link href="/roadmap">
                  로드맵 확인
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
