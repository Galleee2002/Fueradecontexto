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
        return !!auth?.user
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
