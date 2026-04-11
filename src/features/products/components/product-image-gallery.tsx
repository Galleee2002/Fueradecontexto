'use client'

import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { ProductImage } from '../types'

interface ProductImageGalleryProps {
  images: ProductImage[]
  selectedColor: string | null
  productName: string
}

export function ProductImageGallery({ images, selectedColor, productName }: ProductImageGalleryProps) {
  const galleryImages = useMemo(() => {
    if (!selectedColor) return images

    const exactMatch = images.filter((image) => image.colorName === selectedColor)
    const generalImages = images.filter((image) => !image.colorName)
    if (exactMatch.length > 0) return [...exactMatch, ...generalImages]
    if (generalImages.length > 0) return generalImages

    return images
  }, [images, selectedColor])

  const [activeIndex, setActiveIndex] = useState(0)
  const resolvedActiveIndex = activeIndex < galleryImages.length ? activeIndex : 0
  const activeImage = galleryImages[resolvedActiveIndex]?.url ?? galleryImages[0]?.url ?? images[0]?.url ?? ''
  const canSlide = galleryImages.length > 1

  function goToPrevious() {
    setActiveIndex((current) => (current <= 0 ? galleryImages.length - 1 : current - 1))
  }

  function goToNext() {
    setActiveIndex((current) => (current >= galleryImages.length - 1 ? 0 : current + 1))
  }

  if (!activeImage) {
    return (
      <div className="flex aspect-[3/4] items-center justify-center border border-border bg-surface text-sm text-muted-foreground">
        No hay imágenes cargadas.
      </div>
    )
  }

  return (
    <div className="space-y-4 lg:sticky lg:top-24">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
            Galería
          </p>
          {selectedColor ? (
            <p className="text-sm text-foreground">
              Color seleccionado: <span className="font-medium">{selectedColor}</span>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Deslizá la prenda para ver todos los ángulos disponibles.</p>
          )}
        </div>

      
      </div>

      <div className="relative overflow-hidden border border-border bg-surface">
        <div className="relative aspect-[4/5] min-h-[420px] sm:min-h-[520px] lg:min-h-[680px]">
          {canSlide && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                aria-label="Ver imagen anterior"
                className="absolute left-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                aria-label="Ver imagen siguiente"
                className="absolute right-4 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}

          <div
            className="flex h-full transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${resolvedActiveIndex * 100}%)` }}
          >
            {galleryImages.map((image, index) => (
              <div
                key={`${image.url}-${image.colorName ?? 'general'}-${index}`}
                className="relative h-full min-w-full"
                aria-hidden={index !== resolvedActiveIndex}
              >
                <Image
                  src={image.url}
                  alt={image.colorName ? `${productName} ${image.colorName}` : `${productName} imagen ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

      </div>

      {canSlide ? (
        <div className="flex flex-wrap items-center gap-2">
          {galleryImages.map((image, index) => {
            const isActive = index === resolvedActiveIndex

            return (
              <button
                key={`${image.url}-${image.colorName ?? 'general'}-dot-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={
                  image.colorName
                    ? `Ir a imagen ${index + 1} del color ${image.colorName}`
                    : `Ir a imagen ${index + 1}`
                }
                aria-pressed={isActive}
                className={`h-3 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive ? 'w-10 bg-foreground' : 'w-3 bg-border hover:bg-foreground/45'
                }`}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
