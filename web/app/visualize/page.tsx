'use client'

/**
 * 고급 시각화 페이지
 * 네트워크 그래프 및 차트 대시보드
 */

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

// ForceGraph2D는 클라이언트 사이드에서만 로드
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), {
  ssr: false,
})

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function VisualizePage() {
  const [graphData, setGraphData] = useState<any>(null)
  const [analyticsData, setAnalyticsData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'graph' | 'charts'>('graph')

  useEffect(() => {
    // 그래프 데이터 로드
    fetch('/api/graph?limit=50&minConfidence=0.7')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setGraphData(data.data)
        }
      })
      .catch((err) => console.error('Failed to load graph data:', err))

    // Analytics 데이터 로드
    fetch('/api/analytics?period=7d')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setAnalyticsData(data.data)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load analytics data:', err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">시각화 데이터 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            KSS 온톨로지 시각화
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            공급망 네트워크 그래프 및 통계 차트
          </p>
        </div>
      </div>

      {/* 탭 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('graph')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'graph'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              네트워크 그래프
            </button>
            <button
              onClick={() => setActiveTab('charts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'charts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              통계 차트
            </button>
          </div>
        </div>
      </div>

      {/* 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'graph' && graphData && (
          <div>
            {/* 그래프 통계 */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600">노드 수</div>
                <div className="text-2xl font-bold text-gray-900">
                  {graphData.stats.totalNodes}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600">링크 수</div>
                <div className="text-2xl font-bold text-gray-900">
                  {graphData.stats.totalLinks}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-600">평균 신뢰도</div>
                <div className="text-2xl font-bold text-gray-900">
                  {(graphData.stats.avgConfidence * 100).toFixed(1)}%
                </div>
              </div>
            </div>

            {/* 네트워크 그래프 */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="h-[600px]">
                <ForceGraph2D
                  graphData={graphData}
                  nodeLabel="name"
                  nodeAutoColorBy="group"
                  linkLabel="relation"
                  linkWidth={(link: any) => link.confidence * 2}
                  nodeCanvasObject={(node: any, ctx: any, globalScale: number) => {
                    const label = node.name
                    const fontSize = 12 / globalScale
                    ctx.font = `${fontSize}px Sans-Serif`
                    const textWidth = ctx.measureText(label).width
                    const bckgDimensions = [textWidth, fontSize].map(
                      (n) => n + fontSize * 0.2
                    )

                    // 노드 색상
                    const color =
                      node.type === 'company' ? '#3B82F6' : '#10B981'
                    ctx.fillStyle = color
                    ctx.beginPath()
                    ctx.arc(node.x, node.y, node.val, 0, 2 * Math.PI, false)
                    ctx.fill()

                    // 텍스트 배경
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                    ctx.fillRect(
                      node.x - bckgDimensions[0] / 2,
                      node.y + node.val + 2,
                      bckgDimensions[0],
                      bckgDimensions[1]
                    )

                    // 텍스트
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'top'
                    ctx.fillStyle = '#1F2937'
                    ctx.fillText(label, node.x, node.y + node.val + 2)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'charts' && analyticsData && (
          <div className="space-y-6">
            {/* 신뢰도 분포 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">신뢰도 분포</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: '매우 높음 (≥0.9)',
                      count: analyticsData.triples.byConfidence.veryHigh,
                    },
                    {
                      name: '높음 (0.8-0.9)',
                      count: analyticsData.triples.byConfidence.high,
                    },
                    {
                      name: '중간 (0.7-0.8)',
                      count: analyticsData.triples.byConfidence.medium,
                    },
                    {
                      name: '낮음 (<0.7)',
                      count: analyticsData.triples.byConfidence.low,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* 검증 방법별 분포 */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">검증 방법별 분포</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      {
                        name: 'Baseline',
                        value: analyticsData.triples.byValidation.baseline,
                      },
                      {
                        name: 'GPT',
                        value: analyticsData.triples.byValidation.gpt,
                      },
                      {
                        name: 'User',
                        value: analyticsData.triples.byValidation.user,
                      },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 일별 추이 */}
            {analyticsData.trends.daily.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">일별 Triple 추이</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={analyticsData.trends.daily.reverse()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={(value) =>
                        new Date(value).toLocaleDateString('ko-KR')
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={(value) =>
                        new Date(value).toLocaleDateString('ko-KR')
                      }
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#3B82F6"
                      name="Triple 수"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* 관계 타입 Top 5 */}
            {analyticsData.relationTypes.length > 0 && (
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold mb-4">
                  관계 타입 Top 5
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analyticsData.relationTypes.slice(0, 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
