import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import * as schema from './schema'

// Lazy initialization to avoid build-time errors
let pool: Pool | null = null
let drizzleDb: NodePgDatabase<typeof schema> | null = null

// Extract schema from DATABASE_URL if present
function getSchemaFromUrl(): string {
  const url = process.env.DATABASE_URL || ''
  const schemaMatch = url.match(/[?&]schema=([^&]+)/)
  return schemaMatch ? schemaMatch[1] : 'public'
}

function getPool() {
  if (!pool) {
    const schema = getSchemaFromUrl()
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || '',
      max: 10, // 최대 연결 수
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
    // Set search_path for all connections
    pool.on('connect', (client) => {
      client.query(`SET search_path TO ${schema}, public`)
    })
  }
  return pool
}

function getDb(): NodePgDatabase<typeof schema> {
  if (!drizzleDb) {
    drizzleDb = drizzle(getPool(), { schema })
  }
  return drizzleDb
}

// Proxy to maintain backward compatibility while supporting lazy initialization
export const db = new Proxy({} as NodePgDatabase<typeof schema>, {
  get(_, prop) {
    return (getDb() as any)[prop]
  }
})

// 연결 테스트 함수
export async function testConnection() {
  try {
    const client = await getPool().connect()
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
  if (pool) await pool.end()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  if (pool) await pool.end()
  process.exit(0)
})
