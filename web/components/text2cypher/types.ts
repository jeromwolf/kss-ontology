// Text2Cypher Simulator Types

export interface ExamplePair {
  question: string
  cypher: string
  explanation?: string
}

export interface SchemaInfo {
  nodeLabels: string[]
  relationshipTypes: string[]
  properties: Record<string, string[]>
}

export interface ConversionResult {
  query: string
  cypher: string
  confidence: number
  usedExamples: ExamplePair[]
  warnings?: string[]
}

// Sample schema (Movie database)
export const SAMPLE_SCHEMA: SchemaInfo = {
  nodeLabels: ['Person', 'Movie', 'Genre', 'Company'],
  relationshipTypes: ['ACTED_IN', 'DIRECTED', 'PRODUCED', 'HAS_GENRE', 'WROTE'],
  properties: {
    Person: ['name', 'born', 'nationality'],
    Movie: ['title', 'released', 'tagline', 'budget', 'revenue'],
    Genre: ['name'],
    Company: ['name', 'founded'],
  }
}

// Few-shot examples
export const FEW_SHOT_EXAMPLES: ExamplePair[] = [
  {
    question: '모든 영화 목록을 보여줘',
    cypher: 'MATCH (m:Movie) RETURN m.title AS title',
    explanation: '모든 Movie 노드를 찾아 title 속성 반환'
  },
  {
    question: 'Tom Hanks가 출연한 영화는?',
    cypher: 'MATCH (p:Person {name: "Tom Hanks"})-[:ACTED_IN]->(m:Movie) RETURN m.title',
    explanation: 'Person 노드에서 ACTED_IN 관계를 따라 Movie 노드 탐색'
  },
  {
    question: '2000년 이후 개봉한 영화 수',
    cypher: 'MATCH (m:Movie) WHERE m.released >= 2000 RETURN count(m) AS count',
    explanation: 'WHERE 절로 released 속성 필터링 후 count 집계'
  },
  {
    question: '가장 많은 영화에 출연한 배우 5명',
    cypher: 'MATCH (p:Person)-[:ACTED_IN]->(m:Movie) RETURN p.name, count(m) AS movieCount ORDER BY movieCount DESC LIMIT 5',
    explanation: 'ACTED_IN 관계 count 후 정렬 및 LIMIT'
  },
  {
    question: 'Matrix 영화의 감독은 누구야?',
    cypher: 'MATCH (p:Person)-[:DIRECTED]->(m:Movie {title: "The Matrix"}) RETURN p.name',
    explanation: 'DIRECTED 관계로 감독 Person 노드 탐색'
  },
  {
    question: '액션 장르 영화들',
    cypher: 'MATCH (m:Movie)-[:HAS_GENRE]->(g:Genre {name: "Action"}) RETURN m.title',
    explanation: 'HAS_GENRE 관계로 Genre 노드와 연결된 Movie 탐색'
  },
  {
    question: 'Tom Hanks와 같이 영화에 출연한 배우들',
    cypher: 'MATCH (tom:Person {name: "Tom Hanks"})-[:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(coActor:Person) WHERE tom <> coActor RETURN DISTINCT coActor.name',
    explanation: '패턴 매칭으로 공동 출연 배우 탐색 (자기 자신 제외)'
  },
  {
    question: '수익이 가장 높은 영화 10개',
    cypher: 'MATCH (m:Movie) WHERE m.revenue IS NOT NULL RETURN m.title, m.revenue ORDER BY m.revenue DESC LIMIT 10',
    explanation: 'revenue 속성으로 정렬 후 상위 10개 반환'
  }
]

// Query patterns for matching
export const QUERY_PATTERNS = [
  { pattern: /모든|전체|목록/i, type: 'list' },
  { pattern: /출연|연기|acted/i, type: 'acted' },
  { pattern: /감독|directed/i, type: 'directed' },
  { pattern: /장르/i, type: 'genre' },
  { pattern: /몇 개|수|count|몇/i, type: 'count' },
  { pattern: /가장|최고|top|best/i, type: 'ranking' },
  { pattern: /이후|이전|년도/i, type: 'year_filter' },
  { pattern: /같이|함께|공동/i, type: 'coactor' },
  { pattern: /수익|revenue|흥행/i, type: 'revenue' },
  { pattern: /예산|budget/i, type: 'budget' },
]

// Error types
export type ValidationError =
  | 'unknown_node_label'
  | 'unknown_relationship'
  | 'syntax_error'
  | 'missing_return'
  | 'ambiguous_query'

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  suggestions?: string[]
}
