import { NextResponse } from 'next/server'
import { getApiDocs } from '@/lib/swagger'

/**
 * GET /api/docs
 * OpenAPI 스펙 반환
 */
export async function GET() {
  try {
    const spec = await getApiDocs()
    return NextResponse.json(spec)
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to generate API documentation' },
      { status: 500 }
    )
  }
}
