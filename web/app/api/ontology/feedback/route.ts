import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

// Force dynamic rendering to avoid build-time DB connection
export const dynamic = 'force-dynamic'

// Lazy initialization to avoid build-time errors
let pool: Pool | null = null

function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || '',
    })
  }
  return pool
}

/**
 * POST /api/ontology/feedback
 *
 * 사용자가 Triple에 대한 피드백 제공
 * - 신뢰도 조정
 * - Triple 승인/거부
 * - 메모 추가
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { tripleId, feedback } = body

    // Validation
    if (!tripleId || typeof tripleId !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Invalid triple ID' },
        { status: 400 }
      )
    }

    if (!feedback || typeof feedback !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Invalid feedback object' },
        { status: 400 }
      )
    }

    const { action, confidence, notes } = feedback

    // action: 'approve' | 'reject' | 'adjust'
    if (!['approve', 'reject', 'adjust'].includes(action)) {
      return NextResponse.json(
        { success: false, error: 'Invalid action. Must be approve, reject, or adjust' },
        { status: 400 }
      )
    }

    const client = await getPool().connect()

    try {
      await client.query('BEGIN')

      // 1. Triple 존재 확인
      const tripleResult = await client.query(
        'SELECT * FROM knowledge_triples WHERE id = $1',
        [tripleId]
      )

      if (tripleResult.rows.length === 0) {
        await client.query('ROLLBACK')
        return NextResponse.json(
          { success: false, error: 'Triple not found' },
          { status: 404 }
        )
      }

      const triple = tripleResult.rows[0]

      // 2. 액션에 따라 처리
      if (action === 'reject') {
        // Triple 삭제 또는 비활성화
        await client.query(
          'DELETE FROM knowledge_triples WHERE id = $1',
          [tripleId]
        )

        await client.query('COMMIT')
        return NextResponse.json({
          success: true,
          message: 'Triple rejected and removed',
          tripleId
        })
      }

      // 3. approve 또는 adjust: 신뢰도 업데이트
      let newConfidence = triple.confidence

      if (action === 'approve') {
        // 승인 시 신뢰도를 높임 (최대 1.0)
        newConfidence = Math.min(1.0, triple.confidence + 0.15)
      } else if (action === 'adjust' && confidence !== undefined) {
        // 사용자가 직접 지정한 신뢰도
        if (typeof confidence !== 'number' || confidence < 0 || confidence > 1) {
          await client.query('ROLLBACK')
          return NextResponse.json(
            { success: false, error: 'Confidence must be between 0 and 1' },
            { status: 400 }
          )
        }
        newConfidence = confidence
      }

      // 4. validated_by를 'user'로 변경 (사용자가 검증함)
      await client.query(
        `UPDATE knowledge_triples
         SET confidence = $1,
             validated_by = 'user',
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2`,
        [newConfidence, tripleId]
      )

      // 5. 사용자 피드백 로그 저장 (선택적)
      if (notes) {
        await client.query(
          `INSERT INTO triple_feedback (triple_id, action, confidence, notes, created_at)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
           ON CONFLICT DO NOTHING`,
          [tripleId, action, newConfidence, notes]
        )
      }

      await client.query('COMMIT')

      // 6. 업데이트된 Triple 반환
      const updatedTriple = await client.query(
        'SELECT * FROM knowledge_triples WHERE id = $1',
        [tripleId]
      )

      return NextResponse.json({
        success: true,
        message: `Triple ${action}ed successfully`,
        triple: {
          id: updatedTriple.rows[0].id,
          subject: updatedTriple.rows[0].subject,
          predicate: updatedTriple.rows[0].predicate,
          object: updatedTriple.rows[0].object,
          confidence: updatedTriple.rows[0].confidence,
          validatedBy: updatedTriple.rows[0].validated_by
        }
      })
    } catch (error) {
      await client.query('ROLLBACK')
      throw error
    } finally {
      client.release()
    }
  } catch (error) {
    console.error('Feedback API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/ontology/feedback
 *
 * 피드백 이력 조회 (선택적 기능)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const tripleId = searchParams.get('tripleId')

    if (!tripleId) {
      return NextResponse.json(
        { success: false, error: 'Triple ID required' },
        { status: 400 }
      )
    }

    const result = await getPool().query(
      `SELECT * FROM triple_feedback
       WHERE triple_id = $1
       ORDER BY created_at DESC`,
      [parseInt(tripleId)]
    )

    return NextResponse.json({
      success: true,
      feedback: result.rows
    })
  } catch (error) {
    console.error('Get feedback error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
