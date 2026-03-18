'use client'
import { useState } from 'react'
import Image from 'next/image'

interface ProductImageGalleryProps {
  imageUrl: string
  productName: string
}

export function ProductImageGallery({ imageUrl, productName }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const thumbnails = [imageUrl, imageUrl, imageUrl, imageUrl]

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={thumbnails[selectedIndex]}
          alt={`${productName} — Fueradecontexto`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>
      <div className="grid grid-cols-4 gap-2">
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
