// Simulated Embedding Functions
import type { TextDocument, EmbeddingPoint, SearchResult, ChunkingStrategy } from './types'

// Simple word vectors for demo (in real RAG, you'd use OpenAI, HuggingFace, etc.)
const WORD_VECTORS: Record<string, number[]> = {
  // Tech words
  'machine': [0.9, 0.1, 0.2, 0.0],
  'learning': [0.8, 0.2, 0.3, 0.1],
  'algorithm': [0.85, 0.15, 0.1, 0.0],
  'deep': [0.9, 0.1, 0.1, 0.0],
  'neural': [0.95, 0.05, 0.1, 0.0],
  'network': [0.8, 0.3, 0.1, 0.1],
  'natural': [0.7, 0.1, 0.2, 0.0],
  'language': [0.75, 0.1, 0.15, 0.0],
  'processing': [0.7, 0.2, 0.2, 0.1],
  'computer': [0.85, 0.2, 0.05, 0.0],
  'vision': [0.8, 0.1, 0.1, 0.0],
  'artificial': [0.9, 0.1, 0.1, 0.0],
  'intelligence': [0.88, 0.12, 0.1, 0.05],
  'data': [0.7, 0.3, 0.2, 0.1],
  'automates': [0.75, 0.15, 0.1, 0.0],

  // Finance words
  'stock': [0.1, 0.9, 0.1, 0.0],
  'market': [0.2, 0.85, 0.15, 0.1],
  'trading': [0.1, 0.9, 0.05, 0.0],
  'investment': [0.15, 0.9, 0.1, 0.0],
  'portfolio': [0.1, 0.88, 0.12, 0.0],
  'banking': [0.1, 0.9, 0.1, 0.0],
  'financial': [0.15, 0.9, 0.1, 0.0],
  'cryptocurrency': [0.3, 0.85, 0.0, 0.0],
  'economic': [0.1, 0.88, 0.12, 0.05],
  'risk': [0.2, 0.8, 0.1, 0.1],
  'volatile': [0.1, 0.85, 0.05, 0.1],

  // Health words
  'medical': [0.1, 0.1, 0.9, 0.0],
  'diagnosis': [0.15, 0.05, 0.9, 0.0],
  'drug': [0.1, 0.1, 0.88, 0.0],
  'clinical': [0.1, 0.1, 0.9, 0.0],
  'healthcare': [0.1, 0.15, 0.88, 0.05],
  'patient': [0.05, 0.1, 0.9, 0.0],
  'nutrition': [0.1, 0.05, 0.85, 0.1],
  'health': [0.1, 0.1, 0.9, 0.1],
  'mental': [0.1, 0.1, 0.85, 0.1],
  'wellness': [0.1, 0.1, 0.85, 0.15],
  'symptoms': [0.1, 0.05, 0.9, 0.0],

  // Sports words
  'football': [0.0, 0.1, 0.1, 0.9],
  'basketball': [0.0, 0.1, 0.1, 0.88],
  'athletic': [0.05, 0.1, 0.2, 0.9],
  'training': [0.15, 0.1, 0.2, 0.85],
  'olympic': [0.05, 0.1, 0.15, 0.9],
  'games': [0.1, 0.1, 0.1, 0.85],
  'sports': [0.05, 0.1, 0.15, 0.9],
  'athletes': [0.05, 0.1, 0.2, 0.9],
  'player': [0.05, 0.1, 0.1, 0.9],
  'score': [0.1, 0.15, 0.05, 0.85],
  'compete': [0.1, 0.15, 0.1, 0.88],
  'performance': [0.2, 0.15, 0.2, 0.7],
}

// Default vector for unknown words
const DEFAULT_VECTOR = [0.25, 0.25, 0.25, 0.25]

// Tokenize text into words
function tokenize(text: string): string[] {
  return text.toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 2)
}

// Get embedding for a single word
function getWordVector(word: string): number[] {
  return WORD_VECTORS[word] || DEFAULT_VECTOR
}

