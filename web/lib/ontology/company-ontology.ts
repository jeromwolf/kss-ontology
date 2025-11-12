/**
 * 기업 온톨로지 스키마
 *
 * 기업 간 관계, 산업 분류, 영향 관계를 온톨로지로 정의
 */

export interface CompanyEntity {
  uri: string // 예: kss:Company_Samsung
  name: string
  aliases?: string[] // 다른 이름들 (한글, 영문 등)
  industry: Industry[]
  competitors: string[] // 경쟁사 URIs
  suppliers: string[] // 공급사 URIs
  customers: string[] // 고객사 URIs
  subsidiaries: string[] // 자회사 URIs
  parentCompany?: string // 모회사 URI
}

export interface Industry {
  uri: string // 예: kss:Industry_Semiconductor
  name: string
  relatedIndustries: string[]
}

export interface CompanyRelation {
  subject: string // 주체 기업 URI
  predicate: RelationType
  object: string // 대상 기업 URI
  strength: number // 관계 강도 0-1
  description: string
  confidence?: number // 신뢰도 0-1 (온톨로지 DB에서 추출된 경우)
  validatedBy?: 'baseline' | 'gpt' | 'user' // 검증 출처
}

export type RelationType =
  | 'competes_with' // 경쟁 관계
  | 'supplies_to' // 공급 관계
  | 'partners_with' // 협력 관계
  | 'acquires' // 인수 관계
  | 'subsidiary_of' // 자회사 관계
  | 'influences' // 영향 관계

/**
 * 한국 주요 기업 온톨로지 데이터
 */
