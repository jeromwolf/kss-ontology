import { queryTriples, getCompanyRelations, analyzeInfluenceChain, traceSupplyChain } from './ontology-query'
import { findCompanyEntity, KOREAN_COMPANIES } from '../ontology/company-ontology'
import type { RDFTriple } from './triple-extractor'

/**
 * 추론 엔진 - Impact Chain Analysis
 * 온톨로지 관계로부터 숨겨진 영향 관계를 추론
 *
 * 이것이 진짜 온톨로지의 힘!
 * 단순 데이터 검색이 아니라 논리적 추론을 통한 지식 확장
 */

export interface ImpactChain {
  source: string // 시작 기업
  target: string // 영향 받는 기업
  path: Array<{
    from: string
    to: string
    relation: string
    confidence: number
  }>
  overallConfidence: number
  reasoning: string // 추론 설명
}

export interface ImpactAnalysis {
  company: string
  directImpact: ImpactChain[]
  indirectImpact: ImpactChain[]
  industryRippleEffect: Array<{
    industry: string
    affectedCompanies: string[]
    severity: number // 0-1
  }>
  investmentInsight: string
}

/**
 * 핵심 추론 규칙들 (RDFS/OWL 스타일)
 */

// Rule 1: Transitive Property (전이 관계)
// A supplies_to B, B supplies_to C → A influences C (간접적으로)
async function inferTransitiveRelations(companyUri: string): Promise<ImpactChain[]> {
  const chains: ImpactChain[] = []

  // 공급망 체인 추적
  const supplyPaths = await traceSupplyChain(companyUri, 3)

  for (const path of supplyPaths) {
    if (path.path.length >= 2) {
      const pathSteps = []
      for (let i = 0; i < path.path.length - 1; i++) {
        pathSteps.push({
          from: path.path[i],
          to: path.path[i + 1],
          relation: 'supplies_to',
          confidence: path.confidence
        })
      }

      const source = path.path[0]
      const target = path.path[path.path.length - 1]
      const sourceEntity = findCompanyEntity(source.replace('kss:Company_', ''))
      const targetEntity = findCompanyEntity(target.replace('kss:Company_', ''))

      if (sourceEntity && targetEntity) {
        chains.push({
          source,
          target,
          path: pathSteps,
          overallConfidence: path.confidence,
          reasoning: `${sourceEntity.name}의 공급 중단이 ${pathSteps.length}단계 공급망을 통해 ${targetEntity.name}에 영향을 미칠 수 있습니다.`
        })
      }
    }
  }

  return chains
}

// Rule 2: Inverse Property (역관계)
// A supplies_to B → B depends_on A
async function inferInverseRelations(companyUri: string): Promise<Array<{ dependent: string; supplier: string; confidence: number }>> {
  const dependencies: Array<{ dependent: string; supplier: string; confidence: number }> = []

  // 이 기업에 공급하는 모든 기업 찾기
  const incomingSupply = await queryTriples({
    object: companyUri,
    predicate: 'kss:supplies_to'
  })

  for (const triple of incomingSupply) {
    dependencies.push({
      dependent: companyUri,
      supplier: triple.subject,
      confidence: triple.confidence
    })
  }

  return dependencies
}

// Rule 3: Property Chain (관계 체인)
// A competes_with B, B supplies_to C → A may influence C (경쟁사를 통한 간접 영향)
async function inferCompetitorInfluence(companyUri: string): Promise<ImpactChain[]> {
  const chains: ImpactChain[] = []

  // 1. 경쟁사 찾기
  const competitorTriples = await queryTriples({
    subject: companyUri,
    predicate: 'kss:competes_with'
  })

  // 2. 각 경쟁사의 공급 관계 찾기
  for (const competitorTriple of competitorTriples) {
    const competitorSupplies = await queryTriples({
      subject: competitorTriple.object,
      predicate: 'kss:supplies_to'
    })

    for (const supplyTriple of competitorSupplies) {
      const sourceEntity = findCompanyEntity(companyUri.replace('kss:Company_', ''))
      const competitorEntity = findCompanyEntity(competitorTriple.object.replace('kss:Company_', ''))
      const targetEntity = findCompanyEntity(supplyTriple.object.replace('kss:Company_', ''))

      if (sourceEntity && competitorEntity && targetEntity) {
        chains.push({
          source: companyUri,
          target: supplyTriple.object,
          path: [
            {
              from: companyUri,
              to: competitorTriple.object,
              relation: 'competes_with',
              confidence: competitorTriple.confidence
            },
            {
              from: competitorTriple.object,
              to: supplyTriple.object,
              relation: 'supplies_to',
              confidence: supplyTriple.confidence
            }
          ],
          overallConfidence: Math.min(competitorTriple.confidence, supplyTriple.confidence) * 0.8,
          reasoning: `${sourceEntity.name}와 ${competitorEntity.name}가 경쟁 관계이므로, ${sourceEntity.name}의 시장 점유율 변화가 ${targetEntity.name}의 수요에 간접적으로 영향을 미칠 수 있습니다.`
        })
      }
    }
  }

  return chains
}