// Generate embedding for text (average of word vectors)
export function generateEmbedding(text: string): number[] {
  const words = tokenize(text)
  if (words.length === 0) return DEFAULT_VECTOR

  const embedding = [0, 0, 0, 0]
  let count = 0

  for (const word of words) {
    const vector = getWordVector(word)
    for (let i = 0; i < 4; i++) {
      embedding[i] += vector[i]
    }
    count++
  }

  // Average
  for (let i = 0; i < 4; i++) {
    embedding[i] /= count
  }

  // Add some noise for visual variety
  for (let i = 0; i < 4; i++) {
    embedding[i] += (Math.random() - 0.5) * 0.1
  }

  return embedding
}

// Cosine similarity between two vectors
export function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  if (normA === 0 || normB === 0) return 0
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

// Project 4D embedding to 2D using PCA-like projection
export function projectTo2D(embedding: number[]): { x: number; y: number } {
  // Simple projection matrix (approximating first 2 principal components)
  const pc1 = [0.5, -0.5, 0.5, -0.5]
  const pc2 = [0.5, 0.5, -0.5, -0.5]

  let x = 0, y = 0
  for (let i = 0; i < 4; i++) {
    x += embedding[i] * pc1[i]
    y += embedding[i] * pc2[i]
  }

  // Scale for visualization
  return { x: x * 150 + 300, y: y * 150 + 200 }
}

// Process documents to get embedding points
export function processDocuments(documents: TextDocument[]): EmbeddingPoint[] {
  return documents.map(doc => {
    const embedding = generateEmbedding(doc.text)
    const { x, y } = projectTo2D(embedding)

    return {
      id: doc.id,
      text: doc.text,
      x,
      y,
      category: doc.category,
    }
  })
}

// Search for similar documents
export function searchSimilar(
  query: string,
  documents: TextDocument[],
  topK = 5
): SearchResult[] {
  const queryEmbedding = generateEmbedding(query)

  const results = documents.map(doc => {
    const docEmbedding = doc.embedding || generateEmbedding(doc.text)
    const similarity = cosineSimilarity(queryEmbedding, docEmbedding)
    return { document: doc, similarity }
  })

  // Sort by similarity (descending) and take top K
  results.sort((a, b) => b.similarity - a.similarity)
  return results.slice(0, topK)
}

// Chunk text using different strategies
export function chunkText(
  text: string,
  strategy: ChunkingStrategy,
  options?: { chunkSize?: number; overlap?: number }
): string[] {
  const { chunkSize = 100, overlap = 20 } = options || {}

  switch (strategy) {
    case 'fixed':
      // Fixed-size character chunks
      const fixedChunks: string[] = []
      for (let i = 0; i < text.length; i += (chunkSize - overlap)) {
        fixedChunks.push(text.slice(i, i + chunkSize))
        if (i + chunkSize >= text.length) break
      }
      return fixedChunks

    case 'sentence':
      // Split by sentences
      return text.split(/[.!?]+/).filter(s => s.trim().length > 0)

    case 'paragraph':
      // Split by paragraphs (double newline)
      return text.split(/\n\n+/).filter(p => p.trim().length > 0)

    case 'semantic':
      // For demo, use sentences as "semantic" chunks
      // In real systems, you'd use more sophisticated methods
      const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
      const semanticChunks: string[] = []

      // Group related sentences (simplified)
      for (let i = 0; i < sentences.length; i += 2) {
        if (i + 1 < sentences.length) {
          semanticChunks.push(sentences[i] + '. ' + sentences[i + 1])
        } else {
          semanticChunks.push(sentences[i])
        }
      }
      return semanticChunks

    default:
      return [text]
  }
}

// Calculate embedding statistics
export function getEmbeddingStats(points: EmbeddingPoint[]) {
  const categories = [...new Set(points.map(p => p.category).filter(Boolean))]

  const stats = {
    totalDocuments: points.length,
    categories: categories.length,
    categoryDistribution: {} as Record<string, number>,
    avgPosition: { x: 0, y: 0 },
  }

  categories.forEach(cat => {
    stats.categoryDistribution[cat!] = points.filter(p => p.category === cat).length
  })

  points.forEach(p => {
    stats.avgPosition.x += p.x
    stats.avgPosition.y += p.y
  })
  stats.avgPosition.x /= points.length
  stats.avgPosition.y /= points.length

  return stats
}
