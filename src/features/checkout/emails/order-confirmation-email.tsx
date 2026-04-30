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
import {
  customerShippingModeLabel,
  formatCorreoBranchNote,
  formatShippingAddressLines,
  isSellerPickupFromPayload,
} from './shipping-email-copy'

interface OrderConfirmationEmailProps {
  payload: PaidOrderEmailPayload
}

export function OrderConfirmationEmail({ payload }: OrderConfirmationEmailProps) {
  const isPickup = isSellerPickupFromPayload(payload.shippingMethod, payload.shippingAddress)
  const addressText = formatShippingAddressLines(payload.shippingAddress)
  const branchNote = formatCorreoBranchNote(payload.shippingAddress)
  const modeLabel = customerShippingModeLabel(payload.shippingMethod, payload.shippingAddress)

  return (
    <Html>
      <Head />
      <Preview>Confirmacion de compra #{payload.orderId}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Text style={styles.kicker}>FUERADECONTEXTO</Text>
          <Heading style={styles.title}>Gracias por tu compra</Heading>
          <Text style={styles.subtitle}>
            Recibimos tu pago correctamente. Este es el detalle de tu pedido.
          </Text>

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
          </Section>

          <Section style={styles.panel}>
            <Text style={styles.sectionTitle}>Resumen</Text>
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
              Total: <strong>{formatArs(payload.total)}</strong>
            </Text>
          </Section>

          <Section style={styles.panel}>
            <Text style={styles.sectionTitle}>Entrega o retiro</Text>
            <Text style={styles.row}>
              <strong>Modalidad:</strong> {modeLabel}
            </Text>
            {isPickup ? (
              <>
                <Text style={styles.rowMuted}>
                  Retirás tu pedido en nuestro domicilio (no hay envío por Correo Argentino). Te avisamos por mail
                  cuando esté listo para retirar.
                </Text>
                <Text style={styles.row}>
                  <strong>Dirección de retiro:</strong> {addressText}
                </Text>
              </>
            ) : (
              <>
                <Text style={styles.row}>
                  <strong>Dirección de entrega:</strong> {addressText}
                </Text>
                {branchNote ? (
                  <Text style={styles.rowMuted}>{branchNote}</Text>
                ) : null}
                {payload.shippingCost != null && payload.shippingCost > 0 ? (
                  <Text style={styles.row}>
                    <strong>Costo de envío:</strong> {formatArs(payload.shippingCost)}
                  </Text>
                ) : null}
              </>
            )}
          </Section>

          <Text style={styles.footer}>
            Si tenes dudas sobre tu pedido, responde a este correo y te ayudamos.
          </Text>
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
  subtitle: {
    margin: '12px 0 0',
    color: 'rgba(29,29,31,0.74)',
    fontSize: '15px',
    lineHeight: 1.55,
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
  rowMuted: {
    margin: '0 0 10px',
    fontSize: '14px',
    lineHeight: 1.55,
    color: 'rgba(29,29,31,0.72)',
  },
  footer: {
    margin: '18px 0 0',
    color: 'rgba(29,29,31,0.62)',
    fontSize: '13px',
  },
}
