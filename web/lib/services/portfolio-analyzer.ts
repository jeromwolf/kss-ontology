/**
 * Portfolio Analyzer Service
 *
 * 온톨로지 기반 포트폴리오 리스크 분석
 * - 공급망 리스크 (Triple 추론 활용)
 * - 경쟁사 동향 모니터링
 * - 집중도 리스크
 * - 실시간 알림
 */

import { Pool } from 'pg'
import { queryTriples, getCompanyRelations } from './ontology-query'
import type { RDFTriple } from './triple-extractor'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  }
  return pool
}

export interface Holding {
  id: number
  portfolioId: number
  companyUri: string
  companyName: string
  ticker?: string
  quantity: number
  avgBuyPrice: number
  currentPrice?: number
  notes?: string
}

export interface PortfolioRisk {
  riskType: 'supply_chain' | 'competitor' | 'concentration' | 'market_sentiment'
  riskLevel: 'low' | 'medium' | 'high' | 'critical'
  affectedHoldings: string[] // company URIs
  description: string
  recommendation: string
  ontologyEvidence: RDFTriple[]
}

/**
 * 포트폴리오 전체 리스크 분석
 */
export async function analyzePortfolioRisk(
  portfolioId: number
): Promise<PortfolioRisk[]> {
  const risks: PortfolioRisk[] = []

  // 1. 포트폴리오 보유 종목 조회
  const holdings = await getPortfolioHoldings(portfolioId)

  if (holdings.length === 0) {
    return []
  }

  // 2. 공급망 리스크 분석
  const supplyChainRisks = await analyzeSupplyChainRisk(holdings)
  risks.push(...supplyChainRisks)

  // 3. 경쟁사 리스크 분석
  const competitorRisks = await analyzeCompetitorRisk(holdings)
  risks.push(...competitorRisks)

  // 4. 집중도 리스크 분석
  const concentrationRisk = await analyzeConcentrationRisk(holdings)
  if (concentrationRisk) {
    risks.push(concentrationRisk)
  }

  return risks
}

/**
 * 포트폴리오 보유 종목 조회
 */
async function getPortfolioHoldings(portfolioId: number): Promise<Holding[]> {
  const result = await getPool().query(
    `SELECT id, portfolio_id, company_uri, company_name, ticker,
            quantity, avg_buy_price, current_price, notes
     FROM holdings
     WHERE portfolio_id = $1`,
    [portfolioId]
  )

  return result.rows.map((row) => ({
    id: row.id,
    portfolioId: row.portfolio_id,
    companyUri: row.company_uri,
    companyName: row.company_name,
    ticker: row.ticker,
    quantity: parseFloat(row.quantity),
    avgBuyPrice: parseFloat(row.avg_buy_price),
    currentPrice: row.current_price ? parseFloat(row.current_price) : undefined,
    notes: row.notes,
  }))
}

/**
 * 공급망 리스크 분석
 *
 * 온톨로지 추론 활용:
 * - 보유 종목 A가 B에 공급 중 (A supplies_to B)
 * - B에 부정적 뉴스 발생 시 A에도 리스크
 */
async function analyzeSupplyChainRisk(
  holdings: Holding[]
): Promise<PortfolioRisk[]> {
  const risks: PortfolioRisk[] = []

  for (const holding of holdings) {
    // 해당 기업이 공급하는 회사들 찾기
    const supplyRelations = await queryTriples({
      subject: holding.companyUri,
      predicate: 'kss:supplies_to',
    })

    if (supplyRelations.length > 0) {
      // 공급 대상 기업이 포트폴리오에 있는지 확인
      const dependentCompanies = supplyRelations.map((r) => r.object)
      const affectedHoldings = holdings.filter((h) =>
        dependentCompanies.includes(h.companyUri)
      )

      if (affectedHoldings.length > 0) {
        risks.push({
          riskType: 'supply_chain',
          riskLevel: 'medium',
          affectedHoldings: [holding.companyUri, ...affectedHoldings.map((h) => h.companyUri)],
          description: `${holding.companyName}이(가) ${affectedHoldings.map((h) => h.companyName).join(', ')}에 공급 중입니다. 공급망 변동 시 두 종목 모두 영향을 받을 수 있습니다.`,
          recommendation: '공급 계약 안정성 모니터링 및 분산 투자 고려',
          ontologyEvidence: supplyRelations,
        })
      }
    }
  }

  return risks
}

