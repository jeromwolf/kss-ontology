// Graph Algorithm Implementations
import type { GraphData, GraphNode, GraphEdge, AlgorithmType } from './types'

// Build adjacency list from edges
function buildAdjacencyList(nodes: GraphNode[], edges: GraphEdge[]): Map<string, string[]> {
  const adj = new Map<string, string[]>()
  nodes.forEach(n => adj.set(n.id, []))
  edges.forEach(e => {
    adj.get(e.source)?.push(e.target)
    adj.get(e.target)?.push(e.source) // Undirected
  })
  return adj
}

// PageRank Algorithm
export function computePageRank(
  nodes: GraphNode[],
  edges: GraphEdge[],
  damping = 0.85,
  iterations = 20
): Map<string, number> {
  const adj = buildAdjacencyList(nodes, edges)
  const n = nodes.length
  const scores = new Map<string, number>()

  // Initialize
  nodes.forEach(node => scores.set(node.id, 1 / n))

  // Iterate
  for (let i = 0; i < iterations; i++) {
    const newScores = new Map<string, number>()
    nodes.forEach(node => {
      let sum = 0
      nodes.forEach(other => {
        const neighbors = adj.get(other.id) || []
        if (neighbors.includes(node.id)) {
          sum += (scores.get(other.id) || 0) / neighbors.length
        }
      })
      newScores.set(node.id, (1 - damping) / n + damping * sum)
    })
    nodes.forEach(node => scores.set(node.id, newScores.get(node.id) || 0))
  }

  return scores
}

