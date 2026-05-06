'use client'

import { logoutAction } from '../actions/auth-actions'

export function LogoutButton() {
  return (
    <form action={logoutAction} className="w-full">
      <button
        type="submit"
        className="w-full rounded-[8px] bg-[var(--color-error)] px-4 py-3 text-center text-xs font-medium uppercase tracking-widest text-white transition-colors hover:bg-[#991b1b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-error)] focus-visible:ring-offset-2 focus-visible:ring-offset-background active:scale-[0.95]"
      >
        Cerrar sesión
      </button>
    </form>
  )
}