export const KOREAN_COMPANIES: CompanyEntity[] = [
  {
    uri: 'kss:Company_Samsung',
    name: '삼성전자',
    aliases: ['삼성', 'Samsung', 'Samsung Electronics', 'SAMSUNG', '삼성전자주식회사', '삼성전자㈜', 'SEC'],
    industry: [
      { uri: 'kss:Industry_Semiconductor', name: '반도체', relatedIndustries: ['kss:Industry_Electronics'] },
      { uri: 'kss:Industry_Electronics', name: '전자제품', relatedIndustries: ['kss:Industry_Semiconductor'] }
    ],
    competitors: ['kss:Company_SKHynix', 'kss:Company_LG'],
    suppliers: [],
    customers: ['kss:Company_Apple', 'kss:Company_Google'],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_SKHynix',
    name: 'SK하이닉스',
    aliases: ['하이닉스', 'SKHynix', 'SK Hynix', 'SK하닉', 'Hynix', 'HYNIX', 'SK하이닉스㈜'],
    industry: [
      { uri: 'kss:Industry_Semiconductor', name: '반도체', relatedIndustries: ['kss:Industry_Memory'] }
    ],
    competitors: ['kss:Company_Samsung'],
    suppliers: [],
    customers: ['kss:Company_Apple', 'kss:Company_Dell'],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_Hyundai',
    name: '현대자동차',
    aliases: ['현대차', '현대', 'Hyundai', 'Hyundai Motor', 'HYUNDAI', '현대자동차㈜', 'HMC'],
    industry: [
      { uri: 'kss:Industry_Automotive', name: '자동차', relatedIndustries: ['kss:Industry_EV'] }
    ],
    competitors: ['kss:Company_Kia', 'kss:Company_Tesla'],
    suppliers: ['kss:Company_LGChem'],
    customers: [],
    subsidiaries: ['kss:Company_Kia']
  },
  {
    uri: 'kss:Company_LGChem',
    name: 'LG화학',
    aliases: ['LG Chem', 'LGChem', 'LGCHEM', '엘지화학', 'LG화학㈜', 'LG'],
    industry: [
      { uri: 'kss:Industry_Battery', name: '배터리', relatedIndustries: ['kss:Industry_EV'] }
    ],
    competitors: ['kss:Company_Samsung_SDI'],
    suppliers: [],
    customers: ['kss:Company_Hyundai', 'kss:Company_Tesla', 'kss:Company_GM'],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_NAVER',
    name: '네이버',
    aliases: ['NAVER', 'Naver', 'naver', '네이버㈜', 'NAVER Corp'],
    industry: [
      { uri: 'kss:Industry_Internet', name: '인터넷', relatedIndustries: ['kss:Industry_AI'] }
    ],
    competitors: ['kss:Company_Kakao', 'kss:Company_Google'],
    suppliers: [],
    customers: [],
    subsidiaries: ['kss:Company_Line']
  },
  {
    uri: 'kss:Company_Kakao',
    name: '카카오',
    aliases: ['Kakao', 'KAKAO', 'kakao', '카카오㈜', 'Kakao Corp', '다음카카오'],
    industry: [
      { uri: 'kss:Industry_Internet', name: '인터넷', relatedIndustries: ['kss:Industry_Fintech'] }
    ],
    competitors: ['kss:Company_NAVER'],
    suppliers: [],
    customers: [],
    subsidiaries: ['kss:Company_Kakao_Bank', 'kss:Company_Kakao_Pay']
  },
  {
    uri: 'kss:Company_Celltrion',
    name: '셀트리온',
    aliases: ['Celltrion', 'CELLTRION', 'celltrion', '셀트리온㈜', '셀트리온그룹'],
    industry: [
      { uri: 'kss:Industry_Bio', name: '바이오', relatedIndustries: ['kss:Industry_Pharma'] }
    ],
    competitors: ['kss:Company_Samsung_Biologics'],
    suppliers: [],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_POSCO',
    name: 'POSCO',
    aliases: ['포스코', 'Posco', 'posco', 'POSCO㈜', '포항제철'],
    industry: [
      { uri: 'kss:Industry_Steel', name: '철강', relatedIndustries: ['kss:Industry_Manufacturing'] }
    ],
    competitors: [],
    suppliers: [],
    customers: ['kss:Company_Hyundai', 'kss:Company_Samsung'],
    subsidiaries: []
  },
  // Global Companies
  {
    uri: 'kss:Company_Tesla',
    name: 'Tesla',
    aliases: ['테슬라', 'TESLA', 'tesla'],
    industry: [
      { uri: 'kss:Industry_EV', name: '전기차', relatedIndustries: ['kss:Industry_Automotive', 'kss:Industry_Battery'] }
    ],
    competitors: ['kss:Company_Hyundai', 'kss:Company_BYD', 'kss:Company_GM'],
    suppliers: ['kss:Company_LGChem', 'kss:Company_Panasonic'],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_Apple',
    name: 'Apple',
    aliases: ['애플', 'APPLE', 'apple', 'Apple Inc', '애플사'],
    industry: [
      { uri: 'kss:Industry_Electronics', name: '전자제품', relatedIndustries: ['kss:Industry_Semiconductor'] }
    ],
    competitors: ['kss:Company_Samsung', 'kss:Company_Google'],
    suppliers: ['kss:Company_Samsung', 'kss:Company_SKHynix', 'kss:Company_TSMC'],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_Google',
    name: 'Google',
    aliases: ['구글', 'GOOGLE', 'google', 'Alphabet', '알파벳', 'Google Inc'],
    industry: [
      { uri: 'kss:Industry_Internet', name: '인터넷', relatedIndustries: ['kss:Industry_AI'] }
    ],
    competitors: ['kss:Company_Apple', 'kss:Company_Microsoft', 'kss:Company_NAVER'],
    suppliers: ['kss:Company_Samsung'],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_Microsoft',
    name: 'Microsoft',
    aliases: ['마이크로소프트', 'MICROSOFT', 'microsoft', 'MS', 'Microsoft Corp'],
    industry: [
      { uri: 'kss:Industry_Software', name: '소프트웨어', relatedIndustries: ['kss:Industry_AI', 'kss:Industry_Cloud'] }
    ],
    competitors: ['kss:Company_Google', 'kss:Company_Amazon'],
    suppliers: [],
    customers: [],
    subsidiaries: ['kss:Company_OpenAI']
  },
  {
    uri: 'kss:Company_Amazon',
    name: 'Amazon',
    aliases: ['아마존', 'AMAZON', 'amazon', 'Amazon.com', 'AWS'],
    industry: [
      { uri: 'kss:Industry_Ecommerce', name: '이커머스', relatedIndustries: ['kss:Industry_Cloud', 'kss:Industry_AI'] }
    ],
    competitors: ['kss:Company_Microsoft', 'kss:Company_Google'],
    suppliers: [],
    customers: [],
    subsidiaries: ['kss:Company_AWS']
  },
  {
    uri: 'kss:Company_NVIDIA',
    name: 'NVIDIA',
    aliases: ['엔비디아', 'Nvidia', 'nvidia', 'NVDA'],
    industry: [
      { uri: 'kss:Industry_Semiconductor', name: '반도체', relatedIndustries: ['kss:Industry_AI'] }
    ],
    competitors: ['kss:Company_AMD', 'kss:Company_Intel'],
    suppliers: ['kss:Company_TSMC'],
    customers: ['kss:Company_Microsoft', 'kss:Company_Google', 'kss:Company_Amazon', 'kss:Company_Tesla'],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_TSMC',
    name: 'TSMC',
    aliases: ['대만반도체', 'Taiwan Semiconductor', 'TSM', 'TSMC㈜'],
    industry: [
      { uri: 'kss:Industry_Semiconductor', name: '반도체', relatedIndustries: ['kss:Industry_Manufacturing'] }
    ],
    competitors: ['kss:Company_Samsung', 'kss:Company_Intel'],
    suppliers: [],
    customers: ['kss:Company_Apple', 'kss:Company_NVIDIA', 'kss:Company_AMD'],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_Intel',
    name: 'Intel',
    aliases: ['인텔', 'INTEL', 'intel', 'Intel Corporation', '인텔사'],
    industry: [
      { uri: 'kss:Industry_Semiconductor', name: '반도체', relatedIndustries: ['kss:Industry_AI'] }
    ],
    competitors: ['kss:Company_AMD', 'kss:Company_NVIDIA', 'kss:Company_TSMC'],
    suppliers: [],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_AMD',
    name: 'AMD',
    aliases: ['Advanced Micro Devices', 'amd'],
    industry: [
      { uri: 'kss:Industry_Semiconductor', name: '반도체', relatedIndustries: ['kss:Industry_AI'] }
    ],
    competitors: ['kss:Company_NVIDIA', 'kss:Company_Intel'],
    suppliers: ['kss:Company_TSMC'],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_BYD',
    name: 'BYD',
    aliases: ['비야디', 'BYD Auto', 'Build Your Dreams'],
    industry: [
      { uri: 'kss:Industry_EV', name: '전기차', relatedIndustries: ['kss:Industry_Battery'] }
    ],
    competitors: ['kss:Company_Tesla', 'kss:Company_Hyundai'],
    suppliers: [],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_Panasonic',
    name: 'Panasonic',
    aliases: ['파나소닉', 'PANASONIC', 'panasonic'],
    industry: [
      { uri: 'kss:Industry_Battery', name: '배터리', relatedIndustries: ['kss:Industry_Electronics'] }
    ],
    competitors: ['kss:Company_LGChem', 'kss:Company_Samsung_SDI'],
    suppliers: [],
    customers: ['kss:Company_Tesla'],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_GM',
    name: 'GM',
    aliases: ['General Motors', 'GM', '제너럴모터스', 'GMC', '지엠'],
    industry: [
      { uri: 'kss:Industry_Automotive', name: '자동차', relatedIndustries: ['kss:Industry_EV'] }
    ],
    competitors: ['kss:Company_Tesla', 'kss:Company_Hyundai'],
    suppliers: ['kss:Company_LGChem'],
    customers: [],
    subsidiaries: []
  },
  {
    uri: 'kss:Company_Dell',
    name: 'Dell',
    aliases: ['DELL', 'dell', '델', 'Dell Inc', 'Dell Technologies'],
    industry: [
      { uri: 'kss:Industry_Electronics', name: '전자제품', relatedIndustries: ['kss:Industry_Semiconductor'] }
    ],
    competitors: ['kss:Company_HP'],
    suppliers: ['kss:Company_SKHynix', 'kss:Company_Intel'],
    customers: [],
    subsidiaries: []
  }
]

