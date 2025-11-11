import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ChapterMeta } from '@/lib/chapters'

interface ChapterNavigationProps {
  prevChapter?: ChapterMeta
  nextChapter?: ChapterMeta
}

export function ChapterNavigation({ prevChapter, nextChapter }: ChapterNavigationProps) {
  return (
    <div className="mt-12 pt-8 border-t flex items-center justify-between gap-4">
      {prevChapter ? (
        <Link href={`/chapters/${prevChapter.slug}`} className="flex-1">
          <Button variant="outline" className="w-full justify-start group">
            <ChevronLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <div className="text-left">
              <div className="text-xs text-muted-foreground">이전 챕터</div>
              <div className="font-semibold">{prevChapter.title}</div>
            </div>
          </Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}

      {nextChapter ? (
        <Link href={`/chapters/${nextChapter.slug}`} className="flex-1">
          <Button variant="outline" className="w-full justify-end group">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">다음 챕터</div>
              <div className="font-semibold">{nextChapter.title}</div>
            </div>
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      ) : (
        <div className="flex-1" />
      )}
    </div>
  )
}
