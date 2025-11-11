# KSS Ontology - 뉴스 온톨로지 분석 서비스

AI 기반 뉴스 분석을 통해 기업 간 관계와 영향도를 시각화하는 온톨로지 플랫폼

## 주요 기능

### Phase 1: 뉴스 온톨로지 분석 (현재)

- **뉴스 검색 및 수집**: 네이버 뉴스 API를 활용한 실시간 뉴스 검색
- **선택적 분석**: 체크박스로 원하는 뉴스만 선택하여 분석
- **AI 기반 온톨로지 추출**:
  - 기업명 자동 추출 (NER)
  - 감정 분석 (긍정/부정/중립)
  - 기업 간 관계 매핑 (공급사, 고객사, 경쟁사, 파트너)
  - 영향도 스코어링
- **시각화**:
  - 인터랙티브 관계 그래프 (ReactFlow)
  - 감정 색상 코딩 (초록=긍정, 빨강=부정, 회색=중립)
  - RDF 트리플 생성

### Phase 2: 개인화 투자 인사이트 (예정)

- 관심 기업 등록 (최대 10개)
- 일일 자동 모니터링
- 개인화된 영향 분석
- 투자 인사이트 대시보드

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Visualization**: ReactFlow (온톨로지 그래프)
- **AI/ML**: OpenAI GPT-4o-mini (온톨로지 분석)
- **External APIs**: 네이버 뉴스 검색 API
- **Database**: Supabase (PostgreSQL) - Phase 2에서 추가 예정

## 설치 방법

### 1. 저장소 클론

```bash
git clone <repository-url>
cd kss-ontology/web
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.local` 파일을 생성하고 다음 내용을 입력하세요:

```env
# Naver API Keys
# Get your keys at: https://developers.naver.com/
NAVER_CLIENT_ID=your_naver_client_id
NAVER_CLIENT_SECRET=your_naver_client_secret

# Next.js
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# OpenAI API for ontology analysis
# Get your key at: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key
```

### 4. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## API 키 발급 방법

### 네이버 API

1. [네이버 개발자 센터](https://developers.naver.com/) 접속
2. 애플리케이션 등록
3. 검색 API 선택
4. Client ID와 Client Secret 복사

### OpenAI API

1. [OpenAI Platform](https://platform.openai.com/) 접속
2. API Keys 섹션으로 이동
3. "Create new secret key" 클릭
4. API 키 복사 및 안전하게 보관

## 사용 방법

### 1. 뉴스 검색

1. 홈페이지에서 "뉴스 온톨로지 분석" 서비스 선택
2. 검색어 입력 (예: "삼성전자", "반도체 산업")
3. 검색 버튼 클릭

### 2. 뉴스 선택

- 전체 선택/해제 버튼으로 일괄 선택
- 개별 체크박스로 원하는 뉴스만 선택
- 선택된 뉴스 개수 확인

### 3. 온톨로지 분석

1. "선택한 뉴스 분석" 버튼 클릭
2. AI가 자동으로 분석 진행:
   - 기업명 추출
   - 감정 분석
   - 관계 매핑
   - 영향도 계산

### 4. 결과 확인

- **온톨로지 그래프**: 기업 간 관계를 시각적으로 확인
  - 노드: 기업 (색상=감정, 크기=중요도)
  - 엣지: 관계 유형 (공급, 고객, 경쟁, 파트너)
  - 범례: 감정 색상 가이드
- **기업 정보**: 감정 점수, 언급 횟수
- **관계 정보**: 관계 유형, 신뢰도
- **중요도 분석**: 각 기업의 영향도 점수
- **RDF 트리플**: 의미론적 관계 표현

## 프로젝트 구조

```
web/
├── app/
│   ├── api/
│   │   ├── news/search/       # 네이버 뉴스 검색 API
│   │   └── ontology/analyze/  # OpenAI 온톨로지 분석 API
│   ├── components/
│   │   └── OntologyGraph.tsx  # ReactFlow 그래프 컴포넌트
│   ├── services/
│   │   └── news-ontology/     # 뉴스 온톨로지 메인 페이지
│   ├── layout.tsx
│   └── page.tsx               # 홈페이지
├── .env.local                 # 환경 변수 (git에 포함되지 않음)
├── .env.example               # 환경 변수 예시
├── package.json
└── README.md
```

## 주요 컴포넌트

### API Endpoints

#### `/api/news/search`

네이버 뉴스를 검색합니다.

```typescript
POST /api/news/search
{
  "query": "검색어"
}
```

#### `/api/ontology/analyze`

뉴스 기사들을 분석하여 온톨로지를 생성합니다.

```typescript
POST /api/ontology/analyze
{
  "articles": [
    {
      "title": "제목",
      "description": "내용",
      "link": "URL",
      "pubDate": "날짜"
    }
  ]
}
```

## 로드맵

### ✅ Phase 1: 뉴스 온톨로지 분석 (완료)

- 뉴스 검색 및 수집
- 선택적 분석
- AI 기반 온톨로지 추출
- 시각화 (그래프, 범례)

### 🚧 Phase 2: 개인화 투자 인사이트 (진행 예정)

- Supabase 연동
- 사용자 인증
- 관심 기업 등록 (최대 10개)
- 일일 자동 분석
- 개인화 대시보드

### 📋 Phase 3: 고급 기능 (계획)

- 시계열 분석
- 예측 모델
- 알림 시스템
- 리포트 생성

## 라이센스

MIT License

## 기여

기여를 환영합니다! 이슈나 PR을 자유롭게 제출해주세요.

## 문의

프로젝트 관련 문의사항은 이슈 트래커를 이용해주세요.
