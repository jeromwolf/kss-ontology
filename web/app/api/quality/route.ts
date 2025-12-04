import { NextRequest, NextResponse } from 'next/server'
import {
  runQualityCheck,
  mergeDuplicateTriples,
  deleteLowConfidenceTriples,
  decayOutdatedTriples,
} from '@/lib/services/data-quality'

/**
 * GET /api/quality
 * 데이터 품질 검사 보고서 조회
 */
export async function GET(req: NextRequest) {
  try {
    const report = await runQualityCheck()

    return NextResponse.json({
      success: true,
      report,
    })
  } catch (error: any) {
    console.error('Quality check error:', error)
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
 * POST /api/quality
 * 데이터 품질 개선 작업 실행
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, tripleIds, threshold, daysThreshold, decayRate } = body

    switch (action) {
      case 'merge-duplicates':
        // 중복 Triple 병합
        if (!tripleIds || tripleIds.length < 2) {
          return NextResponse.json(
            {
              success: false,
              error: 'tripleIds가 필요합니다 (최소 2개).',
            },
            { status: 400 }
          )
        }

        const mergeResult = await mergeDuplicateTriples(tripleIds)

        return NextResponse.json({
          success: true,
          message: `${mergeResult.deleted}개 중복 Triple 병합 완료`,
          result: mergeResult,
        })

      case 'delete-low-confidence':
        // 저신뢰도 Triple 삭제
        const deleteThreshold = threshold || 0.3
        const deletedCount = await deleteLowConfidenceTriples(deleteThreshold)

        return NextResponse.json({
          success: true,
          message: `${deletedCount}개 저신뢰도 Triple 삭제 완료`,
          result: { deletedCount, threshold: deleteThreshold },
        })

      case 'decay-outdated':
        // 오래된 Triple 신뢰도 감소
        const days = daysThreshold || 90
        const decay = decayRate || 0.1
        const updatedCount = await decayOutdatedTriples(days, decay)

        return NextResponse.json({
          success: true,
          message: `${updatedCount}개 오래된 Triple 신뢰도 감소 완료`,
          result: { updatedCount, daysThreshold: days, decayRate: decay },
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
    console.error('Quality action error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}
