import { neon } from '@neondatabase/serverless'

/**
 * Lectura mínima del rol en Postgres (sin Prisma) para poder usarla en Edge / middleware.
 */
export async function fetchUserRoleById(userId: string): Promise<string | null> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) return null

  try {
    const sql = neon(databaseUrl)
    const rows = (await sql`
      SELECT "role" FROM "User" WHERE "id" = ${userId} LIMIT 1
    `) as { role: string }[]
    return rows[0]?.role ?? null
  } catch {
    return null
  }
}
