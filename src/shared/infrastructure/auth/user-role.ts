export type AppUserRole = 'ADMIN' | 'USER'

/**
 * Normaliza el rol persistido (p. ej. "admin", "ADMIN") al valor usado en sesión y guards.
 */
export function normalizeUserRole(role: unknown): AppUserRole {
  if (role == null || typeof role !== 'string') return 'USER'
  const upper = role.trim().toUpperCase()
  return upper === 'ADMIN' ? 'ADMIN' : 'USER'
}

export function isAdminRole(role: unknown): boolean {
  return normalizeUserRole(role) === 'ADMIN'
}
