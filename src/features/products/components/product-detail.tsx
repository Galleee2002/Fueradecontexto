'use client'

import { useProductPurchase } from '../hooks/use-product-purchase'
import { ProductImageGallery } from './product-image-gallery'
import { ProductPurchasePanel } from '../ui/product-purchase-panel'
import type { ProductFull, SizeGuide } from '../types'

interface ProductDetailProps {
  product: ProductFull
  sizeGuide: SizeGuide | null
}

export function ProductDetail({ product, sizeGuide }: ProductDetailProps) {
  const purchase = useProductPurchase(product)

  return (
    <section className="grid grid-cols-1 gap-8 py-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)] lg:gap-14 lg:py-12 xl:gap-20">
      <ProductImageGallery
        key={purchase.selectedColor ?? 'all-images'}
        images={product.images}
        selectedColor={purchase.selectedColor}
        productName={product.name}
      />

      <div className="min-w-0">
        <ProductPurchasePanel
          product={product}
          sizeGuide={sizeGuide}
          quantity={purchase.quantity}
          selectedColor={purchase.selectedColor}
          selectedSize={purchase.selectedSize}
          selectedStampSide={purchase.selectedStampSide}
          selectedStampLocations={purchase.selectedStampLocations}
          orderedSizes={purchase.orderedSizes}
          filteredStampSizes={purchase.filteredStampSizes}
          effectiveSelectedStampSize={purchase.effectiveSelectedStampSize}
          isPurchasable={purchase.isPurchasable}
          sizeGuideOpen={purchase.sizeGuideOpen}
          onQuantityChange={purchase.setQuantity}
          onColorChange={purchase.setSelectedColor}
          onSizeChange={purchase.setSelectedSize}
          onStampSideChange={purchase.setSelectedStampSide}
          onStampSizeChange={purchase.setSelectedStampSize}
          onStampLocationsChange={purchase.setSelectedStampLocations}
          onOpenSizeGuide={() => purchase.setSizeGuideOpen(true)}
          onCloseSizeGuide={() => purchase.setSizeGuideOpen(false)}
        />
      </div>
    </section>
  )
}
