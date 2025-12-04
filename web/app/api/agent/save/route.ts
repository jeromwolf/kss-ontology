import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

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
 * POST /api/agent/save
 * Agent 설정 저장
 */
export async function POST(req: NextRequest) {
  try {
    const config = await req.json()

    if (!config.name || !config.role || !config.instructions) {
      return NextResponse.json(
        { success: false, error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      )
    }

    // agents 테이블이 없으면 생성
    await getPool().query(`
      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(255) NOT NULL,
        instructions TEXT NOT NULL,
        tools TEXT[] NOT NULL,
        temperature DECIMAL(2,1) NOT NULL DEFAULT 0.7,
        max_tokens INTEGER NOT NULL DEFAULT 2000,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // Agent 저장 (이름이 같으면 업데이트)
    const result = await getPool().query(
      `
      INSERT INTO agents (name, role, instructions, tools, temperature, max_tokens)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (name)
      DO UPDATE SET
        role = EXCLUDED.role,
        instructions = EXCLUDED.instructions,
        tools = EXCLUDED.tools,
        temperature = EXCLUDED.temperature,
        max_tokens = EXCLUDED.max_tokens,
        updated_at = CURRENT_TIMESTAMP
      RETURNING id
    `,
      [
        config.name,
        config.role,
        config.instructions,
        config.tools,
        config.temperature,
        config.maxTokens,
      ]
    )

    return NextResponse.json({
      success: true,
      agentId: result.rows[0].id,
      message: 'Agent가 성공적으로 저장되었습니다.',
    })
  } catch (error: any) {
    console.error('Agent save error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Agent 저장 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/agent/save
 * 저장된 Agent 목록 조회
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    if (name) {
      // 특정 Agent 조회
      const result = await getPool().query(
        `
        SELECT id, name, role, instructions, tools, temperature, max_tokens as "maxTokens", created_at, updated_at
        FROM agents
        WHERE name = $1
      `,
        [name]
      )

      if (result.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Agent를 찾을 수 없습니다.' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        agent: result.rows[0],
      })
    } else {
      // 전체 Agent 목록 조회
      const result = await getPool().query(`
        SELECT id, name, role, tools, created_at, updated_at
        FROM agents
        ORDER BY updated_at DESC
      `)

      return NextResponse.json({
        success: true,
        agents: result.rows,
      })
    }
  } catch (error: any) {
    console.error('Agent list error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Agent 목록 조회 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/agent/save
 * Agent 삭제
 */
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const name = searchParams.get('name')

    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Agent 이름이 필요합니다.' },
        { status: 400 }
      )
    }

    const result = await getPool().query(
      `
      DELETE FROM agents
      WHERE name = $1
      RETURNING id
    `,
      [name]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: 'Agent를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Agent가 성공적으로 삭제되었습니다.',
    })
  } catch (error: any) {
    console.error('Agent delete error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Agent 삭제 중 오류가 발생했습니다.',
      },
      { status: 500 }
    )
  }
}
