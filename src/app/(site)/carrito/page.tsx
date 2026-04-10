import { CartDrawer } from '@/features/cart/components/cart-drawer'
import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'

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
