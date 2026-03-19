'use client'

import { logoutAction } from '@/features/auth/actions/auth-actions'

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="border border-border text-xs tracking-widest uppercase px-4 py-2 hover:bg-surface transition-colors"
      >
        Cerrar sesión
      </button>
    </form>
  )
}
