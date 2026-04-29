interface BrevoRecipient {
  email: string
  name?: string
}

interface BrevoSendEmailInput {
  to: BrevoRecipient[]
  subject: string
  htmlContent: string
}

interface BrevoSendEmailResponse {
  messageId?: string
}

export async function sendBrevoEmail({
  to,
  subject,
  htmlContent,
}: BrevoSendEmailInput): Promise<BrevoSendEmailResponse> {
  const apiKey = process.env.BREVO_API_KEY
  const fromRaw = process.env.EMAIL_FROM

  if (!apiKey) {
    throw new Error('BREVO_API_KEY is not configured.')
  }

  if (!fromRaw) {
    throw new Error('EMAIL_FROM is not configured.')
  }

  const sender = parseEmailFromHeader(fromRaw)

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender,
      to,
      subject,
      htmlContent,
    }),
  })

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '')
    throw new Error(`Brevo send failed (${response.status}): ${errorBody}`)
  }

  const body = (await response.json().catch(() => ({}))) as BrevoSendEmailResponse
  return body.messageId ? { messageId: body.messageId } : {}
}

function parseEmailFromHeader(input: string): { email: string; name?: string } {
  const trimmed = input.trim()
  const match = trimmed.match(/^(.*)<([^<>]+)>$/)

  if (!match) {
    return { email: trimmed }
  }

  const name = match[1]?.trim().replace(/^"|"$/g, '')
  const email = match[2]?.trim()

  if (!email) {
    throw new Error('Invalid EMAIL_FROM format.')
  }

  return name ? { name, email } : { email }
}
