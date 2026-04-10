import { redirect } from 'next/navigation'
import { auth } from '@/auth'

export async function requireAdminSession() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (session.user.role !== 'ADMIN') {
    redirect('/cuenta')
  }

  return session
}

export async function assertAdminSession() {
  const session = await auth()

  if (!session?.user || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized')
  }

  return session
}
