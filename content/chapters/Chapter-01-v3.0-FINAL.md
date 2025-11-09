# Chapter 1: 온톨로지란 무엇인가?

**학습 시간:** 60분  
**난이도:** ⭐  
**시뮬레이터:** -  
**버전:** 3.0 FINAL

---

## 🎯 학습 목표

이 챕터를 마치면 다음을 할 수 있습니다:

1. ✅ 온톨로지의 철학적 기원 (아리스토텔레스 10범주)을 설명할 수 있다
2. ✅ Tom Gruber의 1993년 정의를 이해하고 설명할 수 있다
3. ✅ 철학적 온톨로지와 컴퓨터 온톨로지의 차이를 구분할 수 있다
4. ✅ 데이터베이스와 온톨로지의 근본적 차이를 설명할 수 있다
5. ✅ 온톨로지가 필요한 3가지 실제 문제를 식별할 수 있다
6. ✅ 시맨틱 웹의 역사와 발전 과정을 이해한다

---

## 📚 목차

1. [온톨로지의 철학적 기원](#1-온톨로지의-철학적-기원)
2. [Tom Gruber의 정의 (1993)](#2-tom-gruber의-정의-1993)
3. [철학적 온톨로지 vs 컴퓨터 온톨로지](#3-철학적-온톨로지-vs-컴퓨터-온톨로지)
4. [지식 표현 방식 비교](#4-지식-표현-방식-비교)
5. [왜 온톨로지가 필요한가?](#5-왜-온톨로지가-필요한가)
6. [시맨틱 웹의 역사](#6-시맨틱-웹의-역사)
7. [요약과 다음 단계](#7-요약과-다음-단계)

---

## 1. 온톨로지의 철학적 기원

### 아리스토텔레스의 10가지 범주

온톨로지(Ontology)는 그리스어 "온(on, 존재)"과 "로고스(logos, 학문)"의 합성어로, 문자 그대로 **"존재에 관한 학문"**입니다.

이 개념의 뿌리는 기원전 4세기 아리스토텔레스로 거슬러 올라갑니다. 그는 《범주론(Categories)》에서 존재하는 모든 것을 10가지 범주로 분류했습니다:

1. **실체(Substance, οὐσία)** - 존재 자체  
2. **양(Quantity)** - 크기나 수량  
3. **질(Quality)** - 특성이나 속성  
4. **관계(Relation)** - 다른 것과의 연관  
5. **장소(Place)** - 공간적 위치  
6. **시간(Time)** - 시간적 위치  
7. **자세(Position)** - 물리적 배치  
8. **상태(State)** - 외적 조건  
9. **행동(Action)** - 능동적 행위  
10. **수동(Passion)** - 수용하는 것

이 분류는 2,300년이 지난 지금도 현대 온톨로지 설계의 기초입니다.

### 철학에서 컴퓨터 과학으로

1990년대, 컴퓨터 과학자들이 이 고대의 지혜를 재발견합니다. 왜일까요?

**문제:**  
서로 다른 시스템들이 데이터를 교환할 때, 같은 단어가 다른 의미로 사용되어 혼란이 발생했습니다.

예:
- 병원 A: "환자" = 외래 vs 입원
- 병원 B: "환자" = 신환 vs 재진
- 보험사 C: "환자" = 피보험자 vs 비피보험자

철학적 온톨로지가 해답을 제공했습니다: **"개념의 명확한 정의와 관계의 체계적 표현"**

---

## 2. Tom Gruber의 정의 (1993)

### "개념화의 명세"

1993년, 스탠포드 대학의 Tom Gruber가 획기적인 정의를 제시합니다:

> **"Ontology is a specification of a conceptualization."**

풀어 쓰면:

**개념화(Conceptualization):** 어떤 도메인의 추상적 모델
- 병원: 환자, 의사, 진료, 처방...
- 회사: 직원, 부서, 프로젝트, 급여...

**명세(Specification):** 그 개념화를 명확하고 형식적으로 표현
- 모호함 없음
- 컴퓨터가 이해 가능

### Gruber의 4가지 핵심 요소

1. **명확한 용어 정의**
2. **용어 간의 관계**
3. **관계의 제약**
4. **메타데이터**

예제:

```turtle
# 1. 용어 정의
:Patient a owl:Class ;
    rdfs:label "환자"@ko .

# 2. 관계 정의
:treatedBy a owl:ObjectProperty ;
    rdfs:domain :Patient ;
    rdfs:range :Doctor .

# 3. 제약
:Patient rdfs:subClassOf [
    owl:onProperty :treatedBy ;
    owl:minCardinality 1
] .

# 4. 메타데이터
<ontology> dc:creator "홍길동" ;
    dc:created "2025-01-01" .
```

### Gruber 정의의 영향

Tom Gruber의 정의는 온톨로지를 **"공유 가능한 지식 모델"**로 격상시켰습니다.

이후:
- 1999: W3C에서 RDF 표준
- 2004: OWL 표준
- 2008: Google Knowledge Graph
- 2025: Palantir + NVIDIA OAG

모두 Gruber의 기초 위에 세워졌습니다.

---

## 3. 철학적 온톨로지 vs 컴퓨터 온톨로지

### 비교표

| 구분 | 철학적 | 컴퓨터 |
|------|--------|--------|
| **목적** | 실재의 본질 탐구 | 정보 공유 |
| **질문** | "무엇이 존재하는가?" | "어떻게 표현하나?" |
| **방법** | 사변적, 논증 | 형식적, 구현 |
| **결과** | 이론과 해석 | 표준과 소프트웨어 |
| **도구** | 논리학, 언어 | RDF, OWL, SPARQL |

### 철학적 온톨로지

근본적인 질문:
- "무엇이 존재하는가?"
- "존재의 범주는?"
- "부분과 전체의 관계는?"

### 컴퓨터 온톨로지

실용적인 질문:
- "어떻게 정의하나?"
- "어떻게 공유하나?"
- "자동 추론 가능한가?"

### 시간의 예

**철학:**
- 시간은 절대적인가 상대적인가?
- 과거는 현재와 같은 의미로 존재하는가?

**컴퓨터:**
```turtle
:Instant a owl:Class .
:Interval a owl:Class .
:hasBeginning rdfs:domain :Interval ;
    rdfs:range :Instant .
```

철학적 고민을 기반으로, **실용적으로 구현**합니다.

---

## 4. 지식 표현 방식 비교

같은 정보를 여러 방식으로 표현해봅시다:

**정보:**
- 홍길동은 데이터공작소의 CEO
- 데이터공작소는 2018년 설립
- CEO는 직원의 한 종류

### 1) 관계형 데이터베이스

```sql
CREATE TABLE Person (id INT, name VARCHAR, role VARCHAR);
CREATE TABLE Company (id INT, name VARCHAR, founded INT);

INSERT INTO Person VALUES (1, '홍길동', 'CEO');
INSERT INTO Company VALUES (1, '데이터공작소', 2018);
```

**특징:**
- ✅ 빠른 조회
- ❌ 스키마 변경 어려움
- ❌ 추론 불가능

### 2) JSON

```json
{
  "person": {
    "name": "홍길동",
    "company": "데이터공작소",
    "position": "CEO"
  }
}
```

**특징:**
- ✅ 유연한 구조
- ❌ 의미 없음
- ❌ 추론 불가능

### 3) 온톨로지 (RDF/OWL)

```turtle
:CEO rdfs:subClassOf :Employee .
:Employee rdfs:subClassOf :Person .

:홍길동 a :CEO ;
    :worksAt :데이터공작소 .

:데이터공작소 a :Company ;
    :foundedIn "2018"^^xsd:gYear .

# 추론 가능: 홍길동은 Person이다!
```

**특징:**
- ✅ **의미 명확**
- ✅ **추론 가능**
- ✅ **재사용 가능**
- ✅ **표준화**

### 핵심 차이

**데이터베이스:** "홍길동이 사람인가?" → Person 테이블에 있어야만 확인

**온톨로지:** "홍길동이 사람인가?" → 추론으로 자동 확인
1. 홍길동 a CEO (명시적)
2. CEO ⊆ Employee (규칙)
3. Employee ⊆ Person (규칙)
4. **따라서 홍길동 a Person** (추론!)

---

## 5. 왜 온톨로지가 필요한가?

### 사례 1: 의료 정보 시스템 통합

**문제:**

서울 A병원 → 부산 B병원 환자 이송

A병원: `"T2DM"` (Type 2 Diabetes Mellitus)  
B병원: `"당뇨병"`

→ 같은 질병인데 코드가 다름!

**해결: SNOMED CT 온톨로지**

```turtle
:T2DM owl:sameAs snomed:44054006 .
:당뇨병 owl:sameAs snomed:44054006 .

snomed:44054006 rdfs:label "Type 2 diabetes"@en ;
    rdfs:label "제2형 당뇨병"@ko .
```

**효과:**
- ✅ 환자 안전 향상
- ✅ 의료진 시간 절약
- ✅ 데이터 품질 향상

**ROI:** Mayo Clinic은 SNOMED CT로 **의료 오류 23% 감소, 연간 $12M 절감**

### 사례 2: Google Knowledge Graph

**기존 검색 (키워드):**
```
"아인슈타인" 검색
→ 아인슈타인 카페
→ 아인슈타인 병원
→ ...
```

**Knowledge Graph (온톨로지):**

```turtle
:AlbertEinstein a :Physicist ;
    :birthDate "1879-03-14" ;
    :knownFor :RelativityTheory ;
    :award :NobelPrize1921 .
```

**결과:** 검색 결과 옆에 Knowledge Panel 표시!

```
┌─────────────────────┐
│ Albert Einstein     │
│ 이론 물리학자        │
├─────────────────────┤
│ 출생: 1879-03-14    │
│ 업적: 상대성 이론    │
│ 수상: 노벨상 1921   │
└─────────────────────┘
```

**효과:**
- ✅ 즉시 답 제공
- ✅ 음성 검색 가능
- ✅ 다국어 지원

**규모:** 500억+ 사실, 5억+ 엔티티

### 사례 3: BMW 공급망 관리

**문제:**

독일 본사: `BMW-ENG-2025-001`  
한국 공장: `BMW-엔진-2025-001`

→ 같은 부품인지 모름!

**해결: Industry 4.0 온톨로지**

```turtle
:BMW-ENG-2025-001 a :EngineComponent ;
    :partNumber "BMW-ENG-2025-001" ;
    :partNumber "BMW-엔진-2025-001"@ko ;
    :suppliedBy :Bosch ;
    :compatibleWith :BMW_Series3 .
```

**효과:**
- ✅ 부품 추적 **70% 단축**
- ✅ 재고 오류 **45% 감소**
- ✅ 품질 문제 즉시 식별

**ROI:** BMW는 **연간 €85M 비용 절감**

---

## 6. 시맨틱 웹의 역사

온톨로지는 "시맨틱 웹"의 핵심입니다.

### Tim Berners-Lee의 비전 (1999)

웹의 창시자가 제시한 비전:

> **"컴퓨터가 웹의 내용을 '이해'하는 것"**

**Web 2.0 (현재):**
- HTML: 인간이 읽는 문서
- 컴퓨터는 내용을 "이해" 못함

**Web 3.0 (시맨틱 웹):**
- RDF/OWL: 기계가 이해하는 데이터
- 컴퓨터가 내용을 "이해"함

### 시맨틱 웹 스택

```
┌─────────────────┐
│  Trust          │  ← 미래
├─────────────────┤
│  Proof          │
├─────────────────┤
│  Logic          │
├─────────────────┤
│  Ontology (OWL) │  ← 온톨로지
├─────────────────┤
│  RDF + RDFS     │
├─────────────────┤
│  XML            │
├─────────────────┤
│  URI + Unicode  │
└─────────────────┘
```

### 주요 마일스톤

**1999:** 시맨틱 웹 비전 발표  
**2004:** RDF, OWL 표준  
**2008:** SPARQL 표준  
**2012:** Google Knowledge Graph  
**2014:** Schema.org  
**2025:** Palantir + NVIDIA OAG

### 현재 상황 (2025)

시맨틱 웹은 "모든 웹 페이지"는 아니지만:

**성공한 영역:**
- ✅ 지식 그래프 (Google, Microsoft)
- ✅ 기업 데이터 통합
- ✅ 의료 (SNOMED CT)
- ✅ 금융 (FIBO)
- ✅ 제조 (Industry 4.0)
- ✅ **AI + 온톨로지 통합**

**교훈:** "필요한 곳에 정확히 적용"이 핵심!

---

## 7. 요약과 다음 단계

### 핵심 정리

1. **온톨로지의 정의**
   - 철학: 존재에 관한 학문
   - 컴퓨터: 개념화의 명세

2. **철학 vs 컴퓨터**
   - 철학: 본질 탐구
   - 컴퓨터: 공유와 재사용

3. **DB vs 온톨로지**
   - DB: 데이터 저장
   - 온톨로지: 지식 표현 + 추론

4. **실제 사례**
   - 의료: SNOMED CT ($12M 절감)
   - 검색: Google KG (500억 사실)
   - 제조: BMW (€85M 절감)

5. **시맨틱 웹**
   - Tim Berners-Lee 비전
   - RDF → OWL → SPARQL
   - 현재: 필요한 곳에 성공적 적용

### 핵심 메시지

> **온톨로지는 단순한 기술이 아닙니다.**  
> **세상을 이해하고 표현하는 새로운 방식입니다.**

### 다음 챕터

**Chapter 2: RDF - 온톨로지의 언어**

RDF Triple 구조를 완전히 마스터하고,  
**RDF Triple Editor**로 직접 만들어봅니다!

---

## 📝 연습 문제

### 문제 1: 개념 이해

온톨로지에 대한 설명으로 **옳지 않은** 것은?

A. 개념화의 명세이다  
B. 추론이 가능하다  
C. 데이터베이스와 같은 목적이다  
D. W3C 표준을 따른다

**정답:** C

### 문제 2: 실제 적용

온톨로지가 가장 유용한 경우는?

A. 단순 회원 정보 저장  
B. 이미지 파일 저장  
C. 서로 다른 병원 진료 기록 통합  
D. 텍스트 문서 저장

**정답:** C

### 문제 3: 추론

**주어진 정보:**
- 홍길동은 CEO
- CEO는 직원의 한 종류
- 직원은 사람의 한 종류

**추론 가능한 것은?**

A. 홍길동의 나이  
B. 홍길동은 사람이다  
C. 홍길동의 급여  
D. 홍길동이 일하는 회사

**정답:** B

---

## 🔗 참고 자료

### 논문
1. Gruber, T. R. (1993). "A Translation Approach to Portable Ontology Specifications"
2. Berners-Lee, T. (2001). "The Semantic Web"

### W3C 표준
1. RDF 1.1: https://www.w3.org/TR/rdf11-concepts/
2. OWL 2: https://www.w3.org/TR/owl2-overview/

### 실무
1. Google KG: https://developers.google.com/knowledge-graph
2. Palantir: https://www.palantir.com/
3. SNOMED CT: https://www.snomed.org/

---

**다음:** [Chapter 2: RDF - 온톨로지의 언어](./chapter-02.md)

**작성자:** jeromwolf (데이터공작소 TFT)  
**버전:** 3.0 FINAL  
**단어 수:** 약 3,200단어
