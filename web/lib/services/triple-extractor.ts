import OpenAI from 'openai'
import { findCompanyEntity, KOREAN_COMPANIES } from '../ontology/company-ontology'

// Lazy initialization to support scripts that load env variables after module import
let openai: OpenAI | null = null

function getOpenAI(): OpenAI {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
  }
  return openai
}

/**
 * RDF Triple 구조
 * 실제 온톨로지의 기본 단위 (Subject-Predicate-Object)
 */
export interface RDFTriple {
  subject: string // URI 형식 (예: kss:Company_Samsung)
  predicate: string // URI 형식 (예: kss:supplies_to)
  object: string // URI 또는 리터럴
  confidence: number // 0.0-1.0 신뢰도
  source: string // 출처 (뉴스 URL 등)
  extractedDate: string // ISO 날짜
  validatedBy?: 'baseline' | 'user' | 'gpt' // 검증 방법
}

/**
 * GPT가 추출한 관계를 RDF Triple로 변환
 */
interface ExtractedRelation {
  subject: string // 기업명
  predicate: string // 관계 유형
  object: string // 대상 기업명
  confidence: number
  evidence: string // 근거 문장
}

/**
 * 뉴스에서 기업 관계를 추출하고 RDF Triple로 변환
 * 이것이 진짜 온톨로지 구축의 핵심!
 */
export async function extractTriplesFromNews(
  newsTitle: string,
  newsDescription: string,
  newsUrl: string
): Promise<RDFTriple[]> {
  // 1. GPT로 관계 추출
  const extractedRelations = await extractRelationsWithGPT(newsTitle, newsDescription)

  // 2. 추출된 관계를 RDF Triple로 변환
  const triples: RDFTriple[] = []

  for (const relation of extractedRelations) {
    const triple = convertToRDFTriple(relation, newsUrl)
    if (triple) {
      triples.push(triple)
    }
  }

  return triples
}

/**
 * GPT를 사용하여 뉴스에서 기업 관계 추출
 */
async function extractRelationsWithGPT(
  title: string,
  description: string
): Promise<ExtractedRelation[]> {
  const prompt = `다음 뉴스에서 기업 간 관계를 추출해주세요.

뉴스 제목: ${title}
뉴스 내용: ${description}

추출 가능한 관계 유형:
- supplies_to: A가 B에 공급 (예: LG화학이 테슬라에 배터리 공급)
- competes_with: A와 B가 경쟁 (예: 삼성과 SK하이닉스가 메모리 시장에서 경쟁)
- partners_with: A와 B가 협력 (예: 현대차와 구글이 자율주행 개발)
- acquires: A가 B를 인수 (예: 마이크로소프트가 OpenAI 지분 인수)
- subsidiary_of: A가 B의 자회사 (예: 카카오뱅크가 카카오의 자회사)
- influences: A가 B에 영향 (예: 엔비디아 실적이 삼성전자에 영향)

다음 형식으로 JSON 응답해주세요:
{
  "relations": [
    {
      "subject": "주체 기업명",
      "predicate": "관계 유형 (위 목록 중 하나)",
      "object": "대상 기업명",
      "confidence": 0.0-1.0 (확실도),
      "evidence": "근거가 되는 원문 문장"
    }
  ]
}

주의:
- 명시적으로 언급된 관계만 추출 (추측 금지)
- 기업명은 정확하게 추출
- confidence는 보수적으로 평가 (애매하면 0.6 이하)`

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 뉴스에서 기업 관계를 추출하는 전문가입니다. RDF 온톨로지 구축을 위한 정확한 Triple을 생성합니다.',
        },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.1, // 낮은 temperature로 일관성 확보
    })

    const result = JSON.parse(completion.choices[0].message.content || '{"relations":[]}')
    return result.relations || []
  } catch (error) {
    console.error('Failed to extract relations with GPT:', error)
    return []
  }
}

/**
 * 추출된 관계를 RDF Triple로 변환
 * 기업명을 URI로 변환하고 검증
 */
