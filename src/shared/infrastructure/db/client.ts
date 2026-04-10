import { neon, neonConfig } from '@neondatabase/serverless'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
	throw new Error('DATABASE_URL is not configured')
}

const RETRYABLE_ERROR_CODES = new Set([
	'UND_ERR_CONNECT_TIMEOUT',
	'UND_ERR_CONNECT',
	'ETIMEDOUT',
	'ECONNRESET',
	'EAI_AGAIN',
])

function isRetryableNetworkError(error: unknown): boolean {
	if (!error || typeof error !== 'object') return false

	const err = error as {
		code?: string
		message?: string
		cause?: { code?: string; message?: string }
	}

	const code = err.cause?.code ?? err.code
	const message = `${err.message ?? ''} ${err.cause?.message ?? ''}`.toLowerCase()

	return (
		(!!code && RETRYABLE_ERROR_CODES.has(code)) ||
		message.includes('fetch failed') ||
		message.includes('connect timeout')
	)
}

const globalForNeon = globalThis as { __neonFetchRetryConfigured?: boolean }

if (!globalForNeon.__neonFetchRetryConfigured) {
	const baseFetch: typeof fetch = neonConfig.fetchFunction ?? fetch

	neonConfig.fetchFunction = async (input: RequestInfo | URL, init?: RequestInit) => {
		let lastError: unknown
		const maxAttempts = 3

		for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
			try {
				return await baseFetch(input, init)
			} catch (error) {
				lastError = error

				if (!isRetryableNetworkError(error) || attempt === maxAttempts) {
					throw error
				}

				const backoffMs = attempt * 250
				await new Promise((resolve) => setTimeout(resolve, backoffMs))
			}
		}

		throw lastError
	}

	globalForNeon.__neonFetchRetryConfigured = true
}

const sql = neon(DATABASE_URL)

export { sql }