/**
 * 경쟁사 리스크 분석
 *
 * 온톨로지 활용:
 * - 포트폴리오에 경쟁 관계인 기업들이 있는 경우
 * - 한쪽이 성장하면 다른 쪽이 타격받을 가능성
 */
async function analyzeCompetitorRisk(holdings: Holding[]): Promise<PortfolioRisk[]> {
  const risks: PortfolioRisk[] = []
  const checkedPairs = new Set<string>()

  for (let i = 0; i < holdings.length; i++) {
    for (let j = i + 1; j < holdings.length; j++) {
      const h1 = holdings[i]
      const h2 = holdings[j]

      const pairKey = [h1.companyUri, h2.companyUri].sort().join('|')
      if (checkedPairs.has(pairKey)) continue
      checkedPairs.add(pairKey)

      // 경쟁 관계 확인
      const competesTriples = await queryTriples({
        subject: h1.companyUri,
        predicate: 'kss:competes_with',
        object: h2.companyUri,
      })

      if (competesTriples.length > 0) {
        risks.push({
          riskType: 'competitor',
          riskLevel: 'low',
          affectedHoldings: [h1.companyUri, h2.companyUri],
          description: `${h1.companyName}과(와) ${h2.companyName}은(는) 경쟁 관계입니다. 두 종목을 동시 보유 시 한쪽의 성장이 다른 쪽의 손실로 이어질 수 있습니다.`,
          recommendation: '경쟁 구도 모니터링 및 비중 조정 고려',
          ontologyEvidence: competesTriples,
        })
      }
    }
  }

  return risks
}

/**
 * 집중도 리스크 분석
 *
 * 특정 종목이나 산업에 과도하게 집중되어 있는지 확인
 */
async function analyzeConcentrationRisk(
  holdings: Holding[]
): Promise<PortfolioRisk | null> {
  if (holdings.length === 0) return null

  // 총 평가액 계산
  const totalValue = holdings.reduce((sum, h) => {
    const price = h.currentPrice || h.avgBuyPrice
    return sum + h.quantity * price
  }, 0)

  // 각 종목의 비중 계산
  const concentrations = holdings.map((h) => {
    const price = h.currentPrice || h.avgBuyPrice
    const value = h.quantity * price
    const weight = value / totalValue

    return {
      holding: h,
      weight,
      value,
    }
  })

  // 30% 이상 보유 종목 찾기
  const highConcentration = concentrations.filter((c) => c.weight >= 0.3)

  if (highConcentration.length > 0) {
    return {
      riskType: 'concentration',
      riskLevel: highConcentration[0].weight >= 0.5 ? 'high' : 'medium',
      affectedHoldings: highConcentration.map((c) => c.holding.companyUri),
      description: `${highConcentration.map((c) => `${c.holding.companyName} (${(c.weight * 100).toFixed(1)}%)`).join(', ')}에 집중되어 있습니다.`,
      recommendation: '포트폴리오 분산을 통한 리스크 감소 고려',
      ontologyEvidence: [],
    }
  }

  return null
}

/**
 * 보유 종목 관련 뉴스 기반 알림 생성
 */
export async function generatePortfolioAlerts(
  portfolioId: number
): Promise<void> {
  const holdings = await getPortfolioHoldings(portfolioId)

  for (const holding of holdings) {
    // 해당 기업과 관련된 Triple 조회
    const relations = await getCompanyRelations(holding.companyUri)

    // 최근 추가된 Triple (신뢰도 70% 이상, 최근 7일)
    const recentTriples = [...relations.outgoing, ...relations.incoming].filter(
      (t) => {
        if (!t.extractedDate) return false
        const extractedDate = new Date(t.extractedDate)
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return extractedDate >= weekAgo && t.confidence >= 0.7
      }
    )

    if (recentTriples.length > 0) {
      // 알림 생성 (여기서는 콘솔 로그, 실제로는 DB에 저장)
      console.log(
        `📢 [포트폴리오 알림] ${holding.companyName}: 새로운 관계 ${recentTriples.length}개 발견`
      )
    }
  }
}
