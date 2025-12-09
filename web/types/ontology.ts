// 온톨로지 기본 타입 정의

// 개념(Class) 타입
export interface OntologyClass {
  id: string;
  name: string;
  label?: string;
  description?: string;
  parent?: string; // 상위 클래스 ID
  children?: string[]; // 하위 클래스 ID 배열
}

// 속성(Property) 타입
export interface OntologyProperty {
  id: string;
  name: string;
  label?: string;
  description?: string;
  domain?: string; // 속성이 적용되는 클래스
  range?: string; // 속성 값의 타입/클래스
  type: 'object' | 'data'; // 객체 속성 or 데이터 속성
}

// 인스턴스(Individual) 타입
export interface OntologyIndividual {
  id: string;
  name: string;
  label?: string;
  description?: string;
  class: string; // 소속 클래스 ID
  properties?: Record<string, any>; // 속성-값 쌍
}

// 관계(Relation) 타입
export interface OntologyRelation {
  id: string;
  subject: string; // 주체 ID
  predicate: string; // 관계 속성 ID
  object: string; // 객체 ID
}

// 온톨로지 전체 구조
export interface Ontology {
  id: string;
  name: string;
  version?: string;
  description?: string;
  namespace?: string;
  classes: OntologyClass[];
  properties: OntologyProperty[];
  individuals: OntologyIndividual[];
  relations: OntologyRelation[];
}

// 지식 그래프 노드 타입
export interface KnowledgeNode {
  id: string;
  type: 'class' | 'property' | 'individual';
  label: string;
  description?: string;
  x?: number;
  y?: number;
}

// 지식 그래프 엣지 타입
export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  type: 'subClassOf' | 'instanceOf' | 'property' | 'custom';
  label?: string;
}

// 지식 그래프 타입
export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
}

// 추론 규칙 타입
export interface InferenceRule {
  id: string;
  name: string;
  description?: string;
  if: {
    subject: string;
    predicate: string;
    object: string;
  };
  then: {
    subject: string;
    predicate: string;
    object: string;
  };
}

// 쿼리 결과 타입
export interface QueryResult {
  bindings: Record<string, any>[];
  metadata?: {
    executionTime?: number;
    resultCount?: number;
  };
}