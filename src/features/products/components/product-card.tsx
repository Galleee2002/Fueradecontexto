import Image from 'next/image'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils/format-price'
import type { ProductCard as ProductCardProps } from '../types'

export function ProductCard({ slug, name, price, imageUrl, category }: ProductCardProps) {
  return (
    <Link href={`/productos/${slug}`}>
      <article className="group cursor-pointer">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface">
          <Image
            src={imageUrl}
            alt={`${name} — Fueradecontexto`}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="pt-4 space-y-1">
          <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground">
            {category}
          </p>
          <h3 className="text-base font-medium text-foreground leading-snug">
            {name}
          </h3>
          <p className="text-xl font-semibold text-foreground">
            {formatPrice(price)}
          </p>
        </div>
      </article>
    </Link>
  )
}
