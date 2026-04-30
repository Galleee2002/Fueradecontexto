import 'dotenv/config'
import { reconcilePaidOrders } from '../src/features/checkout/application/reconcile-paid-orders'

function parseArgs(argv: string[]) {
  const apply = argv.includes('--apply')
  const limitArg = argv.find((arg) => arg.startsWith('--limit='))
  const limit = limitArg ? Number(limitArg.slice('--limit='.length)) : undefined

  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) {
    throw new Error('--limit must be a positive integer.')
  }

  return { apply, limit }
}

async function main() {
  const { apply, limit } = parseArgs(process.argv.slice(2))

  if (!apply) {
    console.log('[reconcile-paid-orders] dry-run mode. Re-run with --apply to update orders and send emails.')
  }

  const result = await reconcilePaidOrders({
    dryRun: !apply,
    ...(limit === undefined ? {} : { limit }),
  })

  console.log('[reconcile-paid-orders] summary', result)
}

main().catch((error) => {
  console.error('[reconcile-paid-orders] failed', error)
  process.exit(1)
})
