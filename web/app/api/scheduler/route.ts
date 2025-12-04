import { NextRequest, NextResponse } from 'next/server'
import { scheduler } from '@/lib/services/scheduler'

// Force dynamic rendering to avoid build-time errors
export const dynamic = 'force-dynamic'

/**
 * GET /api/scheduler
 * 스케줄러 상태 조회
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const jobName = searchParams.get('job')

    const status = scheduler.getJobStatus(jobName || undefined)

    return NextResponse.json({
      success: true,
      jobs: status,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/scheduler
 * 스케줄러 제어 (초기화, 작업 실행, 활성화/비활성화)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, jobName, enabled } = body

    switch (action) {
      case 'initialize':
        // 스케줄러 초기화
        scheduler.initialize()
        return NextResponse.json({
          success: true,
          message: '스케줄러가 초기화되었습니다.',
        })

      case 'run':
        // 작업 수동 실행
        if (!jobName) {
          return NextResponse.json(
            {
              success: false,
              error: 'jobName이 필요합니다.',
            },
            { status: 400 }
          )
        }

        await scheduler.runJobManually(jobName)

        return NextResponse.json({
          success: true,
          message: `${jobName} 작업이 완료되었습니다.`,
        })

      case 'toggle':
        // 작업 활성화/비활성화
        if (!jobName || enabled === undefined) {
          return NextResponse.json(
            {
              success: false,
              error: 'jobName과 enabled가 필요합니다.',
            },
            { status: 400 }
          )
        }

        scheduler.toggleJob(jobName, enabled)

        return NextResponse.json({
          success: true,
          message: `${jobName} 작업이 ${enabled ? '활성화' : '비활성화'}되었습니다.`,
        })

      case 'stop-all':
        // 모든 작업 중지
        scheduler.stopAll()

        return NextResponse.json({
          success: true,
          message: '모든 작업이 중지되었습니다.',
        })

      default:
        return NextResponse.json(
          {
            success: false,
            error: `알 수 없는 액션: ${action}`,
          },
          { status: 400 }
        )
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
