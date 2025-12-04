import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

// Lazy initialization to avoid build-time errors
let openai: OpenAI | null = null

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || '',
    })
  }
  return openai
}

export interface NewsArticle {
  title: string
  description: string
  link: string
  pubDate: string
}

export interface CompanyEntity {
  name: string
  mentions: number
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number  // -1 to 1
}

export interface Relationship {
  source: string
  target: string
  type: 'supplier' | 'customer' | 'competitor' | 'partner' | 'related'
  confidence: number  // 0 to 1
}

export interface RDFTriple {
  subject: string
  predicate: string
  object: string
}

export interface OntologyAnalysisResult {
  companies: CompanyEntity[]
  relationships: Relationship[]
  rdfTriples: RDFTriple[]
  impactScores: Record<string, number>
  summary: string
}

export async function POST(request: NextRequest) {
  try {
    const { articles } = await request.json() as { articles: NewsArticle[] }

    if (!articles || articles.length === 0) {
      return NextResponse.json(
        { error: '분석할 뉴스 기사가 없습니다.' },
        { status: 400 }
      )
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다. .env.local 파일에 OPENAI_API_KEY를 추가해주세요.' },
        { status: 500 }
      )
    }

    // 뉴스 기사들을 하나의 텍스트로 결합
    const newsText = articles.map((article, index) =>
      `[기사 ${index + 1}]\n제목: ${article.title}\n내용: ${article.description}\n`
    ).join('\n')

    // OpenAI를 사용한 온톨로지 분석
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 뉴스 기사를 분석하여 기업 온톨로지를 생성하는 전문가입니다.
다음 작업을 수행해주세요:

1. **기업명 추출 (NER)**: 기사에서 언급된 모든 한국 기업명을 추출하세요.
2. **감정 분석**: 각 기업에 대한 기사의 전반적인 감정(긍정/부정/중립)과 점수(-1~1)를 분석하세요.
3. **관계 매핑**: 기업들 간의 관계(공급망, 경쟁사, 파트너 등)를 파악하세요.
4. **영향도 계산**: 각 기업이 받는 영향의 정도를 0-100 점수로 계산하세요.

**중요**: 응답은 반드시 아래 JSON 형식으로만 제공하세요. 다른 설명이나 텍스트 없이 JSON만 출력하세요.

\`\`\`json
{
  "companies": [
    {
      "name": "기업명",
      "mentions": 3,
      "sentiment": "positive" | "negative" | "neutral",
      "sentimentScore": 0.7
    }
  ],
  "relationships": [
    {
      "source": "기업A",
      "target": "기업B",
      "type": "supplier" | "customer" | "competitor" | "partner" | "related",
      "confidence": 0.8
    }
  ],
  "rdfTriples": [
    {
      "subject": "삼성전자",
      "predicate": "공급받음",
      "object": "SK하이닉스"
    }
  ],
  "impactScores": {
    "삼성전자": 85,
    "SK하이닉스": 72
  },
  "summary": "주요 분석 내용 요약 (2-3문장)"
}
\`\`\``
        },
        {
          role: "user",
          content: newsText
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const responseText = completion.choices[0].message.content

    if (!responseText) {
      throw new Error('OpenAI 응답이 비어있습니다.')
    }

    // JSON 추출 (코드 블록 제거)
    let jsonText = responseText.trim()

    // ```json ... ``` 형식 제거
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/^```json?\s*/, '').replace(/```\s*$/, '')
    }

    const analysis: OntologyAnalysisResult = JSON.parse(jsonText)

    return NextResponse.json(analysis)

  } catch (error) {
    console.error('온톨로지 분석 오류:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: '온톨로지 분석 중 오류가 발생했습니다.',
          details: error.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: '온톨로지 분석 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}
