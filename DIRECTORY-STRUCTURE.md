# KSS Ontology - 디렉토리 구조

**작성일:** 2025-11-09
**목적:** 프로젝트 전체 파일 및 폴더 구조 문서화

---

## 📋 목차

1. [프로젝트 개요](#프로젝트-개요)
2. [루트 디렉토리](#루트-디렉토리)
3. [content/ - 교육 콘텐츠](#content---교육-콘텐츠)
4. [web/ - Next.js 웹 애플리케이션](#web---nextjs-웹-애플리케이션)
5. [docs/ - 프로젝트 문서](#docs---프로젝트-문서)
6. [파일 명명 규칙](#파일-명명-규칙)

---

## 프로젝트 개요

### 저장소 정보

- **GitHub URL:** https://github.com/jeromwolf/kss-ontology
- **프로젝트 타입:** Monorepo (교육 콘텐츠 + Next.js 웹 앱)
- **메인 언어:** Korean (한국어)
- **기술 스택:** Next.js 14, TypeScript, Tailwind CSS, MDX

### 전체 통계

| 항목 | 수량 | 위치 |
|------|------|------|
| 챕터 (완성) | 10개 | `content/chapters/` |
| 총 단어 수 | 61,200 | - |
| 시뮬레이터 | 4개 | `web/app/simulators/` |
| 코드 예제 | 150+ | 챕터 내 포함 |
| 문서 파일 | 10+ | 루트 + `docs/` |

---

## 루트 디렉토리

```
kss-ontology/
├── .git/                          # Git 저장소
├── .claude/                       # Claude Code 설정
│   └── settings.local.json
├── .gitignore                     # Git 무시 파일 목록
│
├── content/                       # 📚 교육 콘텐츠 (10개 챕터)
│   └── chapters/
│
├── web/                           # 🌐 Next.js 웹 애플리케이션
│   ├── app/
│   ├── components/
│   ├── config/
│   └── ...
│
├── docs/                          # 📖 프로젝트 문서
│   ├── README.md
│   ├── VISION.md
│   └── ROADMAP.md
│
├── CONFIG-FILES.md                # 설정 파일 가이드
├── DIRECTORY-STRUCTURE.md         # 📍 이 문서
├── FIRST-COMPONENTS.md            # 초기 컴포넌트 가이드
├── PRD.md                         # 제품 요구사항 문서
├── SETUP-GUIDE.md                 # 프로젝트 설정 가이드
├── SIMULATORS-INFO.md             # 시뮬레이터 소스 정보
├── TASKS.md                       # 작업 관리 (41개 서브태스크)
└── WEBSITE-PLANNING-COMPLETE.md   # 웹사이트 기획 완료 문서
```

### 루트 레벨 파일 설명

| 파일명 | 크기 | 목적 | 상태 |
|--------|------|------|------|
| `.gitignore` | 353B | Git 무시 설정 | ✅ 완성 |
| `PRD.md` | 31KB | 제품 요구사항 정의 | ✅ 완성 (Kelly 승인) |
| `TASKS.md` | 14KB | 작업 관리 (6 Phase, 41 subtasks) | 🔄 진행 중 (19%) |
| `SIMULATORS-INFO.md` | 10KB | 기존 시뮬레이터 소스 참조 | ✅ 완성 |
| `CONFIG-FILES.md` | 25KB | 11개 설정 파일 전체 코드 | ✅ 완성 |
| `FIRST-COMPONENTS.md` | 23KB | 6개 초기 컴포넌트 코드 | ✅ 완성 |
| `SETUP-GUIDE.md` | 10KB | Next.js 프로젝트 설정 가이드 | ✅ 완성 |
| `WEBSITE-PLANNING-COMPLETE.md` | 33KB | 웹사이트 전체 기획 | ✅ 완성 |

---

## content/ - 교육 콘텐츠

### 디렉토리 구조

```
content/
└── chapters/                      # 10개 챕터 (Markdown)
    ├── Chapter-01-v3.0-FINAL.md       # 12.8 KB - 온톨로지 기초
    ├── Chapter-02-v3_0-FINAL.md       # 26.5 KB - RDF
    ├── Chapter-03-v3_0-FINAL.md       # 32.7 KB - RDFS & OWL
    ├── Chapter-04-v3_0-FINAL.md       # 27.8 KB - SPARQL
    ├── Chapter-05-v3_0-FINAL.md       # 32.7 KB - 추론 엔진
    ├── Chapter-06-v3_0-FINAL.md       # 29.0 KB - 의료 온톨로지
    ├── Chapter-07-v3_0-FINAL (1).md   # 29.3 KB - 금융 온톨로지
    ├── Chapter-08-v3_0-FINAL.md       # 35.4 KB - 제조 온톨로지
    ├── Chapter-09-v3_0-FINAL.md       # 38.9 KB - AI & 온톨로지
    └── Chapter-10-v3_0-FINAL.md       # 19.6 KB - 미래 트렌드
```

### 챕터별 상세 정보

| 챕터 | 현재 파일명 | 계획된 slug | 용도 | 크기 | 시뮬레이터 |
|------|------------|------------|------|------|----------|
| 1 | `Chapter-01-v3.0-FINAL.md` | `01-ontology-basics.mdx` | 온톨로지 기초 개념 | 12.8KB | - |
| 2 | `Chapter-02-v3_0-FINAL.md` | `02-rdf.mdx` | RDF 기초 | 26.5KB | RDF Playground |
| 3 | `Chapter-03-v3_0-FINAL.md` | `03-rdfs-owl.mdx` | RDFS & OWL | 32.7KB | RDF Playground |
| 4 | `Chapter-04-v3_0-FINAL.md` | `04-sparql.mdx` | SPARQL 쿼리 | 27.8KB | SPARQL Playground |
| 5 | `Chapter-05-v3_0-FINAL.md` | `05-reasoning.mdx` | 추론 엔진 | 32.7KB | Reasoning Engine |
| 6 | `Chapter-06-v3_0-FINAL.md` | `06-medical.mdx` | 의료 온톨로지 | 29.0KB | 3D Knowledge Graph |
| 7 | `Chapter-07-v3_0-FINAL (1).md` | `07-finance.mdx` | 금융 온톨로지 | 29.3KB | 3D Knowledge Graph |
| 8 | `Chapter-08-v3_0-FINAL.md` | `08-manufacturing.mdx` | 제조 온톨로지 | 35.4KB | 3D Knowledge Graph |
| 9 | `Chapter-09-v3_0-FINAL.md` | `09-ai-ontology.mdx` | AI & 온톨로지 | 38.9KB | 3D Knowledge Graph |
| 10 | `Chapter-10-v3_0-FINAL.md` | `10-future-trends.mdx` | 미래 트렌드 | 19.6KB | - |

### 콘텐츠 이전 계획

**현재 위치:**
```
/content/chapters/Chapter-XX-vX_X-FINAL.md
```

**목표 위치:**
```
/web/content/chapters/XX-slug-name.mdx
```

**작업 예시:**
```bash
# Chapter 1
content/chapters/Chapter-01-v3.0-FINAL.md
  → web/content/chapters/01-ontology-basics.mdx

# Chapter 2
content/chapters/Chapter-02-v3_0-FINAL.md
  → web/content/chapters/02-rdf.mdx
```

**변환 작업:**
- [ ] Markdown → MDX 변환
- [ ] 메타데이터 추가 (제목, 설명, 태그, 시뮬레이터 링크)
- [ ] 코드 블록 문법 하이라이팅 개선
- [ ] 이미지 경로 업데이트
- [ ] 내부 링크 수정

---

## web/ - Next.js 웹 애플리케이션

### 전체 구조

```
web/
├── .next/                         # Next.js 빌드 출력 (gitignore)
├── node_modules/                  # 의존성 패키지 (gitignore)
│
├── app/                           # Next.js App Router
│   ├── layout.tsx                 # 루트 레이아웃
│   ├── page.tsx                   # 홈페이지
│   ├── globals.css                # 전역 스타일
│   ├── about/                     # About 페이지
│   ├── chapters/                  # 챕터 페이지
│   ├── projects/                  # 프로젝트 갤러리
│   ├── roadmap/                   # 로드맵 페이지
│   └── simulators/                # 시뮬레이터 페이지 ⭐
│       ├── rdf-editor/
│       ├── sparql-playground/
│       ├── reasoning-engine/
│       └── knowledge-graph/
│
├── components/                    # React 컴포넌트
│   ├── ui/                        # shadcn/ui 컴포넌트
│   ├── layout/                    # Header, Footer, Nav
│   ├── home/                      # 홈페이지 컴포넌트
│   ├── chapter/                   # 챕터 전용 컴포넌트
│   ├── shared/                    # 공용 컴포넌트
│   └── providers/                 # Context Providers
│
├── config/                        # 설정 파일
│   └── site.ts                    # 사이트 설정
│
├── content/                       # MDX 콘텐츠 (목표)
│   ├── chapters/                  # 10개 챕터 (MDX)
│   └── docs/                      # 추가 문서
│
├── lib/                           # 유틸리티 라이브러리
│   └── utils.ts                   # cn() 등
│
├── public/                        # 정적 파일
│   ├── images/
│   └── icons/
│
├── styles/                        # 추가 스타일
│
├── types/                         # TypeScript 타입 정의
│
├── next.config.js                 # Next.js 설정
├── tailwind.config.ts             # Tailwind CSS 설정
├── tsconfig.json                  # TypeScript 설정
├── postcss.config.mjs             # PostCSS 설정
├── package.json                   # 의존성 관리
└── package-lock.json              # 의존성 잠금
```

---

### app/ - 페이지 라우팅

```
app/
├── layout.tsx                     # 루트 레이아웃 (Inter 폰트, 공통 구조)
├── page.tsx                       # 홈페이지 (Hero, Stats, Features)
├── globals.css                    # CSS 변수, Tailwind 설정
│
├── about/                         # /about
│   └── page.tsx
│
├── chapters/                      # /chapters
│   ├── page.tsx                   # 챕터 목록
│   └── [slug]/                    # /chapters/01-ontology-basics
│       └── page.tsx               # 챕터 상세
│
├── projects/                      # /projects
│   └── page.tsx                   # 프로젝트 갤러리
│
├── roadmap/                       # /roadmap
│   └── page.tsx                   # 로드맵
│
└── simulators/                    # /simulators
    ├── page.tsx                   # 시뮬레이터 허브
    │
    ├── rdf-editor/                # /simulators/rdf-editor
    │   └── page.tsx               # RDF Playground (Ch2-3)
    │
    ├── sparql-playground/         # /simulators/sparql-playground
    │   └── page.tsx               # SPARQL Playground (Ch4)
    │
    ├── reasoning-engine/          # /simulators/reasoning-engine
    │   └── page.tsx               # Inference Engine (Ch5)
    │
    └── knowledge-graph/           # /simulators/knowledge-graph
        └── page.tsx               # 3D Knowledge Graph (Ch6-9)
```

**라우팅 예시:**

| URL | 파일 경로 | 설명 |
|-----|----------|------|
| `/` | `app/page.tsx` | 홈페이지 |
| `/chapters` | `app/chapters/page.tsx` | 챕터 목록 |
| `/chapters/01-ontology-basics` | `app/chapters/[slug]/page.tsx` | 챕터 1 |
| `/chapters/02-rdf` | `app/chapters/[slug]/page.tsx` | 챕터 2 |
| `/simulators` | `app/simulators/page.tsx` | 시뮬레이터 허브 |
| `/simulators/rdf-editor` | `app/simulators/rdf-editor/page.tsx` | RDF Playground |
| `/simulators/sparql-playground` | `app/simulators/sparql-playground/page.tsx` | SPARQL Playground |

---

### components/ - React 컴포넌트

```
components/
│
├── ui/                            # shadcn/ui 컴포넌트 (자동 생성)
│   ├── button.tsx
│   ├── card.tsx
│   ├── badge.tsx
│   ├── dropdown-menu.tsx
│   ├── separator.tsx
│   └── dialog.tsx
│
├── layout/                        # 레이아웃 컴포넌트
│   ├── Header.tsx                 # 헤더 (로고, 네비게이션)
│   ├── Footer.tsx                 # 푸터 (링크, 저작권)
│   ├── Navigation.tsx             # 메인 네비게이션
│   ├── Sidebar.tsx                # 사이드바 (챕터 목차)
│   └── ThemeToggle.tsx            # 다크모드 토글
│
├── home/                          # 홈페이지 전용
│   ├── Hero.tsx                   # 히어로 섹션
│   ├── Stats.tsx                  # 통계 섹션
│   ├── Features.tsx               # 주요 기능
│   └── CTA.tsx                    # Call-to-Action
│
├── chapter/                       # 챕터 전용
│   ├── ChapterHeader.tsx          # 챕터 헤더
│   ├── ChapterNav.tsx             # 이전/다음 챕터
│   ├── TableOfContents.tsx        # 목차 (자동 생성)
│   ├── CodeBlock.tsx              # 코드 블록 (문법 하이라이팅)
│   └── SimulatorEmbed.tsx         # 시뮬레이터 임베드
│
├── shared/                        # 공용 컴포넌트
│   ├── Logo.tsx                   # KSS Ontology 로고
│   ├── Loading.tsx                # 로딩 스피너
│   └── ErrorBoundary.tsx          # 에러 경계
│
└── providers/                     # Context Providers
    └── ThemeProvider.tsx          # next-themes Provider
```

**컴포넌트 통합 계획:**

| 컴포넌트 카테고리 | 우선순위 | Phase | 상태 |
|----------------|---------|-------|------|
| `ui/` (shadcn) | 높음 | Phase 2.1 | ⏳ Pending |
| `layout/` | 높음 | Phase 2 | ⏳ Pending |
| `providers/` | 높음 | Phase 2.2 | ⏳ Pending |
| `home/` | 중간 | Phase 2.6 | ⏳ Pending |
| `chapter/` | 중간 | Phase 3 | ⏳ Pending |
| `shared/` | 낮음 | Phase 2-3 | ⏳ Pending |

---

### 시뮬레이터 컴포넌트 (Phase 5)

**Phase 5 이후 추가될 구조:**

```
components/
└── simulators/                    # 시뮬레이터 전용 컴포넌트
    │
    ├── rdf-editor/                # RDF Playground
    │   ├── RDFEditor.tsx          # 메인 에디터
    │   ├── TripleInput.tsx        # S-P-O 입력
    │   ├── TripleList.tsx         # 트리플 목록
    │   └── FormatConverter.tsx    # Turtle/JSON-LD/RDF-XML 변환
    │
    ├── sparql/                    # SPARQL Playground
    │   ├── SPARQLEditor.tsx       # Monaco Editor
    │   ├── QueryExamples.tsx      # 20+ 예제 쿼리
    │   ├── ResultsTable.tsx       # 결과 테이블
    │   └── QueryValidator.tsx     # 문법 검증
    │
    ├── inference/                 # Inference Engine (추론 엔진)
    │   ├── InferenceEngine.tsx    # 메인 엔진 (319줄)
    │   ├── RuleSelector.tsx       # 규칙 선택 (대칭/전이/타입/역관계)
    │   ├── TripleInput.tsx        # 트리플 입력
    │   └── ResultsViewer.tsx      # 추론 결과 시각화
    │
    └── knowledge-graph/           # 3D Knowledge Graph
        ├── Graph3D.tsx            # Three.js 3D 렌더링
        ├── Graph2D.tsx            # D3.js 2D 대안
        ├── Controls.tsx           # 줌/패닝/회전 컨트롤
        ├── NodeDetails.tsx        # 노드 상세 정보
        └── SPARQLPanel.tsx        # 쿼리 패널
```

**시뮬레이터별 소스 코드:**

| 시뮬레이터 | 컴포넌트 수 | 총 코드 줄 수 | 주요 의존성 | Phase 5 서브태스크 |
|-----------|-----------|------------|-----------|----------------|
| RDF Playground | 4개 | ~600줄 | `n3`, `jsonld` | 5.2 (2-3시간) |
| SPARQL Playground | 4개 | ~800줄 | `@monaco-editor/react` | 5.3 (2-3시간) |
| Inference Engine | 4개 | 319줄 | (기존 패키지) | 5.4 (1-2시간) |
| 3D Knowledge Graph | 5개 | ~1,500줄 | `three`, `@react-three/fiber`, `d3` | 5.5 (4-5시간) |

**GitHub 소스 위치:**

1. **Inference Engine:**
   - https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/components/rdf-editor/components/InferenceEngine.tsx

2. **3D Knowledge Graph:**
   - https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/knowledge-graph

3. **SPARQL Playground:**
   - https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/app/sparql-playground/page.tsx

4. **RDF Editor:**
   - https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/rdf-editor

---

### config/ - 설정 파일

```
config/
└── site.ts                        # 사이트 전역 설정
```

**site.ts 내용:**

```typescript
export const siteConfig = {
  name: "KSS Ontology",
  description: "세계에서 가장 깊이 있는 온톨로지 교육 플랫폼",
  url: "https://kss-ontology.vercel.app",
  ogImage: "https://kss-ontology.vercel.app/og.jpg",
  stats: {
    chapters: 10,
    words: 61200,
    simulators: 4,
    codeExamples: 150
  },
  links: {
    github: "https://github.com/jeromwolf/kss-ontology"
  }
};
```

---

### lib/ - 유틸리티 라이브러리

```
lib/
└── utils.ts                       # 유틸리티 함수
```

**Phase 5 이후 추가될 파일:**

```
lib/
├── utils.ts                       # cn() 함수
│
└── simulators/                    # 시뮬레이터 로직
    ├── rdf-parser.ts              # RDF 파싱 (N3.js)
    ├── sparql-engine.ts           # SPARQL 쿼리 실행
    ├── inference-rules.ts         # 추론 규칙 엔진
    └── graph-utils.ts             # 그래프 유틸리티
```

---

### content/ - MDX 콘텐츠 (목표 위치)

**현재 상태:** 빈 폴더

```
content/
├── chapters/                      # 10개 챕터 (MDX 변환 후)
│   ├── 01-ontology-basics.mdx
│   ├── 02-rdf.mdx
│   ├── 03-rdfs-owl.mdx
│   ├── 04-sparql.mdx
│   ├── 05-reasoning.mdx
│   ├── 06-medical.mdx
│   ├── 07-finance.mdx
│   ├── 08-manufacturing.mdx
│   ├── 09-ai-ontology.mdx
│   └── 10-future-trends.mdx
│
└── docs/                          # 추가 문서
    ├── setup.mdx
    └── contributing.mdx
```

**MDX 파일 구조 예시:**

```mdx
---
title: "온톨로지 기초"
description: "온톨로지의 개념과 활용"
chapter: 1
slug: "01-ontology-basics"
tags: ["ontology", "basics", "introduction"]
simulators: []
updatedAt: "2025-11-09"
---

# 온톨로지 기초

## 1. 온톨로지란?

온톨로지(Ontology)는...

<CodeBlock language="turtle">
@prefix ex: <http://example.org/> .
ex:Person a rdfs:Class .
</CodeBlock>

## 2. 주요 개념

...
```

---

### public/ - 정적 파일

```
public/
├── images/                        # 이미지 파일
│   ├── logo.svg
│   ├── hero-bg.jpg
│   └── chapters/
│       ├── ch01-diagram.png
│       └── ...
│
├── icons/                         # 아이콘
│   ├── favicon.ico
│   └── apple-touch-icon.png
│
└── data/                          # 정적 데이터
    └── ontologies/                # 온톨로지 파일
        ├── medical.ttl
        ├── finance.ttl
        └── manufacturing.ttl
```

---

### 설정 파일

```
web/
├── next.config.js                 # Next.js 설정 (MDX 지원)
├── tailwind.config.ts             # Tailwind CSS 설정 (shadcn/ui 통합)
├── tsconfig.json                  # TypeScript 설정
├── postcss.config.mjs             # PostCSS 설정
├── package.json                   # 의존성 관리
└── package-lock.json              # 의존성 잠금 파일
```

**설정 파일 세부사항:**

| 파일 | 크기 | 주요 내용 | 상태 |
|------|------|----------|------|
| `next.config.js` | 916B | MDX 지원, remark/rehype 플러그인 | ✅ 완성 |
| `tailwind.config.ts` | 2.1KB | CSS 변수, 다크모드, 애니메이션 | ✅ 완성 |
| `tsconfig.json` | 800B | Strict mode, path alias | ✅ 완성 |
| `postcss.config.mjs` | 157B | Tailwind CSS 플러그인 | ✅ 완성 |
| `package.json` | 1.0KB | 25+ 의존성 패키지 | ✅ 완성 |

---

## docs/ - 프로젝트 문서

```
docs/
├── README.md                      # 10.1 KB - 프로젝트 소개
├── VISION.md                      # 13.5 KB - 비전 및 목표
└── ROADMAP.md                     # 11.4 KB - 로드맵 (Phase 1-4)
```

### 문서 내용 요약

**README.md:**
- 프로젝트 개요
- 10개 챕터 소개
- 4개 시뮬레이터 소개
- 기술 스택
- 설치 및 실행 방법

**VISION.md:**
- 프로젝트 목표 및 비전
- 타겟 오디언스
- 차별화 요소
- 성공 지표

**ROADMAP.md:**
- Phase 1: ✅ 콘텐츠 개발 완료 (61,200 단어, 4 시뮬레이터)
- Phase 2: 🔄 웹 플랫폼 개발 (현재 진행 중)
- Phase 3: ⏳ 베타 테스트
- Phase 4: ⏳ 정식 런칭

---

## 파일 명명 규칙

### 현재 명명 규칙

**챕터 파일:**
```
content/chapters/Chapter-XX-vX_X-FINAL.md
```

**문제점:**
- 버전 정보 혼재 (v3.0, v3_0)
- "FINAL" 키워드
- 일관성 부족

---

### 새로운 명명 규칙 (PRD.md 승인됨)

**옵션 C: 간결한 슬러그** ✅ 선택됨 (Kelly 승인)

**챕터 파일:**
```
web/content/chapters/XX-slug-name.mdx
```

**슬러그 매핑:**

| 챕터 | 슬러그 | 예시 파일명 |
|------|--------|-----------|
| 1 | `ontology-basics` | `01-ontology-basics.mdx` |
| 2 | `rdf` | `02-rdf.mdx` |
| 3 | `rdfs-owl` | `03-rdfs-owl.mdx` |
| 4 | `sparql` | `04-sparql.mdx` |
| 5 | `reasoning` | `05-reasoning.mdx` |
| 6 | `medical` | `06-medical.mdx` |
| 7 | `finance` | `07-finance.mdx` |
| 8 | `manufacturing` | `08-manufacturing.mdx` |
| 9 | `ai-ontology` | `09-ai-ontology.mdx` |
| 10 | `future-trends` | `10-future-trends.mdx` |

---

### 컴포넌트 명명 규칙

**React 컴포넌트:**
- PascalCase: `Header.tsx`, `ThemeProvider.tsx`
- UI 컴포넌트: `button.tsx`, `card.tsx` (shadcn 규칙)

**유틸리티 파일:**
- camelCase: `utils.ts`, `rdf-parser.ts`

**설정 파일:**
- kebab-case: `site.ts`, `next.config.js`

---

## 의존성 패키지

### 현재 설치된 패키지 (web/package.json)

**프레임워크:**
- `next`: ^14.2.33
- `react`: ^19.2.0
- `react-dom`: ^19.2.0

**스타일링:**
- `tailwindcss`: ^4.1.17
- `tailwindcss-animate`: ^1.0.7
- `class-variance-authority`: ^0.7.1
- `clsx`: ^2.1.1
- `tailwind-merge`: ^2.6.0

**UI 라이브러리:**
- `lucide-react`: ^0.553.0
- `@radix-ui/react-*`: 10+ 컴포넌트

**MDX:**
- `@next/mdx`: ^16.0.1
- `@mdx-js/loader`: ^3.1.0
- `@mdx-js/react`: ^3.1.0
- `remark-gfm`: ^4.0.0
- `rehype-highlight`: ^7.0.1
- `rehype-slug`: ^6.0.0
- `rehype-autolink-headings`: ^7.1.0

**기타:**
- `next-themes`: ^0.4.4
- `geist`: ^1.3.1

---

### Phase 5에서 추가될 패키지

**3D Knowledge Graph:**
```bash
npm install three @react-three/fiber @react-three/drei d3
```

**SPARQL Playground:**
```bash
npm install @monaco-editor/react
```

**RDF Playground:**
```bash
npm install n3 jsonld
```

---

## Git 관리

### .gitignore 규칙

```gitignore
# Dependencies
node_modules/

# Next.js
.next/
out/
web/.next/
web/out/

# TypeScript
*.tsbuildinfo
next-env.d.ts

# IDE
.vscode/
.idea/
.claude/

# Misc
.DS_Store
.env*.local
```

### Git 커밋 히스토리

**현재 커밋:**

1. `a4c53c0` - Initial commit: Add project documentation
2. `7e5a4b5` - Add PRD and web project setup
3. `3645f77` - Initialize Next.js web application with configs and basic pages

---

## 디렉토리 크기 요약

| 디렉토리 | 파일 수 | 총 크기 (추정) | 상태 |
|---------|--------|--------------|------|
| `content/chapters/` | 10 | ~285 KB | ✅ 완성 |
| `docs/` | 3 | ~35 KB | ✅ 완성 |
| `web/app/` | 10+ | ~10 KB | 🔄 진행 중 |
| `web/components/` | 0 | 0 KB | ⏳ Pending |
| `web/node_modules/` | 439 폴더 | ~50 MB | ✅ 설치됨 |
| **전체** | 50+ | ~50 MB | 19% 완성 |

---

## 다음 단계

**Phase 2.1 - shadcn/ui 초기화** (다음 작업)

```bash
# 1. shadcn/ui 초기화
npx shadcn@latest init

# 2. 6개 기본 UI 컴포넌트 설치
npx shadcn@latest add button card badge dropdown-menu separator dialog

# 3. 확인
ls web/components/ui/
```

**예상 결과:**
```
web/components/ui/
├── button.tsx
├── card.tsx
├── badge.tsx
├── dropdown-menu.tsx
├── separator.tsx
└── dialog.tsx
```

---

## 참고 문서

1. **PRD.md** - 제품 요구사항 정의
2. **TASKS.md** - 작업 관리 (41개 서브태스크)
3. **SIMULATORS-INFO.md** - 시뮬레이터 소스 정보
4. **WEBSITE-PLANNING-COMPLETE.md** - 웹사이트 기획 완료
5. **CONFIG-FILES.md** - 설정 파일 가이드
6. **FIRST-COMPONENTS.md** - 초기 컴포넌트 가이드

---

**마지막 업데이트:** 2025-11-09
**작성자:** Claude Code
**다음 작업:** Phase 2.1 - shadcn/ui 초기화 (Kelly 승인 대기 중)
