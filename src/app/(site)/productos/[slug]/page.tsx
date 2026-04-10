import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductDetail, getProducts, ProductDetail, RelatedProducts } from '@/features/products'
import { Container } from '@/shared/ui/layout/container'
import { SITE_NAME } from '@/shared/config/site'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const { products } = await getProducts(undefined, 1, 200)
  return products.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const detail = await getProductDetail(slug)
  if (!detail) return { title: 'Producto no encontrado' }
  const { product } = detail
  return {
    title: `${product.name} — ${SITE_NAME}`,
    description: product.description ?? `${product.name} en ${SITE_NAME}. Indumentaria de autor.`,
    openGraph: {
      title: `${product.name} — ${SITE_NAME}`,
      description: product.description ?? '',
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const detail = await getProductDetail(slug)
  if (!detail) notFound()
  const { product, sizeGuide } = detail

  return (
    <main>
      <Container>
        <nav className="flex items-center gap-2 py-6 text-xs font-medium tracking-wide uppercase text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-foreground transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>
        <ProductDetail product={product} sizeGuide={sizeGuide} />
      </Container>
      <RelatedProducts category={product.category} currentSlug={product.slug} />
    </main>
  )
}
