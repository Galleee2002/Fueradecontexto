import assert from 'node:assert/strict'
import test from 'node:test'
import { isAdminRole, normalizeUserRole } from './user-role'

test('normalizeUserRole maps valid and invalid values to app roles', () => {
  assert.equal(normalizeUserRole('ADMIN'), 'ADMIN')
  assert.equal(normalizeUserRole('admin'), 'ADMIN')
  assert.equal(normalizeUserRole(' user '), 'USER')
  assert.equal(normalizeUserRole(undefined), 'USER')
  assert.equal(normalizeUserRole(null), 'USER')
})

test('isAdminRole only returns true for admin roles', () => {
  assert.equal(isAdminRole('ADMIN'), true)
  assert.equal(isAdminRole('admin'), true)
  assert.equal(isAdminRole('USER'), false)
  assert.equal(isAdminRole(undefined), false)
})
