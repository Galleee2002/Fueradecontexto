import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { AdminSidebar } from '@/features/admin/components/admin-sidebar'
import { AdminHeader } from '@/features/admin/components/admin-header'

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
    <div className="flex h-screen bg-surface overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
