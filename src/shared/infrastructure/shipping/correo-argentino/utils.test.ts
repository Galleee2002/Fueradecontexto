import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeCorreoArgentinoCustomerId } from './utils'

test('normalizeCorreoArgentinoCustomerId pads shorter values to 10 digits', () => {
  assert.equal(normalizeCorreoArgentinoCustomerId('1864069'), '0001864069')
})

test('normalizeCorreoArgentinoCustomerId preserves 10-digit values', () => {
  assert.equal(normalizeCorreoArgentinoCustomerId('0001864069'), '0001864069')
})

test('normalizeCorreoArgentinoCustomerId rejects non-digit values', () => {
  assert.throws(
    () => normalizeCorreoArgentinoCustomerId('18A64069'),
    /debe contener solo dígitos/,
  )
})

test('normalizeCorreoArgentinoCustomerId rejects values longer than 10 digits', () => {
  assert.throws(
    () => normalizeCorreoArgentinoCustomerId('12345678901'),
    /no puede superar los 10 dígitos/,
  )
})
