import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// PostgreSQL 연결 풀 생성
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10, // 최대 연결 수
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Drizzle ORM 인스턴스
export const db = drizzle(pool, { schema })

// 연결 테스트 함수
export async function testConnection() {
  try {
    const client = await pool.connect()
    console.log('✅ PostgreSQL connected successfully')
    client.release()
    return true
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error)
    return false
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  await pool.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await pool.end()
  process.exit(0)
})
