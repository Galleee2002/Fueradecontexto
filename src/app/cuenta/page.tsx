import { LoginForm } from '@/features/auth/components/login-form'
import { Container } from '@/components/shared/layout/container'
import { PageHeader } from '@/components/shared/layout/page-header'

export default function AccountPage() {
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
