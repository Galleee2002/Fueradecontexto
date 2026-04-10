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
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8 lg:py-12">
      <ProductImageGallery
        imageUrl={product.imageUrl}
        previewImages={product.previewImages}
        productName={product.name}
      />

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
    </section>
  )
}
