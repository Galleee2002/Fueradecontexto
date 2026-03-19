import { CartDrawer } from '@/features/cart/components/cart-drawer'
import { Container } from '@/components/shared/layout/container'
import { PageHeader } from '@/components/shared/layout/page-header'

export default function CartPage() {
  return (
    <main>
      <Container>
        <PageHeader
          title="Mi Carrito"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Carrito' }]}
        />
        <CartDrawer />
      </Container>
    </main>
  )
}