// Rule 4: Symmetric Property (대칭 관계)
// A competes_with B → B competes_with A (자동 추론)
async function inferSymmetricRelations(companyUri: string): Promise<RDFTriple[]> {
  const inferredTriples: RDFTriple[] = []

  // competes_with는 대칭 관계
  const competitorTriples = await queryTriples({
    object: companyUri,
    predicate: 'kss:competes_with'
  })

  for (const triple of competitorTriples) {
    // 역방향 관계가 없으면 추론
    const reverseExists = await queryTriples({
      subject: companyUri,
      predicate: 'kss:competes_with',
      object: triple.subject
    })

    if (reverseExists.length === 0) {
      inferredTriples.push({
        subject: companyUri,
        predicate: 'kss:competes_with',
        object: triple.subject,
        confidence: triple.confidence * 0.95, // 추론이므로 약간 낮춤
        source: 'inferred:symmetric',
        extractedDate: new Date().toISOString(),
        validatedBy: 'gpt'
      })
    }
  }

  return inferredTriples
}

/**
 * 종합 영향 분석
 */
export async function analyzeCompanyImpact(companyName: string): Promise<ImpactAnalysis | null> {
  const companyEntity = findCompanyEntity(companyName)
  if (!companyEntity) return null

  const companyUri = companyEntity.uri

  // 1. 직접 영향 (1단계 관계)
  const directChains: ImpactChain[] = []
  const relations = await getCompanyRelations(companyUri)

  for (const triple of relations.outgoing) {
    const targetEntity = findCompanyEntity(triple.object.replace('kss:Company_', ''))
    if (targetEntity) {
      directChains.push({
        source: companyUri,
        target: triple.object,
        path: [{
          from: companyUri,
          to: triple.object,
          relation: triple.predicate.replace('kss:', ''),
          confidence: triple.confidence
        }],
        overallConfidence: triple.confidence,
        reasoning: `${companyEntity.name}가 ${targetEntity.name}와 직접적인 ${triple.predicate.replace('kss:', '')} 관계에 있습니다.`
      })
    }
  }

  // 2. 간접 영향 (추론을 통한 2~3단계 관계)
  const transitiveChains = await inferTransitiveRelations(companyUri)
  const competitorChains = await inferCompetitorInfluence(companyUri)

  const indirectChains = [...transitiveChains, ...competitorChains]
    .sort((a, b) => b.overallConfidence - a.overallConfidence)
    .slice(0, 10) // 상위 10개만

  // 3. 산업 파급 효과
  const industryRippleEffect = await analyzeIndustryRipple(companyUri)

  // 4. 투자 인사이트 생성
  const investmentInsight = generateInvestmentInsight(
    companyEntity,
    directChains,
    indirectChains,
    industryRippleEffect
  )

  return {
    company: companyEntity.name,
    directImpact: directChains,
    indirectImpact: indirectChains,
    industryRippleEffect,
    investmentInsight
  }
}

/**
 * 산업 파급 효과 분석
 */
