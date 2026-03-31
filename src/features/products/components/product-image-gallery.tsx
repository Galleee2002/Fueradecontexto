import Image from 'next/image'

interface ProductImageGalleryProps {
  imageUrl: string
  productName: string
}

export function ProductImageGallery({ imageUrl, productName }: ProductImageGalleryProps) {
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-surface">
      <Image
        src={imageUrl}
        alt={`${productName} — Fueradecontexto`}
        fill
        className="object-cover"
        sizes="(max-width: 1024px) 100vw, 50vw"
        priority
      />
    </div>
  )
}
