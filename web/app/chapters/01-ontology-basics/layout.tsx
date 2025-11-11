import { ChapterNavigation } from '@/components/chapter-navigation'
import { getChapterBySlug, getPrevChapter, getNextChapter } from '@/lib/chapters'

export default function Chapter01Layout({ children }: { children: React.ReactNode }) {
  const chapter = getChapterBySlug('01-ontology-basics')
  const prevChapter = chapter ? getPrevChapter(chapter.id) : undefined
  const nextChapter = chapter ? getNextChapter(chapter.id) : undefined

  return (
    <>
      {children}
      <ChapterNavigation prevChapter={prevChapter} nextChapter={nextChapter} />
    </>
  )
}
