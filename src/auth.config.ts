import type { NextAuthConfig } from 'next-auth'
import { fetchUserRoleById } from '@/shared/infrastructure/auth/fetch-user-role'
import { isAdminRole, normalizeUserRole } from '@/shared/infrastructure/auth/user-role'

export const authConfig = {
  session: { strategy: 'jwt' as const },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
      if (isAdminRoute) {
        if (!auth?.user) {
          return false
        }

        if (!isAdminRole(auth.user.role)) {
          return Response.redirect(new URL('/cuenta', request.nextUrl))
        }

        return true
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        if (user.id) token.id = user.id
        token.role = normalizeUserRole((user as { id?: string; role?: string }).role)
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string

        if (typeof token.role === 'string' && token.role.trim().length > 0) {
          session.user.role = normalizeUserRole(token.role)
        } else if (typeof token.id === 'string') {
          const dbRole = await fetchUserRoleById(token.id)
          session.user.role = normalizeUserRole(dbRole)
        } else {
          session.user.role = 'USER'
        }
      }
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
