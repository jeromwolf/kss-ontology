// Graph Algorithms Simulator Types

export interface GraphNode {
  id: string
  label: string
  x?: number
  y?: number
  // Algorithm results
  pagerank?: number
  degree?: number
  betweenness?: number
  closeness?: number
  community?: number
  similarity?: number
}

export interface GraphEdge {
  source: string
  target: string
  weight?: number
}

export interface GraphData {
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export type AlgorithmType =
  | 'pagerank'
  | 'degree'
  | 'betweenness'
  | 'closeness'
  | 'louvain'
  | 'label-propagation'
  | 'jaccard'
  | 'cosine'
  | 'dijkstra'
  | 'bfs'
  | 'astar'

export interface AlgorithmCategory {
  id: string
  name: string
  description: string
  algorithms: AlgorithmInfo[]
}

export interface AlgorithmInfo {
  id: AlgorithmType
  name: string
  description: string
  complexity: string
  useCase: string
}

export const ALGORITHM_CATEGORIES: AlgorithmCategory[] = [
  {
    id: 'centrality',
    name: 'Centrality',
    description: '그래프에서 중요한 노드를 찾는 알고리즘',
    algorithms: [
      {
        id: 'pagerank',
        name: 'PageRank',
        description: 'Google의 웹 페이지 순위 알고리즘. 연결된 노드의 중요도를 기반으로 계산',
        complexity: 'O(V + E)',
        useCase: '웹 페이지 순위, 인플루언서 찾기'
      },
      {
        id: 'degree',
        name: 'Degree Centrality',
        description: '노드에 연결된 엣지 수. 가장 단순한 중요도 측정',
        complexity: 'O(V)',
        useCase: '허브 노드 찾기, 네트워크 분석'
      },
      {
        id: 'betweenness',
        name: 'Betweenness Centrality',
        description: '노드가 다른 노드들 사이의 최단 경로에 얼마나 자주 등장하는지',
        complexity: 'O(V × E)',
        useCase: '브릿지 노드 찾기, 정보 흐름 분석'
      },
      {
        id: 'closeness',
        name: 'Closeness Centrality',
        description: '노드에서 다른 모든 노드까지의 평균 거리의 역수',
        complexity: 'O(V × E)',
        useCase: '정보 전파 분석, 접근성 평가'
      }
    ]
  },
  {
    id: 'community',
    name: 'Community Detection',
    description: '그래프 내 군집/커뮤니티를 발견하는 알고리즘',
    algorithms: [
      {
        id: 'louvain',
        name: 'Louvain',
        description: '모듈성 최적화 기반 커뮤니티 탐지. 계층적 커뮤니티 발견',
        complexity: 'O(N log N)',
        useCase: '소셜 네트워크 분석, 고객 세분화'
      },
      {
        id: 'label-propagation',
        name: 'Label Propagation',
        description: '이웃의 레이블을 전파하여 커뮤니티 탐지',
        complexity: 'O(E)',
        useCase: '대규모 그래프, 실시간 분석'
      }
    ]
  },
  {
    id: 'similarity',
    name: 'Similarity',
    description: '노드 간 유사도를 계산하는 알고리즘',
    algorithms: [
      {
        id: 'jaccard',
        name: 'Jaccard Similarity',
        description: '두 노드의 이웃 집합 교집합 / 합집합',
        complexity: 'O(degree)',
        useCase: '친구 추천, 유사 아이템 찾기'
      },
      {
        id: 'cosine',
        name: 'Cosine Similarity',
        description: '두 노드의 이웃 벡터 간 코사인 각도',
        complexity: 'O(degree)',
        useCase: '텍스트 유사도, 추천 시스템'
      }
    ]
  },
  {
    id: 'pathfinding',
    name: 'Pathfinding',
    description: '최단 경로를 찾는 알고리즘',
    algorithms: [
      {
        id: 'dijkstra',
        name: 'Dijkstra',
        description: '가중치 그래프에서 최단 경로 탐색',
        complexity: 'O((V + E) log V)',
        useCase: '네비게이션, 네트워크 라우팅'
      },
      {
        id: 'bfs',
        name: 'BFS (Breadth-First)',
        description: '무가중치 그래프에서 최단 경로 탐색',
        complexity: 'O(V + E)',
        useCase: '최소 홉 수 경로, 레벨별 탐색'
      },
      {
        id: 'astar',
        name: 'A* Search',
        description: '휴리스틱 기반 최적 경로 탐색',
        complexity: 'O(E)',
        useCase: '게임 AI, 지도 경로 탐색'
      }
    ]
  }
]

// Sample graph data for demonstration
export const SAMPLE_GRAPH: GraphData = {
  nodes: [
    { id: 'A', label: 'Alice' },
    { id: 'B', label: 'Bob' },
    { id: 'C', label: 'Charlie' },
    { id: 'D', label: 'Diana' },
    { id: 'E', label: 'Eve' },
    { id: 'F', label: 'Frank' },
    { id: 'G', label: 'Grace' },
    { id: 'H', label: 'Henry' },
  ],
  edges: [
    { source: 'A', target: 'B', weight: 1 },
    { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'C', weight: 1 },
    { source: 'B', target: 'D', weight: 3 },
    { source: 'C', target: 'D', weight: 1 },
    { source: 'C', target: 'E', weight: 2 },
    { source: 'D', target: 'F', weight: 1 },
    { source: 'E', target: 'F', weight: 1 },
    { source: 'E', target: 'G', weight: 2 },
    { source: 'F', target: 'G', weight: 1 },
    { source: 'F', target: 'H', weight: 3 },
    { source: 'G', target: 'H', weight: 1 },
  ]
}

// Larger sample for more interesting algorithms
export const LARGE_SAMPLE_GRAPH: GraphData = {
  nodes: [
    { id: '1', label: 'Node 1' },
    { id: '2', label: 'Node 2' },
    { id: '3', label: 'Node 3' },
    { id: '4', label: 'Node 4' },
    { id: '5', label: 'Node 5' },
    { id: '6', label: 'Node 6' },
    { id: '7', label: 'Node 7' },
    { id: '8', label: 'Node 8' },
    { id: '9', label: 'Node 9' },
    { id: '10', label: 'Node 10' },
    { id: '11', label: 'Node 11' },
    { id: '12', label: 'Node 12' },
  ],
  edges: [
    // Community 1: 1, 2, 3, 4
    { source: '1', target: '2' },
    { source: '1', target: '3' },
    { source: '2', target: '3' },
    { source: '2', target: '4' },
    { source: '3', target: '4' },
    // Community 2: 5, 6, 7, 8
    { source: '5', target: '6' },
    { source: '5', target: '7' },
    { source: '6', target: '7' },
    { source: '6', target: '8' },
    { source: '7', target: '8' },
    // Community 3: 9, 10, 11, 12
    { source: '9', target: '10' },
    { source: '9', target: '11' },
    { source: '10', target: '11' },
    { source: '10', target: '12' },
    { source: '11', target: '12' },
    // Bridge edges
    { source: '4', target: '5' },
    { source: '8', target: '9' },
  ]
}
