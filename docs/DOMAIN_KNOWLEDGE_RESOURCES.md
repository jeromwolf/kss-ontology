# 🎓 FDE 도메인 지식 자료집

> **목적**: FDE 커리큘럼 개발에 필요한 도메인 지식 자료 수집 전략 및 리소스 목록
>
> **최종 업데이트**: 2025-12-03

---

## 📋 목차

1. [도메인 지식 수집 전략](#1-도메인-지식-수집-전략)
2. [온톨로지 기초 자료](#2-온톨로지-기초-자료)
3. [산업별 온톨로지 & 데이터셋](#3-산업별-온톨로지--데이터셋)
4. [Palantir Foundry 공식 자료](#4-palantir-foundry-공식-자료)
5. [Knowledge Graph 벤치마크](#5-knowledge-graph-벤치마크)
6. [SPARQL 학습 리소스](#6-sparql-학습-리소스)
7. [전문가 네트워크 구축 방안](#7-전문가-네트워크-구축-방안)
8. [실제 케이스 스터디 확보](#8-실제-케이스-스터디-확보)

---

## 1. 도메인 지식 수집 전략

### 핵심 원칙

```
┌─────────────────────────────────────────────────────────────┐
│                    "가짜는 절대 안돼"                        │
├─────────────────────────────────────────────────────────────┤
│  1. 실제 산업 표준 온톨로지 사용 (FHIR, FIBO 등)             │
│  2. 공식 문서/학술 논문 기반                                │
│  3. 오픈소스 데이터셋으로 실습 환경 구축                     │
│  4. 전문가 검증 거친 콘텐츠만 교육에 사용                    │
└─────────────────────────────────────────────────────────────┘
```

### 자료 수집 우선순위

| 순위 | 자료 유형 | 이유 |
|------|----------|------|
| 1 | **공식 표준 문서** | 정확성, 권위성 |
| 2 | **오픈소스 온톨로지** | 실습 가능, 무료 |
| 3 | **학술 논문** | 최신 연구, 검증됨 |
| 4 | **기업 케이스 스터디** | 실무 적용 사례 |
| 5 | **전문가 인터뷰** | 암묵지, 노하우 |

---

## 2. 온톨로지 기초 자료

### 온톨로지 편집 도구 (무료)

| 도구 | URL | 설명 |
|------|-----|------|
| **Protégé** | https://protege.stanford.edu/ | 스탠포드 대학 개발, OWL 편집기 표준 |
| **VocBench** | https://vocbench.uniroma2.it/ | 웹 기반 협업 온톨로지 개발 |
| **Fluent Editor** | https://www.cognitum.eu/semantics/fluenteditor/ | 자연어 기반 온톨로지 편집 |
| **WebVOWL** | http://vowl.visualdataweb.org/webvowl.html | 온톨로지 시각화 |

### 온톨로지 저장소

| 저장소 | URL | 설명 |
|--------|-----|------|
| **OBO Foundry** | https://obofoundry.org/ | 생명과학 온톨로지 허브 |
| **BioPortal** | https://bioportal.bioontology.org/ | 바이오의료 온톨로지 900+ |
| **LOV (Linked Open Vocabularies)** | https://lov.linkeddata.es/ | 일반 어휘/온톨로지 |
| **BARTOC** | https://bartoc.org/ | 시소러스, 온톨로지, 분류체계 |
| **DBpedia Archivo** | https://archivo.dbpedia.org/ | OWL 온톨로지 자동 인덱싱 |

### W3C 표준 문서

| 표준 | URL | 용도 |
|------|-----|------|
| **RDF 1.1** | https://www.w3.org/TR/rdf11-primer/ | 기초 데이터 모델 |
| **RDFS** | https://www.w3.org/TR/rdf-schema/ | 스키마 정의 |
| **OWL 2** | https://www.w3.org/TR/owl2-primer/ | 온톨로지 언어 |
| **SPARQL 1.1** | https://www.w3.org/TR/sparql11-query/ | 쿼리 언어 |
| **SHACL** | https://www.w3.org/TR/shacl/ | 데이터 검증 |

---

## 3. 산업별 온톨로지 & 데이터셋

### 🏥 헬스케어

| 자료 | URL | 형식 | 설명 |
|------|-----|------|------|
| **HL7 FHIR RDF** | https://www.hl7.org/fhir/rdf.html | RDF/OWL | 의료 데이터 교환 표준 |
| **FHIR OWL Ontology** | https://w3c.github.io/hcls-fhir-rdf/spec/ontology.html | OWL | W3C FHIR 온톨로지 |
| **SNOMED-CT** | https://browser.ihtsdotools.org/ | - | 의료 용어 체계 (유료) |
| **ICD-10/11** | https://icd.who.int/ | - | WHO 질병 분류 |
| **BioPortal - DOID** | https://bioportal.bioontology.org/ontologies/DOID | OWL | 질병 온톨로지 |

**실습 데이터셋**:
- MIMIC-III: 중환자실 데이터 (학술용, 승인 필요)
- Synthea: 합성 의료 데이터 (https://synthea.mitre.org/)

### 💰 금융

| 자료 | URL | 형식 | 설명 |
|------|-----|------|------|
| **FIBO (메인)** | https://spec.edmcouncil.org/fibo/ | OWL/RDF | 금융산업 표준 온톨로지 |
| **FIBO GitHub** | https://github.com/edmcouncil/fibo | OWL | 소스 코드 |
| **FIBO OWL 다운로드** | https://spec.edmcouncil.org/fibo/OWL | OWL | 직접 다운로드 |
| **FRO (규제)** | https://finregont.com/ | OWL | 금융 규제 온톨로지 |
| **FIBO 가이드** | https://github.com/edmcouncil/fibo/blob/master/ONTOLOGY_GUIDE.md | MD | 사용 가이드 |

**핵심 도메인**:
- FBC: Financial Business and Commerce
- FND: Foundations
- SEC: Securities
- BE: Business Entities
- LOAN: Loan

### 🧬 바이오/제약

| 자료 | URL | 형식 | 설명 |
|------|-----|------|------|
| **Gene Ontology** | https://geneontology.org/docs/download-ontology/ | OBO/OWL | 유전자 기능 온톨로지 |
| **GO (OBO Foundry)** | https://obofoundry.org/ontology/go.html | OBO | 간편 접근 |
| **PrimeKG** | https://zitniklab.hms.harvard.edu/projects/PrimeKG/ | - | 정밀의학 지식그래프 |
| **ChEBI** | https://www.ebi.ac.uk/chebi/ | OWL | 화학물질 온톨로지 |
| **DrugBank** | https://go.drugbank.com/ | - | 약물 데이터베이스 |

**벤치마크 데이터셋** (Oxford Academic):
- 21개 바이오의료 KG 벤치마크 데이터셋
- https://academic.oup.com/database/article/doi/10.1093/database/baaa078/5979744

### 🏭 제조/Industry 4.0

| 자료 | URL | 형식 | 설명 |
|------|-----|------|------|
| **DTBM** | Semantic Web Journal | - | 디지털 트윈 벤치마크 |
| **MASON** | http://www.intks.org/docs/mason | OWL | 제조 시맨틱 온톨로지 |
| **RAMI 4.0** | - | - | 참조 아키텍처 모델 |

**핵심 논문**:
- "Digital twin system for manufacturing processes based on a multi-layer knowledge graph model" (Nature Scientific Reports, 2024)
- "Ontology-Based Digital Twin Framework for Smart Factories" (ResearchGate, 2023)

### 🎖️ 국방

| 자료 | URL | 형식 | 설명 |
|------|-----|------|------|
| **BFO** | https://basic-formal-ontology.org/ | OWL | 상위 레벨 온톨로지 (DoD/NATO 표준) |
| **JC3IEDM** | NATO STANAG 5525 | - | C2 정보교환 모델 |
| **NIEM** | https://www.niem.gov/ | XML/JSON | 미국 정보교환 표준 |
| **C2 Ontology 논문** | ODU Digital Commons | OWL-DL | C2 도메인 온톨로지 연구 |

### 🔒 사이버보안

| 자료 | URL | 형식 | 설명 |
|------|-----|------|------|
| **MITRE ATT&CK** | https://attack.mitre.org/ | STIX/JSON | 위협 기법 지식베이스 |
| **D3FEND** | https://d3fend.mitre.org/ | - | 방어 기법 온톨로지 |
| **UCO** | https://unifiedcyberontology.org/ | OWL | 통합 사이버보안 온톨로지 |
| **ATT&CK-KG** | CEUR Workshop | - | 공격 기법 지식그래프 |

---

## 4. Palantir Foundry 공식 자료

### 공식 문서

| 자료 | URL | 설명 |
|------|-----|------|
| **Foundry 메인 문서** | https://www.palantir.com/docs/foundry | 전체 문서 |
| **Use Case 방법론** | https://www.palantir.com/docs/foundry/getting-started/delivering-a-use-case | 유즈케이스 설계 |
| **Vertex (What-If)** | https://www.palantir.com/docs/foundry/vertex/example-use-cases | 시뮬레이션 기능 |

### 산업별 케이스 스터디

| 산업 | URL | 핵심 내용 |
|------|-----|----------|
| **소비재/공급망** | https://www.palantir.com/docs/foundry/use-case-examples/optimizing-production-with-erp-data-across-the-supply-chain | 7개 ERP 통합, 디지털 트윈 |
| **금융서비스** | https://www.palantir.com/docs/foundry/use-case-examples/improving-retention-and-collection-performance-through-intelligent-repricing | ML 기반 수금 최적화 |

### 파트너 케이스 스터디

| 파트너 | URL | 프로젝트 수 |
|--------|-----|------------|
| **Unit8** | https://unit8.com/resources/palantir-foundry-case-studies-by-unit8/ | 65+ 프로젝트 |
| **Launch Consulting** | https://www.launchconsulting.com/case-studies/powering-change-with-palantir-foundry | 유틸리티 회사 |

### ROI 분석

- **Forrester TEI Study**: https://www.palantir.com/assets/xrfr7uokpv1b/7h0zi3GZrU3L7AM2HO1Q6O/1ad26eaa42ad949f8e3c80ea22f96b7a/The_Total_Economic_Impact_of_Palantir_Foundry.pdf
- 평균 30% 비용 절감

---

## 5. Knowledge Graph 벤치마크

### 범용 데이터셋

| 데이터셋 | URL | 설명 |
|----------|-----|------|
| **OGB** | https://ogb.stanford.edu/ | 그래프 ML 벤치마크 |
| **Papers With Code KG** | https://paperswithcode.com/datasets?task=knowledge-graphs | 46개 데이터셋 |
| **KG20C** | https://github.com/tranhungnghiep/KG20C | 학술 지식그래프 |
| **IntelliGraphs** | https://arxiv.org/abs/2307.06698 | KG 생성 벤치마크 |

### 바이오의료 특화

| 데이터셋 | URL | 설명 |
|----------|-----|------|
| **PrimeKG** | Zitnik Lab | 정밀의학 KG |
| **BioSNAP** | Stanford Network Analysis | 생물학적 네트워크 |
| **DRKG** | Amazon | 약물 재창출 KG |

### Awesome 리스트

- **awesome-knowledge-graph**: https://github.com/totogo/awesome-knowledge-graph
- **awesome-ontology**: https://github.com/ozekik/awesome-ontology
- **Awesome-GraphRAG**: https://github.com/DEEP-PolyU/Awesome-GraphRAG

---

## 6. SPARQL 학습 리소스

### 라이브 SPARQL 엔드포인트 (무료)

| 엔드포인트 | URL | 설명 |
|-----------|-----|------|
| **Wikidata Query** | https://query.wikidata.org/ | 가장 큰 오픈 KG |
| **DBpedia** | http://dbpedia.org/sparql | Wikipedia 지식그래프 |
| **UniProt** | https://sparql.uniprot.org/ | 단백질 데이터베이스 |
| **FIBO** | https://spec.edmcouncil.org/fibo/sparql | 금융 온톨로지 |

### 튜토리얼

| 자료 | URL | 설명 |
|------|-----|------|
| **Wikidata SPARQL Tutorial** | https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial | 공식 튜토리얼 |
| **Medium - Wikidata 입문** | https://jsamwrites.medium.com/introduction-to-querying-wikidata-knowledge-graph-using-sparql-e1e15fab4699 | 초보자용 |
| **Python + SPARQL** | https://itnext.io/extracting-data-from-wikidata-using-sparql-and-python-59e0037996f | 실습 코드 |
| **DBpedia 예제 쿼리** | https://gist.github.com/davidsbatista/cdce57196bf84e3a988427b4d9ef9035 | 쿼리 샘플 |

### 연습 방법

```sparql
# Wikidata에서 한국 기업 찾기
SELECT ?company ?companyLabel ?founded
WHERE {
  ?company wdt:P31 wd:Q4830453.  # instance of: business enterprise
  ?company wdt:P17 wd:Q884.      # country: South Korea
  OPTIONAL { ?company wdt:P571 ?founded. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "ko,en". }
}
LIMIT 100
```

---

## 7. 전문가 네트워크 구축 방안

### 온라인 커뮤니티

| 플랫폼 | 커뮤니티 | 목적 |
|--------|----------|------|
| **LinkedIn** | Semantic Web, Knowledge Graph 그룹 | 전문가 연결 |
| **Reddit** | r/semanticweb, r/knowledgegraph | Q&A |
| **Discord** | LangChain, LlamaIndex 서버 | RAG/Agent 커뮤니티 |
| **Slack** | dbt, Airbyte 커뮤니티 | 데이터 엔지니어링 |

### 학술 컨퍼런스

| 컨퍼런스 | 주제 | 시기 |
|----------|------|------|
| **ISWC** | 시맨틱 웹 | 매년 10-11월 |
| **ESWC** | 시맨틱 웹 (유럽) | 매년 5-6월 |
| **KDD** | 데이터 마이닝 | 매년 8월 |
| **AAAI** | AI 전반 | 매년 2월 |

### 한국 내 네트워크

| 조직 | 활동 |
|------|------|
| **한국정보과학회** | 지식그래프/AI 세션 |
| **데이터 3법 관련 포럼** | 데이터 거버넌스 |
| **K-방산 기업 협회** | 국방 도메인 |
| **병원 정보화 협회** | 의료 데이터 |

---

## 8. 실제 케이스 스터디 확보

### 전략 1: 공개 케이스 스터디 수집

```
Palantir 공식 → 파트너 (Unit8, Launch) → 학술 논문 → 뉴스 기사
```

### 전략 2: 합성 데이터 생성

| 도메인 | 도구 | 설명 |
|--------|------|------|
| **의료** | Synthea | 합성 환자 데이터 |
| **금융** | Faker + FIBO | 가상 금융 거래 |
| **제조** | Factory I/O | 가상 공장 시뮬레이션 |

### 전략 3: 오픈 데이터 활용

| 데이터 | URL | 활용 |
|--------|-----|------|
| **data.gov** | https://data.gov/ | 미국 정부 데이터 |
| **공공데이터포털** | https://data.go.kr/ | 한국 공공 데이터 |
| **Kaggle** | https://kaggle.com/datasets | 다양한 도메인 |

### 전략 4: 유튜브 콘텐츠 연계

```
유튜브 교육 영상 → 시청자 질문/피드백 → 실제 문제 발굴 → 케이스 스터디화
```

---

## 📌 다음 단계 (Action Items)

### 즉시 실행 (1주일)

- [ ] Protégé 설치 및 FIBO 로딩 테스트
- [ ] Wikidata SPARQL 튜토리얼 완료
- [ ] Gene Ontology 다운로드 및 구조 분석

### 단기 (1개월)

- [ ] 산업별 대표 온톨로지 1개씩 심층 분석
- [ ] 합성 데이터셋 3개 생성 (의료, 금융, 제조)
- [ ] SPARQL 연습문제 50개 제작

### 중기 (3개월)

- [ ] 산업별 케이스 스터디 템플릿 개발
- [ ] 전문가 인터뷰 5건 이상
- [ ] 첫 번째 시뮬레이터 프로토타입

---

## 📚 참고 자료 바로가기

### 핵심 URL 모음

```
# 온톨로지 편집
https://protege.stanford.edu/

# 온톨로지 저장소
https://bioportal.bioontology.org/
https://obofoundry.org/

# 산업 온톨로지
https://spec.edmcouncil.org/fibo/          # 금융
https://www.hl7.org/fhir/rdf.html          # 의료
https://geneontology.org/                   # 바이오
https://attack.mitre.org/                   # 사이버보안

# SPARQL 연습
https://query.wikidata.org/
http://dbpedia.org/sparql

# Palantir 문서
https://www.palantir.com/docs/foundry

# 벤치마크
https://ogb.stanford.edu/
https://paperswithcode.com/datasets?task=knowledge-graphs
```

---

**문서 작성**: 일론 (Claude)
**검토**: 켈리
**버전**: 1.0
