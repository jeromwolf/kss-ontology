import { MetadataRoute } from 'next'
import { CHAPTERS } from '@/lib/chapters'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://kss-ontology.vercel.app'

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/chapters`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/simulators`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/roadmap`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Chapter pages
  const chapterPages = CHAPTERS.map((chapter) => ({
    url: `${baseUrl}/chapters/${chapter.slug}`,
    lastModified: new Date(chapter.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Simulator pages
  const simulatorPages = [
    'rdf-editor',
    'sparql-playground',
    'reasoning-engine',
    'knowledge-graph',
  ].map((slug) => ({
    url: `${baseUrl}/simulators/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...chapterPages, ...simulatorPages]
}
