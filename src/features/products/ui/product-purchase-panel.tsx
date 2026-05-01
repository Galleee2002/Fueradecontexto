'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AddToCartButton } from '@/features/cart'
import { formatPrice } from '@/shared/lib/format-price'
import type { ProductFull, SizeGuide } from '@/entities/product'
import { STAMP_SIDES, type StampSide } from '../lib/product-purchase'
import {
  STAMP_UPCHARGES,
  getEffectivePrice,
  getStampUpcharge,
  isCapCategory,
} from '../lib/stamp-pricing'
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
  selectedStampSide: StampSide | null
  selectedStampLocations: string[]
  orderedSizes: string[]
  filteredStampSizes: string[]
  effectiveSelectedStampSize: string | null
  isPurchasable: boolean
  sizeGuideOpen: boolean
  onQuantityChange: (value: number) => void
  onColorChange: (value: string | null) => void
  onSizeChange: (value: string) => void
  onStampSideChange: (value: StampSide | null) => void
  onStampSizeChange: (value: string | null) => void
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
  const isCap = isCapCategory(product.category)
  const availableStampSides = isCap ? [STAMP_SIDES[0]] : STAMP_SIDES
  const stampUpcharge = getStampUpcharge(effectiveSelectedStampSize, product.category)
  const effectivePrice = getEffectivePrice(product.price, effectiveSelectedStampSize, product.category)
  const stampUpchargesForCategory = isCap ? undefined : STAMP_UPCHARGES

  const priceRef = useRef<HTMLParagraphElement>(null)
  const previousPriceRef = useRef<number>(effectivePrice)

  useEffect(() => {
    if (previousPriceRef.current === effectivePrice) return
    previousPriceRef.current = effectivePrice

    const node = priceRef.current
    if (!node) return
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    gsap.killTweensOf(node)
    gsap.fromTo(
      node,
      { y: -4, opacity: 0.6 },
      { y: 0, opacity: 1, duration: 0.24, ease: 'power2.out' },
    )
  }, [effectivePrice])

  return (
    <>
      <div className="brand-panel-solid space-y-6 px-6 py-7 sm:px-8">
        <div className="space-y-3">
          <p className="brand-kicker">
            {product.category}
          </p>
          <h1 className="text-3xl font-medium leading-tight tracking-[-0.05em] sm:text-4xl lg:text-5xl">{product.name}</h1>
          <div className="space-y-1">
            <p
              ref={priceRef}
              className="text-2xl font-semibold tracking-[-0.03em] tabular-nums"
              aria-live="polite"
            >
              {formatPrice(effectivePrice)}
            </p>
            {stampUpcharge > 0 && (
              <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-sm text-muted-foreground tabular-nums">
                <span>Base {formatPrice(product.price)}</span>
                <span aria-hidden="true">·</span>
                <span>Estampa +{formatPrice(stampUpcharge)}</span>
              </p>
            )}
          </div>
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
                onClick={() => onStampSideChange(selectedStampSide === side ? null : side)}
                aria-pressed={selectedStampSide === side}
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

        {selectedStampSide ? (
          <>
            <StampSelector
              label="Tamaño de estampa"
              options={filteredStampSizes}
              selected={effectiveSelectedStampSize}
              onChange={onStampSizeChange}
              {...(stampUpchargesForCategory ? { upcharges: stampUpchargesForCategory } : {})}
            />

            <MultiStampSelector
              label="Ubicación de estampa"
              options={product.stampLocations}
              selected={selectedStampLocations}
              onChange={onStampLocationsChange}
            />
          </>
        ) : (
          <p className="text-xs text-muted-foreground">Seleccioná un lado para agregar estampa.</p>
        )}

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
          productPrice={effectivePrice}
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
