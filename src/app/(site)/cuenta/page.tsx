import { auth } from '@/auth'
import { LoginForm } from '@/features/auth/components/login-form'
import { OrderHistorySection } from '@/features/auth/components/order-history-section'
import { fetchUserOrders } from '@/features/auth/queries/user-queries'
import { Container } from '@/shared/ui/layout/container'
import { PageHeader } from '@/shared/ui/layout/page-header'

export default async function AccountPage() {
  const session = await auth()

  if (!session?.user) {
    return (
      <main>
        <Container>
          <PageHeader
            title="Mi Cuenta"
            breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Cuenta' }]}
          />
          <div className="max-w-md mx-auto py-12">
            <LoginForm redirectTo="/cuenta" />
          </div>
        </Container>
      </main>
    )
  }

  const orders = await fetchUserOrders(session.user.id!)

  return (
    <main className="brand-page">
      <Container>
        <div className="mx-auto max-w-2xl">
          <OrderHistorySection user={session.user} orders={orders} />
        </div>
      </Container>
    </main>
  )
}
