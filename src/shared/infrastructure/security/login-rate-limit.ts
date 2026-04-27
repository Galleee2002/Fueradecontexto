type LoginAttemptEntry = {
  attempts: number
  firstAttemptAtMs: number
  lockUntilMs: number
  lockouts: number
}

const MAX_ATTEMPTS = 5
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000
const BASE_LOCK_MS = 15 * 60 * 1000
const MAX_LOCK_MS = 60 * 60 * 1000
const MAX_ENTRIES = 10_000

const attemptsByKey = new Map<string, LoginAttemptEntry>()

function nowMs() {
  return Date.now()
}

function cleanupExpiredEntries(now: number) {
  if (attemptsByKey.size < MAX_ENTRIES) return

  for (const [key, entry] of attemptsByKey.entries()) {
    const outOfWindow = now - entry.firstAttemptAtMs > ATTEMPT_WINDOW_MS
    const notLocked = entry.lockUntilMs <= now

    if (outOfWindow && notLocked) {
      attemptsByKey.delete(key)
    }
  }
}

function getOrCreateEntry(key: string, now: number) {
  const existing = attemptsByKey.get(key)
  if (existing) return existing

  const created: LoginAttemptEntry = {
    attempts: 0,
    firstAttemptAtMs: now,
    lockUntilMs: 0,
    lockouts: 0,
  }
  attemptsByKey.set(key, created)
  return created
}

export function getLoginRateLimitState(key: string) {
  const now = nowMs()
  cleanupExpiredEntries(now)

  const entry = attemptsByKey.get(key)
  if (!entry) {
    return { blocked: false, retryAfterSeconds: 0 }
  }

  if (entry.lockUntilMs > now) {
    return {
      blocked: true,
      retryAfterSeconds: Math.ceil((entry.lockUntilMs - now) / 1000),
    }
  }

  return { blocked: false, retryAfterSeconds: 0 }
}

export function registerLoginFailure(key: string) {
  const now = nowMs()
  cleanupExpiredEntries(now)

  const entry = getOrCreateEntry(key, now)

  if (entry.lockUntilMs > now) {
    return
  }

  if (now - entry.firstAttemptAtMs > ATTEMPT_WINDOW_MS) {
    entry.attempts = 0
    entry.firstAttemptAtMs = now
  }

  entry.attempts += 1

  if (entry.attempts < MAX_ATTEMPTS) {
    return
  }

  entry.lockouts += 1
  const lockMs = Math.min(BASE_LOCK_MS * 2 ** (entry.lockouts - 1), MAX_LOCK_MS)
  entry.lockUntilMs = now + lockMs
  entry.attempts = 0
  entry.firstAttemptAtMs = now
}

export function resetLoginRateLimit(key: string) {
  attemptsByKey.delete(key)
}
