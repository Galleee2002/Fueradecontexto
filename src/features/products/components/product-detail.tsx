import { AddToCartButton } from '@/features/cart/components/add-to-cart-button'
import { formatPrice } from '@/lib/utils/format-price'
import { ProductImageGallery } from './product-image-gallery'
import { ColorSelector } from './color-selector'
import { ServiceStripe } from './service-stripe'
import type { ProductFull } from '../types'

export function ProductDetail({ product }: { product: ProductFull }) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 py-12">
      <ProductImageGallery imageUrl={product.imageUrl} productName={product.name} />

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            {product.category}
          </p>
          <h1 className="text-5xl font-normal font-serif leading-tight">{product.name}</h1>
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
        </div>

        <ColorSelector />

        {product.description && (
          <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
        )}

        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productPrice={product.price}
          productImageUrl={product.imageUrl}
          productSlug={product.slug}
        />

        <ServiceStripe />
      </div>
    </section>
  )
}
