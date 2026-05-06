import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { isAdminRole } from '@/shared/infrastructure/auth/user-role'

export async function requireAdminSession() {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  if (!isAdminRole(session.user.role)) {
    redirect('/cuenta')
  }

  return session
}

export async function assertAdminSession() {
  const session = await auth()

  if (!session?.user || !isAdminRole(session.user.role)) {
    throw new Error('Unauthorized')
  }

  return session
}
