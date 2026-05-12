'use client'

import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

/**
 * Auth.js SessionProvider inicializa el estado solo en el primer mount.
 * Tras signOut/signIn vía Server Action + redirect, Next puede rehidratar el
 * layout con una sesión nueva sin desmontar el provider: `useSession()` queda
 * desincronizado del servidor. Una key estable por identidad fuerza remount.
 */
function sessionProviderKey(session: Session | null): string {
  const user = session?.user
  if (!user?.id) return '__signed_out__'
  return `${user.id}:${user.role ?? ''}`
}

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  return (
    <SessionProvider key={sessionProviderKey(session)} session={session}>
      {children}
    </SessionProvider>
  )
}
