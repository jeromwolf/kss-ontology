import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Network, ArrowLeft, Rocket } from "lucide-react"

export default function KnowledgeGraphPage() {
  return (
    <div className="h-full flex items-center justify-center p-8">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="mx-auto p-4 bg-primary/10 rounded-full w-fit mb-4">
            <Network className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-3xl">3D Knowledge Graph</CardTitle>
          <CardDescription>
            3D 공간에서 지식 그래프를 탐색하는 시각화 도구
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-6 bg-muted rounded-lg text-center">
            <Rocket className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold mb-2">곧 만나보실 수 있습니다</h3>
            <p className="text-sm text-muted-foreground">
              v4.0 업데이트 (2025년 2월)에 3D Knowledge Graph가 추가됩니다.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-3">예정된 기능</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Three.js 기반 고성능 3D 렌더링</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>인터랙티브 노드 탐색 (클릭, 드래그, 줌)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>계층 구조 및 관계 시각화</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>실시간 필터링 & 검색</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>노드 그룹화 및 색상 커스터마이징</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>VR/AR 모드 지원 (선택사항)</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-3">미리 학습하기</h4>
            <p className="text-sm text-muted-foreground mb-3">
              3D Knowledge Graph를 최대한 활용하기 위해 Chapter 6을 먼저 학습해보세요:
            </p>
            <Button asChild className="w-full">
              <Link href="/chapters/06-knowledge-graph">
                Chapter 6: 3D 지식 그래프 - 시각화 →
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
