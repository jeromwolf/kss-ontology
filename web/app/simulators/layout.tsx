'use client'

import Link from "next/link"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"

export default function SimulatorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 시뮬레이터에서는 메인 레이아웃의 헤더/푸터 숨김
  useEffect(() => {
    // 부모 레이아웃의 헤더/푸터 숨기기
    const rootDiv = document.querySelector('body > div.relative.flex.min-h-screen.flex-col')
    const mainHeader = rootDiv?.querySelector(':scope > header')
    const mainFooter = rootDiv?.querySelector(':scope > footer')

    if (mainHeader) (mainHeader as HTMLElement).style.display = 'none'
    if (mainFooter) (mainFooter as HTMLElement).style.display = 'none'

    return () => {
      // 클린업: 다른 페이지로 이동 시 복원
      if (mainHeader) (mainHeader as HTMLElement).style.display = ''
      if (mainFooter) (mainFooter as HTMLElement).style.display = ''
    }
  }, [])

  return (
    <div className="h-screen flex flex-col fixed inset-0 z-50 bg-background">
      {/* 시뮬레이터 전용 헤더 */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shrink-0">
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
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
