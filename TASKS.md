# KSS Ontology Web - 작업 관리

**프로젝트:** KSS Ontology Web Platform
**시작일:** 2025-11-09
**담당자:** jeromwolf + Claude Code
**승인자:** Kelly (켈리)

---

## 📊 전체 진행률

**Phase 1: 프로젝트 설정** ✅ 100% (8/8)
**Phase 2: 기본 컴포넌트** ⏳ 0% (0/6)
**Phase 3: 챕터 시스템** ⏳ 0% (0/8)
**Phase 4: 콘텐츠 변환** ⏳ 0% (0/10)
**Phase 5: 시뮬레이터 통합** ⏳ 0% (0/4)
**Phase 6: 최종 마무리** ⏳ 0% (0/5)

**총 진행률:** 19% (8/41)

---

## ✅ Phase 1: 프로젝트 설정 (완료)

### 1.1 Next.js 프로젝트 초기화
- [x] web/ 폴더 생성
- [x] package.json 설정
- [x] 필수 패키지 설치 (Next.js, React, TypeScript)
- [x] MDX 패키지 설치
- [x] UI 라이브러리 설치 (Tailwind, lucide-react 등)

**완료일:** 2025-11-09
**테스트:** ✅ npm install 성공

### 1.2 프로젝트 구조 생성
- [x] 폴더 구조 생성 (app/, components/, config/ 등)
- [x] .gitignore 업데이트

**완료일:** 2025-11-09
**테스트:** ✅ 폴더 확인 완료

### 1.3 설정 파일 작성
- [x] next.config.js
- [x] tailwind.config.ts
- [x] tsconfig.json
- [x] postcss.config.mjs
- [x] config/site.ts
- [x] lib/utils.ts

**완료일:** 2025-11-09
**테스트:** ✅ TypeScript 에러 없음

### 1.4 기본 페이지 생성
- [x] app/layout.tsx (루트 레이아웃)
- [x] app/page.tsx (홈페이지)
- [x] app/globals.css (글로벌 스타일)

