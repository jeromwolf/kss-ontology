'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface JobStatus {
  name: string
  schedule: string
  enabled: boolean
  lastRun?: string
  nextRun?: string
}

interface OntologyStats {
  totalTriples: number
  highConfidenceTriples: number
  userValidatedTriples: number
  avgConfidence: number
  companiesCount: number
  newsCount: number
  feedbackCount: number
}

interface SystemHealth {
  database: 'healthy' | 'warning' | 'error'
  scheduler: 'running' | 'stopped' | 'error'
  timestamp: string
}

export default function MonitoringPage() {
  const [jobs, setJobs] = useState<JobStatus[]>([])
  const [stats, setStats] = useState<OntologyStats | null>(null)
  const [health, setHealth] = useState<SystemHealth | null>(null)
  const [loading, setLoading] = useState(true)
  const [runningJob, setRunningJob] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // 30초마다 갱신
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [schedulerRes, statsRes] = await Promise.all([
        fetch('/api/scheduler'),
        fetch('/api/ontology/stats'),
      ])

      if (schedulerRes.ok) {
        const schedulerData = await schedulerRes.json()
        setJobs(schedulerData.jobs || [])
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        // API 응답 구조가 { success, data } 형태인 경우 처리
        setStats(statsData.data || statsData)
      }

      // 헬스 체크
      setHealth({
        database: statsRes.ok ? 'healthy' : 'error',
        scheduler: schedulerRes.ok ? 'running' : 'error',
        timestamp: new Date().toISOString(),
      })
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error)
      setHealth({
        database: 'error',
        scheduler: 'error',
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
    }
  }

  const runJobManually = async (jobName: string) => {
    setRunningJob(jobName)
    try {
      const res = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'run', jobName }),
      })

      if (res.ok) {
        alert(`작업 "${jobName}"이 시작되었습니다. 로그를 확인하세요.`)
        fetchData() // 상태 갱신
      } else {
        const data = await res.json()
        alert(`작업 실행 실패: ${data.error}`)
      }
    } catch (error) {
      alert('작업 실행 중 오류가 발생했습니다.')
    } finally {
      setRunningJob(null)
    }
  }

  const toggleJob = async (jobName: string, enabled: boolean) => {
    try {
      const res = await fetch('/api/scheduler', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle', jobName, enabled: !enabled }),
      })

      if (res.ok) {
        fetchData()
      } else {
        const data = await res.json()
        alert(`작업 토글 실패: ${data.error}`)
      }
    } catch (error) {
      alert('작업 토글 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">모니터링 데이터 로딩 중...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">시스템 모니터링</h1>
        <p className="text-gray-600">배치 작업, 데이터베이스, 시스템 상태 모니터링</p>
      </div>

      {/* Navigation */}
      <div className="mb-8 flex gap-4">
        <Link href="/dashboard">
          <Button variant="outline">대시보드로</Button>
        </Link>
        <Link href="/dashboard/graph">
          <Button variant="outline">Knowledge Graph</Button>
        </Link>
        <Button onClick={fetchData} variant="outline">
          새로고침
        </Button>
      </div>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>데이터베이스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  health?.database === 'healthy'
                    ? 'bg-green-500'
                    : health?.database === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                }`}
              />
              <span className="font-medium">
                {health?.database === 'healthy'
                  ? '정상'
                  : health?.database === 'warning'
                    ? '경고'
                    : '오류'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>스케줄러</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  health?.scheduler === 'running' ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <span className="font-medium">
                {health?.scheduler === 'running' ? '실행 중' : '중지됨'}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>마지막 업데이트</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {health?.timestamp
                ? new Date(health.timestamp).toLocaleString('ko-KR')
                : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ontology Statistics */}
      {stats && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>온톨로지 통계</CardTitle>
            <CardDescription>현재 데이터베이스 상태</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-600">{stats.totalTriples}</div>
                <div className="text-sm text-gray-600">총 Triple</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {stats.highConfidenceTriples}
                </div>
                <div className="text-sm text-gray-600">고신뢰도 (≥80%)</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {stats.userValidatedTriples}
                </div>
                <div className="text-sm text-gray-600">사용자 검증</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {(stats.avgConfidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">평균 신뢰도</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 pt-6 border-t">
              <div>
                <div className="text-2xl font-bold">{stats.companiesCount}</div>
                <div className="text-sm text-gray-600">커버 기업</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.newsCount}</div>
                <div className="text-sm text-gray-600">뉴스 기사</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.feedbackCount}</div>
                <div className="text-sm text-gray-600">피드백 이력</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scheduled Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>스케줄 작업</CardTitle>
          <CardDescription>배치 작업 스케줄 및 실행 이력</CardDescription>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-gray-600">등록된 작업이 없습니다.</p>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.name} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg">{job.name}</h3>
                      <p className="text-sm text-gray-600">스케줄: {job.schedule}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          job.enabled
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {job.enabled ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <span className="text-gray-600">마지막 실행:</span>{' '}
                      <span className="font-medium">
                        {job.lastRun
                          ? new Date(job.lastRun).toLocaleString('ko-KR')
                          : '없음'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">다음 실행:</span>{' '}
                      <span className="font-medium">
                        {job.nextRun
                          ? new Date(job.nextRun).toLocaleString('ko-KR')
                          : '없음'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => runJobManually(job.name)}
                      disabled={runningJob === job.name}
                    >
                      {runningJob === job.name ? '실행 중...' : '지금 실행'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleJob(job.name, job.enabled)}
                    >
                      {job.enabled ? '비활성화' : '활성화'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">빠른 작업</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium mb-2">배치 작업 실행</h4>
            <p className="text-sm text-gray-600 mb-2">
              일일 배치 작업을 즉시 실행합니다. (뉴스 수집 + Triple 추출)
            </p>
            <Button
              size="sm"
              onClick={() => runJobManually('daily-batch')}
              disabled={runningJob === 'daily-batch'}
            >
              실행
            </Button>
          </div>
          <div>
            <h4 className="font-medium mb-2">헬스 체크</h4>
            <p className="text-sm text-gray-600 mb-2">
              데이터베이스 연결 상태를 확인합니다.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => runJobManually('health-check')}
              disabled={runningJob === 'health-check'}
            >
              확인
            </Button>
          </div>
          <div>
            <h4 className="font-medium mb-2">Knowledge Graph</h4>
            <p className="text-sm text-gray-600 mb-2">온톨로지 관계망을 시각화합니다.</p>
            <Link href="/dashboard/graph">
              <Button size="sm" variant="outline">
                보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