async function analyzeIndustryRipple(companyUri: string): Promise<Array<{
  industry: string
  affectedCompanies: string[]
  severity: number
}>> {
  const companyEntity = findCompanyEntity(companyUri.replace('kss:Company_', ''))
  if (!companyEntity || companyEntity.industry.length === 0) return []

  const rippleEffects: Array<{
    industry: string
    affectedCompanies: string[]
    severity: number
  }> = []

  const primaryIndustry = companyEntity.industry[0]

  // 같은 산업의 모든 기업 찾기
  const sameIndustryCompanies = KOREAN_COMPANIES.filter(c =>
    c.uri !== companyUri &&
    c.industry.some(ind => ind.uri === primaryIndustry.uri)
  )

  if (sameIndustryCompanies.length > 0) {
    rippleEffects.push({
      industry: primaryIndustry.name,
      affectedCompanies: sameIndustryCompanies.map(c => c.name),
      severity: 0.8
    })
  }

  // 관련 산업 찾기
  for (const relatedUri of primaryIndustry.relatedIndustries) {
    const relatedCompanies = KOREAN_COMPANIES.filter(c =>
      c.industry.some(ind => ind.uri === relatedUri)
    )

    if (relatedCompanies.length > 0) {
      const industryName = relatedCompanies[0].industry.find(ind => ind.uri === relatedUri)?.name || '관련 산업'
      rippleEffects.push({
        industry: industryName,
        affectedCompanies: relatedCompanies.map(c => c.name),
        severity: 0.5
      })
    }
  }

  return rippleEffects
}

/**
 * 투자 인사이트 생성
 */
function generateInvestmentInsight(
  company: any,
  directImpact: ImpactChain[],
  indirectImpact: ImpactChain[],
  rippleEffect: any[]
): string {
  const insights: string[] = []

  // 공급망 리스크
  const suppliesRelations = directImpact.filter(c => c.path[0].relation === 'supplies_to')
  if (suppliesRelations.length > 0) {
    insights.push(`${company.name}는 ${suppliesRelations.length}개 기업에 공급하고 있어, 고객사 실적이 직접적인 영향을 미칩니다.`)
  }

  // 경쟁 리스크
  const competitorRelations = directImpact.filter(c => c.path[0].relation === 'competes_with')
  if (competitorRelations.length > 0) {
    insights.push(`${company.name}는 ${competitorRelations.length}개 경쟁사와 시장을 다투고 있어, 시장 점유율 변동에 주의가 필요합니다.`)
  }

  // 간접 영향
  if (indirectImpact.length > 0) {
    const highConfidenceIndirect = indirectImpact.filter(c => c.overallConfidence >= 0.7)
    if (highConfidenceIndirect.length > 0) {
      insights.push(`온톨로지 분석 결과, ${highConfidenceIndirect.length}개의 간접적 영향 경로가 발견되었습니다.`)
    }
  }

  // 산업 파급
  if (rippleEffect.length > 0) {
    const highSeverity = rippleEffect.filter(r => r.severity >= 0.7)
    if (highSeverity.length > 0) {
      insights.push(`${company.name}의 변동은 ${highSeverity[0].industry} 산업 전체에 파급 효과를 미칠 수 있습니다.`)
    }
  }

  return insights.join(' ')
}

/**
 * 추론된 Triple 저장 (캐싱)
 */
export async function saveInferredRelations(
  sourceTripleId: number,
  inferredTriple: RDFTriple,
  reasoningRule: string
): Promise<void> {
  // DB에 추론 결과 저장 (inferred_relations 테이블)
  // 구현은 ontology-query.ts에서 할 수도 있음
  console.log('Saving inferred relation:', inferredTriple, reasoningRule)
}

/**
 * 배치 추론: 모든 기업에 대해 추론 실행
 */
export async function runBatchInference(): Promise<{
  totalInferred: number
  byRule: Record<string, number>
}> {
  const stats = {
    totalInferred: 0,
    byRule: {
      transitive: 0,
      inverse: 0,
      symmetric: 0,
      competitor_influence: 0
    }
  }

  for (const company of KOREAN_COMPANIES) {
    // Symmetric 추론
    const symmetricTriples = await inferSymmetricRelations(company.uri)
    stats.byRule.symmetric += symmetricTriples.length
    stats.totalInferred += symmetricTriples.length

    // Transitive 추론
    const transitiveChains = await inferTransitiveRelations(company.uri)
    stats.byRule.transitive += transitiveChains.length
    stats.totalInferred += transitiveChains.length

    // Competitor influence 추론
    const competitorChains = await inferCompetitorInfluence(company.uri)
    stats.byRule.competitor_influence += competitorChains.length
    stats.totalInferred += competitorChains.length
  }

  return stats
}
