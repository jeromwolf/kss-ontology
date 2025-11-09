export interface ChapterMeta {
  id: number
  slug: string
  title: string
  description: string
  duration: string
  difficulty: number // 1-5
  part: number // 1 (기초), 2 (실전), 3 (미래)
  publishedAt: string
  topics: string[]
  simulators?: string[]
}

export const CHAPTERS: ChapterMeta[] = [
  {
    id: 1,
    slug: "01-ontology-basics",
    title: "온톨로지란 무엇인가?",
    description: "온톨로지의 철학적 기원부터 Tom Gruber의 정의까지, 온톨로지의 기본 개념을 학습합니다.",
    duration: "60분",
    difficulty: 1,
    part: 1,
    publishedAt: "2025-11-09",
    topics: ["철학", "지식 표현", "시맨틱 웹"]
  },
  {
    id: 2,
    slug: "02-rdf",
    title: "RDF: 시맨틱 웹의 기초",
    description: "RDF(Resource Description Framework)의 트리플 구조와 직렬화 포맷을 학습합니다.",
    duration: "90분",
    difficulty: 2,
    part: 1,
    publishedAt: "2025-11-09",
    topics: ["RDF", "트리플", "Turtle", "JSON-LD"],
    simulators: ["rdf-editor"]
  },
  {
    id: 3,
    slug: "03-rdfs-owl",
    title: "RDFS & OWL: 온톨로지 언어",
    description: "RDFS와 OWL을 사용하여 온톨로지를 설계하고 구축하는 방법을 학습합니다.",
    duration: "120분",
    difficulty: 3,
    part: 1,
    publishedAt: "2025-11-09",
    topics: ["RDFS", "OWL", "클래스", "속성"],
    simulators: ["rdf-editor"]
  },
  {
    id: 4,
    slug: "04-sparql",
    title: "SPARQL: 쿼리 언어",
    description: "SPARQL을 사용하여 RDF 데이터를 쿼리하고 조작하는 방법을 학습합니다.",
    duration: "90분",
    difficulty: 2,
    part: 1,
    publishedAt: "2025-11-09",
    topics: ["SPARQL", "쿼리", "DBpedia", "Wikidata"],
    simulators: ["sparql-playground"]
  },
  {
    id: 5,
    slug: "05-reasoning",
    title: "추론 엔진",
    description: "온톨로지 기반 추론의 원리와 4가지 추론 규칙을 학습합니다.",
    duration: "90분",
    difficulty: 3,
    part: 1,
    publishedAt: "2025-11-09",
    topics: ["추론", "규칙", "논리"],
    simulators: ["reasoning-engine"]
  },
  {
    id: 6,
    slug: "06-medical",
    title: "의료 온톨로지",
    description: "FHIR, HL7, SNOMED CT 등 의료 분야의 온톨로지 활용 사례를 학습합니다.",
    duration: "90분",
    difficulty: 3,
    part: 2,
    publishedAt: "2025-11-09",
    topics: ["의료", "FHIR", "SNOMED CT", "HL7"],
    simulators: ["knowledge-graph"]
  },
  {
    id: 7,
    slug: "07-finance",
    title: "금융 온톨로지",
    description: "FIBO와 금융 분야의 온톨로지 응용 사례를 학습합니다.",
    duration: "90분",
    difficulty: 3,
    part: 2,
    publishedAt: "2025-11-09",
    topics: ["금융", "FIBO", "KYC", "규제"],
    simulators: ["knowledge-graph"]
  },
  {
    id: 8,
    slug: "08-manufacturing",
    title: "제조 온톨로지",
    description: "Palantir와 제조 분야의 온톨로지 활용 사례를 학습합니다.",
    duration: "120분",
    difficulty: 4,
    part: 2,
    publishedAt: "2025-11-09",
    topics: ["제조", "PLM", "공급망", "Industry 4.0"],
    simulators: ["knowledge-graph"]
  },
  {
    id: 9,
    slug: "09-ai-ontology",
    title: "AI & 온톨로지",
    description: "Graph RAG, Knowledge Graph, AI 에이전트와 온톨로지의 통합을 학습합니다.",
    duration: "120분",
    difficulty: 4,
    part: 2,
    publishedAt: "2025-11-09",
    topics: ["AI", "Graph RAG", "Knowledge Graph", "LLM"],
    simulators: ["knowledge-graph"]
  },
  {
    id: 10,
    slug: "10-future-trends",
    title: "미래 트렌드",
    description: "온톨로지의 미래와 신기술 트렌드를 탐색합니다.",
    duration: "60분",
    difficulty: 2,
    part: 3,
    publishedAt: "2025-11-09",
    topics: ["미래", "트렌드", "신기술"]
  }
]

export const PART_TITLES = {
  1: "Part 1: 온톨로지 기초",
  2: "Part 2: 실전 응용",
  3: "Part 3: 미래와 트렌드"
}

export function getChapterBySlug(slug: string): ChapterMeta | undefined {
  return CHAPTERS.find((chapter) => chapter.slug === slug)
}

export function getChaptersByPart(part: number): ChapterMeta[] {
  return CHAPTERS.filter((chapter) => chapter.part === part)
}

export function getPrevChapter(id: number): ChapterMeta | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id - 1)
}

export function getNextChapter(id: number): ChapterMeta | undefined {
  return CHAPTERS.find((chapter) => chapter.id === id + 1)
}

export function getDifficultyStars(difficulty: number): string {
  return "⭐".repeat(difficulty)
}
