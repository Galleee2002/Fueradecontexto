import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { hash } from 'bcryptjs'

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.argv[2]
  const password = process.argv[3]

  if (!email || !password) {
    console.error('Uso: npm run create-admin -- <email> <contraseña>')
    console.error('Ej:  npm run create-admin -- admin@ejemplo.com miContrasena123')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('Error: La contraseña debe tener al menos 8 caracteres')
    process.exit(1)
  }

  const hashedPassword = await hash(password, 12)

  const user = await prisma.user.upsert({
    where: { email },
    update: { password: hashedPassword, role: 'ADMIN' },
    create: { email, password: hashedPassword, role: 'ADMIN' },
  })

  console.log(`✓ Admin creado/actualizado exitosamente: ${user.email}`)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  void prisma.$disconnect()
  process.exit(1)
})
