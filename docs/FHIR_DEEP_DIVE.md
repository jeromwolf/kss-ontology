# 🏥 FHIR (Fast Healthcare Interoperability Resources) 심층 분석

> **목적**: FDE 커리큘럼에 활용할 의료 데이터 표준 FHIR 완전 분석
>
> **최종 업데이트**: 2025-12-03

---

## 📋 목차

1. [FHIR 개요](#1-fhir-개요)
2. [리소스 구조](#2-리소스-구조)
3. [핵심 리소스 상세](#3-핵심-리소스-상세)
4. [용어 체계 (Terminology)](#4-용어-체계-terminology)
5. [RDF/OWL 표현](#5-rdfowl-표현)
6. [SMART on FHIR](#6-smart-on-fhir)
7. [실제 활용 사례](#7-실제-활용-사례)
8. [FDE 커리큘럼 시사점](#8-fde-커리큘럼-시사점)

---

## 1. FHIR 개요

### FHIR이란?

**FHIR (Fast Healthcare Interoperability Resources)**는 전자 건강 정보 교환을 위한 **글로벌 표준**입니다.

| 항목 | 내용 |
|------|------|
| **개발 주체** | HL7 International |
| **현재 버전** | R5 (157개 리소스), R6 개발 중 |
| **포맷** | JSON, XML, RDF (Turtle) |
| **API 방식** | RESTful API |
| **라이선스** | Creative Commons (무료) |

### FHIR vs 이전 표준

```
┌─────────────────────────────────────────────────────────────┐
│                    이전 HL7 표준의 문제                      │
├─────────────────────────────────────────────────────────────┤
│  • HL7 v2: 복잡한 파이프 구분 메시지                        │
│  • HL7 v3/CDA: XML 기반, 너무 복잡                          │
│  • 구현 비용 높음, 학습 곡선 가파름                         │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    FHIR의 혁신                               │
├─────────────────────────────────────────────────────────────┤
│  ✅ 현대 웹 기술 (REST, JSON, OAuth)                        │
│  ✅ 모듈식 리소스 설계                                      │
│  ✅ 확장 가능 (Extensions)                                  │
│  ✅ 구현 용이성 (80% 유즈케이스 커버)                       │
│  ✅ 오픈소스 생태계                                         │
└─────────────────────────────────────────────────────────────┘
```

### 글로벌 채택 현황

| 국가/기관 | 활용 |
|-----------|------|
| **미국** | 21st Century Cures Act - FHIR API 의무화 |
| **영국 NHS** | NHS Digital FHIR 표준 채택 |
| **호주** | My Health Record FHIR 통합 |
| **Apple** | Apple Health 앱 FHIR 지원 |
| **Google** | Google Cloud Healthcare API |
| **Microsoft** | Azure Health Data Services |

---

## 2. 리소스 구조

### FHIR 모듈 구조

```
┌─────────────────────────────────────────────────────────────┐
│                      FHIR Specification                     │
├─────────────────────────────────────────────────────────────┤
│  Foundation          │  기본 인프라, 데이터 타입            │
│  Implementer Support │  구현 지원                           │
│  Security & Privacy  │  보안, 개인정보                      │
│  Conformance         │  적합성, 프로파일                    │
│  Terminology         │  용어 체계                           │
│  Linked Data         │  RDF, 시맨틱 웹                      │
├─────────────────────────────────────────────────────────────┤
│  Administration      │  환자, 의료진, 조직                  │
│  Clinical            │  문제, 알레르기, 진료 과정           │
│  Medications         │  약물 관리, 예방접종                 │
│  Diagnostics         │  검사, 진단 보고서                   │
│  Financial           │  청구, 보험, 수가                    │
│  Workflow            │  요청, 이벤트, 정의                  │
└─────────────────────────────────────────────────────────────┘
```

### 리소스 카테고리 (157개 리소스)

| 카테고리 | 대표 리소스 | 설명 |
|----------|-------------|------|
| **Individuals** | Patient, Practitioner, RelatedPerson | 개인 정보 |
| **Entities** | Organization, Location, Device | 조직, 위치, 장비 |
| **Clinical** | Condition, Procedure, Observation | 임상 정보 |
| **Diagnostics** | DiagnosticReport, ImagingStudy | 진단 정보 |
| **Medications** | Medication, MedicationRequest | 약물 정보 |
| **Financial** | Claim, Coverage, Invoice | 청구/보험 |
| **Workflow** | Task, Appointment, Schedule | 업무 흐름 |

### 리소스 성숙도 수준 (FMM)

| 수준 | 의미 | 예시 |
|------|------|------|
| **FMM 0** | Draft | 초안 |
| **FMM 1** | Draft + 구현 테스트 | 일부 구현 |
| **FMM 2** | 2개 이상 구현 | 실사용 |
| **FMM 3** | 활발한 사용 | 검증됨 |
| **FMM 4** | 광범위 사용 | 안정적 |
| **FMM 5 (Normative)** | 표준화 완료 | Patient, Observation |

---

## 3. 핵심 리소스 상세

### Patient 리소스 (FMM 5 - Normative)

**목적**: 환자의 인구통계학적 및 행정 정보

```json
{
  "resourceType": "Patient",
  "id": "example-patient",
  "identifier": [{
    "use": "official",
    "type": {
      "coding": [{
        "system": "http://terminology.hl7.org/CodeSystem/v2-0203",
        "code": "MR"
      }]
    },
    "value": "12345"
  }],
  "active": true,
  "name": [{
    "use": "official",
    "family": "김",
    "given": ["철수"]
  }],
  "gender": "male",
  "birthDate": "1990-01-15",
  "address": [{
    "use": "home",
    "city": "서울",
    "country": "KR"
  }],
  "telecom": [{
    "system": "phone",
    "value": "010-1234-5678",
    "use": "mobile"
  }]
}
```

**핵심 요소**:
- `identifier`: 환자 식별자 (의료기록번호 등)
- `name`: 이름 (공식, 별명 등 구분)
- `gender`: 성별
- `birthDate`: 생년월일
- `address`: 주소
- `telecom`: 연락처

### Observation 리소스 (FMM 5 - Normative)

**목적**: 측정, 검사 결과, 평가

```json
{
  "resourceType": "Observation",
  "id": "blood-pressure",
  "status": "final",
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/observation-category",
      "code": "vital-signs",
      "display": "Vital Signs"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://loinc.org",
      "code": "85354-9",
      "display": "Blood pressure panel"
    }]
  },
  "subject": {
    "reference": "Patient/example-patient"
  },
  "effectiveDateTime": "2025-12-03T10:30:00+09:00",
  "component": [
    {
      "code": {
        "coding": [{
          "system": "http://loinc.org",
          "code": "8480-6",
          "display": "Systolic blood pressure"
        }]
      },
      "valueQuantity": {
        "value": 120,
        "unit": "mmHg",
        "system": "http://unitsofmeasure.org",
        "code": "mm[Hg]"
      }
    },
    {
      "code": {
        "coding": [{
          "system": "http://loinc.org",
          "code": "8462-4",
          "display": "Diastolic blood pressure"
        }]
      },
      "valueQuantity": {
        "value": 80,
        "unit": "mmHg"
      }
    }
  ]
}
```

**활용 범위**:
- 바이탈 사인 (혈압, 맥박, 체온)
- 검사 결과 (혈액 검사, 소변 검사)
- 임상 평가 (통증 점수, 정신 상태)
- 환자 보고 결과 (설문)

### Condition 리소스

**목적**: 진단, 문제, 건강 상태

```json
{
  "resourceType": "Condition",
  "id": "diabetes",
  "clinicalStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-clinical",
      "code": "active"
    }]
  },
  "verificationStatus": {
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-ver-status",
      "code": "confirmed"
    }]
  },
  "category": [{
    "coding": [{
      "system": "http://terminology.hl7.org/CodeSystem/condition-category",
      "code": "problem-list-item"
    }]
  }],
  "code": {
    "coding": [{
      "system": "http://snomed.info/sct",
      "code": "73211009",
      "display": "Diabetes mellitus"
    }]
  },
  "subject": {
    "reference": "Patient/example-patient"
  },
  "onsetDateTime": "2020-03-15"
}
```

### MedicationRequest 리소스

**목적**: 약물 처방

```json
{
  "resourceType": "MedicationRequest",
  "id": "metformin-prescription",
  "status": "active",
  "intent": "order",
  "medicationCodeableConcept": {
    "coding": [{
      "system": "http://www.nlm.nih.gov/research/umls/rxnorm",
      "code": "860975",
      "display": "Metformin 500 MG Oral Tablet"
    }]
  },
  "subject": {
    "reference": "Patient/example-patient"
  },
  "authoredOn": "2025-12-03",
  "dosageInstruction": [{
    "text": "1정씩 하루 2회 식후 복용",
    "timing": {
      "repeat": {
        "frequency": 2,
        "period": 1,
        "periodUnit": "d"
      }
    },
    "doseAndRate": [{
      "doseQuantity": {
        "value": 1,
        "unit": "tablet"
      }
    }]
  }]
}
```

---

## 4. 용어 체계 (Terminology)

### 주요 코드 시스템

| 코드 시스템 | 용도 | URL |
|-------------|------|-----|
| **SNOMED CT** | 임상 용어 전체 | http://snomed.info/sct |
| **LOINC** | 검사/관찰 항목 | http://loinc.org |
| **ICD-10** | 진단/질병 분류 | http://hl7.org/fhir/sid/icd-10 |
| **RxNorm** | 약물 | http://www.nlm.nih.gov/research/umls/rxnorm |
| **CPT** | 시술/수가 | http://www.ama-assn.org/go/cpt |

### FHIR 용어 리소스

```
┌─────────────────────────────────────────────────────────────┐
│                    CodeSystem                               │
│  코드 시스템 정의 (SNOMED, LOINC 등)                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ValueSet                                 │
│  코드 집합 정의 (특정 목적에 사용할 코드들)                 │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ConceptMap                               │
│  코드 간 매핑 (SNOMED CT → ICD-10)                          │
└─────────────────────────────────────────────────────────────┘
```

### Terminology Binding (용어 바인딩)

```
FHIR 리소스 요소 ←→ ValueSet ←→ CodeSystem

예시:
Observation.code → LOINC ValueSet → LOINC CodeSystem
Condition.code → SNOMED CT ValueSet → SNOMED CT
```

### NHS Terminology Server

영국 NHS는 FHIR 호환 용어 서버를 운영:
- SNOMED CT
- ICD-10
- dm+d (약물 사전)
- READ 코드 (레거시)

---

## 5. RDF/OWL 표현

### FHIR RDF의 목적

```
┌─────────────────────────────────────────────────────────────┐
│  FHIR RDF를 사용하면:                                       │
├─────────────────────────────────────────────────────────────┤
│  • 다른 RDF 데이터와 통합 가능                              │
│  • 시맨틱 추론 (Inference) 가능                             │
│  • SPARQL 쿼리 가능                                         │
│  • 데이터 검증 가능                                         │
│  • 표준 간 의미 공유                                        │
└─────────────────────────────────────────────────────────────┘
```

### FHIR OWL 온톨로지 파일

| 파일 | 용도 |
|------|------|
| **fhir.ttl** | 메인 FHIR 온톨로지 (Normative) |
| **w5.ttl** | 5W 매핑 (Who, What, When, Where, Why) |
| **rim.ttl** | HL7 v3 RIM 매핑 |

### Patient 리소스 RDF 표현 (Turtle)

```turtle
@prefix fhir: <http://hl7.org/fhir/> .
@prefix xsd: <http://www.w3.org/2001/XMLSchema#> .

<http://example.org/Patient/12345>
  a fhir:Patient ;
  fhir:Patient.identifier [
    fhir:Identifier.value [ fhir:value "12345" ]
  ] ;
  fhir:Patient.name [
    fhir:HumanName.family [ fhir:value "Kim" ] ;
    fhir:HumanName.given [ fhir:value "Chulsoo" ]
  ] ;
  fhir:Patient.gender [ fhir:value "male" ] ;
  fhir:Patient.birthDate [ fhir:value "1990-01-15"^^xsd:date ] .
```

### SNOMED CT + FHIR RDF 추론 예시

```
시나리오:
  DiagnosticReport에 "악성 신생물" SNOMED CT 코드가 있음

SNOMED CT 온톨로지:
  악성 신생물 → 암의 하위 클래스

OWL 추론 결과:
  해당 환자는 "암 환자" 클래스의 인스턴스로 추론됨
  → 암 관련 임상 결정 지원 시스템 트리거 가능
```

---

## 6. SMART on FHIR

### SMART on FHIR이란?

```
SMART = Substitutable Medical Applications, Reusable Technologies

┌─────────────────────────────────────────────────────────────┐
│                    SMART on FHIR 아키텍처                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│    ┌──────────┐      OAuth 2.0      ┌──────────┐           │
│    │   App    │ ←─────────────────→ │   EHR    │           │
│    │ (SMART)  │                     │ (FHIR)   │           │
│    └──────────┘                     └──────────┘           │
│         ↓                                ↓                  │
│    ┌──────────┐                    ┌──────────┐            │
│    │ 환자/의사 │                    │  환자    │            │
│    │   UI     │                    │  데이터  │            │
│    └──────────┘                    └──────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘

FHIR = 데이터 표준화
SMART = 데이터 접근 표준화 (보안)
```

### CDS Hooks (Clinical Decision Support)

```
┌─────────────────────────────────────────────────────────────┐
│                    CDS Hooks 워크플로우                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. 의사가 처방 화면 열기                                   │
│     ↓                                                       │
│  2. EHR이 CDS Hook 트리거 ("medication-prescribe")          │
│     ↓                                                       │
│  3. CDS 서비스가 환자 데이터 분석                          │
│     ↓                                                       │
│  4. "경고: 이 환자는 해당 약물에 알레르기가 있습니다"       │
│     ↓                                                       │
│  5. 의사가 처방 수정                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 규제 지원

- **21st Century Cures Act (미국)**: SMART API 의무화
- ONC 인증 EHR은 SMART on FHIR 지원 필수
- Medicare/Medicaid 참여 기관 적용

---

## 7. 실제 활용 사례

### 사례 1: NHS Digital (영국)

```
문제: 응급 상황에서 환자의 약물/알레르기 정보 필요

FHIR 솔루션:
┌─────────────────────────────────────────────────────────────┐
│  응급실 도착                                                │
│      ↓                                                      │
│  FHIR API로 GP(일반의) 시스템 조회                         │
│      ↓                                                      │
│  Patient, MedicationStatement, AllergyIntolerance 리소스    │
│      ↓                                                      │
│  병원 EMR에 자동 입력                                       │
│      ↓                                                      │
│  의사가 즉시 확인 후 치료 결정                             │
└─────────────────────────────────────────────────────────────┘
```

### 사례 2: Apple Health

```
iPhone 사용자 → Apple Health 앱 → FHIR API → 병원 EHR

지원 데이터:
• 알레르기
• 진단
• 예방접종
• 검사 결과
• 약물
• 시술
• 바이탈 사인
```

### 사례 3: 보험 청구 자동화 (Heals.Asia)

```
FHIR 리소스:
• Claim (청구서)
• Coverage (보험 계약)
• ExplanationOfBenefit (급여 설명)

자동 심사 엔진:
• 공제액 (Deductible) 확인
• 본인부담금 (Co-pay) 계산
• 급여 한도 확인
• 자동 지급 결정
```

### 사례 4: 임상 결정 지원 (CORSI)

```
문제: 오피오이드 과다 처방 방지

SMART on FHIR 앱:
1. 의사가 오피오이드 처방 시작
2. CDS Hook 트리거
3. PDMP (처방 모니터링 프로그램) 데이터 조회
4. 환자의 이전 오피오이드 처방 이력 분석
5. 위험 환자인 경우 경고 표시
6. 대안 약물 제안
```

### 사례 5: 연구용 데이터 수집

**112개 SMART on FHIR 앱 조사 결과** (JAMIA Open):
- 임상 진료: 74개
- 연구: 45개
- 다수 기관 구현: 56개

---

## 8. FDE 커리큘럼 시사점

### 학습 경로 제안

```
Level 1: 기초 (2주)
├── FHIR 개념 이해
├── 핵심 리소스 (Patient, Observation, Condition)
├── JSON/XML 포맷
└── REST API 기초

Level 2: 심화 (2주)
├── 전체 리소스 카테고리 이해
├── 용어 체계 (SNOMED CT, LOINC)
├── ValueSet, ConceptMap
└── Profiling & Extensions

Level 3: 시맨틱 (2주)
├── FHIR RDF 표현
├── OWL 온톨로지 활용
├── SPARQL 쿼리
└── 추론 엔진 활용

Level 4: 통합 (2주)
├── SMART on FHIR 개발
├── CDS Hooks 구현
├── Implementation Guide 작성
└── 실제 EHR 연동
```

### 시뮬레이터 아이디어

| 시뮬레이터 | 학습 목표 |
|------------|----------|
| **FHIR Resource Explorer** | 리소스 구조 시각적 탐색 |
| **Patient Journey Builder** | 환자 여정 모델링 |
| **Terminology Mapper** | SNOMED CT ↔ ICD-10 매핑 |
| **FHIR → RDF Converter** | 시맨틱 변환 체험 |
| **CDS Hook Simulator** | 임상 결정 지원 로직 |
| **SMART App Playground** | SMART on FHIR 앱 개발 |

### FIBO vs FHIR 비교

| 항목 | FIBO (금융) | FHIR (의료) |
|------|-------------|-------------|
| **언어** | OWL (순수 온톨로지) | JSON/XML + RDF 옵션 |
| **설계 철학** | 완전한 의미 정의 | 80% 유즈케이스 커버 |
| **확장성** | 클래스 상속 | Extensions 메커니즘 |
| **도구** | Protégé | FHIR 전용 도구 (HAPI, Firely) |
| **진입 장벽** | 높음 (OWL 전문성) | 낮음 (웹 개발자 친화적) |
| **채택 속도** | 점진적 | 빠름 (규제 지원) |

### 핵심 역량

```
FDE가 FHIR로 습득해야 할 역량:

1. 의료 도메인 지식
   - 의료 워크플로우 (진료, 처방, 청구)
   - 의료 용어 체계 (SNOMED CT, LOINC, ICD)
   - 의료 규제 (HIPAA, 21st Century Cures)

2. FHIR 기술
   - 리소스 모델링
   - Implementation Guide 작성
   - API 설계

3. 시맨틱 기술 (차별화)
   - RDF/OWL 이해
   - 추론 엔진 활용
   - 용어 매핑

4. 시스템 통합
   - EHR 연동
   - SMART on FHIR 앱 개발
   - 레거시 시스템 마이그레이션
```

---

## 📚 참고 자료

### 공식 자료

| 자료 | URL |
|------|-----|
| **FHIR 메인** | https://hl7.org/fhir/ |
| **FHIR R5** | https://hl7.org/fhir/R5/ |
| **FHIR RDF** | https://www.hl7.org/fhir/rdf.html |
| **SMART on FHIR** | https://docs.smarthealthit.org/ |
| **Implementation Guide Registry** | https://www.fhir.org/guides/registry/ |

### 용어 체계

| 자료 | URL |
|------|-----|
| **SNOMED CT Browser** | https://browser.ihtsdotools.org/ |
| **LOINC** | https://loinc.org/ |
| **RxNorm** | https://www.nlm.nih.gov/research/umls/rxnorm/ |

### 도구

| 도구 | 용도 |
|------|------|
| **HAPI FHIR** | Java FHIR 라이브러리 |
| **Firely SDK** | .NET FHIR 라이브러리 |
| **FHIR Shorthand (FSH)** | Profile 작성 도구 |
| **Simplifier.net** | FHIR 프로젝트 호스팅 |

### 학습 자료

| 자료 | URL |
|------|-----|
| **FHIR DevDays** | https://www.devdays.com/ |
| **FHIR for Research** | https://mitre.github.io/fhir-for-research/ |
| **Tutorial: FHIR RDF as a Bridge** | https://yosemiteproject.github.io/Tutorial-FHIR-RDF-as-a-Bridge/ |

---

**문서 작성**: 일론 (Claude)
**검토**: 켈리
**버전**: 1.0
