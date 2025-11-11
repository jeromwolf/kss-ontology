import OpenAI from 'openai'
import {
  extractCompanyRelations,
  analyzeIndustryImpact,
  findCompanyEntity,
  type CompanyRelation
} from '../ontology/company-ontology'
// 실제 온톨로지 인프라 임포트
import { extractTriplesFromNews, batchExtractTriples } from './triple-extractor'
import { getCompanyRelations, saveTriples, queryTriples } from './ontology-query'
import { analyzeCompanyImpact, type ImpactAnalysis } from './impact-reasoner'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface NewsArticle {
  title: string
  description: string
  link: string
  pubDate: string
}

interface OntologyInsight {
  relations: CompanyRelation[]
  industryImpact: {
    industry: string
    relatedCompanies: Array<{
      name: string
      relationship: string
      impactLevel: number
    }>
  } | null
  knowledgeGraph: {
    nodes: Array<{ id: string; label: string; type: string }>
    edges: Array<{ source: string; target: string; label: string }>
  }
  impactAnalysis?: ImpactAnalysis | null // 추론 엔진 결과
}

interface CompanyInsight {
  companyName: string
  relevantNews: NewsArticle[]
  sentiment: 'positive' | 'negative' | 'neutral'
  importance: number // 1-10
  summary: string
  keyPoints: string[]
  relatedCompanies: Array<{
    name: string
    relationship: string
  }>
  ontologyInsight?: OntologyInsight
}

interface DailyInsight {
  date: string
  companies: CompanyInsight[]
  urgentItems: Array<{
    company: string
    reason: string
    news: NewsArticle
  }>
  opportunities: Array<{
    company: string
    reason: string
    news: NewsArticle
  }>
  marketOverview: string
}

/**
 * 관심 기업 목록에 대한 일일 인사이트 생성
 */
export async function generateDailyInsight(
  companies: string[],
  newsArticles: NewsArticle[]
): Promise<DailyInsight> {
  // 1. 각 기업별로 관련 뉴스 필터링 및 분석
  const companyInsights: CompanyInsight[] = []

  for (const company of companies) {
    const relevantNews = newsArticles.filter(
      (article) =>
        article.title.includes(company) || article.description.includes(company)
    )

    if (relevantNews.length === 0) continue

    // OpenAI로 해당 기업 뉴스 분석
    const insight = await analyzeCompanyNews(company, relevantNews)
    companyInsights.push(insight)
  }

  // 2. 긴급 이슈 추출 (부정적 감정 + 높은 중요도)
  const urgentItems = companyInsights
    .filter((insight) => insight.sentiment === 'negative' && insight.importance >= 7)
    .flatMap((insight) =>
      insight.relevantNews.slice(0, 1).map((news) => ({
        company: insight.companyName,
        reason: insight.keyPoints[0] || '부정적 뉴스 발생',
        news,
      }))
    )

  // 3. 기회 추출 (긍정적 감정 + 높은 중요도)
  const opportunities = companyInsights
    .filter((insight) => insight.sentiment === 'positive' && insight.importance >= 7)
    .flatMap((insight) =>
      insight.relevantNews.slice(0, 1).map((news) => ({
        company: insight.companyName,
        reason: insight.keyPoints[0] || '긍정적 기회 발생',
        news,
      }))
    )

  // 4. 전체 시장 오버뷰 생성
  const marketOverview = await generateMarketOverview(companyInsights)

  return {
    date: new Date().toISOString(),
    companies: companyInsights,
    urgentItems,
    opportunities,
    marketOverview,
  }
}

/**
 * 특정 기업의 뉴스를 분석하여 인사이트 생성
 */
async function analyzeCompanyNews(
  companyName: string,
  news: NewsArticle[]
): Promise<CompanyInsight> {
  const newsText = news
    .map((article, i) => `${i + 1}. ${article.title}\n${article.description}`)
    .join('\n\n')

  const prompt = `다음은 "${companyName}"에 대한 최근 뉴스입니다. 투자자 관점에서 분석해주세요.

뉴스:
${newsText}

다음 형식으로 JSON 응답해주세요:
{
  "sentiment": "positive" | "negative" | "neutral",
  "importance": 1-10 (투자 결정에 미치는 영향도),
  "summary": "한 문장 요약",
  "keyPoints": ["핵심 포인트 1", "핵심 포인트 2", "핵심 포인트 3"],
  "relatedCompanies": [{"name": "관련 기업명", "relationship": "관계 설명"}]
}`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            '당신은 금융 전문가입니다. 뉴스를 분석하여 투자자에게 실용적인 인사이트를 제공합니다.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    })

    const analysis = JSON.parse(completion.choices[0].message.content || '{}')

    // 온톨로지 기반 분석 추가 (실제 온톨로지!)
    const ontologyInsight = await generateOntologyInsight(companyName)

    // 뉴스에서 Triple 추출 및 저장 (온톨로지 구축!)
    try {
      const triples = await batchExtractTriples(news.map(article => ({
        title: article.title,
        description: article.description,
        link: article.link
      })))

      if (triples.length > 0) {
        await saveTriples(triples)
        console.log(`✅ Extracted and saved ${triples.length} triples for ${companyName}`)
      }
    } catch (error) {
      console.error(`Failed to extract triples for ${companyName}:`, error)
    }

    return {
      companyName,
      relevantNews: news,
      sentiment: analysis.sentiment || 'neutral',
      importance: analysis.importance || 5,
      summary: analysis.summary || '',
      keyPoints: analysis.keyPoints || [],
      relatedCompanies: analysis.relatedCompanies || [],
      ontologyInsight,
    }
  } catch (error) {
    console.error(`Failed to analyze news for ${companyName}:`, error)
    return {
      companyName,
      relevantNews: news,
      sentiment: 'neutral',
      importance: 5,
      summary: '분석 중 오류가 발생했습니다.',
      keyPoints: [],
      relatedCompanies: [],
    }
  }
}

