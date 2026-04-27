import type { Metadata } from 'next'
import { LoginForm } from '@/features/auth/components/login-form'
import { SITE_URL } from '@/shared/config/site'

export const metadata: Metadata = {
  title: 'Iniciar sesión — Fueradecontexto',
  robots: { index: false, follow: false },
}

interface LoginPageSearchParams {
  callbackUrl?: string
  redirectTo?: string
}

function resolveRedirect(searchParams: LoginPageSearchParams) {
  const candidate = searchParams.callbackUrl ?? searchParams.redirectTo
  if (!candidate) return '/cuenta'
  if (candidate.startsWith('/') && !candidate.startsWith('//')) {
    return candidate
  }

  try {
    const callbackUrl = new URL(candidate)
    const siteUrl = new URL(SITE_URL)
    if (callbackUrl.origin !== siteUrl.origin) return '/cuenta'
    return `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}` || '/cuenta'
  } catch {
    return '/cuenta'
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<LoginPageSearchParams>
}) {
  const params = await searchParams
  const redirectTo = resolveRedirect(params)

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <LoginForm redirectTo={redirectTo} />
      </div>
    </div>
  )
}
