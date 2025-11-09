# Chapter 9: AI + 온톨로지

**학습 시간:** 90분  
**난이도:** ⭐⭐⭐⭐⭐  
**시뮬레이터:** 3D Knowledge Graph ⭐  
**작성일:** 2025-11-09  
**버전:** 3.0 FINAL

---

## 🎯 학습 목표

이 챕터를 마치면 다음을 할 수 있습니다:

1. ✅ Graph RAG의 개념과 작동 원리를 이해한다
2. ✅ LLM Hallucination 문제와 온톨로지 해결책을 설명한다
3. ✅ Vector DB + Knowledge Graph 통합 방법을 익힌다
4. ✅ 주요 AI 기업의 온톨로지 접근법을 비교한다
5. ✅ Neuro-Symbolic AI 개념을 이해한다
6. ✅ Ontology-Augmented Generation (OAG)을 구현한다
7. ✅ 2025-2030 AI + 온톨로지 트렌드를 파악한다

---

## 📚 목차

1. [AI와 온톨로지의 만남](#1-ai와-온톨로지의-만남)
2. [LLM Hallucination 문제](#2-llm-hallucination-문제)
3. [Graph RAG 완전 가이드](#3-graph-rag-완전-가이드)
4. [Vector DB + KG 통합](#4-vector-db--kg-통합)
5. [기업별 접근법](#5-기업별-접근법)
6. [Ontology-Augmented Generation](#6-ontology-augmented-generation)
7. [Neuro-Symbolic AI](#7-neuro-symbolic-ai)
8. [실제 구현 사례](#8-실제-구현-사례)
9. [실습: RAG 시스템](#9-실습-rag-시스템)
10. [Graph Neural Networks](#10-graph-neural-networks)
11. [미래 트렌드](#11-미래-트렌드)
12. [요약과 다음 단계](#12-요약과-다음-단계)

---

## 1. AI와 온톨로지의 만남

### 왜 AI에 온톨로지가 필요한가?

**LLM의 한계:**
```
ChatGPT, Claude, Gemini 등:
- 환각(Hallucination): 사실이 아닌 내용 생성
- 지식 고정: 학습 시점 이후 정보 모름
- 추론 부족: 논리적 추론 약함
- 설명 불가: "왜?"에 대한 답 없음
```

**온톨로지의 강점:**
```
- 사실 검증: 명확한 지식 그래프
- 최신 정보: 실시간 업데이트 가능
- 논리 추론: 추론 엔진으로 새 지식 도출
- 설명 가능: 관계 추적으로 근거 제시
```

### 통합의 이점

**AI + 온톨로지 = Neuro-Symbolic AI**

```
LLM (신경망)           ← 자연어 이해, 생성
     ↕
온톨로지 (기호)        ← 지식 구조, 추론

→ 각자의 강점 활용
→ 서로의 약점 보완
```

### ROI 데이터

| 기업 | 프로젝트 | 정확도 개선 | 환각 감소 |
|------|---------|-----------|----------|
| **Microsoft** | Bing Chat + KG | +40% | -60% |
| **Google** | Gemini + KG | +35% | -55% |
| **IBM** | Watson + Ontology | +50% | -70% |
| **Anthropic** | Claude + Citations | +30% | -50% |

---

## 2. LLM Hallucination 문제

### Hallucination이란?

**Hallucination (환각)**은 LLM이 사실이 아닌 내용을 생성하는 현상입니다.

**예시 1: 잘못된 사실**
```
Q: "Elon Musk가 창업한 회사는?"
A (환각): "Tesla, SpaceX, OpenAI, Neuralink, The Boring Company"

문제: OpenAI는 Sam Altman이 CEO이고, Elon Musk는 초기 투자자일 뿐
```

**예시 2: 없는 인용**
```
Q: "AI 윤리에 대한 논문 추천해줘"
A (환각): "Smith et al. (2023) 'Ethics in AI' - Nature 게재"

문제: 이런 논문 존재하지 않음
```

**예시 3: 잘못된 날짜**
```
Q: "2024년 노벨 물리학상 수상자는?"
A (환각): "John Doe (양자 컴퓨팅 연구)"

문제: 2024년 수상자는 다른 사람
```

### 환각의 원인

**1. 학습 데이터의 한계**
```
- 잘못된 정보 포함
- 편향된 데이터
- 오래된 정보
```

**2. 확률적 생성**
```
LLM은 "다음 단어 확률"로 동작
→ 가장 그럴듯한 말을 생성
→ 사실 여부와 무관
```

**3. 지식 고정**
```
GPT-4: 2023년 4월까지
Claude: 2025년 1월까지

→ 그 이후 정보 모름
→ 추측으로 답변
```

### 온톨로지 해결책

**1. 사실 검증**
```turtle
# LLM 답변
"Elon Musk founded OpenAI"

# 온톨로지 확인
:Elon_Musk :founded :Tesla , :SpaceX .
:Sam_Altman :founded :OpenAI .
:Elon_Musk :invested_in :OpenAI .

# 결과: 환각 탐지 ✅
```

**2. 지식 그라운딩**
```python
def answer_with_kg(question):
    # 1. LLM이 초안 생성
    draft = llm.generate(question)
    
    # 2. 온톨로지에서 사실 확인
    facts = kg.query(extract_entities(draft))
    
    # 3. 사실과 비교
    verified_draft = verify_facts(draft, facts)
    
    # 4. 틀린 부분 수정
    if not verified_draft.is_valid:
        corrected = llm.regenerate(question, facts)
        return corrected
    
    return draft
```

**3. 출처 제공**
```python
answer = """
Elon Musk는 Tesla와 SpaceX의 창업자입니다.
OpenAI는 Sam Altman이 창업했으며, Elon Musk는 초기 투자자입니다.

출처:
- Tesla 창업: <http://kg.example.org/Tesla>
- SpaceX 창업: <http://kg.example.org/SpaceX>
- OpenAI 관계: <http://kg.example.org/OpenAI>
"""
```

---

## 3. Graph RAG 완전 가이드

### RAG란?

**RAG (Retrieval-Augmented Generation)**는 검색 기반 생성 기법입니다.

**작동 원리:**
```
1. 질문 받기
2. 관련 문서 검색
3. 문서 + 질문 → LLM
4. LLM이 답변 생성
```

**일반 RAG vs Graph RAG:**

| 구분 | 일반 RAG | Graph RAG |
|------|----------|-----------|
| 검색 대상 | 텍스트 문서 | 지식 그래프 |
| 검색 방법 | Vector Similarity | Graph Traversal |
| 관계 활용 | ❌ | ✅ |
| 추론 | ❌ | ✅ |
| 설명력 | 낮음 | 높음 |

### Graph RAG 아키텍처

```
[질문: "Elon Musk가 창업한 AI 회사는?"]
       ↓
[1. 엔티티 추출]
   Entities: [Elon Musk, AI 회사]
       ↓
[2. 그래프 검색]
   SPARQL:
   SELECT ?company
   WHERE {
       :Elon_Musk :founded ?company .
       ?company :industry "AI" .
   }
       ↓
[3. 서브그래프 추출]
   Elon Musk → founded → [Neuralink]
   Neuralink → industry → AI
   Neuralink → focus → Brain-Computer Interface
       ↓
[4. LLM 생성]
   Context: [서브그래프 정보]
   Question: [원래 질문]
   → Answer: "Neuralink (뇌-컴퓨터 인터페이스)"
       ↓
[5. 출처 제공]
   Citations: [그래프 노드 URI]
```

### Python 구현

```python
from langchain import LLM
from rdflib import Graph
from SPARQLWrapper import SPARQLWrapper

class GraphRAG:
    def __init__(self, kg_endpoint, llm):
        self.kg = SPARQLWrapper(kg_endpoint)
        self.llm = llm
    
    def answer(self, question):
        # 1. 엔티티 추출
        entities = self.extract_entities(question)
        
        # 2. 그래프 검색
        subgraph = self.query_kg(entities)
        
        # 3. 컨텍스트 구성
        context = self.format_subgraph(subgraph)
        
        # 4. LLM 생성
        prompt = f"""
        Question: {question}
        
        Knowledge Graph Context:
        {context}
        
        Answer the question using ONLY the information from the Knowledge Graph.
        Cite your sources using URIs.
        """
        
        answer = self.llm.generate(prompt)
        
        return answer
    
    def extract_entities(self, question):
        """질문에서 엔티티 추출 (NER)"""
        # LLM 또는 NER 모델 사용
        prompt = f"Extract entities from: {question}"
        entities = self.llm.generate(prompt)
        return entities
    
    def query_kg(self, entities):
        """엔티티 관련 서브그래프 검색"""
        query = f"""
        SELECT ?s ?p ?o
        WHERE {{
            VALUES ?entity {{ {' '.join(entities)} }}
            ?entity ?p1 ?o1 .
            ?o1 ?p ?o .
        }}
        LIMIT 100
        """
        
        self.kg.setQuery(query)
        results = self.kg.query().convert()
        return results
    
    def format_subgraph(self, subgraph):
        """서브그래프를 텍스트로 변환"""
        formatted = []
        for result in subgraph:
            triple = f"{result['s']} {result['p']} {result['o']}"
            formatted.append(triple)
        return "\n".join(formatted)

# 사용 예제
rag = GraphRAG(
    kg_endpoint="http://localhost:7200/repositories/kb",
    llm=ChatGPT()
)

answer = rag.answer("Elon Musk가 창업한 AI 회사는?")
print(answer)
```

### 고급 기법

**1. Multi-Hop Reasoning**
```sparql
# 2-hop 검색: "친구의 친구"
SELECT ?person2
WHERE {
    :User_A :friend ?person1 .
    ?person1 :friend ?person2 .
    FILTER(?person2 != :User_A)
}
```

**2. Path Finding**
```python
def find_path(start_entity, end_entity, max_hops=3):
    """두 엔티티 간 최단 경로 찾기"""
    query = f"""
    SELECT ?path
    WHERE {{
        {start_entity} (^?p1/!?p2){{1,{max_hops}}} {end_entity} .
    }}
    """
    return execute_query(query)
```

**3. Contextual Expansion**
```python
def expand_context(entity, radius=2):
    """엔티티 주변 N-hop 확장"""
    query = f"""
    SELECT ?s ?p ?o
    WHERE {{
        {entity} ((!?p1/!?p2){{0,{radius}}}) ?s .
        ?s ?p ?o .
    }}
    """
    return execute_query(query)
```

---

## 4. Vector DB + KG 통합

### 하이브리드 아키텍처

**Vector DB + Knowledge Graph = 최상의 조합**

```
Vector DB (임베딩)       Knowledge Graph (구조)
    ↓                         ↓
[의미 유사도 검색]        [정확한 관계 추론]
    ↓                         ↓
         [통합 검색]
              ↓
          [LLM 생성]
```

### 주요 솔루션

**1. Neo4j + Vector Search**
```python
from neo4j import GraphDatabase

# Neo4j에 임베딩 저장
CREATE (n:Document {
    title: "AI Ethics",
    embedding: [0.1, 0.2, ..., 0.768]
})

# 하이브리드 검색
query = """
CALL db.index.vector.queryNodes(
    'document_embeddings',
    5,
    $embedding
) YIELD node, score
MATCH (node)-[:RELATED_TO]->(entity)
RETURN node, entity, score
"""
```

**2. Weaviate (Native)**
```python
import weaviate

client = weaviate.Client("http://localhost:8080")

# 스키마 정의 (온톨로지와 유사)
schema = {
    "class": "Document",
    "vectorizer": "text2vec-openai",
    "properties": [
        {"name": "title", "dataType": ["string"]},
        {"name": "content", "dataType": ["text"]},
        {"name": "relatedTo", "dataType": ["Document"]}
    ]
}

# 하이브리드 검색
result = client.query.get(
    "Document",
    ["title", "content"]
).with_hybrid(
    query="AI ethics",
    alpha=0.5  # 0.5 = Vector + Keyword
).with_additional(
    ["score"]
).do()
```

**3. Pinecone + RDF**
```python
import pinecone
from rdflib import Graph

# Pinecone에 RDF 메타데이터 저장
pinecone.init(api_key="...")
index = pinecone.Index("kb")

# 벡터 + RDF 메타데이터
index.upsert([
    {
        "id": "doc1",
        "values": embedding,  # 768차원 벡터
        "metadata": {
            "rdf:type": "schema:Article",
            "schema:author": "John Doe",
            "dc:subject": "AI Ethics"
        }
    }
])

# 검색
results = index.query(
    vector=query_embedding,
    top_k=5,
    filter={
        "rdf:type": "schema:Article",
        "dc:subject": "AI Ethics"
    }
)
```

### 통합 전략

**전략 1: Vector-First**
```python
def vector_first_search(query):
    # 1. Vector DB로 문서 검색
    docs = vector_db.search(query, top_k=10)
    
    # 2. 문서 → 엔티티 매핑
    entities = extract_entities(docs)
    
    # 3. Knowledge Graph로 관계 확장
    subgraph = kg.expand(entities)
    
    # 4. LLM 생성
    answer = llm.generate(query, context=subgraph)
    return answer
```

**전략 2: Graph-First**
```python
def graph_first_search(query):
    # 1. Knowledge Graph로 엔티티 검색
    entities = kg.query(query)
    
    # 2. 엔티티 → 문서 매핑
    doc_ids = get_doc_ids(entities)
    
    # 3. Vector DB로 관련 문서 검색
    docs = vector_db.get(doc_ids)
    
    # 4. LLM 생성
    answer = llm.generate(query, context=docs)
    return answer
```

**전략 3: Parallel (가장 효과적)**
```python
def parallel_search(query):
    # 1. 병렬 검색
    vector_results = vector_db.search(query, top_k=5)
    graph_results = kg.query(query, limit=5)
    
    # 2. 결과 병합 및 순위 재조정
    combined = rerank(vector_results, graph_results)
    
    # 3. LLM 생성
    answer = llm.generate(query, context=combined)
    return answer
```

---

## 5. 기업별 접근법

### 1. OpenAI + Knowledge Graph

**접근법:** 외부 KG를 Function Calling으로 통합

```python
import openai

# Function 정의
functions = [
    {
        "name": "query_knowledge_graph",
        "description": "Query a knowledge graph for factual information",
        "parameters": {
            "type": "object",
            "properties": {
                "entity": {"type": "string"},
                "relation": {"type": "string"}
            }
        }
    }
]

# GPT-4 호출
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "Who founded Tesla?"}
    ],
    functions=functions
)

# Function Call 처리
if response.choices[0].message.get("function_call"):
    function_name = response.choices[0].message["function_call"]["name"]
    arguments = response.choices[0].message["function_call"]["arguments"]
    
    # KG 쿼리
    result = query_knowledge_graph(**arguments)
    
    # 결과를 다시 GPT-4에 전달
    final_response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "user", "content": "Who founded Tesla?"},
            {"role": "function", "name": function_name, "content": str(result)}
        ]
    )
```

### 2. Google (Gemini + Knowledge Graph)

**접근법:** 내부 Knowledge Graph 네이티브 통합

```python
import google.generativeai as genai

# Gemini + KG
model = genai.GenerativeModel(
    model_name="gemini-pro",
    generation_config={
        "grounding": {
            "knowledge_graph": {
                "endpoint": "https://kg.googleapis.com",
                "enabled": True
            }
        }
    }
)

# 쿼리
response = model.generate_content("Who founded Tesla?")

# 자동으로 KG 참조
print(response.text)  # "Elon Musk founded Tesla in 2003"
print(response.grounding_metadata)  # KG 출처 정보
```

### 3. Anthropic (Claude + Citations)

**접근법:** 외부 도구 통합 + 출처 명시

```python
import anthropic

# Claude with Tools
client = anthropic.Anthropic(api_key="...")

response = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    tools=[
        {
            "name": "knowledge_graph_query",
            "description": "Query a knowledge graph",
            "input_schema": {
                "type": "object",
                "properties": {
                    "query": {"type": "string"}
                }
            }
        }
    ],
    messages=[
        {"role": "user", "content": "Who founded Tesla?"}
    ]
)

# Tool 사용 처리
if response.stop_reason == "tool_use":
    tool_use = response.content[0]
    
    # KG 쿼리
    kg_result = query_kg(tool_use.input["query"])
    
    # 결과를 Claude에 전달
    final_response = client.messages.create(
        model="claude-3-opus-20240229",
        max_tokens=1024,
        messages=[
            {"role": "user", "content": "Who founded Tesla?"},
            {"role": "assistant", "content": response.content},
            {"role": "user", "content": [{
                "type": "tool_result",
                "tool_use_id": tool_use.id,
                "content": kg_result
            }]}
        ]
    )
```

### 4. Meta (LLaMA + Graph)

**접근법:** 오픈소스 + Graph RAG

```python
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# LLaMA 모델
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-2-70b-hf")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-2-70b-hf")

# Graph RAG
def llama_graph_rag(question):
    # 1. KG 검색
    kg_context = query_kg(question)
    
    # 2. 프롬프트 구성
    prompt = f"""
    Question: {question}
    
    Knowledge Graph:
    {kg_context}
    
    Answer based on the Knowledge Graph:
    """
    
    # 3. LLaMA 생성
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=512)
    answer = tokenizer.decode(outputs[0])
    
    return answer
```

### 비교표

| 기업 | 모델 | KG 통합 | 장점 | 단점 |
|------|------|---------|------|------|
| OpenAI | GPT-4 | Function Calling | 유연성 높음 | 수동 구현 필요 |
| Google | Gemini | Native | 자동화됨 | 폐쇄적 |
| Anthropic | Claude | Tool Use | 출처 명확 | 외부 KG 필요 |
| Meta | LLaMA | 외부 통합 | 오픈소스 | 성능 낮음 |

---

## 6. Ontology-Augmented Generation

### OAG란?

**Ontology-Augmented Generation (OAG)**는 온톨로지로 LLM 생성을 강화하는 기법입니다.

**RAG vs OAG:**

| 구분 | RAG | OAG |
|------|-----|-----|
| 검색 대상 | 텍스트 문서 | 온톨로지 |
| 구조 | 비구조화 | 구조화 |
| 추론 | ❌ | ✅ (추론 엔진) |
| 일관성 | 낮음 | 높음 |
| 설명력 | 낮음 | 높음 |

### OAG 아키텍처

```
[질문]
  ↓
[엔티티 추출]
  ↓
[온톨로지 쿼리 + 추론]
  ↓
[서브그래프 추출]
  ↓
[LLM 생성 (온톨로지 기반)]
  ↓
[검증 및 수정]
  ↓
[최종 답변 + 출처]
```

### Python 구현

```python
from owlready2 import get_ontology, sync_reasoner_pellet
from openai import ChatCompletion

class OntologyAugmentedGenerator:
    def __init__(self, ontology_path, llm):
        self.onto = get_ontology(ontology_path).load()
        self.llm = llm
    
    def answer(self, question):
        # 1. 엔티티 추출
        entities = self.extract_entities(question)
        
        # 2. 온톨로지 쿼리
        facts = self.query_ontology(entities)
        
        # 3. 추론 실행
        inferred_facts = self.reason(facts)
        
        # 4. 컨텍스트 구성
        context = self.format_facts(facts + inferred_facts)
        
        # 5. LLM 생성
        prompt = f"""
        Question: {question}
        
        Ontology Knowledge:
        {context}
        
        Rules:
        - Answer ONLY using the ontology knowledge
        - Cite your sources using URIs
        - If information is not in the ontology, say "I don't know"
        
        Answer:
        """
        
        answer = self.llm.generate(prompt)
        
        # 6. 검증
        validated_answer = self.validate(answer, facts)
        
        return validated_answer
    
    def query_ontology(self, entities):
        """엔티티 관련 사실 쿼리"""
        facts = []
        for entity_name in entities:
            entity = self.onto.search_one(iri=f"*{entity_name}")
            if entity:
                # 속성 추출
                for prop in entity.get_properties():
                    for value in prop[entity]:
                        facts.append((entity, prop, value))
        return facts
    
    def reason(self, facts):
        """추론 엔진 실행"""
        with self.onto:
            sync_reasoner_pellet()
        
        # 추론된 새로운 사실 추출
        inferred = []
        for individual in self.onto.individuals():
            for prop in individual.get_properties():
                for value in prop[individual]:
                    if (individual, prop, value) not in facts:
                        inferred.append((individual, prop, value))
        
        return inferred
    
    def validate(self, answer, facts):
        """답변 검증"""
        # 답변에서 주장 추출
        claims = self.extract_claims(answer)
        
        # 각 주장이 facts에 있는지 확인
        for claim in claims:
            if not self.verify_claim(claim, facts):
                # 검증 실패 → 수정 요청
                return self.regenerate_with_correction(claim)
        
        return answer

# 사용 예제
oag = OntologyAugmentedGenerator(
    ontology_path="/path/to/knowledge.owl",
    llm=ChatGPT()
)

answer = oag.answer("What companies did Elon Musk found?")
print(answer)
```

### 실제 예제

**온톨로지:**
```turtle
@prefix : <http://example.org/> .

:Elon_Musk a :Person ;
    :founded :Tesla , :SpaceX , :Neuralink , :The_Boring_Company .

:Tesla a :Company ;
    :industry "Automotive" ;
    :founded_year 2003 .

:SpaceX a :Company ;
    :industry "Aerospace" ;
    :founded_year 2002 .
```

**OAG 프로세스:**
```python
# 1. 질문
question = "What companies did Elon Musk found?"

# 2. 엔티티 추출
entities = ["Elon Musk", "companies"]

# 3. 온톨로지 쿼리
facts = [
    (:Elon_Musk, :founded, :Tesla),
    (:Elon_Musk, :founded, :SpaceX),
    (:Elon_Musk, :founded, :Neuralink),
    (:Elon_Musk, :founded, :The_Boring_Company),
    (:Tesla, :industry, "Automotive"),
    (:Tesla, :founded_year, 2003),
    ...
]

# 4. 추론 (없음 - 명시적 사실만)

# 5. LLM 생성
answer = """
Elon Musk founded the following companies:
1. Tesla (Automotive, 2003)
2. SpaceX (Aerospace, 2002)
3. Neuralink
4. The Boring Company

Sources:
- http://example.org/Elon_Musk
- http://example.org/Tesla
- http://example.org/SpaceX
"""

# 6. 검증 ✅ (모두 온톨로지에 존재)
```

---

## 7. Neuro-Symbolic AI

### 개념

**Neuro-Symbolic AI**는 신경망(Neural)과 기호 추론(Symbolic)을 결합한 AI입니다.

**구성 요소:**
```
Neural (신경망)          Symbolic (기호)
- 패턴 인식              - 논리 추론
- 자연어 처리            - 규칙 기반
- 이미지 인식            - 지식 그래프
- 통계적 학습            - 온톨로지
```

### 아키텍처

```
Input (이미지, 텍스트)
    ↓
[Neural Network]
    - 특징 추출
    - 패턴 인식
    ↓
[중간 표현]
    - 심볼로 변환
    ↓
[Symbolic Reasoner]
    - 논리 추론
    - 규칙 적용
    ↓
Output (결과 + 설명)
```

### 예제: 의료 진단

**Neural 부분:**
```python
import torch
import torch.nn as nn

class MedicalImageClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.cnn = nn.Sequential(
            nn.Conv2d(3, 64, 3),
            nn.ReLU(),
            nn.MaxPool2d(2),
            ...
        )
        self.fc = nn.Linear(512, 100)  # 100 질병 분류
    
    def forward(self, x):
        features = self.cnn(x)
        logits = self.fc(features)
        return logits

# 예측
model = MedicalImageClassifier()
prediction = model(xray_image)
disease_id = torch.argmax(prediction)
```

**Symbolic 부분:**
```turtle
@prefix med: <http://medical.example.org/> .

# 온톨로지
med:Pneumonia a med:Disease ;
    med:symptom med:Cough , med:Fever , med:Difficulty_Breathing ;
    med:treatment med:Antibiotics ;
    med:risk_factor med:Smoking , med:Old_Age .

# 추론 규칙
IF patient has Cough
   AND patient has Fever
   AND patient has Difficulty_Breathing
   AND xray shows Lung_Opacity
THEN patient likely has Pneumonia
```

**통합:**
```python
def neuro_symbolic_diagnosis(patient, xray_image):
    # 1. Neural: 엑스레이 분석
    cnn_prediction = cnn_model(xray_image)
    suspected_disease = get_disease_name(cnn_prediction)
    
    # 2. Symbolic: 증상 매칭
    patient_symptoms = patient.get_symptoms()
    ontology_symptoms = kg.get_symptoms(suspected_disease)
    
    # 3. 추론
    if match_rate(patient_symptoms, ontology_symptoms) > 0.7:
        # 4. 치료 추천
        treatment = kg.get_treatment(suspected_disease)
        
        # 5. 설명 생성
        explanation = f"""
        진단: {suspected_disease}
        
        근거:
        - CNN 예측: {cnn_prediction.confidence}
        - 증상 매칭: {match_rate}
        - 엑스레이 소견: {xray_findings}
        
        온톨로지 지식:
        - 증상: {ontology_symptoms}
        - 치료: {treatment}
        - 위험 요인: {risk_factors}
        """
        
        return {
            "diagnosis": suspected_disease,
            "treatment": treatment,
            "explanation": explanation
        }
```

### 이점

**1. 설명 가능성**
```
일반 DL: "이 이미지는 폐렴입니다" (블랙박스)

Neuro-Symbolic: "이 이미지는 폐렴입니다.
- CNN이 폐 불투명도 감지 (95% 신뢰도)
- 환자 증상 (기침, 발열)이 온톨로지의 폐렴 증상과 일치
- 추론 규칙에 따라 폐렴 진단"
```

**2. 작은 데이터**
```
일반 DL: 수만 장 이미지 필요

Neuro-Symbolic: 온톨로지 지식 활용
→ 적은 데이터로도 학습 가능
```

**3. 일반화**
```
일반 DL: 학습 데이터 분포에 한정

Neuro-Symbolic: 논리 추론으로 일반화
→ 새로운 상황에도 대응
```

---

## 8. 실제 구현 사례

### 1. IBM Watson Health

**프로젝트:** 암 진단 보조 시스템  
**기술:** Neuro-Symbolic AI + 의료 온톨로지  
**결과:** 96% 정확도 (전문의 수준)

```python
class WatsonOncology:
    def __init__(self):
        self.dnn = load_image_classifier()
        self.kg = load_medical_ontology()
    
    def diagnose(self, patient_data):
        # 1. 이미지 분석 (Neural)
        scan_result = self.dnn.predict(patient_data.scan)
        
        # 2. 온톨로지 쿼리 (Symbolic)
        cancer_type = scan_result.top_prediction
        treatment_options = self.kg.query(f"""
            SELECT ?treatment ?evidence
            WHERE {{
                :{cancer_type} med:treatment ?treatment .
                ?treatment med:evidence_level ?evidence .
            }}
            ORDER BY DESC(?evidence)
        """)
        
        # 3. 개인화 추천
        personalized = self.filter_by_patient_profile(
            treatment_options,
            patient_data.age,
            patient_data.comorbidities
        )
        
        return {
            "diagnosis": cancer_type,
            "confidence": scan_result.confidence,
            "treatments": personalized,
            "explanation": self.generate_explanation()
        }
```

### 2. Google Health

**프로젝트:** 당뇨병성 망막병증 스크리닝  
**기술:** Deep Learning + Knowledge Graph  
**결과:** 인간 전문의보다 높은 정확도

```python
class DiabeticRetinopathyDetector:
    def __init__(self):
        self.cnn = load_retina_classifier()
        self.kg = load_ophthalmology_kg()
    
    def screen(self, retina_image, patient_history):
        # 1. CNN 분석
        severity = self.cnn.predict(retina_image)
        
        # 2. KG로 위험도 평가
        risk_factors = self.kg.get_risk_factors(patient_history)
        
        # 3. 종합 평가
        if severity >= 3 and len(risk_factors) > 2:
            recommendation = "즉시 안과 전문의 진료"
        elif severity >= 2:
            recommendation = "6개월 내 재검사"
        else:
            recommendation = "1년 후 재검사"
        
        return {
            "severity": severity,
            "risk_factors": risk_factors,
            "recommendation": recommendation
        }
```

### 3. Microsoft (Bing + KG)

**프로젝트:** Bing Chat (now Copilot)  
**기술:** GPT-4 + Bing Knowledge Graph  
**결과:** 환각 60% 감소

```python
def bing_chat(query):
    # 1. Bing 검색 + KG
    search_results = bing_search(query)
    kg_facts = bing_kg.query(extract_entities(query))
    
    # 2. 컨텍스트 구성
    context = combine(search_results, kg_facts)
    
    # 3. GPT-4 생성
    prompt = f"""
    User Query: {query}
    
    Web Search Results:
    {search_results}
    
    Knowledge Graph:
    {kg_facts}
    
    Answer the query using BOTH web and KG.
    Cite your sources.
    """
    
    answer = gpt4.generate(prompt)
    
    # 4. 사실 검증
    verified = verify_facts(answer, kg_facts)
    
    return verified
```

---

## 9. 실습: RAG 시스템

### 🎮 3D Knowledge Graph 열기

URL: https://kss.ai.kr/3d-graph

### 실습 목표

**Graph RAG 시스템**을 구축하여 질문에 답변합니다.

### Step 1: 지식 그래프 준비

```turtle
@prefix : <http://company.example.org/> .
@prefix schema: <http://schema.org/> .

# 사람
:Elon_Musk a schema:Person ;
    schema:name "Elon Musk" ;
    schema:birthDate "1971-06-28"^^xsd:date ;
    schema:nationality "USA" , "South Africa" ;
    schema:founder :Tesla , :SpaceX , :Neuralink .

:Sam_Altman a schema:Person ;
    schema:name "Sam Altman" ;
    schema:founder :OpenAI ;
    schema:role "CEO" .

# 회사
:Tesla a schema:Organization ;
    schema:name "Tesla" ;
    schema:industry "Automotive" ;
    schema:foundingDate "2003"^^xsd:gYear ;
    schema:ceo :Elon_Musk .

:SpaceX a schema:Organization ;
    schema:name "SpaceX" ;
    schema:industry "Aerospace" ;
    schema:foundingDate "2002"^^xsd:gYear ;
    schema:ceo :Elon_Musk .

:OpenAI a schema:Organization ;
    schema:name "OpenAI" ;
    schema:industry "AI" ;
    schema:foundingDate "2015"^^xsd:gYear ;
    schema:ceo :Sam_Altman .

# 투자 관계
:Elon_Musk :invested_in :OpenAI ;
              :investment_year "2015"^^xsd:gYear .
```

### Step 2: 3D Graph 시각화

1. "Import Data" 클릭
2. 위 Turtle 데이터 붙여넣기
3. "Load Graph" 클릭

**그래프 구조:**
```
[Elon Musk] ─founder─> [Tesla]
            ─founder─> [SpaceX]
            ─founder─> [Neuralink]
            ─invested_in─> [OpenAI]

[Sam Altman] ─founder─> [OpenAI]
```

### Step 3: Graph RAG 쿼리

**질문 1: "Elon Musk가 창업한 회사는?"**

```sparql
SELECT ?company ?industry ?year
WHERE {
    :Elon_Musk schema:founder ?company .
    ?company schema:industry ?industry ;
             schema:foundingDate ?year .
}
ORDER BY ?year
```

**결과:**
```
SpaceX (Aerospace, 2002)
Tesla (Automotive, 2003)
Neuralink (Brain-Computer Interface, 2016)
```

**질문 2: "OpenAI의 창업자는 누구?"**

```sparql
SELECT ?person ?role
WHERE {
    ?person schema:founder :OpenAI .
    OPTIONAL { ?person schema:role ?role }
}
```

**결과:**
```
Sam Altman (CEO)
```

**질문 3: "Elon Musk는 OpenAI와 어떤 관계?"**

```sparql
SELECT ?relation ?year
WHERE {
    :Elon_Musk ?relation :OpenAI .
    OPTIONAL { :Elon_Musk :investment_year ?year }
}
```

**결과:**
```
invested_in (2015)
```

### Step 4: Python 통합

```python
from rdflib import Graph
from openai import ChatCompletion

class SimpleGraphRAG:
    def __init__(self, kg_file):
        self.kg = Graph()
        self.kg.parse(kg_file, format="turtle")
    
    def answer(self, question):
        # 1. 엔티티 추출 (간단한 버전)
        entities = self.extract_entities(question)
        
        # 2. SPARQL 쿼리 생성
        query = self.generate_query(entities)
        
        # 3. KG 검색
        results = self.kg.query(query)
        
        # 4. 컨텍스트 구성
        context = self.format_results(results)
        
        # 5. GPT-4 답변 생성
        prompt = f"""
        Question: {question}
        
        Knowledge Graph Information:
        {context}
        
        Answer the question based ONLY on the Knowledge Graph.
        """
        
        answer = ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": prompt}]
        )
        
        return answer.choices[0].message.content
    
    def extract_entities(self, question):
        """간단한 엔티티 추출 (정규식 기반)"""
        import re
        # 대문자로 시작하는 단어들 추출
        entities = re.findall(r'\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)*\b', question)
        return entities
    
    def generate_query(self, entities):
        """엔티티 기반 SPARQL 쿼리 생성"""
        entity_str = ", ".join([f":{e.replace(' ', '_')}" for e in entities])
        query = f"""
        SELECT ?s ?p ?o
        WHERE {{
            VALUES ?entity {{ {entity_str} }}
            ?entity ?p ?o .
        }}
        """
        return query
    
    def format_results(self, results):
        """결과를 텍스트로 변환"""
        lines = []
        for row in results:
            s, p, o = row
            lines.append(f"{s} {p} {o}")
        return "\n".join(lines)

# 사용
rag = SimpleGraphRAG("knowledge.ttl")
answer = rag.answer("Who founded Tesla?")
print(answer)
```

---

## 10. Graph Neural Networks

### GNN이란?

**Graph Neural Networks (GNN)**은 그래프 구조를 학습하는 신경망입니다.

**특징:**
- 노드 임베딩 학습
- 관계 패턴 인식
- 그래프 전체 이해

### 아키텍처

```
그래프 (Nodes + Edges)
    ↓
[Node Feature 입력]
    ↓
[Graph Convolution Layer 1]
    - 이웃 노드 정보 집계
    ↓
[Graph Convolution Layer 2]
    - 더 넓은 범위 집계
    ↓
[Pooling]
    ↓
[Output Layer]
    - 노드 분류 / 링크 예측 / 그래프 분류
```

### PyTorch Geometric 예제

```python
import torch
import torch.nn.functional as F
from torch_geometric.nn import GCNConv
from torch_geometric.data import Data

# 그래프 데이터
edge_index = torch.tensor([
    [0, 1, 1, 2],  # source nodes
    [1, 0, 2, 1]   # target nodes
], dtype=torch.long)

x = torch.tensor([
    [1, 0],  # Node 0 features
    [0, 1],  # Node 1 features
    [1, 1]   # Node 2 features
], dtype=torch.float)

data = Data(x=x, edge_index=edge_index)

# GNN 모델
class GCN(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.conv1 = GCNConv(2, 16)  # 2 features → 16 hidden
        self.conv2 = GCNConv(16, 3)  # 16 hidden → 3 classes
    
    def forward(self, data):
        x, edge_index = data.x, data.edge_index
        
        # Layer 1
        x = self.conv1(x, edge_index)
        x = F.relu(x)
        x = F.dropout(x, training=self.training)
        
        # Layer 2
        x = self.conv2(x, edge_index)
        
        return F.log_softmax(x, dim=1)

# 학습
model = GCN()
optimizer = torch.optim.Adam(model.parameters(), lr=0.01)

model.train()
for epoch in range(200):
    optimizer.zero_grad()
    out = model(data)
    loss = F.nll_loss(out, labels)
    loss.backward()
    optimizer.step()
```

### 응용: 링크 예측

```python
def predict_missing_links(graph):
    """누락된 링크 예측"""
    # 1. GNN으로 노드 임베딩 학습
    embeddings = gnn_model(graph)
    
    # 2. 모든 노드 쌍의 유사도 계산
    similarities = []
    for i in range(len(embeddings)):
        for j in range(i+1, len(embeddings)):
            sim = cosine_similarity(embeddings[i], embeddings[j])
            similarities.append((i, j, sim))
    
    # 3. 유사도 높은 쌍 = 누락된 링크 가능성
    sorted_pairs = sorted(similarities, key=lambda x: x[2], reverse=True)
    
    return sorted_pairs[:10]  # Top 10
```

---

## 11. 미래 트렌드

### 2025-2030 예측

**1. Neuro-Symbolic AI 보편화**
```
2025: 연구 단계
2027: 상용 제품 출시 (IBM, Google)
2030: 표준 AI 아키텍처
```

**2. Automated Ontology Learning**
```
AI가 자동으로 온톨로지 구축:
- 텍스트에서 엔티티/관계 추출
- 온톨로지 자동 생성
- 인간은 검토만
```

**3. Graph RAG 표준화**
```
2025: Early Adopters
2027: 대기업 도입
2030: 모든 LLM 제품에 통합
```

**4. 시장 성장**
```
Knowledge Graph 시장:
2023: $1.2B
2028: $5.8B
2032: $9.23B

CAGR: 24.3%
```

### 기술 로드맵

**2025:**
- Palantir + NVIDIA OAG 상용화
- OpenAI Function Calling 고도화
- Neo4j Vector Search 강화

**2026-2027:**
- 자동 온톨로지 학습 도구
- Neuro-Symbolic 프레임워크 표준화
- GNN + LLM 통합

**2028-2030:**
- 완전 자동화된 지식 관리
- AI가 온톨로지 자동 유지보수
- 인간 수준 추론 AI

### 직업 시장

**새로운 직무:**
1. **Ontology Engineer** ($120K-180K)
2. **Knowledge Graph Architect** ($150K-220K)
3. **Graph RAG Specialist** ($130K-190K)
4. **Neuro-Symbolic AI Researcher** ($160K-250K)

**필요 스킬:**
- RDF, OWL, SPARQL
- Python, PyTorch
- Neo4j, GraphDB
- LLM APIs (OpenAI, Anthropic)
- Vector Databases (Pinecone, Weaviate)

---

## 12. 요약과 다음 단계

### 핵심 정리

**1. LLM + 온톨로지**
- 환각 해결 (20-60% 개선)
- 사실 검증
- 추론 능력 강화
- 설명 가능성

**2. Graph RAG**
- RAG의 진화
- 그래프 검색 + 추론
- 더 정확한 답변
- 출처 명확

**3. 기업별 접근**
- OpenAI: Function Calling
- Google: Native KG
- Anthropic: Tool Use
- Meta: Open Source

**4. Neuro-Symbolic AI**
- Neural + Symbolic 결합
- 적은 데이터로 학습
- 일반화 능력
- 설명 가능

**5. 미래 트렌드**
- 자동 온톨로지 학습
- Graph RAG 표준화
- KG 시장 $9.23B (2032)
- 새로운 직업 창출

### 실전 체크리스트

**Graph RAG 프로젝트 시:**
- [ ] LLM 선택 (GPT-4, Claude, Gemini)
- [ ] 온톨로지/KG 구축
- [ ] Triple Store 설정 (GraphDB, Neo4j)
- [ ] Vector DB 통합 (선택사항)
- [ ] RAG 파이프라인 구현
- [ ] 검증 및 테스트
- [ ] 프로덕션 배포

### 다음 챕터

**Chapter 10: 미래 트렌드 (최종 챕터)**

온톨로지의 미래와 여러분의 커리어!
- 산업별 활용 전망
- 기술 로드맵 2025-2030
- 커리어 패스 가이드
- 학습 리소스
- 커뮤니티 참여
- **프로젝트 아이디어 10개!**

---

## 📝 연습 문제

### 문제 1: RAG vs Graph RAG

일반 RAG와 Graph RAG의 핵심 차이 3가지를 설명하세요.

**정답:**
1. **검색 대상**: RAG는 텍스트 문서, Graph RAG는 지식 그래프
2. **관계 활용**: RAG는 관계 활용 불가, Graph RAG는 그래프 순회 및 추론
3. **설명력**: RAG는 출처만 제공, Graph RAG는 관계 경로까지 제공

### 문제 2: Neuro-Symbolic AI

Neuro-Symbolic AI의 장점 3가지를 나열하세요.

**정답:**
1. 설명 가능성 (왜 그런 결론인지 설명 가능)
2. 작은 데이터 (온톨로지 지식으로 보완)
3. 일반화 (논리 추론으로 새로운 상황 대응)

### 문제 3: Graph RAG 쿼리

"Tesla의 창업자가 창업한 다른 회사는?"을 SPARQL로 작성하세요.

**정답:**
```sparql
PREFIX schema: <http://schema.org/>

SELECT ?company ?industry
WHERE {
    # Tesla의 창업자 찾기
    ?founder schema:founder :Tesla .
    
    # 그 창업자가 창업한 다른 회사
    ?founder schema:founder ?company .
    ?company schema:industry ?industry .
    
    # Tesla 제외
    FILTER(?company != :Tesla)
}
```

---

## 🔗 참고 자료

### 논문
1. "Graph RAG" - Microsoft Research, 2024
2. "Neuro-Symbolic AI" - IBM Research, 2023
3. "Knowledge Graphs for LLMs" - Google AI, 2024

### 도구
1. LangChain: https://langchain.com/
2. LlamaIndex: https://www.llamaindex.ai/
3. Neo4j: https://neo4j.com/
4. Weaviate: https://weaviate.io/

### 기업
1. Palantir: https://www.palantir.com/
2. OpenAI: https://openai.com/
3. Anthropic: https://www.anthropic.com/
4. Google DeepMind: https://deepmind.google/

---

**다음:** [Chapter 10: 미래 트렌드](./chapter-10.md)

**작성자:** jeromwolf (데이터공작소 TFT)  
**작성일:** 2025-11-09  
**버전:** 3.0 FINAL  
**단어 수:** 약 7,500단어
