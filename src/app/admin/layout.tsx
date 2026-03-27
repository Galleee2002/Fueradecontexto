import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AdminShell } from '@/features/admin/components/admin-shell'

export const metadata: Metadata = {
  title: 'Admin — Fueradecontexto',
  robots: { index: false, follow: false },
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/login')
  return (
    <AdminShell>
      {children}
    </AdminShell>
  )
}
