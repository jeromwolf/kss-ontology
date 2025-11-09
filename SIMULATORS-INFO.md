# KSS Ontology - 시뮬레이터 소스 정보

**작성일:** 2025-11-09
**목적:** 기존 시뮬레이터 소스 코드 참조 및 통합 가이드

---

## 📋 목차

1. [시뮬레이터 개요](#시뮬레이터-개요)
2. [온톨로지 전용 시뮬레이터](#온톨로지-전용-시뮬레이터)
3. [공통 시뮬레이터](#공통-시뮬레이터)
4. [통합 계획](#통합-계획)

---

## 시뮬레이터 개요

### 전체 통계

| 시뮬레이터 | 타입 | 코드 줄 수 | 기술 스택 | 상태 | 사용 챕터 |
|-----------|------|-----------|----------|------|----------|
| Inference Engine | 온톨로지 전용 | 319줄 | React, TypeScript | ✅ 완성 | Ch5 |
| 3D Knowledge Graph | 공용 (지식 그래프) | 1,500줄+ | Three.js, D3.js | ✅ 완성 | Ch6-9 |
| SPARQL Playground | 공용 (쿼리) | 800줄+ | Monaco Editor | ✅ 완성 | Ch4 |
| RDF Playground | 공용 (편집) | 600줄+ | React | ✅ 완성 | Ch2-3 |
| Video Creator | 공용 (콘텐츠) | 400줄+ | Remotion | ✅ 완성 | - |

**총 코드량:** ~3,600줄

---

## 온톨로지 전용 시뮬레이터

### 1️⃣ Inference Engine (추론 엔진 시뮬레이터) ⭐

**사용 챕터:** Chapter 5 - 추론 엔진

#### 소스 코드 위치

**GitHub URL:**
- 페이지: https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/app/modules/ontology/simulators/inference-engine/page.tsx
- 컴포넌트: https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/components/rdf-editor/components/InferenceEngine.tsx (319줄)

**로컬 경로:**
```
kss-fresh/src/app/modules/ontology/simulators/inference-engine/page.tsx
kss-fresh/src/components/rdf-editor/components/InferenceEngine.tsx
```

**Production URL:**
https://kss.ai.kr/modules/ontology/simulators/inference-engine

#### 주요 기능

- 🔄 **대칭 관계 추론**: A→B이면 B→A 자동 추론
- 🔗 **전이 관계 추론**: A→B, B→C이면 A→C 추론
- 🏷️ **타입 추론**: 도메인/레인지 기반 자동 분류
- 🔄 **역관계 추론**: 부모-자식 관계의 양방향 추론

#### 기술 스택

- React Client Component
- TypeScript interfaces (Triple, InferredTriple)
- 4가지 추론 규칙 엔진
- 신뢰도 점수 계산 (80-95%)
- 실시간 추론 시각화

#### 추론 규칙 상세

| 규칙 | 설명 | 신뢰도 | 예시 |
|------|------|--------|------|
| 대칭 (Symmetric) | A knows B → B knows A | 90% | `:John :knows :Mary` → `:Mary :knows :John` |
| 전이 (Transitive) | A→B, B→C → A→C | 85% | `:Seoul :locatedIn :Korea`, `:Korea :locatedIn :Asia` → `:Seoul :locatedIn :Asia` |
| 타입 추론 (Type Inference) | teaches 속성 → Teacher/Course 타입 | 80% | `:John :teaches :Math` → `:John :type :Teacher` |
| 역관계 (Inverse) | hasParent ↔ hasChild | 95% | `:John :hasParent :Mary` → `:Mary :hasChild :John` |

#### 통합 계획

**목표 경로:** `web/app/simulators/reasoning-engine/page.tsx`

**작업 항목:**
- [ ] InferenceEngine.tsx 컴포넌트 복사
- [ ] TypeScript 인터페이스 정의
- [ ] 추론 규칙 엔진 이식
- [ ] UI 스타일 통일 (Tailwind)
- [ ] 테스트 데이터 준비

---

## 공통 시뮬레이터

### 2️⃣ Knowledge Graph Visualizer (3D 지식 그래프) 🌟

**사용 챕터:** Chapter 6-9 (의료, 금융, 제조, AI)

#### 소스 코드 위치

**GitHub URL:**
https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/knowledge-graph

**컴포넌트 구조:**
```
kss-fresh/src/components/knowledge-graph/
├── KnowledgeGraphContainer.tsx  # 메인 컨테이너
├── Graph2D.tsx                  # 2D 그래프 시각화
├── GraphViewer.tsx              # 3D Force-directed graph
├── SparqlPanel.tsx              # SPARQL 쿼리 패널
└── ToolPanel.tsx                # 도구 제어판
```

**Production URL:**
https://kss.ai.kr/3d-graph

#### 주요 기능

- 🎨 **3D Force-Directed Layout**: Three.js 기반 3D 시각화
- 📊 **2D Graph Alternative**: D3.js 기반 2D 뷰
- 🔍 **SPARQL Query Interface**: 실시간 쿼리 실행
- 🎮 **인터랙티브 조작**: 줌, 패닝, 회전, 노드 선택
- 💡 **레이블 렌더링**: 4가지 타입 (HTML, Sprite, Text, Billboard)

#### 기술 스택

- React Three Fiber (3D)
- D3.js (2D)
- Force-Directed Graph Algorithm
- WebGL 기반 고성능 렌더링

#### 통합 계획

**목표 경로:** `web/app/simulators/knowledge-graph/page.tsx`

**작업 항목:**
- [ ] 5개 컴포넌트 복사
- [ ] Three.js 의존성 설치
- [ ] React Three Fiber 설정
- [ ] 챕터별 데이터 준비 (의료, 금융, 제조, AI)
- [ ] 성능 최적화

---

### 3️⃣ SPARQL Playground

**사용 챕터:** Chapter 4 - SPARQL

#### 소스 코드 위치

**GitHub URL:**
https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/app/sparql-playground/page.tsx

**Production URL:**
https://kss.ai.kr/sparql-playground

#### 주요 기능

- ✏️ **SPARQL 쿼리 에디터**: 문법 하이라이팅
- ▶️ **실행 엔진**: 로컬 트리플 스토어 쿼리
- 📊 **결과 테이블**: 쿼리 결과 시각화
- 💾 **쿼리 저장**: 즐겨찾기 기능

#### 통합 계획

**목표 경로:** `web/app/simulators/sparql-playground/page.tsx`

**작업 항목:**
- [ ] SPARQL 에디터 컴포넌트 복사
- [ ] Monaco Editor 설정 (또는 CodeMirror)
- [ ] 20+ 예제 쿼리 추가 (DBpedia, Wikidata)
- [ ] 결과 시각화 컴포넌트
- [ ] 문법 검증 기능

---

### 4️⃣ RDF Playground

**사용 챕터:** Chapter 2-3 (RDF, RDFS/OWL)

#### 소스 코드 위치

**GitHub URL:**
https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/rdf-editor

**컴포넌트 구조:**
```
kss-fresh/src/components/rdf-editor/
├── RDFEditor.tsx               # 메인 에디터
├── TripleInput.tsx             # S-P-O 입력
├── TripleList.tsx              # 트리플 목록
└── FormatConverter.tsx         # 포맷 변환
```

#### 주요 기능

- 📝 **RDF 트리플 편집기**: Subject-Predicate-Object
- ✅ **실시간 검증**: RDF 문법 체크
- 🔄 **포맷 변환**: Turtle, JSON-LD, N-Triples, RDF/XML
- 💾 **트리플 저장**: 로컬 스토리지
- 🎨 **시각화**: 그래프 뷰

#### 통합 계획

**목표 경로:** `web/app/simulators/rdf-editor/page.tsx`

**작업 항목:**
- [ ] RDF Editor 컴포넌트 복사
- [ ] 4가지 직렬화 포맷 지원
- [ ] 12개 코드 예제 추가
- [ ] 실시간 검증 기능
- [ ] Export 기능

---

### 5️⃣ Ontology Video Creator (Remotion 기반)

**사용:** 선택적 (콘텐츠 생성 도구)

#### 소스 코드 위치

**GitHub URL:**
https://github.com/jeromwolf/ontology/blob/main/kss-fresh/src/components/video-creator/OntologyShortsCreator.tsx

**템플릿 위치:**
```
kss-fresh/remotion/
├── OntologyShorts.tsx           # 온톨로지 Shorts 템플릿
├── ChapterExplainer.tsx         # 챕터 설명 영상
└── ModernChapterExplainer.tsx   # 현대적 스타일
```

#### 주요 기능

- 🎬 **자동 비디오 생성**: 온톨로지 개념 설명 영상
- 🎨 **애니메이션**: Remotion 기반 프로그래밍 방식
- 🔊 **TTS 통합**: ElevenLabs 음성 합성
- 📹 **YouTube Shorts**: 9:16 세로 형식

#### 통합 계획

**우선순위:** 낮음 (Phase 7 이후)

**작업 항목:**
- [ ] Remotion 의존성 설치
- [ ] 비디오 템플릿 복사
- [ ] TTS API 설정
- [ ] 렌더링 파이프라인 구축

---

## 통합 계획

### Phase 5: 시뮬레이터 통합

#### 5.1 우선순위 결정

**높음 (필수):**
1. RDF Playground (Ch2-3)
2. SPARQL Playground (Ch4)
3. Inference Engine (Ch5)
4. 3D Knowledge Graph (Ch6-9)

**낮음 (선택):**
5. Video Creator

#### 5.2 통합 전략

**옵션 A: iframe 임베드** (빠름, 간단)
- 장점: 빠른 구현, 기존 코드 재사용
- 단점: 스타일 통일 어려움, 성능 저하

**옵션 B: 컴포넌트 이식** (권장)
- 장점: 완전한 통합, 스타일 통일, 성능 최적화
- 단점: 시간 소요, 의존성 관리

**결정:** 옵션 B (컴포넌트 이식)

#### 5.3 기술 의존성

**추가 설치 필요:**
```bash
# 3D Knowledge Graph
npm install three @react-three/fiber @react-three/drei d3

# SPARQL Playground
npm install @monaco-editor/react

# RDF Playground
npm install n3 jsonld

# Inference Engine
# (기존 패키지로 충분)
```

#### 5.4 디렉토리 구조

```
web/
├── app/
│   └── simulators/
│       ├── rdf-editor/
│       │   └── page.tsx
│       ├── sparql-playground/
│       │   └── page.tsx
│       ├── reasoning-engine/
│       │   └── page.tsx
│       └── knowledge-graph/
│           └── page.tsx
├── components/
│   └── simulators/
│       ├── rdf-editor/
│       │   ├── RDFEditor.tsx
│       │   ├── TripleInput.tsx
│       │   └── FormatConverter.tsx
│       ├── sparql/
│       │   ├── SPARQLEditor.tsx
│       │   └── ResultsTable.tsx
│       ├── inference/
│       │   └── InferenceEngine.tsx
│       └── knowledge-graph/
│           ├── Graph3D.tsx
│           ├── Graph2D.tsx
│           └── Controls.tsx
└── lib/
    └── simulators/
        ├── rdf-parser.ts
        ├── sparql-engine.ts
        └── inference-rules.ts
```

#### 5.5 작업 순서

1. **RDF Playground** (Ch2-3)
   - 예상 시간: 2-3시간
   - 우선순위: 높음 (챕터 2에서 바로 사용)

2. **SPARQL Playground** (Ch4)
   - 예상 시간: 2-3시간
   - 의존성: Monaco Editor

3. **Inference Engine** (Ch5)
   - 예상 시간: 1-2시간
   - 가장 간단 (319줄)

4. **3D Knowledge Graph** (Ch6-9)
   - 예상 시간: 4-5시간
   - 가장 복잡 (1,500줄+, Three.js)

**총 예상 시간:** 9-13시간

---

## GitHub 디렉토리 링크

### 전체 구조

**온톨로지 모듈 전체:**
https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/app/modules/ontology

**시뮬레이터 디렉토리:**
https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/app/modules/ontology/simulators

### 공통 컴포넌트

**RDF Editor:**
https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/rdf-editor

**Knowledge Graph:**
https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/knowledge-graph

**Video Creator:**
https://github.com/jeromwolf/ontology/tree/main/kss-fresh/src/components/video-creator

---

## 다음 단계

**현재:** SIMULATORS-INFO.md 생성 완료
**다음:** TASKS.md 업데이트 (시뮬레이터 통합 계획 반영)

**켈리, TASKS.md를 업데이트해도 될까요?** 👍

---

**마지막 업데이트:** 2025-11-09
**작성자:** Claude Code
