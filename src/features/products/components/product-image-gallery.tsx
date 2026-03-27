'use client'
import { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  imageUrl: string
  productName: string
}

export function ProductImageGallery({ imageUrl, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchEndX, setTouchEndX] = useState<number | null>(null)
  const thumbnails = [imageUrl, imageUrl, imageUrl, imageUrl]

  function handleTouchStart(e: React.TouchEvent) {
    setTouchStartX(e.targetTouches[0]!.clientX)
    setTouchEndX(null)
  }

  function handleTouchMove(e: React.TouchEvent) {
    setTouchEndX(e.targetTouches[0]!.clientX)
  }

  function handleTouchEnd() {
    if (touchStartX === null || touchEndX === null) return
    const diff = touchStartX - touchEndX
    if (diff > 50) {
      setSelectedIndex((i) => Math.min(i + 1, thumbnails.length - 1))
    } else if (diff < -50) {
      setSelectedIndex((i) => Math.max(i - 1, 0))
    }
  }

  return (
    <div className="space-y-4">
      <div
        className="relative aspect-[3/4] overflow-hidden bg-surface"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={thumbnails[selectedIndex]!}
          alt={`${productName} — Fueradecontexto`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Dot indicators — mobile only */}
      <div className="flex justify-center gap-1.5 lg:hidden">
        {thumbnails.map((_, i) => (
          <button
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              selectedIndex === i ? 'bg-foreground' : 'bg-border'
            }`}
            aria-label={`Ir a imagen ${i + 1}`}
          />
        ))}
      </div>

      {/* Thumbnail grid — desktop */}
      <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
        {thumbnails.map((src, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            className={`relative aspect-[3/4] overflow-hidden bg-surface focus:outline-none transition-all duration-150 ${
              selectedIndex === index
                ? 'ring-1 ring-foreground ring-offset-0'
                : 'opacity-60 hover:opacity-100'
            }`}
            aria-label={`Ver imagen ${index + 1}`}
          >
            <Image
              src={src}
              alt={`${productName} — vista ${index + 1}`}
              fill
              className="object-cover"
              sizes="25vw"
            />
          </button>
        ))}
      </div>
    </div>
  )
}