**완료일:** 2025-11-09
**테스트:** ✅ npm run dev 성공 (http://localhost:3000)

### 1.5 Git 커밋
- [x] 변경사항 커밋
- [x] 커밋 메시지 작성

**완료일:** 2025-11-09
**커밋 ID:** 3645f77

---

## 🔄 Phase 2: 기본 컴포넌트 (진행 예정)

### 2.1 shadcn/ui 초기화
- [ ] shadcn/ui init 실행
- [ ] components.json 생성 확인
- [ ] 기본 UI 컴포넌트 설치
  - [ ] button
  - [ ] card
  - [ ] badge
  - [ ] dropdown-menu
  - [ ] separator
  - [ ] dialog

**예상 소요 시간:** 15분
**테스트 방법:** components/ui/ 폴더에 파일들이 생성되었는지 확인

**켈리 승인 대기:** [ ]

---

### 2.2 ThemeProvider 생성
- [ ] components/providers/theme-provider.tsx 생성
- [ ] next-themes 설정
- [ ] app/layout.tsx에 ThemeProvider 추가

**예상 소요 시간:** 10분
**테스트 방법:** 다크모드 토글 작동 확인

**켈리 승인 대기:** [ ]

---

### 2.3 Header 컴포넌트
- [ ] components/layout/header.tsx 생성
- [ ] 로고 추가
- [ ] 네비게이션 메뉴 (챕터, 시뮬레이터, 프로젝트, 소개)
- [ ] ThemeToggle 버튼
- [ ] "시작하기" CTA 버튼
- [ ] 모바일 햄버거 메뉴

**예상 소요 시간:** 30분
**테스트 방법:**
- [ ] 데스크톱에서 네비게이션 작동
- [ ] 모바일에서 햄버거 메뉴 작동
- [ ] 다크모드 전환 작동

**켈리 승인 대기:** [ ]

---

### 2.4 Footer 컴포넌트
- [ ] components/layout/footer.tsx 생성
- [ ] 4개 섹션 (About, 콘텐츠, 리소스, 연락처)
- [ ] 소셜 링크 (GitHub, YouTube)
- [ ] Copyright 정보

**예상 소요 시간:** 20분
**테스트 방법:**
- [ ] 모든 링크 작동 확인
- [ ] 반응형 레이아웃 확인

**켈리 승인 대기:** [ ]

---

### 2.5 ThemeToggle 컴포넌트
- [ ] components/shared/theme-toggle.tsx 생성
- [ ] 라이트/다크/시스템 옵션
- [ ] 드롭다운 메뉴 UI

**예상 소요 시간:** 15분
**테스트 방법:**
- [ ] 라이트 모드 전환
- [ ] 다크 모드 전환
- [ ] 시스템 테마 감지

**켈리 승인 대기:** [ ]

---

### 2.6 홈페이지 개선
- [ ] app/page.tsx 업데이트 (FIRST-COMPONENTS.md 참조)
- [ ] Hero Section 개선
- [ ] Features Section 추가
- [ ] CTA Section 추가
- [ ] 아이콘 추가 (lucide-react)

**예상 소요 시간:** 30분
**테스트 방법:**
- [ ] 모든 섹션이 올바르게 표시됨
- [ ] 버튼 링크 작동
- [ ] 반응형 레이아웃

**켈리 승인 대기:** [ ]

---

## 📚 Phase 3: 챕터 시스템 (계획)

### 3.1 타입 정의
- [ ] types/chapter.ts 생성
- [ ] types/simulator.ts 생성
- [ ] Chapter, ChapterMeta, TableOfContentsItem 인터페이스

**예상 소요 시간:** 20분

**켈리 승인 대기:** [ ]

---

### 3.2 상수 정의
- [ ] lib/constants.ts 생성
- [ ] CHAPTERS_META 배열 (10개 챕터 메타데이터)
- [ ] PART_TITLES 객체
- [ ] STATS 객체

**예상 소요 시간:** 30분

**켈리 승인 대기:** [ ]

---

### 3.3 유틸리티 함수
- [ ] lib/utils.ts 확장
- [ ] formatDate, calculateReadingTime
- [ ] slugToTitle, titleToSlug
- [ ] difficultyToStars, partNumberToTitle

**예상 소요 시간:** 20분
**테스트 방법:** 각 함수 단위 테스트

**켈리 승인 대기:** [ ]

---

### 3.4 MDX 파서 구현
- [ ] lib/mdx.ts 생성
- [ ] MDX 파일 읽기 함수
- [ ] frontmatter 파싱 (gray-matter)
- [ ] 목차 추출 함수

**예상 소요 시간:** 40분
**테스트 방법:** 샘플 MDX 파일로 테스트

**켈리 승인 대기:** [ ]

---

### 3.5 챕터 목록 페이지
- [ ] app/chapters/page.tsx 생성
- [ ] Part별 그룹핑
- [ ] 챕터 카드 컴포넌트
- [ ] 진행률 표시
- [ ] 필터 기능 (선택)

**예상 소요 시간:** 60분
**테스트 방법:**
- [ ] 10개 챕터 모두 표시됨
- [ ] Part별로 그룹핑됨
- [ ] 링크 작동

**켈리 승인 대기:** [ ]

---

### 3.6 챕터 상세 페이지 레이아웃
- [ ] app/chapters/[slug]/page.tsx 생성
- [ ] 3-column 레이아웃 (TOC, Content, Sidebar)
- [ ] 동적 라우팅 설정
- [ ] generateStaticParams 함수

**예상 소요 시간:** 45분

**켈리 승인 대기:** [ ]

---

### 3.7 ChapterContent 컴포넌트
- [ ] components/chapter/chapter-content.tsx
- [ ] MDX 렌더링
- [ ] 타이포그래피 스타일
- [ ] 챕터 헤더 (제목, 설명, 메타)

**예상 소요 시간:** 30분

**켈리 승인 대기:** [ ]

---

### 3.8 TableOfContents 컴포넌트
- [ ] components/chapter/table-of-contents.tsx
- [ ] 섹션 링크 자동 생성
- [ ] 스크롤 스파이 (현재 위치 하이라이트)
- [ ] Sticky 포지션

**예상 소요 시간:** 40분
**테스트 방법:**
- [ ] 목차 클릭 시 해당 섹션으로 스크롤
- [ ] 현재 위치 하이라이트

**켈리 승인 대기:** [ ]

---

## 📝 Phase 4: 콘텐츠 변환 (계획)

### 4.1 챕터 파일명 변경
- [ ] Chapter-01-v3.0-FINAL.md → 01-ontology-basics.mdx
- [ ] Chapter-02-v3_0-FINAL.md → 02-rdf.mdx
- [ ] Chapter-03-v3_0-FINAL.md → 03-rdfs-owl.mdx
- [ ] Chapter-04-v3_0-FINAL.md → 04-sparql.mdx
- [ ] Chapter-05-v3_0-FINAL.md → 05-reasoning.mdx
- [ ] Chapter-06-v3_0-FINAL.md → 06-medical.mdx
- [ ] Chapter-07-v3_0-FINAL (1).md → 07-finance.mdx
- [ ] Chapter-08-v3_0-FINAL.md → 08-manufacturing.mdx
- [ ] Chapter-09-v3_0-FINAL.md → 09-ai-ontology.mdx
- [ ] Chapter-10-v3_0-FINAL.md → 10-future-trends.mdx

**예상 소요 시간:** 20분
**테스트 방법:** 파일명 확인

**켈리 승인 대기:** [ ]

---

### 4.2 MDX 프론트매터 추가
각 챕터에 다음 정보 추가:
```yaml
---
id: 1
slug: "ontology-basics"
title: "온톨로지란 무엇인가?"
description: "..."
wordCount: 3200
duration: "30분"
difficulty: 1
part: 1
publishedAt: "2025-11-09"
topics: ["철학", "지식 표현"]
---
```

- [ ] Chapter 1-10 frontmatter 추가

**예상 소요 시간:** 60분

**켈리 승인 대기:** [ ]

---

### 4.3 content/chapters 폴더 심볼릭 링크
- [ ] web/content/chapters → ../content/chapters 링크 생성
- [ ] 또는 파일 복사

**예상 소요 시간:** 5분

**켈리 승인 대기:** [ ]

---

### 4.4 첫 챕터 렌더링 테스트
- [ ] /chapters/ontology-basics 접속
- [ ] MDX 렌더링 확인
- [ ] 스타일 확인
- [ ] 목차 작동 확인

**예상 소요 시간:** 30분
**테스트 방법:**
- [ ] 챕터가 올바르게 표시됨
- [ ] 코드 블록 하이라이팅
- [ ] 링크 작동

**켈리 승인 대기:** [ ]

---

## 🎮 Phase 5: 시뮬레이터 통합 (계획)

> **📚 참고 문서:** [SIMULATORS-INFO.md](./SIMULATORS-INFO.md)
>
> **소스 코드:** https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src
>
> **통합 전략:** 컴포넌트 이식 (iframe 임베드 아님)

### 5.1 추가 패키지 설치
- [ ] Three.js 관련: `three @react-three/fiber @react-three/drei d3`
- [ ] SPARQL 에디터: `@monaco-editor/react`
- [ ] RDF 파서: `n3 jsonld`
- [ ] package.json 업데이트

**예상 소요 시간:** 15분
**테스트 방법:** `npm list` 확인

**켈리 승인 대기:** [ ]

---

### 5.2 RDF Playground 통합 (Ch2-3)

**우선순위:** 높음 (챕터 2에서 바로 사용)

**소스:**
- GitHub: https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/rdf-editor
- 코드량: ~600줄

**작업 항목:**
- [ ] 컴포넌트 복사 (RDFEditor.tsx, TripleInput.tsx, FormatConverter.tsx)
- [ ] `components/simulators/rdf-editor/` 폴더 생성
- [ ] `app/simulators/rdf-editor/page.tsx` 생성
- [ ] 4가지 직렬화 포맷 지원 (Turtle, JSON-LD, N-Triples, RDF/XML)
- [ ] 12개 코드 예제 추가
- [ ] 실시간 검증 기능
- [ ] Export 기능
- [ ] Tailwind 스타일 적용

**예상 소요 시간:** 2-3시간
**테스트 방법:**
- [ ] `/simulators/rdf-editor` 접속
- [ ] Subject-Predicate-Object 입력
- [ ] 포맷 변환 작동
- [ ] Export 작동

**켈리 승인 대기:** [ ]

---

### 5.3 SPARQL Playground 통합 (Ch4)

**우선순위:** 높음

**소스:**
- GitHub: https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/app/sparql-playground/page.tsx
- 코드량: ~800줄

**작업 항목:**
- [ ] Monaco Editor 설정
- [ ] `components/simulators/sparql/SPARQLEditor.tsx` 생성
- [ ] `app/simulators/sparql-playground/page.tsx` 생성
- [ ] 20+ 예제 쿼리 추가 (DBpedia, Wikidata)
- [ ] 결과 테이블 시각화
- [ ] 쿼리 저장 기능
- [ ] 문법 하이라이팅

**예상 소요 시간:** 2-3시간
**테스트 방법:**
- [ ] SPARQL 쿼리 작성
- [ ] 예제 쿼리 실행
- [ ] 결과 테이블 표시

**켈리 승인 대기:** [ ]

---

### 5.4 Inference Engine 통합 (Ch5)

**우선순위:** 높음

**소스:**
- GitHub: https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/components/rdf-editor/components/InferenceEngine.tsx
- 코드량: 319줄 (가장 간단)

**작업 항목:**
- [ ] InferenceEngine.tsx 복사
- [ ] `components/simulators/inference/InferenceEngine.tsx` 생성
- [ ] `app/simulators/reasoning-engine/page.tsx` 생성
- [ ] 4가지 추론 규칙 구현
  - [ ] 대칭 (Symmetric) - 90% 신뢰도
  - [ ] 전이 (Transitive) - 85% 신뢰도
  - [ ] 타입 추론 (Type Inference) - 80% 신뢰도
  - [ ] 역관계 (Inverse) - 95% 신뢰도
- [ ] TypeScript 인터페이스 (Triple, InferredTriple)
- [ ] 실시간 추론 시각화
- [ ] 신뢰도 점수 표시

**예상 소요 시간:** 1-2시간
**테스트 방법:**
- [ ] 트리플 입력
- [ ] 4가지 추론 규칙 작동
- [ ] 신뢰도 점수 표시
- [ ] 추론 결과 시각화

**켈리 승인 대기:** [ ]

---

### 5.5 3D Knowledge Graph 통합 (Ch6-9)

**우선순위:** 높음 (가장 복잡)

**소스:**
- GitHub: https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/knowledge-graph
- 코드량: ~1,500줄

**컴포넌트 구조:**
```
KnowledgeGraphContainer.tsx  # 메인 컨테이너
Graph2D.tsx                  # 2D 그래프 (D3.js)
GraphViewer.tsx              # 3D Force-directed (Three.js)
SparqlPanel.tsx              # SPARQL 쿼리 패널
ToolPanel.tsx                # 도구 제어판
```

**작업 항목:**
- [ ] 5개 컴포넌트 복사
- [ ] `components/simulators/knowledge-graph/` 폴더 생성
- [ ] `app/simulators/knowledge-graph/page.tsx` 생성
- [ ] Three.js 의존성 설정
- [ ] React Three Fiber 설정
- [ ] D3.js Force-Directed Graph
- [ ] 챕터별 데이터 준비
  - [ ] Ch6: 의료 온톨로지 (SNOMED CT)
  - [ ] Ch7: 금융 온톨로지 (FIBO)
  - [ ] Ch8: 제조 온톨로지 (Palantir)
  - [ ] Ch9: AI + 온톨로지 (Graph RAG)
- [ ] SPARQL 쿼리 인터페이스
- [ ] 인터랙티브 조작 (줌, 패닝, 회전)
- [ ] 레이블 렌더링 (4가지 타입)
- [ ] 성능 최적화 (1000+ 노드)

**예상 소요 시간:** 4-5시간
**테스트 방법:**
- [ ] 3D 그래프 렌더링
- [ ] 2D/3D 전환
- [ ] 노드 클릭, 줌, 회전
- [ ] SPARQL 쿼리 실행
- [ ] 성능 (60fps)

**켈리 승인 대기:** [ ]

---

### 5.6 시뮬레이터 허브 페이지
- [ ] `app/simulators/page.tsx` 생성
- [ ] 4개 시뮬레이터 카드
- [ ] 각 시뮬레이터 설명 및 링크
- [ ] Production URL 표시

**예상 소요 시간:** 30분
**테스트 방법:**
- [ ] `/simulators` 접속
- [ ] 4개 카드 표시
- [ ] 각 링크 작동

**켈리 승인 대기:** [ ]

---

### 5.7 SimulatorEmbed 컴포넌트 (선택)
- [ ] `components/chapter/simulator-embed.tsx`
- [ ] 챕터 페이지에서 시뮬레이터 임베드
- [ ] "새 창에서 열기" 버튼

**예상 소요 시간:** 30분

**켈리 승인 대기:** [ ]

---

## 🎨 Phase 6: 최종 마무리 (계획)

### 6.1 반응형 디자인 검증
- [ ] 모바일 (< 768px)
- [ ] 태블릿 (768px - 1024px)
- [ ] 데스크톱 (> 1024px)

**예상 소요 시간:** 30분

**켈리 승인 대기:** [ ]

---

### 6.2 SEO 최적화
- [ ] 메타 태그 추가
- [ ] Open Graph 이미지
- [ ] sitemap.xml 생성

**예상 소요 시간:** 30분

**켈리 승인 대기:** [ ]

---

### 6.3 성능 최적화
- [ ] Image 최적화
- [ ] 코드 스플리팅
- [ ] Lighthouse 테스트 (90+ 목표)

**예상 소요 시간:** 45분
**테스트 방법:** Lighthouse 점수 확인

**켈리 승인 대기:** [ ]

---

### 6.4 빌드 테스트
- [ ] npm run build 성공
- [ ] 정적 페이지 생성 확인
- [ ] 번들 크기 확인

**예상 소요 시간:** 20분
**테스트 방법:**
- [ ] 빌드 에러 없음
- [ ] 모든 페이지 정적 생성됨

**켈리 승인 대기:** [ ]

---

### 6.5 최종 Git 커밋 및 배포
- [ ] 변경사항 커밋
- [ ] GitHub push
- [ ] README 업데이트
- [ ] Vercel 배포 (선택)

**예상 소요 시간:** 30분

**켈리 승인 대기:** [ ]

---

## 📝 작업 이력

### 2025-11-09
- ✅ Phase 1 완료 (프로젝트 설정)
- ✅ Git 커밋 (3645f77)
- ⏳ Phase 2 대기 중 (켈리 승인 필요)

---

## 🔍 다음 작업

**현재 단계:** Phase 2.1 - shadcn/ui 초기화
**예상 소요 시간:** 15분
**켈리 승인 필요:** ✅

**작업 내용:**
1. shadcn/ui init 실행
2. 6개 기본 UI 컴포넌트 설치
3. components/ui/ 폴더 확인

**켈리, 진행해도 될까요?** 👍/👎

---

**마지막 업데이트:** 2025-11-09
**다음 업데이트:** Phase 2.1 완료 후
