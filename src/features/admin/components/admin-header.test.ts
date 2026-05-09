import assert from 'node:assert/strict'
import test from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { AdminHeader } from './admin-header'

test('AdminHeader renders a visible logout action for admin users', () => {
  const markup = renderToStaticMarkup(createElement(AdminHeader, { onToggleSidebar() {} }))

  assert.match(markup, /Cerrar sesión/)
})