/**
 * 기업명으로 온톨로지 엔티티 찾기
 */
export function findCompanyEntity(companyName: string): CompanyEntity | undefined {
  return KOREAN_COMPANIES.find((c) => {
    // 정확한 이름 매칭
    if (c.name === companyName) return true

    // 별칭 매칭
    if (c.aliases && c.aliases.some(alias =>
      alias.toLowerCase() === companyName.toLowerCase() ||
      companyName.toLowerCase().includes(alias.toLowerCase()) ||
      alias.toLowerCase().includes(companyName.toLowerCase())
    )) return true

    // 부분 매칭
    if (c.name.includes(companyName) || companyName.includes(c.name)) return true

    return false
  })
}

/**
 * 기업 간 관계 추출
 */
export function extractCompanyRelations(companyName: string): CompanyRelation[] {
  const company = findCompanyEntity(companyName)
  if (!company) return []

  const relations: CompanyRelation[] = []

  // 경쟁 관계
  company.competitors.forEach((competitorUri) => {
    const competitor = KOREAN_COMPANIES.find((c) => c.uri === competitorUri)
    if (competitor) {
      relations.push({
        subject: company.uri,
        predicate: 'competes_with',
        object: competitorUri,
        strength: 0.8,
        description: `${company.name}는 ${competitor.name}와 경쟁 관계에 있습니다.`
      })
    }
  })

  // 공급 관계
  company.customers.forEach((customerUri) => {
    const customer = KOREAN_COMPANIES.find((c) => c.uri === customerUri)
    if (customer) {
      relations.push({
        subject: company.uri,
        predicate: 'supplies_to',
        object: customerUri,
        strength: 0.9,
        description: `${company.name}는 ${customer.name}에 공급합니다.`
      })
    }
  })

  // 자회사 관계
  company.subsidiaries.forEach((subUri) => {
    const subsidiary = KOREAN_COMPANIES.find((c) => c.uri === subUri)
    if (subsidiary) {
      relations.push({
        subject: subUri,
        predicate: 'subsidiary_of',
        object: company.uri,
        strength: 1.0,
        description: `${subsidiary.name}는 ${company.name}의 자회사입니다.`
      })
    }
  })

  return relations
}