/**
 * 온톨로지 기반 인사이트 생성 - 실제 온톨로지 사용!
 */
async function generateOntologyInsight(companyName: string): Promise<OntologyInsight | undefined> {
  const companyEntity = findCompanyEntity(companyName)
  if (!companyEntity) return undefined

  // 1. 베이스라인 관계 (하드코딩된 기본 관계)
  const baselineRelations = extractCompanyRelations(companyName)

  // 2. DB에서 실시간으로 추출된 관계 가져오기 (실제 온톨로지!)
  let dbRelations: CompanyRelation[] = []
  try {
    const companyRelations = await getCompanyRelations(companyEntity.uri)

    // RDF Triple을 CompanyRelation 형식으로 변환
    dbRelations = companyRelations.outgoing.map(triple => ({
      subject: triple.subject,
      predicate: triple.predicate.replace('kss:', '') as any,
      object: triple.object,
      strength: triple.confidence,
      description: `[DB 추출] 신뢰도 ${(triple.confidence * 100).toFixed(0)}% - ${triple.validatedBy === 'baseline' ? '검증됨' : '추정'}`
    }))
  } catch (error) {
    console.error('Failed to fetch DB relations:', error)
  }

  // 3. 베이스라인 + DB 관계 통합 (중복 제거)
  const allRelations = [...baselineRelations, ...dbRelations]
  const uniqueRelations = deduplicateRelations(allRelations)

  // 4. 추론 엔진으로 영향 분석 (실제 온톨로지 추론!)
  let impactAnalysis: ImpactAnalysis | null = null
  try {
    impactAnalysis = await analyzeCompanyImpact(companyName)
  } catch (error) {
    console.error('Failed to analyze impact:', error)
  }

  // 5. 산업 영향도 분석
  const industryImpact = analyzeIndustryImpact(companyName)

  // 6. 지식 그래프 생성
  const knowledgeGraph = buildKnowledgeGraph(companyName, uniqueRelations)

  return {
    relations: uniqueRelations,
    industryImpact,
    knowledgeGraph,
    impactAnalysis, // 추론 엔진 결과 추가
  }
}

/**
 * 관계 중복 제거 (베이스라인 우선)
 */
function deduplicateRelations(relations: CompanyRelation[]): CompanyRelation[] {
  const map = new Map<string, CompanyRelation>()

  for (const rel of relations) {
    const key = `${rel.subject}|${rel.predicate}|${rel.object}`
    const existing = map.get(key)

    if (!existing || rel.strength > existing.strength) {
      map.set(key, rel)
    }
  }

  return Array.from(map.values())
}

/**
 * 지식 그래프 생성
 */
function buildKnowledgeGraph(companyName: string, relations: CompanyRelation[]) {
  const companyEntity = findCompanyEntity(companyName)
  if (!companyEntity) {
    return { nodes: [], edges: [] }
  }

  const nodes: Array<{ id: string; label: string; type: string }> = [
    { id: companyEntity.uri, label: companyEntity.name, type: 'company' }
  ]

  const edges: Array<{ source: string; target: string; label: string }> = []

  relations.forEach((rel) => {
    // 대상 기업 노드 추가
    const targetCompany = findCompanyEntity(rel.object.replace('kss:Company_', ''))
    if (targetCompany && !nodes.find(n => n.id === targetCompany.uri)) {
      nodes.push({
        id: targetCompany.uri,
        label: targetCompany.name,
        type: 'company'
      })
    }

    // 관계 엣지 추가
    edges.push({
      source: rel.subject,
      target: rel.object,
      label: rel.predicate.replace(/_/g, ' ')
    })
  })

  return { nodes, edges }
}

/**
 * 전체 시장 오버뷰 생성
 */
async function generateMarketOverview(insights: CompanyInsight[]): Promise<string> {
  if (insights.length === 0) {
    return '오늘은 관심 기업에 대한 주요 뉴스가 없습니다.'
  }

  const summaries = insights.map((insight) => `- ${insight.companyName}: ${insight.summary}`)

  const prompt = `다음은 오늘의 관심 기업 뉴스 요약입니다:

${summaries.join('\n')}

이를 바탕으로 투자자를 위한 전체 시장 오버뷰를 2-3문장으로 작성해주세요. 주요 트렌드와 주의할 점을 포함하세요.`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 금융 전문가입니다. 간결하고 핵심적인 시장 분석을 제공합니다.',
        },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      max_tokens: 200,
    })

    return completion.choices[0].message.content || '시장 오버뷰를 생성할 수 없습니다.'
  } catch (error) {
    console.error('Failed to generate market overview:', error)
    return '시장 오버뷰를 생성하는 중 오류가 발생했습니다.'
  }
}

/**
 * Naver News API로 뉴스 검색
 */
export async function fetchNewsForCompanies(
  companies: string[]
): Promise<Map<string, NewsArticle[]>> {
  const newsMap = new Map<string, NewsArticle[]>()

  for (const company of companies) {
    try {
      const response = await fetch(
        `https://openapi.naver.com/v1/search/news.json?query=${encodeURIComponent(company)}&display=10&sort=date`,
        {
          headers: {
            'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID!,
            'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET!,
          },
        }
      )

      if (!response.ok) {
        console.error(`Failed to fetch news for ${company}`)
        continue
      }

      const data = await response.json()
      newsMap.set(company, data.items || [])
    } catch (error) {
      console.error(`Error fetching news for ${company}:`, error)
    }
  }

  return newsMap
}