function convertToRDFTriple(
  relation: ExtractedRelation,
  sourceUrl: string
): RDFTriple | null {
  // 1. 기업명을 URI로 변환
  const subjectEntity = findCompanyEntity(relation.subject)
  const objectEntity = findCompanyEntity(relation.object)

  if (!subjectEntity || !objectEntity) {
    // 온톨로지에 없는 기업이면 스킵 (나중에 추가 가능)
    return null
  }

  // 2. 베이스라인과 비교하여 신뢰도 보정
  const adjustedConfidence = validateAgainstBaseline(
    subjectEntity.uri,
    relation.predicate,
    objectEntity.uri,
    relation.confidence
  )

  // 3. RDF Triple 생성
  const triple: RDFTriple = {
    subject: subjectEntity.uri,
    predicate: `kss:${relation.predicate}`,
    object: objectEntity.uri,
    confidence: adjustedConfidence.confidence,
    source: sourceUrl,
    extractedDate: new Date().toISOString(),
    validatedBy: adjustedConfidence.validatedBy,
  }

  return triple
}

/**
 * 베이스라인 온톨로지와 비교하여 신뢰도 검증
 * 이것이 "가짜"를 방지하는 핵심 메커니즘!
 */
function validateAgainstBaseline(
  subjectUri: string,
  predicate: string,
  objectUri: string,
  gptConfidence: number
): { confidence: number; validatedBy: 'baseline' | 'gpt' } {
  const subjectEntity = KOREAN_COMPANIES.find(c => c.uri === subjectUri)
  if (!subjectEntity) {
    return { confidence: gptConfidence, validatedBy: 'gpt' }
  }

  // 베이스라인에 이미 있는 관계인지 확인
  let existsInBaseline = false

  switch (predicate) {
    case 'supplies_to':
      existsInBaseline = subjectEntity.customers.includes(objectUri)
      break
    case 'competes_with':
      existsInBaseline = subjectEntity.competitors.includes(objectUri)
      break
    case 'subsidiary_of':
      existsInBaseline = subjectEntity.subsidiaries.includes(objectUri)
      break
  }

  if (existsInBaseline) {
    // 베이스라인과 일치하면 신뢰도 1.0
    return { confidence: 1.0, validatedBy: 'baseline' }
  } else {
    // 새로운 관계이면 GPT 신뢰도 사용 (보수적으로)
    return { confidence: Math.min(gptConfidence, 0.85), validatedBy: 'gpt' }
  }
}

/**
 * 여러 뉴스를 배치로 처리하여 Triple 추출
 */
export async function batchExtractTriples(
  newsArticles: Array<{ title: string; description: string; link: string }>
): Promise<RDFTriple[]> {
  const allTriples: RDFTriple[] = []

  for (const article of newsArticles) {
    try {
      const triples = await extractTriplesFromNews(
        article.title,
        article.description,
        article.link
      )
      allTriples.push(...triples)
    } catch (error) {
      console.error(`Failed to extract triples from ${article.link}:`, error)
    }
  }

  // 중복 제거 (같은 subject-predicate-object는 하나만)
  const uniqueTriples = deduplicateTriples(allTriples)

  return uniqueTriples
}

/**
 * Triple 중복 제거 및 신뢰도 병합
 */
function deduplicateTriples(triples: RDFTriple[]): RDFTriple[] {
  const tripleMap = new Map<string, RDFTriple>()

  for (const triple of triples) {
    const key = `${triple.subject}|${triple.predicate}|${triple.object}`

    const existing = tripleMap.get(key)
    if (existing) {
      // 이미 있으면 높은 신뢰도를 사용
      if (triple.confidence > existing.confidence) {
        tripleMap.set(key, triple)
      }
    } else {
      tripleMap.set(key, triple)
    }
  }

  return Array.from(tripleMap.values())
}

/**
 * SPARQL 쿼리를 위한 Turtle 형식 출력
 * (나중에 실제 Triple Store에 저장할 때 사용)
 */
export function triplesToTurtle(triples: RDFTriple[]): string {
  let turtle = '@prefix kss: <http://kss-ontology.org/> .\n\n'

  for (const triple of triples) {
    turtle += `${triple.subject} ${triple.predicate} ${triple.object} .\n`
  }

  return turtle
}
