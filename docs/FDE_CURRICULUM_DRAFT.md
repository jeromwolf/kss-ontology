# 🎓 FDE Academy 커리큘럼 (DRAFT v0.2)

> **목적**: Forward Deployed Engineer 양성을 위한 체계적 교육 과정
>
> **타겟**: 개발 기초가 있는 분 → FDE 전환 희망자
>
> **예상 기간**: 12개월 (파트타임 기준)
>
> **최종 목표**: 연봉 7천만원~2억원+ FDE 포지션 취업
>
> **전제 조건**: Python 기초, SQL 기초, Git 사용 경험

---

## 📋 목차

1. [커리큘럼 개요](#1-커리큘럼-개요)
2. [Phase 1: 데이터 엔지니어링 기초](#2-phase-1-데이터-엔지니어링-기초-3개월)
3. [Phase 2: 온톨로지 & 지식 그래프](#3-phase-2-온톨로지--지식-그래프-2개월)
4. [Phase 3: 클라우드 & 인프라](#4-phase-3-클라우드--인프라-2개월)
5. [Phase 4: AI/ML & GenAI](#5-phase-4-aiml--genai-2개월)
6. [Phase 5: 산업별 심화](#6-phase-5-산업별-심화-2개월)
7. [Phase 6: 실전 프로젝트 & 취업](#7-phase-6-실전-프로젝트--취업-1개월)
8. [포트폴리오 프로젝트](#8-포트폴리오-프로젝트)
9. [자격증 로드맵](#9-자격증-로드맵)
10. [소프트 스킬 트레이닝](#10-소프트-스킬-트레이닝)
11. [면접 준비](#11-면접-준비)
12. [한국에서 FDE 경험 쌓기](#12-한국에서-fde-경험-쌓기)

---

## 1. 커리큘럼 개요

### 🎯 FDE란?

> **Forward Deployed Engineer** = 고객 현장에 "전방 배치"되어 기술 문제를 해결하는 엔지니어

**Palantir (2010년 아프가니스탄)에서 시작:**
- "Go there and win. Call if you need anything."
- 2025년 채용 공고 **800%+ 증가** (a16z: "테크에서 가장 핫한 직업")

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         FDE 핵심 역량 3가지                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  1. 기술력 (Technical Skills)                                           │
│     • 데이터 엔지니어링: Spark, Kafka, Airflow                          │
│     • 클라우드: AWS/GCP, Docker, Kubernetes                            │
│     • AI/ML: RAG, LangChain, 프롬프트 엔지니어링                        │
│     • 온톨로지: RDF, SPARQL, 지식 그래프                                │
│                                                                         │
│  2. 도메인 지식 (Domain Expertise)                                      │
│     • 금융 (FIBO), 의료 (FHIR), 국방 (BFO), 제조                        │
│                                                                         │
│  3. 소프트 스킬 (Soft Skills)                                           │
│     • 고객 대면 커뮤니케이션                                             │
│     • 비즈니스 문제 파악 및 정의                                         │
│     • 빠른 적응력, 오너십                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 📊 커리큘럼 구조 (12개월)

```
Phase 1 (3개월)         Phase 2 (2개월)         Phase 3 (2개월)
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│데이터 엔지니어링│  →   │  온톨로지 &  │   →   │  클라우드 &  │
│Spark/Kafka/  │       │  지식 그래프  │       │    인프라    │
│Airflow       │       │              │       │  K8s/Docker  │
└──────────────┘       └──────────────┘       └──────────────┘
       │                                              │
       ▼                                              ▼
Phase 4 (2개월)         Phase 5 (2개월)         Phase 6 (1개월)
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│  AI/ML &     │  →    │  산업별 심화  │   →   │ 실전 & 취업  │
│   GenAI      │       │(금융/의료/국방)│       │  포트폴리오  │
│ RAG/Agent    │       │              │       │    면접     │
└──────────────┘       └──────────────┘       └──────────────┘
```

### 📅 12개월 타임라인

| 월 | Phase | 핵심 내용 | 산출물 |
|----|-------|----------|--------|
| 1 | Phase 1 | Python 심화, pandas, SQL | 데이터 분석 노트북 |
| 2 | Phase 1 | Apache Spark, PySpark | Spark 파이프라인 |
| 3 | Phase 1 | Kafka, Airflow, ETL | E2E 데이터 파이프라인 |
| 4 | Phase 2 | RDF, SPARQL 기초 | 트리플 100개 작성 |
| 5 | Phase 2 | 지식 그래프, 추론 | KG 프로젝트 |
| 6 | Phase 3 | AWS 기초, 자격증 준비 | AWS SAA |
| 7 | Phase 3 | Docker, Kubernetes | K8s 배포 |
| 8 | Phase 4 | LLM 기초, 프롬프트 엔지니어링 | 프롬프트 라이브러리 |
| 9 | Phase 4 | RAG, LangChain, 에이전트 | RAG 애플리케이션 |
| 10 | Phase 5 | 산업별 심화 (택 1) | 도메인 온톨로지 |
| 11 | Phase 5 | 미니 프로젝트 | 산업별 솔루션 |
| 12 | Phase 6 | 포트폴리오, 면접 | **취업!** |

### 💰 목표 연봉

| 레벨 | 한국 기업 | 글로벌 기업 (한국) | 미국 |
|------|----------|------------------|------|
| 주니어 FDE | 7천만~1억 | 1억~1.5억 | $150K-$200K |
| 시니어 FDE | 1.2억~2억 | 2억~4억+ | $300K-$450K+ |

### 🚪 입학 전제 조건

```
필수:
✅ Python 기초 (변수, 함수, 클래스, 파일 I/O)
✅ SQL 기초 (SELECT, JOIN, GROUP BY)
✅ Git 기본 사용 (clone, commit, push, pull)
✅ 터미널/CLI 기본 사용

권장:
⭐ 웹 개발 경험 (프론트엔드 or 백엔드)
⭐ 1년+ 개발 경험
⭐ 영어 기술 문서 읽기 가능
```

---

## 2. Phase 1: 데이터 엔지니어링 기초 (3개월)

> **"Spark는 Palantir Foundry와 Databricks의 핵심이다"**
> — Palantir Learn

### 2.1 Month 1: Python 심화 & 데이터 처리

| 주차 | 주제 | 실습 | 도구 |
|------|------|------|------|
| 1 | Python 심화 | 제너레이터, 데코레이터, 컨텍스트 매니저 | Python 3.11+ |
| 2 | **pandas 심화** | 대용량 데이터 처리, 최적화 | pandas, polars |
| 3 | **SQL 심화** | 윈도우 함수, CTE, 쿼리 최적화 | PostgreSQL |
| 4 | 데이터 모델링 | 스키마 설계, 정규화, 인덱싱 | ERD 도구 |

**산출물:**
- [ ] pandas 데이터 분석 프로젝트 (공공데이터 활용)
- [ ] SQL 쿼리 50개 작성 (LeetCode SQL)
- [ ] 데이터 모델 설계 1개

**핵심 자료:**
- [Mode SQL Tutorial](https://mode.com/sql-tutorial/)
- [Pandas Documentation](https://pandas.pydata.org/docs/)

---

### 2.2 Month 2: Apache Spark & 분산 처리

| 주차 | 주제 | 실습 | 도구 |
|------|------|------|------|
| 5 | Spark 기초 | RDD, DataFrame, SparkSQL | PySpark |
| 6 | Spark 심화 | 파티셔닝, 캐싱, 최적화 | Spark UI |
| 7 | **Spark ML** | 피처 엔지니어링, MLlib | MLlib |
| 8 | Spark 실전 | 대용량 로그 분석 프로젝트 | Databricks Community |

**산출물:**
- [ ] PySpark 데이터 파이프라인 3개
- [ ] Spark ML 모델 1개
- [ ] Databricks 노트북 프로젝트

**핵심 자료:**
- [Databricks Academy (무료)](https://www.databricks.com/learn)
- [Spark: The Definitive Guide](https://www.oreilly.com/library/view/spark-the-definitive/9781491912201/)

---

### 2.3 Month 3: 실시간 스트리밍 & 워크플로우

| 주차 | 주제 | 실습 | 도구 |
|------|------|------|------|
| 9 | **Apache Kafka** | Producer, Consumer, Topics | Kafka, Docker |
| 10 | Kafka 심화 | Kafka Streams, Connect | Confluent |
| 11 | **Apache Airflow** | DAG 작성, 스케줄링 | Airflow, Astronomer |
| 12 | **E2E 파이프라인** | Kafka → Spark → Warehouse | 전체 통합 |

**산출물:**
- [ ] Kafka 스트리밍 파이프라인 1개
- [ ] Airflow DAG 5개
- [ ] **E2E 데이터 파이프라인 프로젝트** (포트폴리오 #1)

**핵심 자료:**
- [Confluent Kafka Tutorial](https://developer.confluent.io/tutorials/)
- [Airflow Documentation](https://airflow.apache.org/docs/)
- [Coursera: ETL with Airflow & Kafka](https://www.coursera.org/learn/etl-and-data-pipelines-shell-airflow-kafka)

---

### Phase 1 체크포인트

```
✅ Python 심화 (제너레이터, 데코레이터)
✅ pandas/SQL 대용량 데이터 처리
✅ Apache Spark (PySpark, SparkSQL, Spark ML)
✅ Apache Kafka (실시간 스트리밍)
✅ Apache Airflow (워크플로우 오케스트레이션)
✅ E2E 데이터 파이프라인 구축 경험

🎯 포트폴리오 프로젝트 #1: 엔드-투-엔드 데이터 파이프라인
```

---

## 3. Phase 2: 온톨로지 & 지식 그래프 (2개월)

> **KSS Ontology 기존 10개 챕터 활용**

### 3.1 Month 4: 온톨로지 기초

| 주차 | KSS 챕터 | 주제 | 시뮬레이터 |
|------|----------|------|-----------|
| 13 | Ch 1-2 | 온톨로지 개념, **RDF 트리플** | RDF Editor |
| 14 | Ch 3 | **RDFS, OWL** 스키마 정의 | Protégé |
| 15 | Ch 4 | **SPARQL** 쿼리 언어 | SPARQL Playground |
| 16 | 실습 | Wikidata, DBpedia 쿼리 | 라이브 엔드포인트 |

**산출물:**
- [ ] RDF 트리플 100개 작성
- [ ] SPARQL 쿼리 30개 작성
- [ ] Wikidata 쿼리 프로젝트

**핵심 자료:**
- [W3C RDF Primer](https://www.w3.org/TR/rdf11-primer/)
- [Wikidata SPARQL Tutorial](https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial)

---

### 3.2 Month 5: 지식 그래프 & 추론

| 주차 | KSS 챕터 | 주제 | 시뮬레이터 |
|------|----------|------|-----------|
| 17 | Ch 5 | **추론 엔진** (RDFS/OWL 규칙) | Reasoning Engine |
| 18 | Ch 6 | **지식 그래프 구축** | Knowledge Graph |
| 19 | Ch 7-8 | SOLID 원칙, 지식 추출 | - |
| 20 | 실습 | KG 프로젝트 (100+ 노드) | Neo4j, vis-network |

**산출물:**
- [ ] 추론 규칙 10개 작성
- [ ] **Knowledge Graph 프로젝트** (100+ 노드)
- [ ] Neo4j 또는 PostgreSQL 기반 Triple Store

**핵심 자료:**
- [Neo4j GraphAcademy (무료)](https://graphacademy.neo4j.com/)
- KSS Ontology 챕터 5-8

---

### Phase 2 체크포인트

```
✅ RDF 트리플 구조 이해 및 작성
✅ SPARQL 쿼리 능숙
✅ OWL 온톨로지 설계
✅ 추론 규칙 구현
✅ Knowledge Graph 구축

🎯 Palantir Foundry Ontology 이해를 위한 기반 완성
```

---

## 4. Phase 3: 클라우드 & 인프라 (2개월)

### 4.1 Month 6: AWS & 클라우드 기초

| 주차 | 주제 | 서비스 | 실습 |
|------|------|--------|------|
| 21 | 컴퓨팅 & 네트워킹 | EC2, VPC, IAM | 웹 서버 배포 |
| 22 | 스토리지 & 데이터베이스 | S3, RDS, DynamoDB | 데이터 레이크 구축 |
| 23 | 서버리스 | Lambda, API Gateway | 서버리스 API |
| 24 | IaC | **Terraform**, CloudFormation | 인프라 자동화 |

**산출물:**
- [ ] AWS 아키텍처 설계 3개
- [ ] Terraform 스크립트
- [ ] **AWS SAA 자격증 취득**

**핵심 자료:**
- [AWS Skill Builder (무료)](https://skillbuilder.aws/)
- [Terraform Tutorial](https://developer.hashicorp.com/terraform/tutorials)

---

### 4.2 Month 7: 컨테이너 & Kubernetes

| 주차 | 주제 | 도구 | 실습 |
|------|------|------|------|
| 25 | **Docker** 기초 | Docker, Compose | 컨테이너 빌드 |
| 26 | Docker 심화 | Multi-stage, 최적화 | 프로덕션 이미지 |
| 27 | **Kubernetes** 기초 | Minikube, kubectl | Pod, Service, Deployment |
| 28 | K8s 심화 & 배포 | EKS/GKE | 클러스터 배포 |

**산출물:**
- [ ] Docker 이미지 5개 빌드
- [ ] Kubernetes 매니페스트 (3-tier 앱)
- [ ] **EKS 클러스터 배포**

**핵심 자료:**
- [Docker 공식 Tutorial](https://docs.docker.com/get-started/)
- [Kubernetes 공식 Tutorial](https://kubernetes.io/docs/tutorials/)

---

### Phase 3 체크포인트

```
✅ AWS 핵심 서비스 (EC2, S3, RDS, Lambda)
✅ Terraform IaC
✅ Docker 컨테이너화
✅ Kubernetes 배포
✅ AWS SAA 자격증

🎯 클라우드 네이티브 애플리케이션 배포 역량
```

---

## 5. Phase 4: AI/ML & GenAI (2개월)

> **"2025년 FDE = AI 배포 전문가"**
> — OpenAI, Anthropic, Databricks 채용 공고

### 5.1 Month 8: LLM 기초 & 프롬프트 엔지니어링

| 주차 | 주제 | 도구 | 실습 |
|------|------|------|------|
| 29 | LLM 기초 | OpenAI API, Claude API | API 호출, 토큰 이해 |
| 30 | **프롬프트 엔지니어링** | 기법, 패턴, 최적화 | 프롬프트 라이브러리 |
| 31 | 임베딩 & 벡터 DB | OpenAI Embeddings | Pinecone, Chroma |
| 32 | 평가 & 테스트 | LLM 평가 프레임워크 | 품질 측정 |

**산출물:**
- [ ] 프롬프트 라이브러리 (20개 패턴)
- [ ] 임베딩 검색 시스템
- [ ] LLM 평가 파이프라인

**핵심 자료:**
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Anthropic Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)

---

### 5.2 Month 9: RAG & AI 에이전트

| 주차 | 주제 | 도구 | 실습 |
|------|------|------|------|
| 33 | **RAG 기초** | LangChain, LlamaIndex | 문서 검색 시스템 |
| 34 | RAG 심화 | 하이브리드 검색, 리랭킹 | 성능 최적화 |
| 35 | **AI 에이전트** | LangGraph, CrewAI | 멀티 에이전트 시스템 |
| 36 | **프로덕션 배포** | FastAPI, 모니터링 | RAG 서비스 배포 |

**산출물:**
- [ ] **RAG 애플리케이션** (포트폴리오 #2)
- [ ] 멀티 에이전트 시스템
- [ ] 프로덕션 배포 경험

**핵심 자료:**
- [LangChain Documentation](https://python.langchain.com/docs/)
- [LlamaIndex Documentation](https://docs.llamaindex.ai/)

---

### Phase 4 체크포인트

```
✅ LLM API 활용 (OpenAI, Claude)
✅ 프롬프트 엔지니어링 고급 기법
✅ 벡터 DB & 임베딩
✅ RAG 시스템 구축
✅ AI 에이전트 개발
✅ 프로덕션 배포

🎯 포트폴리오 프로젝트 #2: RAG 애플리케이션
```

---

## 6. Phase 5: 산업별 심화 (2개월)

> **1개 트랙 선택 집중** (나머지는 개요만)

### 6.1 금융 트랙 (FIBO)

| 주차 | 주제 | 실습 |
|------|------|------|
| 37-38 | FIBO 온톨로지 구조 | Protégé 로딩, 탐색 |
| 39-40 | 금융 도메인 모델링 | 증권, 파생상품, 대출 |
| 41-42 | 규제 컴플라이언스 | KYC/AML 온톨로지 |
| 43-44 | **미니 프로젝트** | 금융 지식그래프 + RAG |

**핵심 자료:**
- [FIBO GitHub](https://github.com/edmcouncil/fibo)
- [FIBO SPARQL Endpoint](https://spec.edmcouncil.org/fibo/sparql)

---

### 6.2 의료 트랙 (FHIR)

| 주차 | 주제 | 실습 |
|------|------|------|
| 37-38 | FHIR 리소스 구조 | Patient, Observation, Condition |
| 39-40 | FHIR RDF/OWL | 온톨로지 매핑 |
| 41-42 | SMART on FHIR | OAuth, CDS Hooks |
| 43-44 | **미니 프로젝트** | 의료 데이터 파이프라인 + AI |

**핵심 자료:**
- [FHIR RDF](https://www.hl7.org/fhir/rdf.html)
- [Synthea (합성 데이터)](https://synthea.mitre.org/)

---

### 6.3 국방/사이버보안 트랙 (BFO/ATT&CK)

| 주차 | 주제 | 실습 |
|------|------|------|
| 37-38 | BFO 상위 온톨로지 | 기본 개념, 구조 |
| 39-40 | MITRE ATT&CK | 사이버 위협 지식그래프 |
| 41-42 | C2 도메인 온톨로지 | 지휘통제 개념 |
| 43-44 | **미니 프로젝트** | 위협 분석 시스템 |

**핵심 자료:**
- [BFO](https://basic-formal-ontology.org/)
- [MITRE ATT&CK](https://attack.mitre.org/)

---

### Phase 5 체크포인트

```
✅ 1개 산업 도메인 심층 이해
✅ 산업 표준 온톨로지 활용
✅ 도메인 특화 솔루션 구축

🎯 포트폴리오 프로젝트 #3: 산업별 미니 프로젝트
```

---

## 7. Phase 6: 실전 프로젝트 & 취업 (1개월)

### 7.1 Week 45-46: 포트폴리오 마무리

**체크리스트:**
- [ ] 3개 프로젝트 GitHub 정리
- [ ] README 작성 (문제, 해결, 아키텍처, 결과)
- [ ] 아키텍처 다이어그램 추가
- [ ] 데모 영상 녹화 (각 3분)
- [ ] 기술 블로그 3개 작성

### 7.2 Week 47-48: 취업 준비

**체크리스트:**
- [ ] 이력서/LinkedIn 업데이트
- [ ] 시스템 디자인 면접 연습 (10개 주제)
- [ ] Decomposition 면접 연습
- [ ] STAR 기법 스토리 5개 준비
- [ ] 모의 면접 3회
- [ ] 타겟 기업 리스트 & 지원

---

## 8. 포트폴리오 프로젝트 (필수 3개)

### 📊 프로젝트 1: 엔드-투-엔드 데이터 파이프라인

```
공공데이터 API → Kafka → Spark → Data Warehouse → Dashboard
```

**기술 스택:** Python, Kafka, Spark, Airflow, BigQuery/Snowflake, Metabase

**구현 내용:**
- [ ] 실시간 데이터 수집 (Kafka Producer)
- [ ] 스트림 처리 (Spark Streaming)
- [ ] 배치 처리 (Spark, Airflow DAG)
- [ ] 데이터 웨어하우스 적재
- [ ] 대시보드 시각화

**평가 기준:**
- 확장성 있는 아키텍처
- 에러 핸들링 & 모니터링
- 문서화 품질

---

### 🤖 프로젝트 2: RAG 기반 AI 애플리케이션

```
문서 수집 → 청킹 → 임베딩 → 벡터 DB → LLM → 웹 UI
```

**기술 스택:** LangChain/LlamaIndex, OpenAI/Claude, Pinecone/Chroma, FastAPI, Streamlit

**구현 내용:**
- [ ] 문서 로더 & 청킹 전략
- [ ] 임베딩 & 벡터 DB 구축
- [ ] 하이브리드 검색 (키워드 + 시맨틱)
- [ ] RAG 파이프라인 & 프롬프트 최적화
- [ ] 웹 UI & API

**평가 기준:**
- 검색 정확도 (Recall, Precision)
- 응답 품질
- 프로덕션 준비도

---

### ☸️ 프로젝트 3: 산업별 미니 프로젝트 (택 1)

#### 금융: 금융 지식그래프 + AI 어시스턴트
```
FIBO 온톨로지 → Knowledge Graph → RAG → 금융 Q&A 봇
```

#### 의료: 의료 데이터 파이프라인 + 분석
```
Synthea 데이터 → FHIR 변환 → 분석 → 대시보드
```

#### 국방/보안: 위협 분석 시스템
```
ATT&CK 데이터 → Knowledge Graph → 위협 탐지 → 알림
```

---

## 9. 자격증 로드맵

### 필수 (1개 이상)

| 자격증 | 시기 | 난이도 | 비용 | 준비 자료 |
|--------|------|--------|------|----------|
| **AWS SAA** | Month 6 | ⭐⭐⭐ | $150 | AWS Skill Builder |
| **CKA** | Month 7 이후 | ⭐⭐⭐⭐ | $395 | Killer.sh |

### 권장

| 자격증 | 분야 | 시기 |
|--------|------|------|
| Databricks Data Engineer | 데이터 | Month 3 이후 |
| Terraform Associate | IaC | Month 6 이후 |
| Palantir Foundry Certified | 플랫폼 | 수료 후 |

---

## 10. 소프트 스킬 트레이닝

> **"기술적 수준은 높지만, 차별화 요소는 소프트 스킬이다"**

### 10.1 커뮤니케이션

**연습 방법:**
- [ ] 기술 블로그 작성 (월 2개)
- [ ] 스터디 그룹에서 발표 (주 1회)
- [ ] 비전문가에게 기술 설명 연습

### 10.2 문제 해결 & 비즈니스 이해

**연습 방법:**
- [ ] 케이스 스터디 분석 (Palantir, Databricks 사례)
- [ ] "왜?"를 5번 묻기 연습
- [ ] 비즈니스 뉴스 읽기 (금융/의료/제조)

### 10.3 고객 대면 시뮬레이션

**연습 방법:**
- [ ] 롤플레이: 고객 요구사항 인터뷰
- [ ] 롤플레이: 기술적 트레이드오프 설명
- [ ] 롤플레이: 프로젝트 상태 보고

---

## 11. 면접 준비

### 11.1 면접 유형

| 유형 | 설명 | 준비 방법 |
|------|------|----------|
| **Decomposition** | 큰 문제를 작게 분해 | 화이트보드 연습, 구조화 |
| **System Design** | 대규모 시스템 설계 | DDIA 책, 면접 책 |
| **Technical** | 코딩, 디버깅 | LeetCode Medium |
| **Behavioral** | STAR 기법 | 스토리 5개 준비 |
| **Case Study** | 비즈니스 문제 해결 | Palantir 스타일 연습 |

### 11.2 필독서

- **Designing Data-Intensive Applications (DDIA)**
- **System Design Interview** (Alex Xu)
- **Cracking the Coding Interview**

### 11.3 STAR 스토리 준비

```
S - Situation: 상황
T - Task: 역할
A - Action: 행동
R - Result: 결과

준비할 스토리:
1. 기술적 어려움 극복
2. 팀 협업/갈등 해결
3. 고객 대응 경험
4. 빠른 학습/적응
5. 리더십/오너십 발휘
```

---

## 12. 한국에서 FDE 경험 쌓기

### 12.1 5가지 경로

| 경로 | 회사 예시 | 특징 |
|------|----------|------|
| **테크니컬 컨설턴트** | AWS TAM/SA, 네이버 클라우드 | 고객 대면 + 기술 |
| **AI 솔루션 엔지니어** | 업스테이지, 루닛, 스캐터랩 | AI 배포 경험 |
| **프리랜서 DX** | 대기업 DX 프로젝트 | 다양한 도메인 |
| **플랫폼/인프라 팀** | 사내 고객 지원 | 고객 협업 연습 |
| **오픈소스 기여** | K8s, Airflow, LangChain | 글로벌 협업 |

### 12.2 네트워크 구축

- LinkedIn FDE 관련 그룹 참여
- 밋업/컨퍼런스 참석 (PyCon, K8s 밋업)
- 기술 블로그로 존재감 구축

---

## 📊 전체 커리큘럼 요약

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FDE Academy 12개월 커리큘럼                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Phase 1 (3개월): 데이터 엔지니어링                                      │
│  ├── Python 심화, pandas, SQL                                          │
│  ├── Apache Spark, PySpark                                             │
│  └── Kafka, Airflow, ETL → 🎯 포트폴리오 #1                            │
│                                                                         │
│  Phase 2 (2개월): 온톨로지 & 지식 그래프                                 │
│  ├── RDF, SPARQL, OWL                                                  │
│  └── Knowledge Graph 구축                                               │
│                                                                         │
│  Phase 3 (2개월): 클라우드 & 인프라                                      │
│  ├── AWS (SAA 자격증)                                                   │
│  └── Docker, Kubernetes                                                 │
│                                                                         │
│  Phase 4 (2개월): AI/ML & GenAI                                         │
│  ├── LLM, 프롬프트 엔지니어링                                            │
│  └── RAG, AI 에이전트 → 🎯 포트폴리오 #2                                │
│                                                                         │
│  Phase 5 (2개월): 산업별 심화                                            │
│  ├── 금융(FIBO) / 의료(FHIR) / 국방(BFO)                                │
│  └── 미니 프로젝트 → 🎯 포트폴리오 #3                                   │
│                                                                         │
│  Phase 6 (1개월): 실전 & 취업                                            │
│  ├── 포트폴리오 마무리                                                   │
│  └── 면접 준비 → 🎯 취업!                                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 버전 관리

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| v0.1 | 2025-12-04 | 초안 작성 |
| v0.2 | 2025-12-04 | 리서치 기반 재설계: 데이터 엔지니어링 추가, 개발 기초 전제조건화 |

---

## 📌 TODO (Fix 예정)

- [ ] 각 주차별 상세 학습 자료 링크
- [ ] 시뮬레이터 연동 구체화
- [ ] 평가 기준/체크포인트 상세화
- [ ] 커뮤니티/멘토링 구조 설계
- [ ] 유료/무료 구분 정책
- [ ] KSS 기존 10개 챕터 매핑 구체화

---

**작성**: 일론 (Claude)
**검토**: 켈리
**상태**: DRAFT v0.2 - 검토 필요
