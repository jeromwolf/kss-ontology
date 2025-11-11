import { ChapterNavigation } from '@/components/chapter-navigation'
import { getChapterBySlug, getPrevChapter, getNextChapter } from '@/lib/chapters'

export default function ChapterLayout({ children }: { children: React.ReactNode }) {
  const chapter = getChapterBySlug('06-knowledge-graph')
  const prevChapter = chapter ? getPrevChapter(chapter.id) : undefined
  const nextChapter = chapter ? getNextChapter(chapter.id) : undefined

  return (
    <>
      {children}
      <ChapterNavigation prevChapter={prevChapter} nextChapter={nextChapter} />
    </>
  )
}
