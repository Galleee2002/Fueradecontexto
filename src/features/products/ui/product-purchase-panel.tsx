'use client'

import { AddToCartButton } from '@/features/cart'
import { formatPrice } from '@/shared/lib/format-price'
import type { ProductFull, SizeGuide } from '@/entities/product'
import { STAMP_SIDES, type StampSide } from '../lib/product-purchase'
import { ColorSelector } from '../components/color-selector'
import { MultiStampSelector } from '../components/multi-stamp-selector'
import { QuantitySelector } from '../components/quantity-selector'
import { ServiceStripe } from '../components/service-stripe'
import { SizeGuideModal } from '../components/size-guide-modal'
import { SizeSelector } from '../components/size-selector'
import { StampSelector } from '../components/stamp-selector'

interface ProductPurchasePanelProps {
  product: ProductFull
  sizeGuide: SizeGuide | null
  quantity: number
  selectedColor: string | null
  selectedSize: string | null
  selectedStampSide: StampSide
  selectedStampLocations: string[]
  orderedSizes: string[]
  filteredStampSizes: string[]
  effectiveSelectedStampSize: string | null
  isPurchasable: boolean
  sizeGuideOpen: boolean
  onQuantityChange: (value: number) => void
  onColorChange: (value: string | null) => void
  onSizeChange: (value: string) => void
  onStampSideChange: (value: StampSide) => void
  onStampSizeChange: (value: string) => void
  onStampLocationsChange: (value: string[]) => void
  onOpenSizeGuide: () => void
  onCloseSizeGuide: () => void
}

export function ProductPurchasePanel({
  product,
  sizeGuide,
  quantity,
  selectedColor,
  selectedSize,
  selectedStampSide,
  selectedStampLocations,
  orderedSizes,
  filteredStampSizes,
  effectiveSelectedStampSize,
  isPurchasable,
  sizeGuideOpen,
  onQuantityChange,
  onColorChange,
  onSizeChange,
  onStampSideChange,
  onStampSizeChange,
  onStampLocationsChange,
  onOpenSizeGuide,
  onCloseSizeGuide,
}: ProductPurchasePanelProps) {
  const isCapCategory = product.category.toLowerCase().includes('gorra')
  const availableStampSides = isCapCategory ? [STAMP_SIDES[0]] : STAMP_SIDES

  return (
    <>
      <div className="brand-panel-solid space-y-6 px-6 py-7 sm:px-8">
        <div className="space-y-3">
          <p className="brand-kicker">
            {product.category}
          </p>
          <h1 className="text-3xl font-medium leading-tight tracking-[-0.05em] sm:text-4xl lg:text-5xl">{product.name}</h1>
          <p className="text-2xl font-semibold tracking-[-0.03em]">{formatPrice(product.price)}</p>
        </div>

        <ColorSelector
          colors={product.availableColors}
          selected={selectedColor}
          onChange={onColorChange}
        />

        <SizeSelector
          sizes={orderedSizes}
          selected={selectedSize}
          onChange={onSizeChange}
          onGuideClick={onOpenSizeGuide}
        />

        <div className="space-y-3">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            Lado de estampa
            {selectedStampSide ? <> — <span className="text-foreground">{selectedStampSide}</span></> : null}
          </p>
          <div className="flex flex-wrap gap-2">
            {availableStampSides.map((side) => (
              <button
                key={side}
                type="button"
                onClick={() => onStampSideChange(side)}
                className={`min-h-[44px] rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] transition-colors ${
                  selectedStampSide === side
                    ? 'border-foreground bg-foreground text-background'
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
          selected={effectiveSelectedStampSize}
          onChange={onStampSizeChange}
        />

        <MultiStampSelector
          label="Ubicación de estampa"
          options={product.stampLocations}
          selected={selectedStampLocations}
          onChange={onStampLocationsChange}
        />

        {product.description && (
          <p className="text-base leading-relaxed text-muted-foreground">{product.description}</p>
        )}

        <div className="flex items-center justify-between gap-3 rounded-[1.1rem] border border-border bg-surface-muted/55 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Disponibilidad</span>
          <span className={isPurchasable ? 'font-medium text-foreground' : 'font-medium text-error-foreground'}>
            {isPurchasable
              ? `${product.stock} unidad${product.stock === 1 ? '' : 'es'} disponible${product.stock === 1 ? '' : 's'}`
              : 'Sin stock disponible'}
          </span>
        </div>

        <QuantitySelector value={quantity} onChange={onQuantityChange} max={Math.max(1, Math.min(10, product.stock))} />

        <AddToCartButton
          productId={product.id}
          productName={product.name}
          productPrice={product.price}
          productImageUrl={product.imageUrl}
          productSlug={product.slug}
          quantity={quantity}
          {...(selectedColor !== null ? { selectedColor } : {})}
          {...(selectedSize !== null ? { selectedSize } : {})}
          {...(effectiveSelectedStampSize !== null ? { selectedStampSize: effectiveSelectedStampSize } : {})}
          {...(selectedStampLocations.length > 0 ? { selectedStampLocations } : {})}
          disabled={!isPurchasable}
          disabledLabel="Sin stock"
        />

        <ServiceStripe />
      </div>

      <SizeGuideModal
        isOpen={sizeGuideOpen}
        onClose={onCloseSizeGuide}
        category={product.category}
        guide={sizeGuide}
      />
    </>
  )
}
