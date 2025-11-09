import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, X } from "lucide-react"

export default function SimulatorLayout({
  children,
}: {
  children: React.Node
}) {
  return (
    <div className="h-screen flex flex-col">
      {/* 최소한의 헤더 - 전체 화면 활용을 위해 */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/simulators" className="font-semibold">
              시뮬레이터
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                홈으로
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* 전체 화면 시뮬레이터 영역 */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
