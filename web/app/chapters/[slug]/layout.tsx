import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CHAPTERS } from '@/lib/chapters'

type Props = {
  params: { slug: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const chapter = CHAPTERS.find((ch) => ch.slug === params.slug)

  if (!chapter) {
    return {
      title: '챕터를 찾을 수 없습니다',
    }
  }

  return {
    title: chapter.title,
    description: chapter.description,
    openGraph: {
      title: `${chapter.title} | KSS Ontology`,
      description: chapter.description,
      type: 'article',
      publishedTime: chapter.publishedAt,
    },
    keywords: chapter.topics,
  }
}

export async function generateStaticParams() {
  return CHAPTERS.map((chapter) => ({
    slug: chapter.slug,
  }))
}

export default function ChapterLayout({ children }: Props) {
  return <>{children}</>
}
