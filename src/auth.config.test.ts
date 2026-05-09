import assert from 'node:assert/strict'
import test from 'node:test'
import { authConfig } from './auth.config'

const callbacks = authConfig.callbacks

if (!callbacks?.authorized || !callbacks.jwt || !callbacks.session) {
  throw new Error('Auth callbacks are not configured')
}

test('authorized blocks unauthenticated admin routes', async () => {
  const result = await callbacks.authorized({
    auth: null,
    request: { nextUrl: new URL('https://example.com/admin') } as never,
  })

  assert.equal(result, false)
})

test('authorized redirects non-admin users away from admin routes', async () => {
  const result = await callbacks.authorized({
    auth: {
      user: { id: 'user-1', email: 'user@example.com', role: 'USER' },
      expires: new Date('2099-01-01T00:00:00.000Z').toISOString(),
    },
    request: { nextUrl: new URL('https://example.com/admin/productos') } as never,
  })

  assert.ok(result instanceof Response)
  assert.equal(result.status, 302)
  assert.equal(result.headers.get('location'), 'https://example.com/cuenta')
})

test('authorized allows admins into admin routes', async () => {
  const result = await callbacks.authorized({
    auth: {
      user: { id: 'admin-1', email: 'admin@example.com', role: 'ADMIN' },
      expires: new Date('2099-01-01T00:00:00.000Z').toISOString(),
    },
    request: { nextUrl: new URL('https://example.com/admin/productos') } as never,
  })

  assert.equal(result, true)
})

test('jwt and session callbacks persist normalized id and role', async () => {
  const token = await callbacks.jwt({
    token: {},
    user: { id: 'user-1', email: 'admin@example.com', role: 'admin' } as never,
    account: null,
    trigger: 'signIn',
    isNewUser: false,
  } as never)

  assert.equal(token.id, 'user-1')
  assert.equal(token.role, 'ADMIN')

  const session = await callbacks.session({
    session: {
      user: {
        id: '',
        email: 'admin@example.com',
        role: 'USER',
      },
      expires: new Date('2099-01-01T00:00:00.000Z').toISOString(),
    },
    token,
  } as never)

  assert.equal(session.user.id, 'user-1')
  assert.equal(session.user.role, 'ADMIN')
})
