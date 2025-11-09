import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, BookOpen, Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="container py-20">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-2">페이지를 찾을 수 없습니다</h2>
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>💡 TIP:</strong> URL을 다시 확인하거나 아래 링크를 통해 원하는 페이지로 이동하세요.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/" className="block">
                  <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
                    <Home className="h-6 w-6 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">홈으로</h3>
                  </div>
                </Link>

                <Link href="/chapters" className="block">
                  <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
                    <BookOpen className="h-6 w-6 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">챕터 보기</h3>
                  </div>
                </Link>

                <Link href="/roadmap" className="block">
                  <div className="p-4 border rounded-lg hover:bg-muted transition-colors">
                    <Compass className="h-6 w-6 mx-auto mb-2" />
                    <h3 className="font-semibold text-sm">로드맵</h3>
                  </div>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">홈으로 돌아가기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/chapters">챕터 둘러보기</Link>
          </Button>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg text-left">
          <h3 className="font-semibold mb-3">자주 찾는 페이지</h3>
          <div className="space-y-2 text-sm">
            <Link href="/chapters/01-ontology-basics" className="block text-primary hover:underline">
              → Chapter 1: 온톨로지란 무엇인가?
            </Link>
            <Link href="/chapters/02-rdf" className="block text-primary hover:underline">
              → Chapter 2: RDF - 온톨로지의 언어
            </Link>
            <Link href="/chapters/04-sparql" className="block text-primary hover:underline">
              → Chapter 4: SPARQL - 온톨로지 쿼리
            </Link>
            <Link href="/about" className="block text-primary hover:underline">
              → 프로젝트 소개
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
