import { Check, Sparkles, Zap, Crown } from 'lucide-react'
import Link from 'next/link'

export default function PricingPage() {
  const plans = [
    {
      name: 'Free',
      icon: Sparkles,
      price: '₩0',
      period: '영구 무료',
      description: '온톨로지를 배우고 체험하세요',
      features: [
        '모든 교육 컨텐츠 (Chapter 1-10)',
        '뉴스 온톨로지 분석 (하루 10회)',
        '커뮤니티 액세스',
        '기본 그래프 시각화',
      ],
      cta: '무료로 시작',
      href: '/services/news-ontology',
      popular: false
    },
    {
      name: 'Pro',
      icon: Zap,
      price: '₩29,900',
      period: '월',
      description: '개인 투자자와 애널리스트를 위한',
      features: [
        'Free 플랜 모든 기능',
        '뉴스 온톨로지 무제한 분석',
        '실시간 알림',
        'SPARQL API 접근 (100 calls/day)',
        '증권 분석 기본',
        '고급 필터링 & 정렬',
        '이메일 리포트',
      ],
      cta: 'Pro 시작하기',
      href: '/services/news-ontology',
      popular: true
    },
    {
      name: 'Enterprise',
      icon: Crown,
      price: '₩990,000',
      period: '년',
      description: '기관과 기업을 위한',
      features: [
        'Pro 플랜 모든 기능',
        'SPARQL API 무제한',
        '커스텀 온톨로지 구축',
        '전담 기술 지원',
        '온사이트 교육',
        'SLA 보장',
        '우선 기능 요청',
        '데이터 수출 & 백업',
      ],
      cta: '문의하기',
      href: 'mailto:contact@kss.ai.kr',
      popular: false
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
      <div className="container mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            천억을 향한 여정을 함께하세요
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            세계 최초 온톨로지 플랫폼으로 시장을 선도하세요
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8
                ${plan.popular ? 'ring-4 ring-indigo-500 scale-105' : 'border border-gray-200 dark:border-gray-700'}
                transition-all hover:shadow-2xl`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    가장 인기
                  </span>
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  plan.popular ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-gray-100 dark:bg-gray-900'
                }`}>
                  <plan.icon className={`w-6 h-6 ${
                    plan.popular ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-600 dark:text-gray-400'
                  }`} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{plan.name}</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  <span className="text-gray-600 dark:text-gray-400">/ {plan.period}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block w-full py-3 px-6 rounded-xl font-semibold text-center transition-all
                  ${plan.popular
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:scale-105'
                    : 'bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800'
                  }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* ROI Calculator */}
        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">ROI 계산기</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">10,000명</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pro 유료 사용자</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">₩299M/월</div>
            </div>
            <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
              <div className="text-3xl font-bold text-blue-600 mb-2">100개</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Enterprise 고객</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">₩99M/월</div>
            </div>
            <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
              <div className="text-3xl font-bold text-purple-600 mb-2">₩4.7B</div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">연 매출</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">5% 전환율</div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            * 보수적 추정: 20만 무료 사용자 기준
          </p>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-900 dark:text-white">
            자주 묻는 질문
          </h2>
          <div className="space-y-4">
            {[
              {
                q: '온톨로지가 무엇인가요?',
                a: '온톨로지는 지식을 구조화하여 표현하는 방법입니다. 우리 플랫폼은 뉴스와 기업 관계를 온톨로지로 표현하여 자동으로 영향도를 추론합니다.'
              },
              {
                q: '무료 플랜으로 충분한가요?',
                a: '학습과 기본 체험은 무료 플랜으로 충분합니다. 하지만 실전 투자나 업무에 활용하려면 Pro 플랜을 추천합니다.'
              },
              {
                q: 'SPARQL API는 어떻게 사용하나요?',
                a: 'Pro 이상 플랜에서 REST API로 SPARQL 쿼리를 전송할 수 있습니다. 문서는 대시보드에서 확인하세요.'
              },
              {
                q: 'Enterprise 플랜의 커스텀 온톨로지는?',
                a: '귀사의 도메인에 맞는 온톨로지를 함께 설계하고 구축합니다. 제조, 의료, 금융 등 모든 산업에 적용 가능합니다.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <summary className="font-semibold text-gray-900 dark:text-white cursor-pointer">
                  {faq.q}
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
