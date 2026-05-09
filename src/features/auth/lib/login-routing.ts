import { SITE_URL } from '@/shared/config/site'
import { isAdminRole } from '@/shared/infrastructure/auth/user-role'

const DEFAULT_AUTH_REDIRECT = '/cuenta'

interface LoginRedirectSearchParams {
  callbackUrl?: string
  redirectTo?: string
}

interface SessionLike {
  user?: {
    role?: string | null
  } | null
}

function resolveSafeAuthRedirect(candidate: string | null | undefined, siteUrl = SITE_URL) {
  if (!candidate) return DEFAULT_AUTH_REDIRECT
  if (candidate.startsWith('/') && !candidate.startsWith('//')) {
    return candidate
  }

  try {
    const callbackUrl = new URL(candidate)
    const allowedOrigin = new URL(siteUrl)

    if (callbackUrl.origin !== allowedOrigin.origin) {
      return DEFAULT_AUTH_REDIRECT
    }

    return `${callbackUrl.pathname}${callbackUrl.search}${callbackUrl.hash}` || DEFAULT_AUTH_REDIRECT
  } catch {
    return DEFAULT_AUTH_REDIRECT
  }
}

export function resolveLoginRedirectTarget(
  searchParams: LoginRedirectSearchParams,
  siteUrl = SITE_URL,
) {
  const candidate = searchParams.callbackUrl ?? searchParams.redirectTo
  return resolveSafeAuthRedirect(candidate, siteUrl)
}

export function resolveLoginActionRedirect(rawRedirect: FormDataEntryValue | null) {
  if (typeof rawRedirect !== 'string') {
    return DEFAULT_AUTH_REDIRECT
  }

  return resolveSafeAuthRedirect(rawRedirect)
}

export function getAuthenticatedLoginRedirect(session: SessionLike | null): '/admin' | '/cuenta' | null {
  if (!session?.user) return null
  return isAdminRole(session.user.role) ? '/admin' : '/cuenta'
}
