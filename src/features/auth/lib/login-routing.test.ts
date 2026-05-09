import assert from 'node:assert/strict'
import test from 'node:test'
import {
  getAuthenticatedLoginRedirect,
  resolveLoginRedirectTarget,
} from './login-routing'

test('resolveLoginRedirectTarget keeps safe internal redirects and rejects external ones', () => {
  assert.equal(
    resolveLoginRedirectTarget({
      callbackUrl: '/admin/productos?status=active',
    }),
    '/admin/productos?status=active',
  )

  assert.equal(
    resolveLoginRedirectTarget({
      callbackUrl: 'https://evil.example.com/admin',
    }),
    '/cuenta',
  )

  assert.equal(
    resolveLoginRedirectTarget({
      redirectTo: 'http://localhost:3000/admin?tab=orders',
    }),
    '/admin?tab=orders',
  )
})

test('getAuthenticatedLoginRedirect sends admins to admin and users to account', () => {
  assert.equal(getAuthenticatedLoginRedirect({ user: { role: 'ADMIN' } }), '/admin')
  assert.equal(getAuthenticatedLoginRedirect({ user: { role: 'admin' } }), '/admin')
  assert.equal(getAuthenticatedLoginRedirect({ user: { role: 'USER' } }), '/cuenta')
  assert.equal(getAuthenticatedLoginRedirect({ user: {} }), '/cuenta')
  assert.equal(getAuthenticatedLoginRedirect(null), null)
})
