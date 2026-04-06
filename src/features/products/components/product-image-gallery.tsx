import Image from 'next/image'
import { useMemo, useState } from 'react'

interface ProductImageGalleryProps {
  imageUrl: string
  previewImages?: string[]
  productName: string
}

export function ProductImageGallery({ imageUrl, previewImages = [], productName }: ProductImageGalleryProps) {
  const galleryImages = useMemo(() => {
    const unique = [imageUrl, ...previewImages].filter((url, index, array) => url && array.indexOf(url) === index)
    return unique.slice(0, 4)
  }, [imageUrl, previewImages])

  const [activeImage, setActiveImage] = useState<string>(galleryImages[0] ?? imageUrl)

  return (
    <div className="space-y-3">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        <Image
          src={activeImage}
          alt={`${productName} — Fueradecontexto`}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {galleryImages.map((url, index) => {
            const isActive = url === activeImage

            return (
              <button
                key={`${url}-${index}`}
                type="button"
                onClick={() => setActiveImage(url)}
                aria-label={`Ver imagen ${index + 1}`}
                className={`relative aspect-square overflow-hidden border transition-colors ${
                  isActive ? 'border-primary' : 'border-border hover:border-foreground'
                }`}
              >
                <Image
                  src={url}
                  alt={`${productName} preview ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 22vw, 8vw"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
