import { auth } from '@/auth'
import { LoginForm } from '@/features/auth/components/login-form'
import { OrderHistorySection } from '@/features/auth/components/order-history-section'
import { fetchUserOrders } from '@/features/auth/queries/user-queries'
import { Container } from '@/components/shared/layout/container'
import { PageHeader } from '@/components/shared/layout/page-header'

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
            <LoginForm />
          </div>
        </Container>
      </main>
    )
  }

  const orders = await fetchUserOrders(session.user.id!)

  return (
    <main>
      <Container>
        <PageHeader
          title="Mi Cuenta"
          breadcrumb={[{ label: 'Inicio', href: '/' }, { label: 'Cuenta' }]}
        />
        <div className="max-w-2xl mx-auto">
          <OrderHistorySection user={session.user} orders={orders} />
        </div>
      </Container>
    </main>
  )
}