// Degree Centrality
export function computeDegreeCentrality(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, number> {
  const adj = buildAdjacencyList(nodes, edges)
  const scores = new Map<string, number>()
  const maxDegree = Math.max(...nodes.map(n => (adj.get(n.id) || []).length))

  nodes.forEach(node => {
    const degree = (adj.get(node.id) || []).length
    scores.set(node.id, maxDegree > 0 ? degree / maxDegree : 0)
  })

  return scores
}

// Betweenness Centrality (simplified Brandes algorithm)
export function computeBetweennessCentrality(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, number> {
  const adj = buildAdjacencyList(nodes, edges)
  const scores = new Map<string, number>()
  nodes.forEach(n => scores.set(n.id, 0))

  nodes.forEach(source => {
    // BFS from source
    const dist = new Map<string, number>()
    const paths = new Map<string, number>()
    const pred = new Map<string, string[]>()
    const stack: string[] = []

    nodes.forEach(n => {
      dist.set(n.id, -1)
      paths.set(n.id, 0)
      pred.set(n.id, [])
    })

    dist.set(source.id, 0)
    paths.set(source.id, 1)
    const queue = [source.id]

    while (queue.length > 0) {
      const v = queue.shift()!
      stack.push(v)

      for (const w of adj.get(v) || []) {
        if (dist.get(w) === -1) {
          dist.set(w, (dist.get(v) || 0) + 1)
          queue.push(w)
        }
        if (dist.get(w) === (dist.get(v) || 0) + 1) {
          paths.set(w, (paths.get(w) || 0) + (paths.get(v) || 0))
          pred.get(w)?.push(v)
        }
      }
    }

    // Accumulation
    const delta = new Map<string, number>()
    nodes.forEach(n => delta.set(n.id, 0))

    while (stack.length > 0) {
      const w = stack.pop()!
      for (const v of pred.get(w) || []) {
        const d = ((paths.get(v) || 0) / (paths.get(w) || 1)) * (1 + (delta.get(w) || 0))
        delta.set(v, (delta.get(v) || 0) + d)
      }
      if (w !== source.id) {
        scores.set(w, (scores.get(w) || 0) + (delta.get(w) || 0))
      }
    }
  })

  // Normalize
  const maxScore = Math.max(...Array.from(scores.values()))
  if (maxScore > 0) {
    nodes.forEach(n => scores.set(n.id, (scores.get(n.id) || 0) / maxScore))
  }

  return scores
}

// Closeness Centrality
export function computeClosenessCentrality(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, number> {
  const adj = buildAdjacencyList(nodes, edges)
  const scores = new Map<string, number>()

  nodes.forEach(source => {
    // BFS to find distances
    const dist = new Map<string, number>()
    nodes.forEach(n => dist.set(n.id, -1))
    dist.set(source.id, 0)

    const queue = [source.id]
    while (queue.length > 0) {
      const v = queue.shift()!
      for (const w of adj.get(v) || []) {
        if (dist.get(w) === -1) {
          dist.set(w, (dist.get(v) || 0) + 1)
          queue.push(w)
        }
      }
    }

    // Sum of distances
    let totalDist = 0
    let reachable = 0
    nodes.forEach(n => {
      const d = dist.get(n.id) || 0
      if (d > 0) {
        totalDist += d
        reachable++
      }
    })

    scores.set(source.id, reachable > 0 ? reachable / totalDist : 0)
  })

  // Normalize
  const maxScore = Math.max(...Array.from(scores.values()))
  if (maxScore > 0) {
    nodes.forEach(n => scores.set(n.id, (scores.get(n.id) || 0) / maxScore))
  }

  return scores
}

// Louvain Community Detection (simplified)
export function computeLouvain(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, number> {
  const adj = buildAdjacencyList(nodes, edges)
  const community = new Map<string, number>()

  // Initialize each node in its own community
  nodes.forEach((n, i) => community.set(n.id, i))

  // Simple greedy optimization
  let improved = true
  let iterations = 0
  const maxIterations = 10

  while (improved && iterations < maxIterations) {
    improved = false
    iterations++

    for (const node of nodes) {
      const currentCommunity = community.get(node.id) || 0
      const neighbors = adj.get(node.id) || []

      // Count connections to each community
      const communityConnections = new Map<number, number>()
      for (const neighbor of neighbors) {
        const nc = community.get(neighbor) || 0
        communityConnections.set(nc, (communityConnections.get(nc) || 0) + 1)
      }

      // Find best community
      let bestCommunity = currentCommunity
      let bestConnections = communityConnections.get(currentCommunity) || 0

      for (const [c, connections] of communityConnections) {
        if (connections > bestConnections) {
          bestCommunity = c
          bestConnections = connections
        }
      }

      if (bestCommunity !== currentCommunity) {
        community.set(node.id, bestCommunity)
        improved = true
      }
    }
  }

  // Normalize community IDs
  const uniqueCommunities = [...new Set(community.values())]
  const communityMap = new Map<number, number>()
  uniqueCommunities.forEach((c, i) => communityMap.set(c, i))

  nodes.forEach(n => {
    const c = community.get(n.id) || 0
    community.set(n.id, communityMap.get(c) || 0)
  })

  return community
}

// Label Propagation
export function computeLabelPropagation(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, number> {
  const adj = buildAdjacencyList(nodes, edges)
  const labels = new Map<string, number>()

  // Initialize with unique labels
  nodes.forEach((n, i) => labels.set(n.id, i))

  // Iterate
  let changed = true
  let iterations = 0
  const maxIterations = 20

  while (changed && iterations < maxIterations) {
    changed = false
    iterations++

    // Shuffle nodes
    const shuffled = [...nodes].sort(() => Math.random() - 0.5)

    for (const node of shuffled) {
      const neighbors = adj.get(node.id) || []
      if (neighbors.length === 0) continue

      // Count label frequencies
      const labelCounts = new Map<number, number>()
      for (const neighbor of neighbors) {
        const label = labels.get(neighbor) || 0
        labelCounts.set(label, (labelCounts.get(label) || 0) + 1)
      }

      // Find most common label
      let maxCount = 0
      let mostCommonLabel = labels.get(node.id) || 0
      for (const [label, count] of labelCounts) {
        if (count > maxCount) {
          maxCount = count
          mostCommonLabel = label
        }
      }

      if (mostCommonLabel !== labels.get(node.id)) {
        labels.set(node.id, mostCommonLabel)
        changed = true
      }
    }
  }

  // Normalize labels
  const uniqueLabels = [...new Set(labels.values())]
  const labelMap = new Map<number, number>()
  uniqueLabels.forEach((l, i) => labelMap.set(l, i))

  nodes.forEach(n => {
    const l = labels.get(n.id) || 0
    labels.set(n.id, labelMap.get(l) || 0)
  })

  return labels
}

// Jaccard Similarity (between two nodes)
export function computeJaccardSimilarity(
  nodes: GraphNode[],
  edges: GraphEdge[],
  nodeA: string,
  nodeB: string
): number {
  const adj = buildAdjacencyList(nodes, edges)
  const neighborsA = new Set(adj.get(nodeA) || [])
  const neighborsB = new Set(adj.get(nodeB) || [])

  const intersection = new Set([...neighborsA].filter(x => neighborsB.has(x)))
  const union = new Set([...neighborsA, ...neighborsB])

  return union.size > 0 ? intersection.size / union.size : 0
}

// Compute all pairwise Jaccard similarities
export function computeAllJaccardSimilarities(
  nodes: GraphNode[],
  edges: GraphEdge[]
): Map<string, Map<string, number>> {
  const result = new Map<string, Map<string, number>>()

  for (const nodeA of nodes) {
    const similarities = new Map<string, number>()
    for (const nodeB of nodes) {
      if (nodeA.id !== nodeB.id) {
        similarities.set(nodeB.id, computeJaccardSimilarity(nodes, edges, nodeA.id, nodeB.id))
      }
    }
    result.set(nodeA.id, similarities)
  }

  return result
}

// Dijkstra's Algorithm
export function computeDijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  source: string,
  target: string
): { path: string[]; distance: number } {
  const adj = new Map<string, Array<{ node: string; weight: number }>>()
  nodes.forEach(n => adj.set(n.id, []))
  edges.forEach(e => {
    adj.get(e.source)?.push({ node: e.target, weight: e.weight || 1 })
    adj.get(e.target)?.push({ node: e.source, weight: e.weight || 1 })
  })

  const dist = new Map<string, number>()
  const prev = new Map<string, string | null>()
  const visited = new Set<string>()

  nodes.forEach(n => {
    dist.set(n.id, Infinity)
    prev.set(n.id, null)
  })
  dist.set(source, 0)

  while (visited.size < nodes.length) {
    // Find minimum distance unvisited node
    let minDist = Infinity
    let minNode: string | null = null
    for (const node of nodes) {
      if (!visited.has(node.id) && (dist.get(node.id) || Infinity) < minDist) {
        minDist = dist.get(node.id) || Infinity
        minNode = node.id
      }
    }

    if (minNode === null || minDist === Infinity) break
    visited.add(minNode)

    if (minNode === target) break

    for (const neighbor of adj.get(minNode) || []) {
      const alt = (dist.get(minNode) || 0) + neighbor.weight
      if (alt < (dist.get(neighbor.node) || Infinity)) {
        dist.set(neighbor.node, alt)
        prev.set(neighbor.node, minNode)
      }
    }
  }

  // Reconstruct path
  const path: string[] = []
  let current: string | null = target
  while (current !== null) {
    path.unshift(current)
    current = prev.get(current) || null
  }

  if (path[0] !== source) {
    return { path: [], distance: Infinity }
  }

  return { path, distance: dist.get(target) || Infinity }
}

// BFS Shortest Path
export function computeBFS(
  nodes: GraphNode[],
  edges: GraphEdge[],
  source: string,
  target: string
): { path: string[]; distance: number } {
  const adj = buildAdjacencyList(nodes, edges)

  const dist = new Map<string, number>()
  const prev = new Map<string, string | null>()

  nodes.forEach(n => {
    dist.set(n.id, -1)
    prev.set(n.id, null)
  })
  dist.set(source, 0)

  const queue = [source]
  while (queue.length > 0) {
    const current = queue.shift()!

    if (current === target) break

    for (const neighbor of adj.get(current) || []) {
      if (dist.get(neighbor) === -1) {
        dist.set(neighbor, (dist.get(current) || 0) + 1)
        prev.set(neighbor, current)
        queue.push(neighbor)
      }
    }
  }

  // Reconstruct path
  const path: string[] = []
  let current: string | null = target
  while (current !== null) {
    path.unshift(current)
    current = prev.get(current) || null
  }

  if (path[0] !== source) {
    return { path: [], distance: -1 }
  }

  return { path, distance: dist.get(target) || -1 }
}

// Main compute function
export function runAlgorithm(
  algorithm: AlgorithmType,
  data: GraphData,
  options?: {
    sourceNode?: string
    targetNode?: string
  }
): {
  nodeScores?: Map<string, number>
  path?: string[]
  distance?: number
  similarities?: Map<string, Map<string, number>>
} {
  const { nodes, edges } = data
  const { sourceNode, targetNode } = options || {}

  switch (algorithm) {
    case 'pagerank':
      return { nodeScores: computePageRank(nodes, edges) }
    case 'degree':
      return { nodeScores: computeDegreeCentrality(nodes, edges) }
    case 'betweenness':
      return { nodeScores: computeBetweennessCentrality(nodes, edges) }
    case 'closeness':
      return { nodeScores: computeClosenessCentrality(nodes, edges) }
    case 'louvain':
      return { nodeScores: computeLouvain(nodes, edges) }
    case 'label-propagation':
      return { nodeScores: computeLabelPropagation(nodes, edges) }
    case 'jaccard':
      return { similarities: computeAllJaccardSimilarities(nodes, edges) }
    case 'cosine':
      // Similar to Jaccard for now
      return { similarities: computeAllJaccardSimilarities(nodes, edges) }
    case 'dijkstra':
      if (sourceNode && targetNode) {
        return computeDijkstra(nodes, edges, sourceNode, targetNode)
      }
      return {}
    case 'bfs':
      if (sourceNode && targetNode) {
        return computeBFS(nodes, edges, sourceNode, targetNode)
      }
      return {}
    case 'astar':
      // Use Dijkstra for now (A* needs heuristic)
      if (sourceNode && targetNode) {
        return computeDijkstra(nodes, edges, sourceNode, targetNode)
      }
      return {}
    default:
      return {}
  }
}
