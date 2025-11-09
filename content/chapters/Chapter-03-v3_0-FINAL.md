# Chapter 3: RDFS와 OWL

**학습 시간:** 90분  
**난이도:** ⭐⭐⭐⭐  
**시뮬레이터:** RDF Triple Editor ⭐  
**작성일:** 2025-11-09  
**버전:** 3.0 FINAL

---

## 🎯 학습 목표

이 챕터를 마치면 다음을 할 수 있습니다:

1. ✅ RDFS의 역할과 11가지 추론 규칙을 이해한다
2. ✅ 클래스 계층 (rdfs:subClassOf)과 프로퍼티 계층 (rdfs:subPropertyOf)을 설계한다
3. ✅ OWL 2의 4가지 프로파일 (EL, QL, RL, Full)을 구분한다
4. ✅ Class Expression (교집합, 합집합, 여집합)을 작성한다
5. ✅ Property 특성 (Transitive, Symmetric, Functional 등)을 활용한다
6. ✅ Restrictions (someValuesFrom, allValuesFrom, cardinality)를 구현한다
7. ✅ RDFS vs OWL 언제 무엇을 사용할지 결정한다

---

## 📚 목차

1. [RDFS란 무엇인가?](#1-rdfs란-무엇인가)
2. [RDFS 클래스와 프로퍼티](#2-rdfs-클래스와-프로퍼티)
3. [RDFS 추론 규칙 11가지](#3-rdfs-추론-규칙-11가지)
4. [OWL의 탄생과 목적](#4-owl의-탄생과-목적)
5. [OWL 2 프로파일 4가지](#5-owl-2-프로파일-4가지)
6. [Class Expression](#6-class-expression)
7. [Property 특성](#7-property-특성)
8. [Restrictions와 제약](#8-restrictions와-제약)
9. [실습: 도서관 온톨로지](#9-실습-도서관-온톨로지)
10. [RDFS vs OWL 선택 가이드](#10-rdfs-vs-owl-선택-가이드)
11. [요약과 다음 단계](#11-요약과-다음-단계)

---

## 1. RDFS란 무엇인가?

### RDF Schema (RDFS)

**RDFS (RDF Schema)**는 RDF에 **의미(Semantics)**를 추가하는 W3C 표준입니다.

**RDF만으로는:**
```turtle
:홍길동 :근무처 :데이터공작소 .
:김철수 :근무처 :ABC회사 .
```

→ 컴퓨터는 "근무처"가 무슨 의미인지 모름!

**RDFS로:**
```turtle
# 클래스 정의
:Person a rdfs:Class .
:Company a rdfs:Class .

# 프로퍼티 정의
:근무처 a rdf:Property ;
    rdfs:domain :Person ;    # 주어는 Person
    rdfs:range :Company .    # 목적어는 Company

# 데이터
:홍길동 a :Person ;
    :근무처 :데이터공작소 .

:데이터공작소 a :Company .
```

→ 컴퓨터가 "홍길동은 사람, 데이터공작소는 회사, 근무처는 사람과 회사를 연결"을 **이해**!

### RDFS의 핵심 개념

**1. 어휘 정의 (Vocabulary)**
- 클래스와 프로퍼티의 의미를 명시

**2. 계층 구조 (Hierarchy)**
- 상위 개념 → 하위 개념
- 예: 동물 → 포유류 → 개

**3. 추론 가능 (Inference)**
- 명시적 사실 + 규칙 = 암묵적 지식 도출

### RDFS의 역사

**1999년:** RDF 표준 발표  
**2000년:** RDFS 1.0 발표  
**2004년:** RDFS 1.1 (현재 표준)  
**2014년:** RDFS 1.1 최종 권고안

---

## 2. RDFS 클래스와 프로퍼티

### 핵심 클래스 5개

#### 1. rdfs:Class

모든 클래스의 클래스 (메타 클래스)

```turtle
:Person a rdfs:Class ;
    rdfs:label "사람"@ko ;
    rdfs:comment "인간을 나타내는 클래스"@ko .

:Company a rdfs:Class ;
    rdfs:label "회사"@ko .
```

#### 2. rdfs:Resource

모든 것의 최상위 클래스

```turtle
# 모든 것은 자동으로 rdfs:Resource
:홍길동 a :Person .
# → 추론: :홍길동 a rdfs:Resource .
```

#### 3. rdfs:Literal

모든 리터럴 값의 클래스

```turtle
# "홍길동"은 자동으로 rdfs:Literal
:홍길동 :이름 "홍길동" .
```

#### 4. rdf:Property

모든 프로퍼티의 클래스

```turtle
:근무처 a rdf:Property .
:이름 a rdf:Property .
```

#### 5. rdfs:Datatype

데이터 타입의 클래스

```turtle
xsd:string a rdfs:Datatype .
xsd:integer a rdfs:Datatype .
xsd:date a rdfs:Datatype .
```

### 핵심 프로퍼티 7개

#### 1. rdfs:subClassOf (클래스 계층)

```turtle
:CEO rdfs:subClassOf :Employee .
:Employee rdfs:subClassOf :Person .
:Person rdfs:subClassOf rdfs:Resource .

# 추론:
:홍길동 a :CEO .
# → :홍길동 a :Employee .
# → :홍길동 a :Person .
# → :홍길동 a rdfs:Resource .
```

**전이적 (Transitive):** A ⊆ B, B ⊆ C → A ⊆ C

#### 2. rdfs:subPropertyOf (프로퍼티 계층)

```turtle
:근무처 rdfs:subPropertyOf :관련조직 .
:관련조직 rdfs:subPropertyOf :관계 .

# 추론:
:홍길동 :근무처 :데이터공작소 .
# → :홍길동 :관련조직 :데이터공작소 .
# → :홍길동 :관계 :데이터공작소 .
```

#### 3. rdfs:domain (주어의 타입)

```turtle
:근무처 rdfs:domain :Person .

# 추론:
:홍길동 :근무처 :데이터공작소 .
# → :홍길동 a :Person .
```

#### 4. rdfs:range (목적어의 타입)

```turtle
:근무처 rdfs:range :Company .

# 추론:
:홍길동 :근무처 :데이터공작소 .
# → :데이터공작소 a :Company .
```

#### 5. rdfs:label (레이블)

사람이 읽을 수 있는 이름

```turtle
:Person rdfs:label "사람"@ko ;
    rdfs:label "Person"@en ;
    rdfs:label "人"@zh .
```

#### 6. rdfs:comment (설명)

클래스나 프로퍼티의 설명

```turtle
:Person rdfs:comment "인간을 나타내는 클래스입니다."@ko .
```

#### 7. rdfs:seeAlso (추가 정보)

관련 리소스 링크

```turtle
:Person rdfs:seeAlso <http://xmlns.com/foaf/0.1/Person> .
```

---

## 3. RDFS 추론 규칙 11가지

RDFS는 **11가지 추론 규칙**을 정의합니다.

### 규칙 1: rdfs1 (리터럴은 rdfs:Literal)

```turtle
# 명시:
:홍길동 :이름 "홍길동" .

# 추론:
"홍길동" a rdfs:Literal .
```

### 규칙 2: rdfs2 (domain 추론)

```turtle
# 명시:
:근무처 rdfs:domain :Person .
:홍길동 :근무처 :데이터공작소 .

# 추론:
:홍길동 a :Person .
```

### 규칙 3: rdfs3 (range 추론)

```turtle
# 명시:
:근무처 rdfs:range :Company .
:홍길동 :근무처 :데이터공작소 .

# 추론:
:데이터공작소 a :Company .
```

### 규칙 4: rdfs4a, 4b (주어/목적어는 Resource)

```turtle
# 명시:
:홍길동 :근무처 :데이터공작소 .

# 추론:
:홍길동 a rdfs:Resource .
:데이터공작소 a rdfs:Resource .
```

### 규칙 5: rdfs5 (subPropertyOf 전이성)

```turtle
# 명시:
:근무처 rdfs:subPropertyOf :관련조직 .
:관련조직 rdfs:subPropertyOf :관계 .

# 추론:
:근무처 rdfs:subPropertyOf :관계 .
```

### 규칙 6: rdfs6 (프로퍼티는 자기 자신의 서브프로퍼티)

```turtle
# 자동 추론:
:근무처 rdfs:subPropertyOf :근무처 .
```

### 규칙 7: rdfs7 (subPropertyOf 적용)

```turtle
# 명시:
:근무처 rdfs:subPropertyOf :관련조직 .
:홍길동 :근무처 :데이터공작소 .

# 추론:
:홍길동 :관련조직 :데이터공작소 .
```

### 규칙 8: rdfs8 (클래스는 rdfs:Resource의 서브클래스)

```turtle
# 명시:
:Person a rdfs:Class .

# 추론:
:Person rdfs:subClassOf rdfs:Resource .
```

### 규칙 9: rdfs9 (subClassOf 적용)

```turtle
# 명시:
:CEO rdfs:subClassOf :Employee .
:홍길동 a :CEO .

# 추론:
:홍길동 a :Employee .
```

### 규칙 10: rdfs10 (클래스는 자기 자신의 서브클래스)

```turtle
# 자동 추론:
:Person rdfs:subClassOf :Person .
```

### 규칙 11: rdfs11 (subClassOf 전이성)

```turtle
# 명시:
:CEO rdfs:subClassOf :Employee .
:Employee rdfs:subClassOf :Person .

# 추론:
:CEO rdfs:subClassOf :Person .
```

### 추론 체인 예제

**명시적 사실:**
```turtle
# 클래스 계층
:CEO rdfs:subClassOf :Employee .
:Employee rdfs:subClassOf :Person .

# 프로퍼티 정의
:관리함 rdfs:domain :CEO ;
    rdfs:range :Department .

# 데이터
:홍길동 a :CEO ;
    :관리함 :개발팀 .
```

**추론되는 사실:**
```turtle
# rdfs11 (subClassOf 전이성)
:CEO rdfs:subClassOf :Person .

# rdfs9 (subClassOf 적용)
:홍길동 a :Employee .
:홍길동 a :Person .

# rdfs3 (range)
:개발팀 a :Department .

# rdfs4
:홍길동 a rdfs:Resource .
:개발팀 a rdfs:Resource .
```

**총 7개의 새로운 사실 도출!**

---

## 4. OWL의 탄생과 목적

### RDFS의 한계

RDFS는 훌륭하지만, 표현력이 제한적입니다:

**1. 복잡한 클래스 표현 불가**
```turtle
# "CEO이면서 여성인 사람"을 RDFS로 표현할 수 없음
# RDFS에는 intersection(교집합) 개념이 없음
```

**2. 프로퍼티 특성 표현 불가**
```turtle
# "친구 관계는 대칭적"을 RDFS로 표현할 수 없음
# A가 B의 친구 → B도 A의 친구
```

**3. 카디널리티 제약 불가**
```turtle
# "사람은 정확히 1명의 생물학적 어머니"를 표현할 수 없음
```

**4. 불일치 탐지 불가**
```turtle
# "사람은 동물이면서 식물일 수 없다"를 표현할 수 없음
```

### OWL의 탄생 (2004)

**OWL (Web Ontology Language)**은 RDFS의 한계를 극복하기 위해 탄생했습니다.

**주요 목표:**
1. **풍부한 표현력** - 복잡한 개념 표현
2. **강력한 추론** - 자동으로 지식 도출
3. **불일치 탐지** - 논리적 오류 발견
4. **표준화** - W3C 권고안

**버전 역사:**
- **2004:** OWL 1.0 (OWL Lite, DL, Full)
- **2009:** OWL 2.0 (EL, QL, RL, Full)
- **2012:** OWL 2 권고안 확정

### OWL의 기반: 기술 논리 (Description Logic)

OWL은 **Description Logic (DL)**에 기반합니다.

**기술 논리란?**
- 수학적으로 정의된 논리 체계
- 완전성(Completeness)과 결정가능성(Decidability) 보장
- 자동 추론 가능

**DL 표기법:**
```
Person ⊓ CEO         (교집합: 사람이면서 CEO)
Person ⊔ Company     (합집합: 사람이거나 회사)
¬Mammal              (여집합: 포유류가 아님)
∃hasChild.Person     (존재: 자식이 있는)
∀hasEmployee.PhD     (전체: 모든 직원이 박사)
```

---

## 5. OWL 2 프로파일 4가지

OWL 2는 **4가지 프로파일**로 제공됩니다. 각각 다른 용도와 추론 복잡도를 가집니다.

### 비교표

| 프로파일 | 표현력 | 추론 속도 | 복잡도 | 용도 |
|---------|--------|-----------|--------|------|
| **EL** | 낮음 | 매우 빠름 | P | 대규모 계층 (의료) |
| **QL** | 낮음 | 빠름 | AC0 | DB 쿼리 (금융) |
| **RL** | 중간 | 빠름 | P | 규칙 기반 (제조) |
| **Full** | 매우 높음 | 느림 | N2EXPTIME | 학술 연구 |

### 1. OWL 2 EL (Existential Language)

**특징:**
- 존재 제약(∃) 중심
- 클래스 계층 표현에 최적
- 다항 시간 추론 (Polynomial)

**지원 기능:**
- ✅ subClassOf
- ✅ equivalentClass
- ✅ someValuesFrom (∃)
- ❌ allValuesFrom (∀)
- ❌ cardinality

**사용 사례:**
```turtle
# SNOMED CT (의료 온톨로지)
:Pneumonia rdfs:subClassOf :LungDisease ;
    rdfs:subClassOf [
        a owl:Restriction ;
        owl:onProperty :hasSymptom ;
        owl:someValuesFrom :Cough
    ] .

# "폐렴은 폐 질환이고, 기침 증상이 있다"
```

**대표 사용:**
- SNOMED CT (350,000+ 개념)
- Gene Ontology
- 대규모 의료/생물 온톨로지

### 2. OWL 2 QL (Query Language)

**특징:**
- DB 쿼리 최적화
- SQL로 변환 가능
- 매우 빠른 쿼리

**지원 기능:**
- ✅ subClassOf
- ✅ domain/range
- ✅ inverseOf
- ❌ someValuesFrom
- ❌ cardinality

**사용 사례:**
```turtle
# FIBO (금융 온톨로지)
:Stock rdfs:subClassOf :Security .
:hasTicker rdfs:domain :Stock ;
    rdfs:range xsd:string .

# SPARQL 쿼리가 SQL로 자동 변환!
SELECT ?stock ?ticker WHERE {
    ?stock a :Stock ;
           :hasTicker ?ticker .
}
```

**대표 사용:**
- FIBO (금융)
- 대규모 데이터베이스 위의 온톨로지
- 쿼리 성능이 중요한 경우

### 3. OWL 2 RL (Rule Language)

**특징:**
- 규칙 기반 추론
- Datalog로 구현 가능
- 실용적 균형

**지원 기능:**
- ✅ subClassOf
- ✅ someValuesFrom
- ✅ allValuesFrom
- ✅ hasValue
- ✅ Functional, Inverse, Transitive 프로퍼티
- ⚠️ 제한된 cardinality

**사용 사례:**
```turtle
# Industry 4.0 (제조)
:Machine a owl:Class .
:Sensor a owl:Class .

:hasSensor a owl:ObjectProperty ;
    rdfs:domain :Machine ;
    rdfs:range :Sensor .

:Machine rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :hasSensor ;
    owl:someValuesFrom :TemperatureSensor
] .

# 규칙: 모든 기계는 최소 1개의 온도 센서가 있어야 함
```

**대표 사용:**
- Industry 4.0 (스마트 팩토리)
- 규칙 엔진 통합
- 실시간 시스템

### 4. OWL 2 Full

**특징:**
- 최대 표현력
- RDF와 완전 호환
- 추론 결정불가능 (Undecidable)

**지원 기능:**
- ✅ 모든 OWL 2 기능
- ✅ 메타 모델링
- ✅ 클래스를 개체로 사용

**사용 사례:**
```turtle
# 메타 모델링
:Person a owl:Class ;
    a :MetaConcept .   # 클래스가 동시에 개체!

# Full에서만 가능
```

**주의:**
- 추론 완료 보장 안됨
- 학술 연구용
- 실무에서는 거의 사용 안함

### 프로파일 선택 가이드

```
대규모 계층 (수십만 개념) → EL
DB 쿼리 성능 중요 → QL
규칙 기반 시스템 → RL
복잡한 논리 표현 필요 → DL (Full의 결정가능 서브셋)
```

---

## 6. Class Expression

OWL의 핵심은 **복잡한 클래스 표현**입니다.

### 1. 교집합 (Intersection, ⊓)

**owl:intersectionOf** - "그리고(AND)"

```turtle
# "CEO이면서 여성인 사람"
:FemaleCEO owl:equivalentClass [
    a owl:Class ;
    owl:intersectionOf (
        :CEO
        :Female
    )
] .

# 추론:
:김대표 a :CEO , :Female .
# → :김대표 a :FemaleCEO .
```

**실전 예제:**
```turtle
# "석사 이상 학위를 가진 개발자"
:SeniorDeveloper owl:equivalentClass [
    owl:intersectionOf (
        :Developer
        [ owl:onProperty :hasDegree ;
          owl:someValuesFrom :MastersDegree ]
    )
] .
```

### 2. 합집합 (Union, ⊔)

**owl:unionOf** - "또는(OR)"

```turtle
# "직원이거나 계약직"
:Worker owl:equivalentClass [
    owl:unionOf (
        :Employee
        :Contractor
    )
] .

# 추론:
:홍길동 a :Employee .
# → :홍길동 a :Worker .

:김철수 a :Contractor .
# → :김철수 a :Worker .
```

### 3. 여집합 (Complement, ¬)

**owl:complementOf** - "아님(NOT)"

```turtle
# "사람이 아닌 것"
:NonPerson owl:equivalentClass [
    owl:complementOf :Person
] .

# "여성이 아닌 사람 = 남성"
:Male owl:equivalentClass [
    owl:intersectionOf (
        :Person
        [ owl:complementOf :Female ]
    )
] .
```

### 4. 열거 (Enumeration)

**owl:oneOf** - "이 중 하나"

```turtle
# "요일"
:DayOfWeek owl:equivalentClass [
    owl:oneOf (
        :Monday :Tuesday :Wednesday
        :Thursday :Friday :Saturday :Sunday
    )
] .

# "신호등 색상"
:TrafficLightColor owl:oneOf (
    :Red :Yellow :Green
) .
```

### 복합 예제

```turtle
# "박사 학위를 가진 정직원 또는 모든 시니어 계약직"
:QualifiedWorker owl:equivalentClass [
    owl:unionOf (
        # 박사 학위 정직원
        [ owl:intersectionOf (
            :Employee
            [ owl:onProperty :hasDegree ;
              owl:someValuesFrom :PhD ]
        ) ]
        # 시니어 계약직
        [ owl:intersectionOf (
            :Contractor
            [ owl:onProperty :seniorityLevel ;
              owl:hasValue :Senior ]
        ) ]
    )
] .
```

---

## 7. Property 특성

OWL은 프로퍼티에 **특별한 의미**를 부여할 수 있습니다.

### 1. Transitive Property (전이적)

**A → B, B → C이면 A → C**

```turtle
:hasAncestor a owl:TransitiveProperty .

# 명시:
:홍길동 :hasAncestor :김할아버지 .
:김할아버지 :hasAncestor :이증조할아버지 .

# 추론:
:홍길동 :hasAncestor :이증조할아버지 .
```

**실전 예제:**
```turtle
:partOf a owl:TransitiveProperty .

:엔진 :partOf :자동차 .
:피스톤 :partOf :엔진 .
# → :피스톤 :partOf :자동차 .
```

### 2. Symmetric Property (대칭적)

**A → B이면 B → A**

```turtle
:friendOf a owl:SymmetricProperty .

# 명시:
:홍길동 :friendOf :김철수 .

# 추론:
:김철수 :friendOf :홍길동 .
```

**실전 예제:**
```turtle
:marriedTo a owl:SymmetricProperty .
:sibling a owl:SymmetricProperty .
:collaboratesWith a owl:SymmetricProperty .
```

### 3. Asymmetric Property (비대칭적)

**A → B이면 B → A 불가**

```turtle
:parentOf a owl:AsymmetricProperty .

# A가 B의 부모이면, B는 A의 부모일 수 없음
:홍길동 :parentOf :홍아들 .
# :홍아들 :parentOf :홍길동 . ← 모순! (불일치)
```

### 4. Reflexive Property (반사적)

**모든 A에 대해 A → A**

```turtle
:knows a owl:ReflexiveProperty .

# 모든 사람은 자기 자신을 안다
:홍길동 a :Person .
# → :홍길동 :knows :홍길동 .
```

### 5. Irreflexive Property (비반사적)

**A → A 불가**

```turtle
:parentOf a owl:IrreflexiveProperty .

# 자기 자신의 부모일 수 없음
:홍길동 :parentOf :홍길동 . ← 모순!
```

### 6. Functional Property (함수적)

**A는 B를 최대 1개 가짐**

```turtle
:hasBiologicalMother a owl:FunctionalProperty .

# 생물학적 어머니는 정확히 1명
:홍길동 :hasBiologicalMother :김어머니 .
:홍길동 :hasBiologicalMother :이어머니 .
# → 추론: :김어머니 owl:sameAs :이어머니 .
```

**실전 예제:**
```turtle
:hasSSN a owl:FunctionalProperty .  # 주민등록번호는 1개
:hasCEO a owl:FunctionalProperty .  # CEO는 1명
```

### 7. Inverse Functional Property (역함수적)

**B는 A의 값이 최대 1개**

```turtle
:hasSSN a owl:InverseFunctionalProperty .

# SSN이 같으면 같은 사람
:홍길동 :hasSSN "123-45-6789" .
:John :hasSSN "123-45-6789" .
# → 추론: :홍길동 owl:sameAs :John .
```

### 8. Inverse Property (역관계)

```turtle
:hasChild owl:inverseOf :hasParent .

# 명시:
:홍길동 :hasChild :홍아들 .

# 추론:
:홍아들 :hasParent :홍길동 .
```

**복합 예제:**
```turtle
:knows a owl:SymmetricProperty ,
        owl:TransitiveProperty .

# 대칭 + 전이 = 친구의 친구는 친구
:A :knows :B .
:B :knows :C .
# → :A :knows :C .
# → :B :knows :A .
# → :C :knows :B .
# → :C :knows :A .
```

---

## 8. Restrictions와 제약

**Restrictions**는 클래스의 속성에 제약을 겁니다.

### 1. Value Constraints

#### someValuesFrom (∃, 존재)

**"최소 1개는 만족"**

```turtle
:Parent owl:equivalentClass [
    a owl:Restriction ;
    owl:onProperty :hasChild ;
    owl:someValuesFrom :Person
] .

# "부모 = 최소 1명의 사람 자식이 있는"
```

#### allValuesFrom (∀, 전체)

**"있다면 모두 만족"**

```turtle
:VegetarianRestaurant rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :servesFood ;
    owl:allValuesFrom :VegetarianFood
] .

# "채식 식당은 채식 음식만 제공"
# 주의: 아무것도 안 제공해도 만족!
```

**someValuesFrom vs allValuesFrom:**

```turtle
# ∃ (someValuesFrom)
:홍길동 :hasChild :아들 .
:아들 a :Person .
# → :홍길동 a :Parent . ✅

# ∀ (allValuesFrom)  
:식당 :servesFood :김치 , :된장찌개 .
:김치 a :VegetarianFood .
:된장찌개 a :VegetarianFood .
# → :식당 a :VegetarianRestaurant . ✅

:식당2 :servesFood :삼겹살 .
:삼겹살 a :MeatFood .
# → :식당2 a :VegetarianRestaurant . ❌
```

#### hasValue (특정 값)

```turtle
:DataWorkshopEmployee rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :worksFor ;
    owl:hasValue :데이터공작소
] .

# "데이터공작소 직원 = worksFor가 데이터공작소인"
```

### 2. Cardinality Constraints (카디널리티)

#### minCardinality (최소)

```turtle
:Parent rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :hasChild ;
    owl:minCardinality 1
] .

# "부모는 최소 1명의 자식"
```

#### maxCardinality (최대)

```turtle
:Person rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :hasBiologicalMother ;
    owl:maxCardinality 1
] .

# "사람은 최대 1명의 생물학적 어머니"
```

#### cardinality (정확히)

```turtle
:Couple rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :hasMember ;
    owl:cardinality 2
] .

# "커플은 정확히 2명"
```

#### Qualified Cardinality (타입 지정)

```turtle
:Professor rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :teaches ;
    owl:minQualifiedCardinality 2 ;
    owl:onClass :GraduateCourse
] .

# "교수는 최소 2개의 대학원 과목을 가르침"
```

### 3. Self Restriction

```turtle
:Narcissist owl:equivalentClass [
    a owl:Restriction ;
    owl:onProperty :loves ;
    owl:hasSelf true
] .

# "나르시시스트 = 자기 자신을 사랑하는 사람"
```

### 복합 예제

```turtle
# "PhD 학위를 가지고, 최소 2편의 논문을 쓴,
#  소속이 대학인 사람"
:Researcher owl:equivalentClass [
    owl:intersectionOf (
        :Person
        [ owl:onProperty :hasDegree ;
          owl:hasValue :PhD ]
        [ owl:onProperty :authorOf ;
          owl:minQualifiedCardinality 2 ;
          owl:onClass :ScientificPaper ]
        [ owl:onProperty :affiliatedWith ;
          owl:someValuesFrom :University ]
    )
] .
```

---

## 9. 실습: 도서관 온톨로지

### 실습 목표

RDF Triple Editor를 사용해서 RDFS와 OWL 기능을 모두 활용한 **도서관 온톨로지**를 구축합니다.

### Step 1: 네임스페이스

```turtle
@prefix : <http://library.example.org/ontology#> .
@prefix lib: <http://library.example.org/data/> .

@prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
@prefix owl: <http://www.w3.org/2002/07/owl#> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<http://library.example.org/ontology> a owl:Ontology ;
    rdfs:label "도서관 온톨로지"@ko ;
    owl:versionInfo "1.0" .
```

### Step 2: RDFS 클래스 계층

```turtle
# 최상위 클래스
:LibraryResource a owl:Class ;
    rdfs:label "도서관 자원"@ko .

# 자료 유형
:Book a owl:Class ;
    rdfs:subClassOf :LibraryResource ;
    rdfs:label "책"@ko .

:Magazine a owl:Class ;
    rdfs:subClassOf :LibraryResource ;
    rdfs:label "잡지"@ko .

:DVD a owl:Class ;
    rdfs:subClassOf :LibraryResource ;
    rdfs:label "DVD"@ko .

# 사람
:Person a owl:Class ;
    rdfs:label "사람"@ko .

:Author a owl:Class ;
    rdfs:subClassOf :Person ;
    rdfs:label "저자"@ko .

:Member a owl:Class ;
    rdfs:subClassOf :Person ;
    rdfs:label "회원"@ko .

:Librarian a owl:Class ;
    rdfs:subClassOf :Person ;
    rdfs:label "사서"@ko .

# 장르
:Genre a owl:Class ;
    rdfs:label "장르"@ko .

:Fiction a owl:Class ;
    rdfs:subClassOf :Genre .

:NonFiction a owl:Class ;
    rdfs:subClassOf :Genre .
```

### Step 3: RDFS 프로퍼티

```turtle
# 저작 관계
:writtenBy a rdf:Property ;
    rdfs:label "저자"@ko ;
    rdfs:domain :Book ;
    rdfs:range :Author .

# 대출 관계
:borrowedBy a rdf:Property ;
    rdfs:label "대출자"@ko ;
    rdfs:domain :LibraryResource ;
    rdfs:range :Member .

# 속성
:title a rdf:Property ;
    rdfs:label "제목"@ko ;
    rdfs:domain :LibraryResource ;
    rdfs:range xsd:string .

:isbn a rdf:Property ;
    rdfs:label "ISBN"@ko ;
    rdfs:domain :Book ;
    rdfs:range xsd:string .

:publicationYear a rdf:Property ;
    rdfs:label "출판년도"@ko ;
    rdfs:domain :LibraryResource ;
    rdfs:range xsd:gYear .
```

### Step 4: OWL 프로퍼티 특성

```turtle
# ISBN은 책을 유일하게 식별
:isbn a owl:InverseFunctionalProperty .

# 저작 관계의 역
:wrote a rdf:Property ;
    owl:inverseOf :writtenBy .

# 공동 저자 관계는 대칭적
:coAuthorWith a owl:SymmetricProperty ;
    rdfs:domain :Author ;
    rdfs:range :Author .
```

### Step 5: OWL Class Expression

```turtle
# "소설책"
:FictionBook owl:equivalentClass [
    owl:intersectionOf (
        :Book
        [ owl:onProperty :hasGenre ;
          owl:someValuesFrom :Fiction ]
    )
] .

# "베스트셀러" = 100권 이상 대출
:Bestseller owl:equivalentClass [
    owl:intersectionOf (
        :Book
        [ owl:onProperty :borrowedBy ;
          owl:minCardinality 100 ]
    )
] .

# "전자책이 아닌 책"
:PhysicalBook owl:equivalentClass [
    owl:intersectionOf (
        :Book
        [ owl:complementOf :EBook ]
    )
] .
```

### Step 6: OWL Restrictions

```turtle
# 모든 책은 최소 1명의 저자
:Book rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :writtenBy ;
    owl:minCardinality 1
] .

# 잡지는 정확히 1개의 ISSN
:Magazine rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :issn ;
    owl:cardinality 1
] .

# 회원은 최대 5권까지 대출 가능
:Member rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :borrows ;
    owl:maxCardinality 5
] .

# 사서는 도서관에 소속
:Librarian rdfs:subClassOf [
    a owl:Restriction ;
    owl:onProperty :worksAt ;
    owl:someValuesFrom :Library
] .
```

### Step 7: 실제 데이터

```turtle
# 저자들
lib:김영하 a :Author ;
    rdfs:label "김영하" ;
    :coAuthorWith lib:황석영 .

lib:황석영 a :Author ;
    rdfs:label "황석영" .

# 책들
lib:빛의제국 a :Book , :FictionBook ;
    :title "빛의 제국" ;
    :writtenBy lib:김영하 ;
    :isbn "978-89-546-9012-3" ;
    :publicationYear "2006"^^xsd:gYear ;
    :hasGenre :Fiction .

lib:개밥바라기별 a :Book ;
    :title "개밥바라기별" ;
    :writtenBy lib:황석영 ;
    :isbn "978-89-470-0123-4" ;
    :publicationYear "2000"^^xsd:gYear .

# 회원
lib:홍길동 a :Member ;
    rdfs:label "홍길동" ;
    :borrows lib:빛의제국 .
```

### Step 8: 추론 확인

**추론 1: 역관계**
```turtle
# 명시:
lib:빛의제국 :writtenBy lib:김영하 .

# 추론:
lib:김영하 :wrote lib:빛의제국 .
```

**추론 2: 대칭**
```turtle
# 명시:
lib:김영하 :coAuthorWith lib:황석영 .

# 추론:
lib:황석영 :coAuthorWith lib:김영하 .
```

**추론 3: 계층**
```turtle
# 명시:
lib:홍길동 a :Member .

# 추론:
lib:홍길동 a :Person .
lib:홍길동 a rdfs:Resource .
```

**추론 4: Class Expression**
```turtle
# 명시:
lib:빛의제국 a :Book ;
    :hasGenre :Fiction .

# 추론:
lib:빛의제국 a :FictionBook .
```

### Step 9: 불일치 탐지

```turtle
# 제약 위반 1
lib:김철수 a :Member ;
    :borrows lib:책1 , lib:책2 , lib:책3 ,
             lib:책4 , lib:책5 , lib:책6 .
# ❌ 오류: 최대 5권까지!

# 제약 위반 2
lib:고아책 a :Book .
# (writtenBy 없음)
# ❌ 오류: 모든 책은 최소 1명의 저자!

# 제약 위반 3
lib:잡지1 a :Magazine ;
    :issn "1234-5678" ;
    :issn "8765-4321" .
# ❌ 오류: ISSN은 정확히 1개!
```

---

## 10. RDFS vs OWL 선택 가이드

### 의사결정 플로우차트

```
시작
 ↓
간단한 계층만 필요? ─YES→ RDFS
 ↓ NO
복잡한 제약 필요? ─NO→ RDFS
 ↓ YES
대규모 데이터? ─YES→ OWL EL 또는 QL
 ↓ NO
규칙 기반? ─YES→ OWL RL
 ↓ NO
OWL DL (또는 Full)
```

### 상황별 권장사항

| 상황 | 권장 | 이유 |
|------|------|------|
| 소규모 어휘 정의 | RDFS | 간단, 빠름 |
| 대규모 계층 (의료) | OWL EL | 다항 시간 추론 |
| DB 쿼리 중심 (금융) | OWL QL | SQL 변환 |
| IoT/실시간 (제조) | OWL RL | 규칙 엔진 |
| 복잡한 논리 | OWL DL | 표현력 + 결정가능 |
| 학술 연구 | OWL Full | 최대 표현력 |

### 기능 비교표

| 기능 | RDFS | OWL EL | OWL QL | OWL RL | OWL Full |
|------|------|--------|--------|--------|----------|
| subClassOf | ✅ | ✅ | ✅ | ✅ | ✅ |
| subPropertyOf | ✅ | ✅ | ✅ | ✅ | ✅ |
| domain/range | ✅ | ✅ | ✅ | ✅ | ✅ |
| equivalentClass | ❌ | ✅ | ✅ | ✅ | ✅ |
| disjointWith | ❌ | ❌ | ✅ | ✅ | ✅ |
| someValuesFrom | ❌ | ✅ | ❌ | ✅ | ✅ |
| allValuesFrom | ❌ | ❌ | ❌ | ✅ | ✅ |
| cardinality | ❌ | ❌ | ❌ | 제한적 | ✅ |
| Transitive | ❌ | ✅ | ❌ | ✅ | ✅ |
| Symmetric | ❌ | ❌ | ✅ | ✅ | ✅ |
| Functional | ❌ | ❌ | ✅ | ✅ | ✅ |

### 실전 예제

**시나리오 1: 회사 조직도**
```
요구사항:
- 부서 계층 (개발팀 < 기술본부 < 회사)
- 직급 계층 (사원 < 대리 < 과장)
- 간단한 관계 (belongs_to, reports_to)

→ RDFS 추천
이유: 계층 표현만으로 충분
```

**시나리오 2: 의료 온톨로지**
```
요구사항:
- 350,000+ 질병 개념
- 복잡한 계층 (폐렴 < 폐질환 < 호흡기질환)
- "특정 증상이 있는" 표현 필요
- 빠른 추론

→ OWL EL 추천
이유: SNOMED CT가 사용하는 표준
```

**시나리오 3: 금융 시스템**
```
요구사항:
- 수백만 트랜잭션
- SPARQL 쿼리 성능 중요
- SQL DB 통합
- 단순한 온톨로지

→ OWL QL 추천
이유: DB 쿼리 최적화
```

**시나리오 4: 스마트 팩토리**
```
요구사항:
- IoT 센서 데이터
- 실시간 추론
- 규칙 기반 알림
- 제약 검증

→ OWL RL 추천
이유: 규칙 엔진과 통합 용이
```

---

## 11. 요약과 다음 단계

### 핵심 정리

**1. RDFS (RDF Schema)**
- RDF에 의미 추가
- 11가지 추론 규칙
- 클래스/프로퍼티 계층
- 단순하지만 제한적

**2. OWL (Web Ontology Language)**
- RDFS의 한계 극복
- 4가지 프로파일 (EL, QL, RL, Full)
- 복잡한 표현력
- 자동 추론과 불일치 탐지

**3. Class Expression**
- Intersection (⊓): AND
- Union (⊔): OR
- Complement (¬): NOT
- Enumeration: 열거

**4. Property 특성**
- Transitive: 전이적
- Symmetric: 대칭적
- Functional: 함수적
- Inverse: 역관계

**5. Restrictions**
- someValuesFrom: ∃ (존재)
- allValuesFrom: ∀ (전체)
- Cardinality: 개수 제약

**6. 선택 가이드**
- 간단한 계층 → RDFS
- 대규모 계층 → OWL EL
- DB 쿼리 → OWL QL
- 규칙 기반 → OWL RL

### 실전 체크리스트

**온톨로지 설계 시:**
- [ ] 도메인 복잡도 평가
- [ ] 추론 요구사항 확인
- [ ] 데이터 규모 고려
- [ ] 성능 요구사항 파악
- [ ] RDFS vs OWL 선택
- [ ] OWL 프로파일 결정

**RDF Triple Editor 사용 시:**
- [ ] 네임스페이스 선언
- [ ] 클래스 계층 정의
- [ ] 프로퍼티 특성 명시
- [ ] Restrictions 추가
- [ ] 샘플 데이터로 검증
- [ ] 추론 결과 확인

### 다음 챕터

**Chapter 4: SPARQL 쿼리 언어**

온톨로지에서 **지식을 꺼내옵니다**:
- SELECT, CONSTRUCT, ASK, DESCRIBE
- FILTER, OPTIONAL, UNION
- Property Paths
- Aggregation (COUNT, AVG, GROUP BY)
- **SPARQL Playground로 실습!**

---

## 📝 연습 문제

### 문제 1: RDFS 추론

다음 온톨로지가 주어졌을 때, 추론되는 사실을 모두 쓰세요:

```turtle
:CEO rdfs:subClassOf :Employee .
:Employee rdfs:subClassOf :Person .

:manages rdfs:domain :CEO ;
    rdfs:range :Department .

:홍길동 a :CEO ;
    :manages :개발팀 .
```

**정답:**
```turtle
# rdfs11: subClassOf 전이성
:CEO rdfs:subClassOf :Person .

# rdfs9: subClassOf 적용
:홍길동 a :Employee .
:홍길동 a :Person .

# rdfs3: range 추론
:개발팀 a :Department .

# rdfs4: Resource 추론
:홍길동 a rdfs:Resource .
:개발팀 a rdfs:Resource .
```

### 문제 2: OWL Class Expression

"박사 학위를 가진 교수이면서, 최소 2개의 대학원 과목을 가르치는 사람"을 OWL로 표현하세요.

**정답:**
```turtle
:QualifiedProfessor owl:equivalentClass [
    owl:intersectionOf (
        :Professor
        [ owl:onProperty :hasDegree ;
          owl:hasValue :PhD ]
        [ owl:onProperty :teaches ;
          owl:minQualifiedCardinality 2 ;
          owl:onClass :GraduateCourse ]
    )
] .
```

### 문제 3: Property 특성

다음 프로퍼티에 적절한 OWL 특성을 추가하세요:

```turtle
:friendOf ...      # 친구 관계
:parentOf ...      # 부모 관계
:partOf ...        # 부분 관계
:hasEmail ...      # 이메일 (사람 식별용)
```

**정답:**
```turtle
:friendOf a owl:SymmetricProperty .
:parentOf a owl:AsymmetricProperty ,
           owl:IrreflexiveProperty .
:partOf a owl:TransitiveProperty .
:hasEmail a owl:InverseFunctionalProperty .
```

---

## 🔗 참고 자료

### W3C 표준
1. RDFS 1.1: https://www.w3.org/TR/rdf-schema/
2. OWL 2 Primer: https://www.w3.org/TR/owl2-primer/
3. OWL 2 Profiles: https://www.w3.org/TR/owl2-profiles/

### 도구
1. Protégé: https://protege.stanford.edu/
2. OWL Validator: https://www.w3.org/2007/OWL/validator
3. HermiT Reasoner: http://www.hermit-reasoner.com/

### 실무 온톨로지
1. SNOMED CT (의료 - OWL EL): https://www.snomed.org/
2. FIBO (금융 - OWL QL): https://spec.edmcouncil.org/fibo/
3. GoodRelations (전자상거래): http://www.heppnetz.de/projects/goodrelations/

### 학습 자료
1. OWL Web Ontology Language Guide: https://www.w3.org/TR/owl-guide/
2. Description Logic: https://dl.kr.org/

---

**다음:** [Chapter 4: SPARQL 쿼리 언어](./chapter-04.md)

**작성자:** jeromwolf (데이터공작소 TFT)  
**작성일:** 2025-11-09  
**버전:** 3.0 FINAL  
**단어 수:** 약 6,200단어
