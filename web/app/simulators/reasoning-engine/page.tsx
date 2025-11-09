import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, ArrowLeft, Rocket } from "lucide-react"

export default function ReasoningEnginePage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
            <Lightbulb className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl">Inference Engine</CardTitle>
          <CardDescription>
            OWL 추론을 시뮬레이션하는 추론 엔진
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted rounded-lg text-center">
            <Rocket className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">곧 만나보실 수 있습니다</h3>
            <p className="text-sm text-muted-foreground">
              v4.0 업데이트 (2025년 2월)에 Inference Engine이 추가됩니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">예정된 기능</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>RDFS 11 규칙 시뮬레이션</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>OWL 2 추론 지원 (RL, EL, QL 프로파일)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>추론 과정 단계별 시각화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Pellet/HermiT 엔진 시뮬레이션</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>추론 결과 비교 (추론 전/후)</span>
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
              Inference Engine을 최대한 활용하기 위해 Chapter 5를 먼저 학습해보세요:
            </p>
            <Button asChild className="w-full">
              <Link href="/chapters/05-reasoning">
                Chapter 5: 추론 엔진 - 지식의 확장 →
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
