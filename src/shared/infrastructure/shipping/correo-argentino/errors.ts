export class CorreoArgentinoError extends Error {
  status: number
  code: string | null
  retriable: boolean

  constructor(message: string, options?: { status?: number; code?: string | null; retriable?: boolean }) {
    super(message)
    this.name = 'CorreoArgentinoError'
    this.status = options?.status ?? 500
    this.code = options?.code ?? null
    this.retriable = options?.retriable ?? false
  }
}
