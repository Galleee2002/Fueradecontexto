import type { NextAuthConfig } from 'next-auth'

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

        if (auth.user.role !== 'ADMIN') {
          return Response.redirect(new URL('/cuenta', request.nextUrl))
        }

        return true
      }
      return true
    },
    jwt({ token, user }) {
      if (user) {
        if (user.id) token.id = user.id
        const role = (user as { id?: string; role?: string }).role
        if (role) token.role = role
      }
      return token
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      if (token.role) (session.user as { role?: string }).role = token.role as string
      return session
    },
  },
  providers: [],
} satisfies NextAuthConfig
