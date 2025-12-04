# Forward Deployed Engineer (FDE) 종합 리서치

> **목적**: FDE Academy 커리큘럼 개발을 위한 체계적 자료 조사
>
> **작성일**: 2025-12-04
>
> **상태**: 리서치 완료

---

## 목차

1. [FDE 개념 및 역사](#1-fde-개념-및-역사)
2. [주요 기업별 FDE 채용 현황](#2-주요-기업별-fde-채용-현황)
3. [FDE 필수 기술 스택](#3-fde-필수-기술-스택)
4. [FDE 소프트 스킬](#4-fde-소프트-스킬)
5. [커리어 경로 및 연봉](#5-커리어-경로-및-연봉)
6. [교육 및 자격증 프로그램](#6-교육-및-자격증-프로그램)
7. [면접 준비](#7-면접-준비)
8. [성공 사례 및 인사이트](#8-성공-사례-및-인사이트)
9. [FDE의 하루](#9-fde의-하루)
10. [커리큘럼 시사점](#10-커리큘럼-시사점)

---

## 1. FDE 개념 및 역사

### 정의

> **Forward Deployed Engineer (FDE)** = 고객 현장에 "전방 배치"되어 기술 문제를 해결하는 소프트웨어 엔지니어

**핵심 특징:**
- 고객 팀과 핵심 제품 엔지니어링 팀 사이를 오가며 일함
- 엔지니어링 + 고객 대응 + 제품 개발의 하이브리드 역할
- 슬라이드 덱이 아닌 **코드를 배포**
- 청구 시간이 아닌 **성과로 측정**

**출처**: [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)

### 역사적 기원 (Palantir "Delta")

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FDE의 탄생 (2003-2010)                          │
├─────────────────────────────────────────────────────────────────────────┤
│  2003: Palantir 설립 (Peter Thiel + PayPal 동문)                        │
│  2004: 정보기관(CIA, NSA) 대상 소프트웨어 개발 시작                      │
│  2008: Palantir Gotham 출시 (국방/정보용)                               │
│  2010: 아프가니스탄 칸다하르 군사기지에 엔지니어 2명 배치                 │
│        → "Go there and win. Call if you need anything."                │
│  2011: 네이비씰 팀과 함께 작전 수행                                      │
│        → 빈 라덴 작전 지원 시스템 구축                                   │
│  2016: FDE 수가 일반 SWE보다 많았음                                     │
└─────────────────────────────────────────────────────────────────────────┘
```

**핵심 일화:**
- 2010년 여름, 한 엔지니어가 아프간 칸다하르 근처 군사기지에서 서버를 설치하고, 파키스탄 국경 근처 전초기지까지 야간 헬리콥터를 타고 이동
- 2011년 여름, 네이비씰 팀과 함께 작전 중 로켓 공격을 피하면서 데이터 통합 작업 수행
- Palantir 내부 철학: **"현장 팀에 대한 급진적 존중(Radical deference to teams in the field)"**

**출처**: [Bloomberg - Palantir](https://www.bloomberg.com/features/2018-palantir-peter-thiel/), [Per Aspera](https://www.peraspera.us/forward-deployed/)

### FDE의 진화 (2016-2025)

| 시기 | 특징 | 주요 변화 |
|------|------|----------|
| 2003-2015 | **국방 중심** | Palantir만의 고유 역할, 군사/정보기관 대상 |
| 2016-2020 | **기업 확산** | 상업 고객 확대, 금융/헬스케어로 진출 |
| 2021-2023 | **AI 전환** | LLM 등장, AI 배포 역할로 확장 |
| 2024-2025 | **폭발적 성장** | 채용 공고 **800%+ 증가**, "테크에서 가장 핫한 직업" |

**출처**: [FDE Playbook](https://www.forwarddeployedengineer.site/article), [Sundeep Teki](https://www.sundeepteki.org/blog/forwarded-deployed-engineer)

---

## 2. 주요 기업별 FDE 채용 현황

### 2.1 Palantir (원조)

**역할**: Forward Deployed Software Engineer (FDSE)

**요구사항:**
- 고객과 함께 일하며 가장 어려운 문제 해결
- 비즈니스 크리티컬 데이터와 최신 AI를 활용한 솔루션 설계
- 스타트업 CTO와 유사한 책임: 작은 팀, 엔드-투-엔드 실행

**특징:**
- 고객 현장 25% 이상 근무
- 신입도 채용 (1년 경력부터)
- Dev ↔ FDSE 간 이동 활발

**출처**: [Palantir Careers](https://jobs.lever.co/palantir/dab396d4-2f14-4796-aac0-0d82883dccf0)

---

### 2.2 OpenAI

**역할**: Forward Deployed Engineer

**요구사항:**
- 4년+ 소프트웨어 엔지니어링 경험, 고객 대면 역할 선호
- 풀스택 시스템 및 커스텀 데이터 파이프라인 설계/구축/배포
- 고객과 함께 임베드, 도메인 이해, 솔루션 공동 개발

**연봉**: $220,000 - $280,000 (+ 주식, 총 보상 $300K-$500K+)

**근무 형태:**
- SF/NYC 기반, 주 3일 출근
- 고객 현장 출장 최대 50%

**특별 포지션:**
- Forward Deployed Engineer, Gov (Washington DC) - 정부 기관 전담

**출처**: [OpenAI Careers](https://openai.com/careers/forward-deployed-engineer-sf/)

---

### 2.3 Anthropic

**역할**: Forward Deployed Engineer

**요구사항:**
- 4년+ 기술적 고객 대면 역할 경험 (FDE, 컨설팅, 창업 경험)
- LLM 프로덕션 경험: 프롬프트 엔지니어링, 에이전트 개발, 평가 프레임워크
- Python 필수, TypeScript/Java 권장

**특징:**
- PhD 불필요, ML 사전 경험 불필요
- 높은 협업 마인드, AI 안전에 대한 열정

**출처**: [Anthropic Careers](https://job-boards.greenhouse.io/anthropic/jobs/4985877008)

---

### 2.4 Databricks

**두 가지 트랙:**

#### (A) Forward Deployed Engineer (FDE)
- 풀스택 애플리케이션 및 솔루션 설계/구축
- Python, SQL, Java/Scala, JavaScript/TypeScript
- 백엔드, 프론트엔드, 시스템 통합 경험

#### (B) AI Engineer - FDE
- GenAI 애플리케이션 구축: RAG, 멀티 에이전트, Text2SQL, 파인튜닝
- HuggingFace, LangChain, DSPy 경험
- Databricks 플랫폼, Apache Spark 경험 우대

**출처**: [Databricks Careers](https://www.databricks.com/company/careers/professional-services-operations/forward-deployed-engineer-fde-8251122002)

---

### 2.5 Salesforce (1,000명 채용 계획)

**역할**: Agentforce Forward Deployed Engineer

**레벨:**
| 레벨 | 경험 | 역할 |
|------|------|------|
| Early Career | 신입 | 대졸 신입 대상 |
| Senior/Lead/Principal | 5년+ | 복잡한 AI 에이전트 배포 리드, 멘토링 |

**요구사항:**
- AI/LLM 기술: LangChain, LlamaIndex, 프롬프트 엔지니어링
- 데이터 플랫폼: Salesforce Data Cloud, Snowflake, Databricks
- 프로그래밍: JavaScript, Java, Python, Apex

**교육 프로그램:**
- **Ready in Six**: 6주 온보딩 프로그램 (기술 교육 + 현장 실습 + 캡스톤 프로젝트)
- **Trailhead**: 무료 학습 플랫폼, Agentblazer Legend 자격 취득 가능

**출처**: [Salesforce Careers](https://careers.salesforce.com/en/jobs/jr305198/ai-forward-deployed-engineer-seniorleadprincipal/), [Salesforce Blog](https://www.salesforce.com/blog/forward-deployed-engineer/?bc=OTH)

---

### 2.6 기타 주요 기업

| 기업 | FDE 채용 상태 | 특징 |
|------|-------------|------|
| **Google DeepMind** | 채용 중 | AI 배포 전문 |
| **ElevenLabs** | 채용 중 | 음성 AI |
| **Ramp** | 활발 | 16명 팀, 7명이 전직 창업자 |
| **Postman** | 채용 중 | API 플랫폼 |
| **Intercom** | 채용 중 | Fin AI 에이전트 배포 |

---

## 3. FDE 필수 기술 스택

### 3.1 프로그래밍 언어

| 언어 | 중요도 | 용도 |
|------|--------|------|
| **Python** | 필수 | 데이터 처리, ML, 자동화 |
| **SQL** | 필수 | 데이터 쿼리, 분석 |
| **JavaScript/TypeScript** | 높음 | 풀스택 개발, 프론트엔드 |
| **Java/Scala** | 높음 | 백엔드, Spark |

### 3.2 데이터 엔지니어링

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        데이터 엔지니어링 스택                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                 │
│  │   수집      │ →  │   처리      │ →  │   저장      │                 │
│  │ Kafka      │    │ Spark      │    │ Snowflake  │                 │
│  │ Airflow    │    │ PySpark    │    │ BigQuery   │                 │
│  │ ETL        │    │ dbt        │    │ Redshift   │                 │
│  └─────────────┘    └─────────────┘    └─────────────┘                 │
│                                                                         │
│  핵심 기술:                                                             │
│  • Apache Spark: 분산 데이터 처리 (Palantir Foundry, Databricks 핵심)   │
│  • Apache Kafka: 실시간 스트리밍                                        │
│  • Apache Airflow: 워크플로우 오케스트레이션 (DAG)                       │
│  • ETL/ELT: 데이터 파이프라인 설계                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**출처**: [Palantir Learn](https://learn.palantir.com/page/training-track-data-engineer), [Coursera ETL](https://www.coursera.org/learn/etl-and-data-pipelines-shell-airflow-kafka)

### 3.3 클라우드 & 인프라

| 영역 | 기술 | 중요도 |
|------|------|--------|
| **클라우드 플랫폼** | AWS, Azure, GCP | 필수 |
| **컨테이너** | Docker | 필수 |
| **오케스트레이션** | Kubernetes | 높음 |
| **IaC** | Terraform, CloudFormation | 높음 |

### 3.4 AI/ML

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         AI/ML 스택 (2024-2025)                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  GenAI 애플리케이션:                                                    │
│  • RAG (Retrieval Augmented Generation)                                │
│  • 멀티 에이전트 시스템                                                 │
│  • Text2SQL                                                            │
│  • 파인튜닝                                                             │
│                                                                         │
│  도구/프레임워크:                                                       │
│  • LangChain, LlamaIndex, DSPy                                         │
│  • HuggingFace                                                         │
│  • OpenAI API, Anthropic API                                           │
│                                                                         │
│  기초 ML:                                                              │
│  • pandas, scikit-learn, PyTorch                                       │
│  • 모델 배포 및 최적화                                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**출처**: [Databricks AI FDE](https://www.databricks.com/company/careers/professional-services-operations/ai-engineer---fde-forward-deployed-engineer-8024010002)

### 3.5 데이터베이스

| 유형 | 기술 | 용도 |
|------|------|------|
| **관계형** | PostgreSQL, MySQL | 구조화된 데이터 |
| **NoSQL** | MongoDB, Cassandra | 비정형 데이터 |
| **그래프** | Neo4j | 지식 그래프 |
| **벡터** | Pinecone, Chroma | RAG 시스템 |

### 3.6 온톨로지 & 지식 그래프 (Palantir 특화)

```
Palantir Foundry 핵심:
• Object Types: 온톨로지 정의
• Pipeline Builder: 데이터 파이프라인
• Ontology Manager: 관계 정의
• SPARQL-like 쿼리
```

---

## 4. FDE 소프트 스킬

### 4.1 핵심 소프트 스킬 5가지

| 순위 | 스킬 | 설명 | 출처 |
|------|------|------|------|
| 1 | **문제 해결력** | "FDE에게 가장 필요한 스킬 #1" - 기술적 권위로 문제 파악 및 해결 | [Salesforce](https://www.salesforce.com/blog/forward-deployed-engineer/) |
| 2 | **커뮤니케이션** | 기술/비기술 이해관계자 모두와 명확한 소통 | [10Clouds](https://10clouds.com/blog/a-i/what-is-a-forward-deployed-engineer/) |
| 3 | **비즈니스 이해력** | 고객 요청의 "왜"를 파악, 요청한 솔루션이 아닌 올바른 솔루션 제공 | [Salesforce](https://www.salesforce.com/blog/forward-deployed-engineer/) |
| 4 | **적응력** | 모호함, 변화하는 문제, 우선순위 전환에 대응 | [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers) |
| 5 | **오너십** | 엔드-투-엔드 책임, 가드레일 내 방향 설정 | [Ramp](https://builders.ramp.com/post/forward-deployed-engineering) |

### 4.2 FDE vs 일반 SWE 차별점

> "기술적 수준은 높지만, **차별화 요소는 소프트 스킬**이다. 많은 엔지니어가 Python을 쓰고 모델을 배포할 수 있다. 하지만 몇 달마다 새로운 고객의 산업과 기술 스택에 적응하고, VP에게 왜 이렇게 해야 하는지 설명하고, 문제가 생겼을 때 전체 배포를 책임질 수 있는 사람은 훨씬 적다."

**출처**: [Hashnode](https://hashnode.com/blog/a-complete-guide-to-the-forward-deployed-engineer)

### 4.3 고객 대면 능력

```
FDE = 엔지니어 + 세일즈맨 + 고객 지원 + 모델 성능 엔지니어

"회사의 얼굴"로서:
• 신뢰할 수 있는 기술 파트너
• 비전문가에게 복잡한 시스템 설명
• VP 레벨과 기술적 이유 소통
```

---

## 5. 커리어 경로 및 연봉

### 5.1 커리어 경로

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FDE 커리어 경로                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Junior FDE → Senior FDE → Principal FDE                               │
│                    ↓              ↓                                     │
│              Tech Lead    →  VP of Solutions                           │
│                    ↓              ↓                                     │
│         Solutions Architect  →  창업                                    │
│                                                                         │
│  전환 가능 경로:                                                        │
│  • FDE → Product Manager                                               │
│  • FDE → Engineering Manager                                           │
│  • FDE → Technical Founder (Ramp FDE 16명 중 7명이 전직 창업자)         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 5.2 연봉 (미국 기준)

| 레벨 | 기본급 | 총 보상 (TC) | 출처 |
|------|--------|-------------|------|
| **신입 FDE** | $120K-$150K | $200K-$250K | [Levels.fyi](https://www.levels.fyi/companies/palantir/salaries/software-engineer/title/fdse) |
| **중급 FDE** | $150K-$200K | $250K-$350K | [Levels.fyi](https://www.levels.fyi/t/software-engineer/title/fdse) |
| **시니어 FDE** | $200K-$280K | $300K-$450K+ | [Hashnode](https://hashnode.com/blog/a-complete-guide-to-the-forward-deployed-engineer) |
| **최상위** | $280K+ | $600K+ | [Levels.fyi](https://www.levels.fyi/companies/palantir/salaries/software-engineer/title/fdse) |

**회사별:**
- **Palantir**: 중앙값 $200K, 최대 $365K+
- **OpenAI**: $220K-$280K (기본급), TC $300K-$500K+
- **Anthropic**: SW Engineer 기준 $550K-$700K+

### 5.3 연봉 (한국 기준 추정)

| 레벨 | 한국 기업 | 글로벌 기업 한국 지사 |
|------|----------|---------------------|
| 주니어 FDE | 7천만원 ~ 1억원 | 1억원 ~ 1.5억원 |
| 시니어 FDE | 1.2억원 ~ 2억원 | 2억원 ~ 4억원+ |

---

## 6. 교육 및 자격증 프로그램

### 6.1 Palantir 공식 자격증

| 자격증 | 내용 | URL |
|--------|------|-----|
| **Foundry Data Engineer** | 데이터 파이프라인, PySpark, Spark 최적화 | [Palantir Learn](https://learn.palantir.com/data-engineer-guide-2023) |
| **Foundry Application Developer** | 앱 개발, 온톨로지 활용 | [Palantir Learn](https://learn.palantir.com/) |
| **Foundry & AIP Builder Foundations** | 기초 배지, 퀴즈 통과 | [Palantir Learn](https://learn.palantir.com/) |

**무료 개발 환경**: [build.palantir.com](https://build.palantir.com) (신용카드 필요, 과금 없음)

### 6.2 Salesforce 교육

| 프로그램 | 내용 | 비용 |
|----------|------|------|
| **Trailhead** | Agentforce, Data Cloud 교육 | 무료 |
| **Agentblazer Legend** | 최고 레벨 자격 | 무료 |
| **Ready in Six** | 6주 온보딩 (기술 + 현장 + 캡스톤) | 입사 후 |

### 6.3 관련 산업 자격증

| 자격증 | 분야 | 준비 기간 | 비용 |
|--------|------|----------|------|
| **AWS SAA** | 클라우드 | 2-3개월 | $150 |
| **AWS SAP** | 클라우드 (고급) | 3-4개월 | $300 |
| **CKA** | Kubernetes | 2-3개월 | $395 |
| **Databricks Certified** | 데이터 엔지니어링 | 2-3개월 | $200 |
| **Terraform Associate** | IaC | 1-2개월 | $70 |

### 6.4 온라인 학습 리소스

| 리소스 | 내용 | URL |
|--------|------|-----|
| **IBM Data Engineering** | ETL, Spark, Kafka, Airflow | [Coursera](https://www.coursera.org/professional-certificates/ibm-data-engineer) |
| **ETL with Airflow & Kafka** | 데이터 파이프라인 | [Coursera](https://www.coursera.org/learn/etl-and-data-pipelines-shell-airflow-kafka) |
| **Learn Data Engineering** | 3개월 집중 과정 | [Academy](https://learndataengineering.com/p/academy) |

---

## 7. 면접 준비

### 7.1 Palantir 면접 프로세스

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Palantir FDE 면접 프로세스                          │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1️⃣ 리크루터 콜 (30분)                                                  │
│     • 회사 지원 동기 (깊이 있게!)                                        │
│     • 문화 적합성 평가                                                   │
│     • ⚠️ 표면적 동기는 탈락 사유                                         │
│                                                                         │
│  2️⃣ 기술 폰 스크린 (1시간)                                              │
│     • 알고리즘/자료구조 (LeetCode Easy-Medium)                           │
│     • 최종 사용자 맥락의 문제                                            │
│     • 행동 질문 포함                                                    │
│                                                                         │
│  3️⃣ 온사이트 (3라운드)                                                  │
│     • 시스템 디자인                                                     │
│     • Decomposition (문제 분해)                                         │
│     • Learning Interview (새 개념 빠른 학습)                             │
│                                                                         │
│  4️⃣ 채용 매니저 인터뷰                                                   │
│     • 행동 질문                                                         │
│     • 추가 Decomposition                                                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 7.2 주요 면접 유형

| 유형 | 설명 | 준비 방법 |
|------|------|----------|
| **Decomposition** | 크고 모호한 실제 문제를 분해 | 화이트보드에 구조화, 협업 강조 |
| **Learning Interview** | 새 개념 실시간 학습 및 적용 | 빠른 적응력 연습, 멀티스레딩 등 |
| **Code Review/Debugging** | 500-1000줄 코드에서 버그 찾기 | 침착하게 전체 파악 후 분석 |
| **System Design** | 대규모 분산 시스템 설계 | DDIA 필독, 시스템 디자인 면접 책 |
| **Case Study** | 실제 비즈니스 문제 해결 | 가정 설명, 트레이드오프 분석 |

### 7.3 기술 주제

- **알고리즘**: Two Pointers, BFS, 고급 자료구조
- **복잡도 분석**: Big O 명확히 설명
- **분산 시스템**: 일관성, 가용성, 파티션 허용
- **데이터 모델링**: 스키마 설계, 인덱싱

### 7.4 행동 면접 (STAR)

```
S - Situation: 상황 설명
T - Task: 맡은 역할
A - Action: 구체적 행동
R - Result: 결과와 배운 점

준비할 스토리:
1. 기술적 어려움 극복
2. 팀 갈등 해결
3. 고객 대응 경험
4. 빠른 학습/적응
5. 리더십 발휘
```

**출처**: [Interviewing.io](https://interviewing.io/palantir-interview-questions), [AlgoCademy](https://algocademy.com/blog/mastering-palantir-interview-questions-a-comprehensive-guide/)

---

## 8. 성공 사례 및 인사이트

### 8.1 Het Trivedi - Baseten FDE

**배경:**
- 2024년 1월, AI 스타트업 Baseten에 FDE로 입사
- 기술 한파 시기에 취업

**성공 전략:**
1. 사이드 프로젝트로 GenAI 학습
2. 배운 내용을 **블로그로 공유**
3. Truss(LLM 배포 도구) 블로그 글이 공동창업자 눈에 띔
4. SF 오피스 방문 → 입사

**FDE 역할 인사이트:**
> "FDE는 엔지니어 + 세일즈맨 + 고객 지원 + 모델 성능 엔지니어를 합친 것"

> "엄청난 컨텍스트 스위칭이 있다. 일반 소프트웨어 직업처럼 한 프로젝트에 집중할 수 없다. 여러 PoC를 동시에 진행하면서 고객 지원 불도 끈다."

**출처**: [Medium - Het Trivedi](https://medium.com/@het.trivedi05/what-i-learned-as-a-forward-deployed-engineer-working-at-an-ai-startup-6046e0c7e1fe)

### 8.2 Ramp FDE 팀

**팀 구성:**
- 16명 FDE 중 **7명이 전직 창업자**
- 5년+ 경력 선호, 예외적 신입도 채용

**핵심 인사이트:**
> "최고의 FDE는 판단력이 있다 - 고객에게 진정으로 중요한 것이 무엇인지, 언제 파고들기를 멈춰야 하는지 알아내는 능력. '문제 해결'이 아니라 **'문제 발견'**이다."

**출처**: [Ramp Builders Blog](https://builders.ramp.com/post/forward-deployed-engineering)

### 8.3 Intercom의 FDE 팀 탄생

**계기:**
- Fin AI 에이전트 출시 후, R&D 팀과 직접 일한 고객이 훨씬 좋은 결과
- 엔지니어링/제품 팀과 직접 협업한 고객 → 더 빠르고 임팩트 있는 결과

**교훈:**
- FDE 팀의 가치는 **고객과 제품 팀 사이의 피드백 루프 단축**

---

## 9. FDE의 하루

### 9.1 일반적인 하루

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          FDE의 하루                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  🌅 오전: 고객 현장 (주 2-3일)                                          │
│     • 기술/비즈니스 이해관계자와 미팅                                    │
│     • 모니터링, 디버깅, 배포, 설정                                       │
│     • 사용자와 함께 앉아 실제 업무 방식 관찰                             │
│     • 실시간으로 문제점 파악 및 솔루션 코딩                              │
│                                                                         │
│  🌆 오후: 오피스/원격                                                    │
│     • 마이너 코드 수정                                                   │
│     • PR 리뷰                                                           │
│     • 고객 솔루션 조사/계획                                              │
│                                                                         │
│  🌙 저녁:                                                                │
│     • 내부 지원/제품 개발 팀과 소통                                      │
│     • 현장 인사이트를 제품 팀에 공유                                     │
│                                                                         │
│  다양한 업무:                                                           │
│     • 에이전트 인스트럭션 작성                                           │
│     • 프롬프트 실험                                                     │
│     • 까다로운 통합 작업                                                 │
│     • 제품 팀과 기능 논의                                                │
│     • 아키텍처 및 워크플로우 설계                                        │
│     • 초기 프로토타입 스트레스 테스트                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 9.2 고객 생애주기 전체 담당

```
Sales Funnel → Implementation → Rollout → Long-tail Support

FDE는 고객의 전체 여정을 함께함:
• 세일즈 단계의 PoC
• 구현 및 배포
• 롤아웃 지원
• 장기 기술 지원
```

**출처**: [Pragmatic Engineer](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers), [Invisible Blog](https://invisibletech.ai/blog/what-is-forward-deployed-engineering)

---

## 10. 커리큘럼 시사점

### 10.1 FDE Academy가 가르쳐야 할 것

| 영역 | 필수 내용 | 우선순위 |
|------|----------|----------|
| **프로그래밍** | Python, SQL, JavaScript/TypeScript | 🔴 필수 |
| **데이터 엔지니어링** | Spark, Kafka, Airflow, ETL | 🔴 필수 |
| **클라우드** | AWS/GCP, Docker, Kubernetes | 🔴 필수 |
| **AI/ML** | RAG, 에이전트, LangChain, 프롬프트 엔지니어링 | 🔴 필수 |
| **온톨로지** | RDF, SPARQL, 지식 그래프 | 🟡 높음 |
| **시스템 디자인** | 분산 시스템, 확장성 | 🟡 높음 |
| **소프트 스킬** | 커뮤니케이션, 문제 해결, 비즈니스 이해 | 🔴 필수 |
| **산업 도메인** | 금융(FIBO), 의료(FHIR), 국방 | 🟡 선택 |

### 10.2 차별화 포인트

기존 교육과 FDE Academy의 차이:

| 기존 교육 | FDE Academy |
|----------|-------------|
| 이론 중심 | **실전 프로젝트 중심** |
| 단일 기술 | **풀스택 + AI + 데이터** |
| 코딩만 | **코딩 + 고객 대면 + 비즈니스** |
| 혼자 학습 | **시뮬레이터 + 케이스 스터디** |
| 취업 준비 없음 | **면접 + 포트폴리오 + 커리어 코칭** |

### 10.3 타겟 수강생

1. **개발자 → FDE 전환 희망자** (1-3년 경력)
2. **데이터 엔지니어 → AI FDE 전환**
3. **컨설턴트 → 기술 역량 강화**
4. **신입 개발자 → FDE 직접 진입**

### 10.4 수료 후 목표

```
FDE Academy 수료 후:

✅ 기술 스택: Python, Spark, Kafka, K8s, RAG, LangChain
✅ 포트폴리오: 3개 프로젝트 (데이터 파이프라인, RAG, K8s 마이크로서비스)
✅ 자격증: AWS SAA, Palantir Foundry 또는 Databricks
✅ 면접 준비: Decomposition, System Design, STAR 스토리
✅ 연봉 목표: 한국 7천만원~1억원, 글로벌 $150K-$200K
```

---

## 참고 자료

### 핵심 아티클
- [Pragmatic Engineer - FDE](https://newsletter.pragmaticengineer.com/p/forward-deployed-engineers)
- [Hashnode - FDE Complete Guide](https://hashnode.com/blog/a-complete-guide-to-the-forward-deployed-engineer)
- [Sundeep Teki - FDE Ultimate Guide](https://www.sundeepteki.org/blog/forwarded-deployed-engineer)
- [Ramp - FDE Blog](https://builders.ramp.com/post/forward-deployed-engineering)
- [FDE Playbook](https://www.forwarddeployedengineer.site/)

### 채용 공고
- [OpenAI FDE](https://openai.com/careers/forward-deployed-engineer-sf/)
- [Anthropic FDE](https://job-boards.greenhouse.io/anthropic/jobs/4985877008)
- [Databricks FDE](https://www.databricks.com/company/careers/professional-services-operations/forward-deployed-engineer-fde-8251122002)
- [Salesforce FDE](https://careers.salesforce.com/en/jobs/jr305198/ai-forward-deployed-engineer-seniorleadprincipal/)

### 교육/자격증
- [Palantir Learn](https://learn.palantir.com/)
- [Salesforce Trailhead](https://trailhead.salesforce.com/)
- [Levels.fyi - FDE Salary](https://www.levels.fyi/companies/palantir/salaries/software-engineer/title/fdse)

---

**문서 작성**: 일론 (Claude)
**검토**: 켈리
**버전**: 1.0
**작성일**: 2025-12-04