/**
 * 산업 영향도 분석
 */
export function analyzeIndustryImpact(companyName: string): {
  industry: string
  relatedCompanies: Array<{ name: string; relationship: string; impactLevel: number }>
} | null {
  const company = findCompanyEntity(companyName)
  if (!company || company.industry.length === 0) return null

  const primaryIndustry = company.industry[0]
  const relatedCompanies: Array<{ name: string; relationship: string; impactLevel: number }> = []

  // 같은 산업의 다른 기업들
  KOREAN_COMPANIES.forEach((other) => {
    if (other.uri === company.uri) return

    const hasSharedIndustry = other.industry.some((ind) =>
      primaryIndustry.relatedIndustries.includes(ind.uri) || ind.uri === primaryIndustry.uri
    )

    if (hasSharedIndustry) {
      // 경쟁사면 높은 영향도
      const isCompetitor = company.competitors.includes(other.uri)
      // 공급/고객 관계면 중간 영향도
      const isSupplyChain = company.customers.includes(other.uri) || company.suppliers.includes(other.uri)

      if (isCompetitor) {
        relatedCompanies.push({
          name: other.name,
          relationship: '경쟁사',
          impactLevel: 0.9
        })
      } else if (isSupplyChain) {
        relatedCompanies.push({
          name: other.name,
          relationship: '공급망',
          impactLevel: 0.7
        })
      } else {
        relatedCompanies.push({
          name: other.name,
          relationship: '동일 산업',
          impactLevel: 0.5
        })
      }
    }
  })

  return {
    industry: primaryIndustry.name,
    relatedCompanies: relatedCompanies.sort((a, b) => b.impactLevel - a.impactLevel)
  }
}
