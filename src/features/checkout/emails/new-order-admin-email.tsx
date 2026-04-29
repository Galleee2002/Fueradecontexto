import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { CSSProperties } from 'react'
import type { PaidOrderEmailPayload } from './types'

interface NewOrderAdminEmailProps {
  payload: PaidOrderEmailPayload
}

export function NewOrderAdminEmail({ payload }: NewOrderAdminEmailProps) {
  const shippingAddress = formatShippingAddress(payload.shippingAddress)

  return (
    <Html>
      <Head />
      <Preview>Nueva orden pagada #{payload.orderId}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.kicker}>FUERADECONTEXTO · ADMIN</Text>
          <Heading style={styles.title}>Nueva orden pagada</Heading>

          <Section style={styles.panel}>
            <Text style={styles.row}>
              <strong>Pedido:</strong> {payload.orderId}
            </Text>
            <Text style={styles.row}>
              <strong>Cliente:</strong> {payload.customerName}
            </Text>
            <Text style={styles.row}>
              <strong>Email:</strong> {payload.customerEmail}
            </Text>
            <Text style={styles.row}>
              <strong>Telefono:</strong> {payload.customerPhone}
            </Text>
            <Text style={styles.row}>
              <strong>Total:</strong> {formatArs(payload.total)}
            </Text>
            <Text style={styles.row}>
              <strong>Costo envio:</strong> {formatArs(payload.shippingCost ?? 0)}
            </Text>
            <Text style={styles.row}>
              <strong>Metodo envio:</strong> {payload.shippingMethod ?? 'No informado'} ({payload.shippingCarrier ?? 'No informado'})
            </Text>
            <Text style={styles.row}>
              <strong>Direccion:</strong> {shippingAddress}
            </Text>
          </Section>

          <Section style={styles.panel}>
            <Text style={styles.sectionTitle}>Items del pedido</Text>
            {payload.items.map((item) => (
              <Section key={`${item.productName}-${item.unitPrice}`} style={styles.itemRow}>
                <Text style={styles.itemName}>{item.productName}</Text>
                <Text style={styles.itemMeta}>
                  {item.quantity} x {formatArs(item.unitPrice)}
                </Text>
              </Section>
            ))}
            <Hr style={styles.hr} />
            <Text style={styles.total}>
              Total orden: <strong>{formatArs(payload.total)}</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

function formatArs(value: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(value)
}

function formatShippingAddress(shippingAddress: unknown): string {
  if (!shippingAddress || typeof shippingAddress !== 'object') {
    return 'No disponible'
  }

  const addr = shippingAddress as Record<string, unknown>
  const parts = [
    addr.calle,
    addr.numero,
    addr.pisoDpto,
    addr.ciudad,
    addr.provincia,
    addr.codigoPostal,
  ]
    .filter((part) => typeof part === 'string' && part.trim().length > 0)
    .map((part) => String(part).trim())

  return parts.length > 0 ? parts.join(', ') : 'No disponible'
}

const styles: Record<string, CSSProperties> = {
  body: {
    margin: 0,
    backgroundColor: '#f5f5f7',
    fontFamily: '"SF Pro Text", "Inter", Arial, sans-serif',
    color: '#1d1d1f',
    padding: '28px 12px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  kicker: {
    fontSize: '11px',
    letterSpacing: '0.24em',
    textTransform: 'uppercase',
    color: 'rgba(29,29,31,0.62)',
    margin: '0 0 12px',
  },
  title: {
    margin: '0',
    fontSize: '30px',
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    fontWeight: 600,
    color: '#121820',
  },
  panel: {
    border: '1px solid rgba(29, 29, 31, 0.08)',
    borderRadius: '16px',
    backgroundColor: '#ffffff',
    padding: '18px',
    marginTop: '16px',
  },
  row: {
    margin: '0 0 8px',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  sectionTitle: {
    margin: '0 0 12px',
    fontWeight: 600,
    fontSize: '15px',
  },
  itemRow: {
    marginBottom: '12px',
  },
  itemName: {
    margin: 0,
    fontSize: '14px',
    fontWeight: 500,
  },
  itemMeta: {
    margin: '2px 0 0',
    fontSize: '13px',
    color: 'rgba(29,29,31,0.62)',
  },
  hr: {
    borderColor: 'rgba(29, 29, 31, 0.08)',
    margin: '12px 0',
  },
  total: {
    margin: 0,
    fontSize: '16px',
  },
}
