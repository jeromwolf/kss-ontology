# KSS Ontology

**실제 온톨로지 기술을 활용한 투자 인사이트 서비스**

"가짜는 절대 안돼" - 진짜 RDF Triple Store, SPARQL 쿼리, Reasoning Engine을 사용한 프로덕션 온톨로지 시스템

## 프로젝트 개요

KSS Ontology는 실시간 뉴스 데이터와 진짜 온톨로지 기술을 결합하여 개인화된 투자 인사이트를 제공하는 서비스입니다.

### 핵심 특징

- ✅ **실제 RDF Triple Store** - PostgreSQL 기반 진짜 온톨로지 데이터베이스
- ✅ **SPARQL-like 쿼리** - 패턴 매칭 기반 온톨로지 쿼리 엔진
- ✅ **Reasoning Engine** - RDFS/OWL 스타일 추론 규칙 (Transitive, Inverse, Property Chain, Symmetric)
- ✅ **자동 Triple 추출** - GPT-4o-mini를 사용한 실시간 뉴스 분석
- ✅ **신뢰도 스코어링** - 베이스라인 검증 및 보수적 신뢰도 평가
- ✅ **실시간 뉴스 연동** - 네이버 뉴스 API 통합

## 기술 스택

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Triple Store)
- **AI**: OpenAI GPT-4o-mini (Triple Extraction)
- **News API**: Naver News Search API

## 프로젝트 구조

```
kss-ontology/
├── web/                           # Next.js 애플리케이션
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # REST API 엔드포인트
│   │   │   ├── ontology/
│   │   │   │   ├── stats/        # 온톨로지 통계 API
│   │   │   │   └── query/        # SPARQL-like 쿼리 API
│   │   │   └── news/              # 뉴스 검색 API
│   │   └── chapters/              # 교육용 시뮬레이터 (Phase 1)
│   ├── lib/
│   │   ├── services/              # 핵심 온톨로지 서비스
│   │   │   ├── triple-extractor.ts   # Triple 추출 엔진
│   │   │   ├── ontology-query.ts     # SPARQL-like 쿼리
│   │   │   ├── impact-reasoner.ts    # Reasoning 엔진
│   │   │   └── insight-generator.ts  # 통합 인사이트 생성
│   │   ├── db/                    # 데이터베이스
│   │   │   └── schema-ontology.sql   # Triple Store 스키마
│   │   ├── ontology/              # 온톨로지 정의
│   │   │   └── company-ontology.ts   # 베이스라인 기업 데이터
│   │   ├── naver-news-client.ts  # 뉴스 API 클라이언트
│   │   └── rate-limiter.ts        # Rate limiting
│   └── scripts/                   # 유틸리티 스크립트
│       ├── seed-baseline-triples.ts   # 베이스라인 데이터 시딩
│       └── test-news-extraction.ts    # Triple 추출 테스트
├── docs/                          # 문서
└── claude.md                      # 개발 로그

```

## 설치 및 실행

### 1. 환경 설정

```bash
cd web
cp .env.example .env.local
```

`.env.local` 파일에 API 키 설정:

```
DATABASE_URL=postgresql://user@localhost:5432/kss_ontology
OPENAI_API_KEY=your-openai-api-key
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret
```

### 2. 데이터베이스 설정

```bash
# PostgreSQL 데이터베이스 생성
createdb kss_ontology

# 스키마 생성
psql -d kss_ontology -f lib/db/schema-ontology.sql

# 베이스라인 데이터 시딩
npx tsx scripts/seed-baseline-triples.ts
```

### 3. 개발 서버 실행

```bash
npm install
npm run dev
```

http://localhost:3000 에서 접속

### 4. Triple 추출 테스트

```bash
npx tsx scripts/test-news-extraction.ts
```

## 온톨로지 아키텍처

### Triple Store 구조

```
Subject (주체)     Predicate (관계)      Object (대상)
----------------  ------------------  ----------------
kss:Company_Samsung → kss:competes_with → kss:Company_SKHynix
kss:Company_Samsung → kss:supplies_to   → kss:Company_Apple
kss:Company_Samsung → kss:partners_with → kss:Company_SKHynix
```

### 신뢰도 시스템

- **Baseline (100%)**: 하드코딩된 검증된 관계
- **GPT Estimated (≤85%)**: 뉴스에서 추출된 새로운 관계
- **User Validated (Variable)**: 사용자 피드백 기반

### Reasoning Rules

1. **Transitive**: A→B, B→C ⇒ A influences C
2. **Inverse**: A supplies_to B ⇒ B depends_on A
3. **Property Chain**: A competes_with B, B supplies_to C ⇒ A may_influence C
4. **Symmetric**: A competes_with B ⇒ B competes_with A

## API 엔드포인트

### 온톨로지 통계
```
GET /api/ontology/stats
```

### SPARQL-like 쿼리
```
GET /api/ontology/query?subject=kss:Company_Samsung&minConfidence=0.7
```

### 뉴스 검색
```
GET /api/news/search?q=삼성전자&display=10
```

## 개발 단계

### Phase 1: 교육용 시뮬레이터 (완료 ✅)
- RDF Playground
- SPARQL Playground
- Reasoning Engine Simulator
- Triple Store Explorer

### Phase 2: 실제 온톨로지 인프라 (진행 중 🚀)
- ✅ PostgreSQL Triple Store
- ✅ Triple 추출 엔진 (추출 성공률 100%)
- ✅ SPARQL-like 쿼리 엔진
- ✅ Reasoning Engine
- ✅ 네이버 뉴스 API 연동
- ✅ 자동 Triple 추출 및 저장
- ✅ Knowledge Graph 시각화 (vis-network)
- ✅ 기업 온톨로지 정교화 (20개 기업 별칭)
- 🔄 대시보드 신뢰도 표시
- 📋 사용자 피드백 UI
- 📋 일일 배치 작업

### Phase 3: 프로덕션 서비스 (계획)
- 사용자 인증 및 개인화
- 실시간 알림
- 포트폴리오 연동
- 모바일 앱

## 테스트 결과

최근 테스트 (2025-01-12):

```
📰 뉴스 수집: 삼성전자 관련 5개 기사
🤖 Triple 추출: 5개 (100% 성공률) ✅
   - Samsung → competes_with → SKHynix (100% 신뢰도)
   - Samsung → influences → Apple (70% 신뢰도)
   - Samsung → influences → SKHynix (70% 신뢰도)
   - Samsung → influences → NVIDIA (70% 신뢰도)
💾 DB 저장: 4개 (새로운 관계)
📊 총 Triple: 56개 (평균 신뢰도 0.964)
📈 개선: 추출 성공률 40% → 100% (별칭 확장)
```

## 기여

개발 로그는 `claude.md`에서 확인할 수 있습니다.

## 라이선스

Private

---

**"가짜는 절대 안돼" - 진짜 온톨로지 기술로 만든 투자 인사이트 서비스** 🚀
