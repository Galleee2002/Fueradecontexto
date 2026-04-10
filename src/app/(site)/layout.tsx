import { Navbar } from '@/features/navigation/components/navbar'
import { Footer } from '@/features/navigation/components/footer'
import { WhatsAppButton } from '@/features/navigation/components/whatsapp-button'
import { getProductCategories } from '@/features/products'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getProductCategories()

  return (
    <>
      <Navbar categories={categories} />
      {children}
      <WhatsAppButton />
      <Footer />
    </>
  )
}
