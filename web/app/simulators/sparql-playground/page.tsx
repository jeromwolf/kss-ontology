import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, ArrowLeft, Rocket } from "lucide-react"

export default function SparqlPlaygroundPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
            <Database className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl">SPARQL Playground</CardTitle>
          <CardDescription>
            SPARQL 쿼리를 작성하고 실행하는 실습 환경
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted rounded-lg text-center">
            <Rocket className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">곧 만나보실 수 있습니다</h3>
            <p className="text-sm text-muted-foreground">
              v4.0 업데이트 (2025년 2월)에 SPARQL Playground가 추가됩니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">예정된 기능</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>DBpedia/Wikidata 실시간 연동</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>쿼리 결과 테이블 및 그래프 시각화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>FILTER, OPTIONAL, UNION 문법 지원</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Property Paths 실습 환경</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>쿼리 히스토리 및 저장 기능</span>
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
              SPARQL Playground를 최대한 활용하기 위해 Chapter 4를 먼저 학습해보세요:
            </p>
            <Button asChild className="w-full">
              <Link href="/chapters/04-sparql">
                Chapter 4: SPARQL - 온톨로지 쿼리 →
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
