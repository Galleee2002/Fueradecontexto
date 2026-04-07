import type { Metadata } from 'next'
import { AdminShell } from '@/features/admin/components/admin-shell'
import { requireAdminSession } from '@/lib/auth/require-admin'

export const metadata: Metadata = {
  title: 'Admin — Fueradecontexto',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdminSession()
  return (
    <AdminShell>
      {children}
    </AdminShell>
  )
}
