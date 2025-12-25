// GraphRAG Pipeline Simulator Types

export type RetrievalStrategy = 'local' | 'global' | 'hybrid'

export interface GraphEntity {
  id: string
  type: 'Person' | 'Company' | 'Product' | 'Technology' | 'Event'
  name: string
  properties: Record<string, string>
  embedding?: number[]
}

export interface GraphRelation {
  source: string
  target: string
  type: string
  properties?: Record<string, string>
}

export interface RetrievalResult {
  entity: GraphEntity
  score: number
  source: 'vector' | 'graph' | 'community'
  path?: string[]
}

export interface CommunityInfo {
  id: number
  name: string
  summary: string
  entities: string[]
  keywords: string[]
}

export interface GraphRAGStep {
  name: string
  description: string
  icon: string
  status: 'pending' | 'active' | 'complete'
}

// Sample knowledge graph for demo
export const SAMPLE_ENTITIES: GraphEntity[] = [
  // Tech Companies
  { id: 'google', type: 'Company', name: 'Google', properties: { industry: 'Tech', founded: '1998' } },
  { id: 'openai', type: 'Company', name: 'OpenAI', properties: { industry: 'AI', founded: '2015' } },
  { id: 'microsoft', type: 'Company', name: 'Microsoft', properties: { industry: 'Tech', founded: '1975' } },
  { id: 'anthropic', type: 'Company', name: 'Anthropic', properties: { industry: 'AI', founded: '2021' } },

  // People
  { id: 'satya', type: 'Person', name: 'Satya Nadella', properties: { role: 'CEO', company: 'Microsoft' } },
  { id: 'sam', type: 'Person', name: 'Sam Altman', properties: { role: 'CEO', company: 'OpenAI' } },
  { id: 'dario', type: 'Person', name: 'Dario Amodei', properties: { role: 'CEO', company: 'Anthropic' } },
  { id: 'sundar', type: 'Person', name: 'Sundar Pichai', properties: { role: 'CEO', company: 'Google' } },

  // Products/Technologies
  { id: 'gpt4', type: 'Technology', name: 'GPT-4', properties: { type: 'LLM', release: '2023' } },
  { id: 'claude', type: 'Technology', name: 'Claude', properties: { type: 'LLM', release: '2023' } },
  { id: 'gemini', type: 'Technology', name: 'Gemini', properties: { type: 'LLM', release: '2023' } },
  { id: 'copilot', type: 'Product', name: 'GitHub Copilot', properties: { type: 'Code Assistant' } },

  // Events
  { id: 'chatgpt', type: 'Event', name: 'ChatGPT Launch', properties: { date: '2022-11-30' } },
  { id: 'ms-invest', type: 'Event', name: 'Microsoft $10B Investment', properties: { date: '2023-01' } },
]

export const SAMPLE_RELATIONS: GraphRelation[] = [
  // Company-Person relations
  { source: 'satya', target: 'microsoft', type: 'CEO_OF' },
  { source: 'sam', target: 'openai', type: 'CEO_OF' },
  { source: 'dario', target: 'anthropic', type: 'CEO_OF' },
  { source: 'sundar', target: 'google', type: 'CEO_OF' },

  // Company-Tech relations
  { source: 'openai', target: 'gpt4', type: 'DEVELOPED' },
  { source: 'anthropic', target: 'claude', type: 'DEVELOPED' },
  { source: 'google', target: 'gemini', type: 'DEVELOPED' },
  { source: 'microsoft', target: 'copilot', type: 'DEVELOPED' },

  // Company partnerships
  { source: 'microsoft', target: 'openai', type: 'INVESTED_IN' },
  { source: 'google', target: 'anthropic', type: 'INVESTED_IN' },

  // Tech relations
  { source: 'copilot', target: 'gpt4', type: 'POWERED_BY' },

  // Events
  { source: 'openai', target: 'chatgpt', type: 'LAUNCHED' },
  { source: 'microsoft', target: 'ms-invest', type: 'ANNOUNCED' },
]

export const SAMPLE_COMMUNITIES: CommunityInfo[] = [
  {
    id: 0,
    name: 'Microsoft-OpenAI Ecosystem',
    summary: 'Microsoft invested $10B in OpenAI, integrating GPT-4 into products like Copilot.',
    entities: ['microsoft', 'openai', 'satya', 'sam', 'gpt4', 'copilot'],
    keywords: ['Microsoft', 'OpenAI', 'investment', 'GPT-4', 'Copilot']
  },
  {
    id: 1,
    name: 'Google-Anthropic AI',
    summary: 'Google has invested in Anthropic, competing in the LLM space with Gemini and Claude.',
    entities: ['google', 'anthropic', 'sundar', 'dario', 'gemini', 'claude'],
    keywords: ['Google', 'Anthropic', 'Gemini', 'Claude', 'AI safety']
  }
]

export const GRAPHRAG_STEPS: GraphRAGStep[] = [
  { name: 'Query Analysis', description: '질문 분석 및 엔티티 추출', icon: '🔍', status: 'pending' },
  { name: 'Vector Search', description: '시맨틱 유사도 기반 검색', icon: '📊', status: 'pending' },
  { name: 'Graph Traversal', description: '관계 기반 컨텍스트 확장', icon: '🕸️', status: 'pending' },
  { name: 'Community Lookup', description: '커뮤니티 요약 조회', icon: '👥', status: 'pending' },
  { name: 'Context Aggregation', description: '검색 결과 통합', icon: '📋', status: 'pending' },
  { name: 'Response Generation', description: 'LLM 응답 생성', icon: '✨', status: 'pending' },
]

// Entity type colors
export const ENTITY_COLORS: Record<string, string> = {
  'Person': '#4F46E5',     // Indigo
  'Company': '#10B981',    // Emerald
  'Product': '#F59E0B',    // Amber
  'Technology': '#8B5CF6', // Violet
  'Event': '#EF4444',      // Red
}
