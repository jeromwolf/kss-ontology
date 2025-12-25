// Embedding Visualizer Types

export interface TextDocument {
  id: string
  text: string
  embedding?: number[]
  category?: string
}

export interface EmbeddingPoint {
  id: string
  text: string
  x: number
  y: number
  z?: number
  category?: string
  similarity?: number
}

export interface SearchResult {
  document: TextDocument
  similarity: number
}

// Sample documents for demonstration
export const SAMPLE_DOCUMENTS: TextDocument[] = [
  // Technology
  { id: '1', text: 'Machine learning algorithms process large datasets', category: 'Tech' },
  { id: '2', text: 'Deep neural networks learn complex patterns', category: 'Tech' },
  { id: '3', text: 'Natural language processing understands text', category: 'Tech' },
  { id: '4', text: 'Computer vision analyzes images and videos', category: 'Tech' },
  { id: '5', text: 'Artificial intelligence automates tasks', category: 'Tech' },

  // Finance
  { id: '6', text: 'Stock market trading involves risk management', category: 'Finance' },
  { id: '7', text: 'Investment portfolios require diversification', category: 'Finance' },
  { id: '8', text: 'Banking systems process financial transactions', category: 'Finance' },
  { id: '9', text: 'Cryptocurrency markets are highly volatile', category: 'Finance' },
  { id: '10', text: 'Economic indicators predict market trends', category: 'Finance' },

  // Health
  { id: '11', text: 'Medical diagnosis uses patient symptoms', category: 'Health' },
  { id: '12', text: 'Drug development requires clinical trials', category: 'Health' },
  { id: '13', text: 'Healthcare systems manage patient records', category: 'Health' },
  { id: '14', text: 'Nutrition affects physical health outcomes', category: 'Health' },
  { id: '15', text: 'Mental wellness requires stress management', category: 'Health' },

  // Sports
  { id: '16', text: 'Football teams compete in league matches', category: 'Sports' },
  { id: '17', text: 'Athletic training improves performance', category: 'Sports' },
  { id: '18', text: 'Olympic games showcase world athletes', category: 'Sports' },
  { id: '19', text: 'Basketball players score points through shooting', category: 'Sports' },
  { id: '20', text: 'Sports analytics measures player statistics', category: 'Sports' },
]

// Category colors
export const CATEGORY_COLORS: Record<string, string> = {
  'Tech': '#4F46E5',      // Indigo
  'Finance': '#10B981',   // Emerald
  'Health': '#EF4444',    // Red
  'Sports': '#F59E0B',    // Amber
  'Query': '#8B5CF6',     // Violet (for search query)
}

// Chunking strategies
export type ChunkingStrategy = 'fixed' | 'sentence' | 'paragraph' | 'semantic'

export interface ChunkingOptions {
  strategy: ChunkingStrategy
  chunkSize?: number
  overlap?: number
}

// RAG concepts
export interface RAGStep {
  name: string
  description: string
  icon: string
}

export const RAG_STEPS: RAGStep[] = [
  {
    name: 'Chunking',
    description: '문서를 작은 청크로 분할',
    icon: '✂️'
  },
  {
    name: 'Embedding',
    description: '텍스트를 벡터로 변환',
    icon: '🔢'
  },
  {
    name: 'Indexing',
    description: '벡터 인덱스에 저장',
    icon: '📚'
  },
  {
    name: 'Retrieval',
    description: '유사한 청크 검색',
    icon: '🔍'
  },
  {
    name: 'Generation',
    description: 'LLM으로 응답 생성',
    icon: '✨'
  }
]
