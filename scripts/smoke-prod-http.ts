/**
 * Smoke HTTP contra producción (sin pagos).
 * Ejecutar: pnpm exec tsx scripts/smoke-prod-http.ts
 *
 * Comprueba GET de páginas públicas y POST al webhook con cuerpo no-payment (200).
 * El flujo completo compra → emails requiere prueba manual (ver plan de auditoría).
 */

const BASE = process.env.SMOKE_BASE_URL ?? 'https://www.fueradecontexto.com.ar'

async function main() {
  const paths = ['/', '/productos', '/login']
  for (const path of paths) {
    const url = `${BASE.replace(/\/$/, '')}${path}`
    const res = await fetch(url, { redirect: 'follow' })
    console.log(`GET ${url} -> ${res.status}`)
    if (!res.ok) process.exitCode = 1
  }

  const webhookUrl = `${BASE.replace(/\/$/, '')}/api/mercadopago/webhook`
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'merchant_order', data: { id: 'smoke-probe' } }),
  })
  console.log(`POST ${webhookUrl} (non-payment) -> ${res.status}`)
  if (res.status !== 200) process.exitCode = 1
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
