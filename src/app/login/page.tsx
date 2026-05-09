import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { LoginForm } from '@/features/auth/components/login-form'
import {
  getAuthenticatedLoginRedirect,
  resolveLoginRedirectTarget,
} from '@/features/auth/lib/login-routing'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Fueradecontexto',
  robots: { index: false, follow: false },
}

interface LoginPageSearchParams {
  callbackUrl?: string
  redirectTo?: string
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginPageSearchParams>
}) {
  const session = await auth()
  const authenticatedRedirect = getAuthenticatedLoginRedirect(session)

  if (authenticatedRedirect) {
    redirect(authenticatedRedirect)
  }

  const params = await searchParams
  const redirectTo = resolveLoginRedirectTarget(params)

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}
