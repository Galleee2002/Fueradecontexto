import { Navbar } from '@/features/navigation/components/navbar'
import { Footer } from '@/features/navigation/components/footer'
import { WhatsAppButton } from '@/features/navigation/components/whatsapp-button'
import { fetchProductCategories } from '@/features/products/queries/product-queries'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await fetchProductCategories()

  return (
    <>
      <Navbar categories={categories} />
      {children}
      <WhatsAppButton />
      <Footer />
    </>
  )
}
