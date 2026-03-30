import { neon } from '@neondatabase/serverless'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)
require('dotenv').config({ path: '.env' })

const sql = neon(process.env.DATABASE_URL)

async function seed() {
  console.log('No hay datos de seed configurados.')
  console.log('Agrega productos desde el panel de administración.')
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
