'use client'

import { useEffect, useMemo, useState } from 'react'
import { AddToCartButton } from '@/features/cart/components/add-to-cart-button'
import { formatPrice } from '@/lib/utils/format-price'
import { ProductImageGallery } from './product-image-gallery'
import { ColorSelector } from './color-selector'
import { SizeSelector } from './size-selector'
import { StampSelector } from './stamp-selector'
import { MultiStampSelector } from './multi-stamp-selector'
import { QuantitySelector } from './quantity-selector'
import { SizeGuideModal } from './size-guide-modal'
import { ServiceStripe } from './service-stripe'
import type { ProductFull, SizeGuide } from '../types'

interface ProductDetailProps {
  product: ProductFull
  sizeGuide: SizeGuide | null
}

const STAMP_SIDES = ['FRENTE', 'DORSO'] as const
type StampSide = (typeof STAMP_SIDES)[number]

const SIZE_ORDER = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const
const STAMP_SIZE_ORDER = ['20x30', '30x40', '40x50'] as const

export function ProductDetail({ product, sizeGuide }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedStampSide, setSelectedStampSide] = useState<StampSide>('DORSO')
  const [selectedStampSize, setSelectedStampSize] = useState<string | null>(null)
  const [selectedStampLocations, setSelectedStampLocations] = useState<string[]>([])
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  const orderedSizes = useMemo(
    () => SIZE_ORDER.filter((size) => product.availableSizes.includes(size)),
    [product.availableSizes],
  )

  const filteredStampSizes = useMemo(
    () => {
      const orderedStampSizes = STAMP_SIZE_ORDER.filter((size) => product.stampSizes.includes(size))

      return selectedStampSide === 'FRENTE'
        ? orderedStampSizes.filter((size) => size !== '40x50')
        : orderedStampSizes
    },
    [product.stampSizes, selectedStampSide],
  )

  useEffect(() => {
    if (selectedStampSize && !(filteredStampSizes as string[]).includes(selectedStampSize)) {
      setSelectedStampSize(null)
    }
  }, [filteredStampSizes, selectedStampSize])

  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 py-8 lg:py-12">
      <ProductImageGallery
        imageUrl={product.imageUrl}
        previewImages={product.previewImages}
        productName={product.name}
      />

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            {product.category}
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-normal font-serif leading-tight">{product.name}</h1>
          <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
        </div>

        <ColorSelector
          colors={product.availableColors}
          selected={selectedColor}
          onChange={setSelectedColor}
        />

        <SizeSelector
          sizes={orderedSizes}
          selected={selectedSize}
          onChange={setSelectedSize}
          onGuideClick={() => setSizeGuideOpen(true)}
        />

        <div className="space-y-3">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Lado de estampa
            {selectedStampSide ? <> — <span className="text-foreground">{selectedStampSide}</span></> : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {STAMP_SIDES.map((side) => (
              <button
                key={side}
                type="button"
                onClick={() => setSelectedStampSide(side)}
                className={`px-3 py-1.5 text-xs font-medium tracking-wide border transition-colors ${
                  selectedStampSide === side
                    ? 'bg-foreground text-background border-foreground'
                    : 'border-border text-foreground hover:border-foreground'
                }`}
              >
                {side}
              </button>
            ))}
          </div>
        </div>

        <StampSelector
          label="Tamaño de estampa"
          options={filteredStampSizes}
          selected={selectedStampSize}
          onChange={setSelectedStampSize}
        />

        <MultiStampSelector
          label="Ubicación de estampa"
          options={product.stampLocations}
          selected={selectedStampLocations}
          onChange={setSelectedStampLocations}
        />

        {product.description && (
          <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
        )}

        <QuantitySelector value={quantity} onChange={setQuantity} max={10} />

        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productPrice={product.price}
          productImageUrl={product.imageUrl}
          productSlug={product.slug}
          quantity={quantity}
          {...(selectedColor !== null ? { selectedColor } : {})}
          {...(selectedSize !== null ? { selectedSize } : {})}
          {...(selectedStampSize !== null ? { selectedStampSize } : {})}
          {...(selectedStampLocations.length > 0 ? { selectedStampLocations } : {})}
        />

        <ServiceStripe />
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
        category={product.category}
        guide={sizeGuide}
      />
    </section>
  )
}
