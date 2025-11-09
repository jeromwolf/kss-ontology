import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CHAPTERS, PART_TITLES, getDifficultyStars, getChaptersByPart } from "@/lib/chapters"

export default function ChaptersPage() {
  const parts = [1, 2, 3]

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">온톨로지 교육 과정</h1>
        <p className="text-lg text-muted-foreground max-w-[750px] mx-auto">
          10개 챕터, 61,200 단어로 구성된 세계에서 가장 깊이 있는 온톨로지 교육 콘텐츠
        </p>
      </div>

      {parts.map((part) => {
        const chapters = getChaptersByPart(part)
        return (
          <section key={part} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">{PART_TITLES[part as 1 | 2 | 3]}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/chapters/${chapter.slug}`}
                  className="block transition-transform hover:scale-[1.02]"
                >
                  <Card className="h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline">Chapter {chapter.id}</Badge>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{getDifficultyStars(chapter.difficulty)}</span>
                          <span>·</span>
                          <span>{chapter.duration}</span>
                        </div>
                      </div>
                      <CardTitle>{chapter.title}</CardTitle>
                      <CardDescription>{chapter.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {chapter.topics.map((topic) => (
                          <Badge key={topic} variant="secondary">
                            {topic}
                          </Badge>
                        ))}
                      </div>
                      {chapter.simulators && chapter.simulators.length > 0 && (
                        <div className="mt-4 text-sm text-muted-foreground">
                          🎮 시뮬레이터: {chapter.simulators.join(", ")}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
